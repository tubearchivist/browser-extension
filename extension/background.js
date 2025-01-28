/*
extension background script listening for events
*/

'use strict';

console.log('running background.js');

let browserType = getBrowser();

// boilerplate to dedect browser type api
function getBrowser() {
  if (typeof chrome !== 'undefined') {
    if (typeof browser !== 'undefined') {
      return browser;
    } else {
      return chrome;
    }
  } else {
    console.log('failed to detect browser');
    throw 'browser detection error';
  }
}

// send get request to API backend
async function sendGet(path) {
  let access = await getAccess();
  const url = `${access.url}:${access.port}/${path}`;
  console.log('GET: ' + url);

  const rawResponse = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Token ' + access.apiKey,
      mode: 'no-cors',
    },
  });

  const content = await rawResponse.json();
  return content;
}

// send post/put request to API backend
async function sendData(path, payload, method) {
  let access = await getAccess();
  const url = `${access.url}:${access.port}/${path}`;
  console.log(`${method}: ${url}`);
  if (!path.endsWith('cookie/')) console.log(`${method}: ${JSON.stringify(payload)}`);

  try {
    const rawResponse = await fetch(url, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + access.apiKey,
        mode: 'no-cors',
      },
      body: JSON.stringify(payload),
    });
    const content = await rawResponse.json();
    return content;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// read access details from storage.local
async function getAccess() {
  let storage = await browserType.storage.local.get('access');

  return storage.access;
}

// check if cookie is valid
async function getCookieState() {
  const path = 'api/appsettings/cookie/';
  let response = await sendGet(path);
  console.log('cookie state: ' + JSON.stringify(response));

  return response;
}

// send ping to server
async function verifyConnection() {
  const path = 'api/ping/';
  let message = await sendGet(path);
  console.log('verify connection: ' + JSON.stringify(message));

  if (message?.response === 'pong') {
    return true;
  } else if (message?.detail) {
    throw new Error(message.detail);
  } else {
    throw new Error(`got unknown message ${JSON.stringify(message)}`);
  }
}

// send youtube link from injected buttons
async function download(url) {
  let apiURL = 'api/download/';
  let autostart = await browserType.storage.local.get('autostart');
  if (Object.keys(autostart).length > 0 && autostart.autostart.checked) {
    apiURL += '?autostart=true';
  }
  return await sendData(
    apiURL,
    {
      data: [
        {
          youtube_id: url,
          status: 'pending',
        },
      ],
    },
    'POST'
  );
}

async function subscribe(url, subscribed) {
  return await sendData(
    'api/channel/',
    {
      data: [
        {
          channel_id: url,
          channel_subscribed: subscribed,
        },
      ],
    },
    'POST'
  );
}

async function videoExists(id) {
  const path = `api/video/${id}/`;
  let response = await sendGet(path);
  if (!response.data) return false;
  let access = await getAccess();
  return new URL(`video/${id}/`, `${access.url}:${access.port}/`).href;
}

async function getChannel(channelHandle) {
  let channel;
  const path = `api/channel/search/?q=${channelHandle}`;
  try {
    channel = await sendGet(path);
    return channel.data;
  } catch {
    return false;
  }
}

async function cookieStr(cookieLines) {
  const path = 'api/appsettings/cookie/';
  let payload = {
    cookie: cookieLines.join('\n'),
  };
  let response = await sendData(path, payload, 'PUT');

  return response;
}

function buildCookieLine(cookie) {
  // 2nd argument controls subdomains, and must match leading dot in domain
  let includeSubdomains = cookie.domain.startsWith('.') ? 'TRUE' : 'FALSE';

  return [
    cookie.domain,
    includeSubdomains,
    cookie.path,
    cookie.httpOnly.toString().toUpperCase(),
    Math.trunc(cookie.expirationDate) || 0,
    cookie.name,
    cookie.value,
  ].join('\t');
}

async function sendCookies() {
  console.log('function sendCookies');
  const acceptableDomains = ['.youtube.com', 'youtube.com', 'www.youtube.com'];

  let cookieStores = await browserType.cookies.getAllCookieStores();
  let cookieLines = [
    '# Netscape HTTP Cookie File',
    '# https://curl.haxx.se/rfc/cookie_spec.html',
    '# This is a generated file! Do not edit.\n',
  ];
  for (let i = 0; i < cookieStores.length; i++) {
    const cookieStore = cookieStores[i];
    let allCookiesStore = await browserType.cookies.getAll({
      domain: '.youtube.com',
      storeId: cookieStore['id'],
    });
    for (let j = 0; j < allCookiesStore.length; j++) {
      const cookie = allCookiesStore[j];
      if (acceptableDomains.includes(cookie.domain)) {
        cookieLines.push(buildCookieLine(cookie));
      }
    }
  }

  let response = cookieStr(cookieLines);

  return response;
}

let listenerEnabled = false;
let isThrottled = false;

async function handleContinuousCookie(checked) {
  if (checked === true) {
    browserType.cookies.onChanged.addListener(onCookieChange);
    listenerEnabled = true;
    console.log('Cookie listener enabled');
  } else {
    browserType.cookies.onChanged.removeListener(onCookieChange);
    listenerEnabled = false;
    console.log('Cookie listener disabled');
  }
}

function onCookieChange(changeInfo) {
  if (!isThrottled) {
    isThrottled = true;

    console.log('Cookie event detected:', changeInfo);

    sendCookies();

    setTimeout(() => {
      isThrottled = false;
    }, 10000);
  }
}

/*
process and return message if needed
the following messages are supported:
type Message =
  | { type: 'verify' }
  | { type: 'cookieState' }
  | { type: 'sendCookie' }
  | { type: 'continuousSync', checked: boolean }
  | { type: 'download', url: string }
  | { type: 'subscribe', url: string }
  | { type: 'unsubscribe', url: string }
  | { type: 'videoExists', id: string }
  | { type: 'getChannel', url: string }
*/
function handleMessage(request, sender, sendResponse) {
  console.log('message background.js listener got message', request);

  // this function must return the value `true` in chrome to signal the response will be async;
  // it cannot return a promise
  // so in order to use async/await, we need a wrapper
  (async () => {
    switch (request.type) {
      case 'verify': {
        return await verifyConnection();
      }
      case 'cookieState': {
        return await getCookieState();
      }
      case 'sendCookie': {
        return await sendCookies();
      }
      case 'continuousSync': {
        return await handleContinuousCookie(request.checked);
      }
      case 'download': {
        return await download(request.url);
      }
      case 'subscribe': {
        return await subscribe(request.url, true);
      }
      case 'unsubscribe': {
        let channel = await getChannel(request.url);
        return await subscribe(channel.channel_id, false);
      }
      case 'videoExists': {
        return await videoExists(request.videoId);
      }
      case 'getChannel': {
        return await getChannel(request.channelHandle);
      }
      default: {
        let err = new Error(`unknown message type ${JSON.stringify(request.type)}`);
        console.log(err);
        throw err;
      }
    }
  })()
    .then(value => sendResponse({ success: true, value }))
    .catch(e => {
      console.log(e);
      let message = e?.message ?? e;
      if (message === 'Failed to fetch') {
        // chrome's error message for failed `fetch` is not very user-friendly
        message = 'Could not connect to server';
      }
      sendResponse({ success: false, value: message });
    });
  return true;
}

browserType.runtime.onMessage.addListener(handleMessage);

browserType.runtime.onInstalled.addListener(() => {
  browserType.storage.local.get('continuousSync', data => {
    handleContinuousCookie(data?.continuousSync?.checked || false);
  });
});
