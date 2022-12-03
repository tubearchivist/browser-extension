/*
extension background script listening for events
*/

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
  console.log(`${method}: ${JSON.stringify(payload)}`);

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
  const path = 'api/cookie/';
  let response = await sendGet(path);
  console.log('cookie state: ' + JSON.stringify(response));

  return response;
}

// send ping to server, return response
async function verifyConnection() {
  const path = 'api/ping/';
  let response = await sendGet(path);
  console.log('verify connection: ' + JSON.stringify(response));

  return response;
}

// send youtube link from injected buttons
async function youtubeLink(youtubeMessage) {
  let path;
  let payload;

  if (youtubeMessage.action === 'download') {
    path = 'api/download/';
    payload = {
      data: [
        {
          youtube_id: youtubeMessage.url,
          status: 'pending',
        },
      ],
    };
  } else if (youtubeMessage.action === 'subscribe') {
    path = 'api/channel/';
    payload = {
      data: [
        {
          channel_id: youtubeMessage.url,
          channel_subscribed: true,
        },
      ],
    };
  }

  let response = await sendData(path, payload, 'POST');
  return response;
}

async function cookieStr(cookieLines) {
  const path = 'api/cookie/';
  let payload = {
    cookie: cookieLines.join('\n'),
  };
  let response = await sendData(path, payload, 'PUT');

  return response;
}

function buildCookieLine(cookie) {
  return [
    cookie.domain,
    'TRUE',
    cookie.path,
    cookie.httpOnly.toString().toUpperCase(),
    Math.trunc(cookie.expirationDate) || 0,
    cookie.name,
    cookie.value,
  ].join('\t');
}

async function sendCookies() {
  console.log('function sendCookies');

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
      cookieLines.push(buildCookieLine(cookie));
    }
  }

  let response = cookieStr(cookieLines);

  return response;
}

// process and return message if needed
function handleMessage(request, sender, sendResponse) {
  console.log('message background.js listener: ' + JSON.stringify(request));

  if (request.verify === true) {
    let response = verifyConnection();
    response.then(message => {
      sendResponse(message);
    });
  } else if (request.youtube) {
    let response = youtubeLink(request.youtube);
    response.then(message => {
      sendResponse(message);
    });
  } else if (request.cookieState) {
    let response = getCookieState();
    response.then(message => {
      sendResponse(message);
    });
  } else if (request.sendCookie) {
    console.log('backgound: ' + JSON.stringify(request));
    let response = sendCookies();
    response.then(message => {
      sendResponse(message);
    });
  }

  return true;
}

browserType.runtime.onMessage.addListener(handleMessage);
