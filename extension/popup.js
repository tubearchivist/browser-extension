/*
Loaded into popup index.html
*/

'use strict';

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

async function sendMessage(message) {
  let { success, value } = await browserType.runtime.sendMessage(message);
  if (!success) {
    throw value;
  }
  return value;
}

let errorOut = document.getElementById('error-out');
function setError(message) {
  errorOut.style.display = 'initial';
  errorOut.innerText = message;
}

function clearError() {
  errorOut.style.display = 'none';
}

function clearTempLocalStorage() {
  browserType.storage.local.remove('popupApiKey');
  browserType.storage.local.remove('popupFullUrl');
}

// store access details
document.getElementById('save-login').addEventListener('click', function () {
  let url = document.getElementById('full-url').value;
  if (!url.includes('://')) {
    url = 'http://' + url;
  }
  try {
    clearError();
    let parsed = new URL(url);
    let toStore = {
      access: {
        url: `${parsed.protocol}//${parsed.hostname}`,
        port: parsed.port || (parsed.protocol === 'https:' ? '443' : '80'),
        apiKey: document.getElementById('api-key').value,
      },
    };
    browserType.storage.local.set(toStore, function () {
      console.log('Stored connection details: ' + JSON.stringify(toStore));
      pingBackend();
    });
  } catch (e) {
    setError(e.message);
  }
});

// verify connection status
document.getElementById('status-icon').addEventListener('click', function () {
  pingBackend();
});

// send cookie
document.getElementById('sendCookies').addEventListener('click', function () {
  sendCookie();
});

// continuous sync
document.getElementById('continuous-sync').addEventListener('click', function () {
  toggleContinuousSync();
});

// autostart
document.getElementById('autostart').addEventListener('click', function () {
  toggleAutostart();
});

let fullUrlInput = document.getElementById('full-url');
fullUrlInput.addEventListener('change', () => {
  browserType.storage.local.set({
    popupFullUrl: fullUrlInput.value,
  });
});

let apiKeyInput = document.getElementById('api-key');
apiKeyInput.addEventListener('change', () => {
  browserType.storage.local.set({
    popupApiKey: apiKeyInput.value,
  });
});

function sendCookie() {
  console.log('popup send cookie');
  clearError();

  function handleResponse(message) {
    console.log('handle cookie response: ' + JSON.stringify(message));
    let validattionMessage = `enabled, last verified ${message.validated_str}`;
    document.getElementById('sendCookiesStatus').innerText = validattionMessage;
  }

  function handleError(error) {
    console.log(`Error: ${error}`);
    setError(error);
  }

  let sending = sendMessage({ type: 'sendCookie' });
  sending.then(handleResponse, handleError);
}

function toggleContinuousSync() {
  const checked = document.getElementById('continuous-sync').checked;
  let toStore = {
    continuousSync: {
      checked: checked,
    },
  };
  browserType.storage.local.set(toStore, function () {
    console.log('stored option: ' + JSON.stringify(toStore));
  });
  sendMessage({ type: 'continuousSync', checked });
}

function toggleAutostart() {
  let checked = document.getElementById('autostart').checked;
  let toStore = {
    autostart: {
      checked: checked,
    },
  };
  browserType.storage.local.set(toStore, function () {
    console.log('stored option: ' + JSON.stringify(toStore));
  });
}

// send ping message to TA backend
function pingBackend() {
  clearError();
  clearTempLocalStorage();
  function handleResponse() {
    console.log('connection validated');
    setStatusIcon(true);
  }

  function handleError(error) {
    console.log(`Verify got error: ${error}`);
    setStatusIcon(false);
    setError(error);
  }

  console.log('ping TA server');
  let sending = sendMessage({ type: 'verify' });
  sending.then(handleResponse, handleError);
}

// add url to image
function addUrl(access) {
  const url = `${access.url}:${access.port}`;
  document.getElementById('ta-url').setAttribute('href', url);
}

function setCookieState() {
  clearError();
  function handleResponse(message) {
    console.log(message);
    if (!message.cookie_enabled) {
      document.getElementById('sendCookiesStatus').innerText = 'disabled';
    } else {
      let validattionMessage = `enabled, last verified ${message.validated_str}`;
      document.getElementById('sendCookiesStatus').innerText = validattionMessage;
    }
  }

  function handleError(error) {
    console.log(`Error: ${error}`);
    setError(error);
  }

  console.log('set cookie state');
  let sending = sendMessage({ type: 'cookieState' });
  sending.then(handleResponse, handleError);
  document.getElementById('sendCookies').checked = true;
}

// change status icon based on connection status
function setStatusIcon(connected) {
  let statusIcon = document.getElementById('status-icon');
  if (connected) {
    statusIcon.innerHTML = '&#9745;';
    statusIcon.style.color = 'green';
  } else {
    statusIcon.innerHTML = '&#9746;';
    statusIcon.style.color = 'red';
  }
}

// fill in form
document.addEventListener('DOMContentLoaded', async () => {
  function onGot(item) {
    if (!item.access) {
      console.log('no access details found');
      if (item.popupFullUrl != null && fullUrlInput.value === '') {
        fullUrlInput.value = item.popupFullUrl;
      }
      if (item.popupApiKey != null && apiKeyInput.value === '') {
        apiKeyInput.value = item.popupApiKey;
      }
      setStatusIcon(false);
      return;
    }
    let { url, port } = item.access;
    let fullUrl = url;
    if (!(url.startsWith('http://') && port === '80')) {
      fullUrl += `:${port}`;
    }
    document.getElementById('full-url').value = fullUrl;
    document.getElementById('api-key').value = item.access.apiKey;
    pingBackend();
    addUrl(item.access);
  }

  function setContinuousCookiesOptions(result) {
    if (!result.continuousSync || result.continuousSync.checked === false) {
      console.log('continuous cookie sync not set');
      return;
    }
    console.log('set options: ' + JSON.stringify(result));
    document.getElementById('continuous-sync').checked = true;
  }

  function setAutostartOption(result) {
    console.log(result);
    if (!result.autostart || result.autostart.checked === false) {
      console.log('autostart not set');
      return;
    }
    console.log('set options: ' + JSON.stringify(result));
    document.getElementById('autostart').checked = true;
  }

  browserType.storage.local.get(['access', 'popupFullUrl', 'popupApiKey'], function (result) {
    onGot(result);
  });

  browserType.storage.local.get('continuousSync', function (result) {
    setContinuousCookiesOptions(result);
  });

  browserType.storage.local.get('autostart', function (result) {
    setAutostartOption(result);
  });

  setCookieState();
});
