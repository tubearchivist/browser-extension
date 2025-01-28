/*
content script running on youtube.com
*/

'use strict';

const downloadIcon = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;" xml:space="preserve">
<style type="text/css">
.st0{display:none;}
.st1{display:inline;}
</style>
<g class="st0">
<g class="st1">
   <g>
       <rect x="49.8" y="437.8" width="400.4" height="32.4"/>
   </g>
   <g>
       <g>
           <path d="M49.8,193c2-9.4,7.6-16.4,14.5-22.6c2.9-2.6,5.5-5.5,8.3-8.3c13.1-12.9,31.6-13,44.6,0c23,22.9,45.9,45.9,68.8,68.8
               c0.7,0.7,1.5,1.4,2.5,2.4c1.1-1.1,2.2-2.1,3.3-3.1c63.4-63.4,126.8-126.8,190.2-190.2c10.7-10.7,24.6-13.3,37.1-6.7
               c2.9,1.6,5.6,3.8,8.1,6c4.2,3.9,8.2,8.1,12.2,12.1c14.3,14.3,14.3,32.4,0.1,46.6c-20.2,20.3-40.5,40.5-60.8,60.8
               C321,216.8,263.2,274.6,205.4,332.4c-11.2,11.2-22.4,11.2-33.6,0c-35.7-35.7-71.4-71.6-107.3-107.2
               c-6.7-6.6-12.7-13.4-14.8-22.8C49.8,199.2,49.8,196.1,49.8,193z"/>
       </g>
   </g>
</g>
</g>
<g>
<rect x="237.9" y="313.5" transform="matrix(-1.836970e-16 1 -1 -1.836970e-16 708.0891 208.8956)" width="23.4" height="289.9"/>
<g>
   <g>
       <path d="M190.6,195.1c-21.7,0-42.5,0.1-63.4,0c-8.2,0-14.4,3-17.8,10.6c-3.5,7.9-1.3,14.6,4.5,20.7
           c40.6,42.4,81,84.9,121.6,127.3c8.9,9.3,19.1,9.4,28,0.1c40.7-42.5,81.3-85.1,122-127.7c5.6-5.9,7.6-12.6,4.3-20.3
           c-3.3-7.6-9.5-10.8-17.7-10.7c-19,0.1-38,0-57,0c-2,0-3.9,0-6.5,0c0-2.8,0-5,0-7.1c0-42.3,0.1-84.5,0-126.8
           c0-19.4-12.1-31.3-31.5-31.4c-17.9-0.1-35.8,0-53.7,0c-21.2,0-32.7,11.6-32.7,32.9c0,41.7,0,83.4,0,125.1
           C190.6,190,190.6,192.2,190.6,195.1z"/>
       <path d="M190.6,195.1c0-2.9,0-5.1,0-7.3c0-41.7,0-83.4,0-125.1c0-21.3,11.5-32.9,32.7-32.9c17.9,0,35.8-0.1,53.7,0
           c19.4,0.1,31.5,12,31.5,31.4c0.1,42.3,0,84.5,0,126.8c0,2.2,0,4.4,0,7.1c2.5,0,4.5,0,6.5,0c19,0,38,0.1,57,0
           c8.2,0,14.4,3.1,17.7,10.7c3.4,7.6,1.3,14.4-4.3,20.3c-40.7,42.6-81.3,85.2-122,127.7c-8.8,9.2-19.1,9.2-28-0.1
           c-40.5-42.4-81-84.9-121.6-127.3c-5.8-6.1-8-12.8-4.5-20.7c3.4-7.6,9.6-10.7,17.8-10.6C148.1,195.2,168.9,195.1,190.6,195.1z"/>
   </g>
</g>
</g>
</svg>`;

const checkmarkIcon = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;" xml:space="preserve">
<style type="text/css">
.st0{display:none;}
.st1{display:inline;}
</style>
<g>
<g>
   <g>
       <rect x="49.8" y="437.8" width="400.4" height="32.4"/>
   </g>
   <g>
       <g>
           <path d="M49.8,193c2-9.4,7.6-16.4,14.5-22.6c2.9-2.6,5.5-5.5,8.3-8.3c13.1-12.9,31.6-13,44.6,0c23,22.9,45.9,45.9,68.8,68.8
               c0.7,0.7,1.5,1.4,2.5,2.4c1.1-1.1,2.2-2.1,3.3-3.1c63.4-63.4,126.8-126.8,190.2-190.2c10.7-10.7,24.6-13.3,37.1-6.7
               c2.9,1.6,5.6,3.8,8.1,6c4.2,3.9,8.2,8.1,12.2,12.1c14.3,14.3,14.3,32.4,0.1,46.6c-20.2,20.3-40.5,40.5-60.8,60.8
               C321,216.8,263.2,274.6,205.4,332.4c-11.2,11.2-22.4,11.2-33.6,0c-35.7-35.7-71.4-71.6-107.3-107.2
               c-6.7-6.6-12.7-13.4-14.8-22.8C49.8,199.2,49.8,196.1,49.8,193z"/>
       </g>
   </g>
</g>
</g>
<g class="st0">

   <rect x="237.9" y="313.5" transform="matrix(-1.836970e-16 1 -1 -1.836970e-16 708.0891 208.8956)" class="st1" width="23.4" height="289.9"/>
<g class="st1">
   <g>
       <path d="M190.6,195.1c-21.7,0-42.5,0.1-63.4,0c-8.2,0-14.4,3-17.8,10.6c-3.5,7.9-1.3,14.6,4.5,20.7
           c40.6,42.4,81,84.9,121.6,127.3c8.9,9.3,19.1,9.4,28,0.1c40.7-42.5,81.3-85.1,122-127.7c5.6-5.9,7.6-12.6,4.3-20.3
           c-3.3-7.6-9.5-10.8-17.7-10.7c-19,0.1-38,0-57,0c-2,0-3.9,0-6.5,0c0-2.8,0-5,0-7.1c0-42.3,0.1-84.5,0-126.8
           c0-19.4-12.1-31.3-31.5-31.4c-17.9-0.1-35.8,0-53.7,0c-21.2,0-32.7,11.6-32.7,32.9c0,41.7,0,83.4,0,125.1
           C190.6,190,190.6,192.2,190.6,195.1z"/>
       <path d="M190.6,195.1c0-2.9,0-5.1,0-7.3c0-41.7,0-83.4,0-125.1c0-21.3,11.5-32.9,32.7-32.9c17.9,0,35.8-0.1,53.7,0
           c19.4,0.1,31.5,12,31.5,31.4c0.1,42.3,0,84.5,0,126.8c0,2.2,0,4.4,0,7.1c2.5,0,4.5,0,6.5,0c19,0,38,0.1,57,0
           c8.2,0,14.4,3.1,17.7,10.7c3.4,7.6,1.3,14.4-4.3,20.3c-40.7,42.6-81.3,85.2-122,127.7c-8.8,9.2-19.1,9.2-28-0.1
           c-40.5-42.4-81-84.9-121.6-127.3c-5.8-6.1-8-12.8-4.5-20.7c3.4-7.6,9.6-10.7,17.8-10.6C148.1,195.2,168.9,195.1,190.6,195.1z"/>
   </g>
</g>
</g>
</svg>`;

const defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>minus-thick</title><path d="M20 14H4V10H20" /></svg>`;

let browserType = getBrowser();

// boilerplate to dedect browser type api
function getBrowser() {
  if (typeof chrome !== 'undefined') {
    if (typeof browser !== 'undefined') {
      console.log('detected firefox');
      return browser;
    } else {
      console.log('detected chrome');
      return chrome;
    }
  } else {
    console.log('failed to dedect browser');
    throw 'browser detection error';
  }
}

function getChannelContainers() {
  const elements = document.querySelectorAll('.page-header-view-model-wiz__page-header-flexible-actions, #owner');
  const channelContainerNodes = [];

  elements.forEach(element => {
    if (isElementVisible(element) && window.location.pathname !== '/playlist') {
      channelContainerNodes.push(element);
    }
  });

  return channelContainerNodes;
}

function isElementVisible(element) {
  return element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0;
}

function ensureTALinks() {
  let channelContainerNodes = getChannelContainers();

  for (let channelContainer of channelContainerNodes) {
    channelContainer = adjustOwner(channelContainer);
    if (channelContainer.hasTA) continue;
    let channelButton = buildChannelButton(channelContainer);
    channelContainer.appendChild(channelButton);
    channelContainer.hasTA = true;
  }

  let titleContainerNodes = getTitleContainers();
  for (let titleContainer of titleContainerNodes) {
    let parent = getNearestH3(titleContainer);
    if (!parent) continue;
    if (parent.hasTA) continue;
    let videoButton = buildVideoButton(titleContainer);
    if (videoButton == null) continue;
    processTitle(parent);
    parent.appendChild(videoButton);
    parent.hasTA = true;
  }
}
ensureTALinks = throttled(ensureTALinks, 700);

function adjustOwner(channelContainer) {
  return channelContainer.querySelector('#buttons') || channelContainer;
}

function buildChannelButton(channelContainer) {
  let channelHandle = getChannelHandle(channelContainer);
  channelContainer.taDerivedHandle = channelHandle;

  let buttonDiv = buildChannelButtonDiv();

  let channelSubButton = buildChannelSubButton(channelHandle);
  buttonDiv.appendChild(channelSubButton);
  channelContainer.taSubButton = channelSubButton;

  let spacer = buildSpacer();
  buttonDiv.appendChild(spacer);

  let channelDownloadButton = buildChannelDownloadButton();
  buttonDiv.appendChild(channelDownloadButton);
  channelContainer.taDownloadButton = channelDownloadButton;

  if (!channelContainer.taObserver) {
    function updateButtonsIfNecessary() {
      let newHandle = getChannelHandle(channelContainer);
      if (channelContainer.taDerivedHandle === newHandle) return;
      console.log(`updating handle from ${channelContainer.taDerivedHandle} to ${newHandle}`);
      channelContainer.taDerivedHandle = newHandle;
      let channelSubButton = buildChannelSubButton(newHandle);
      channelContainer.taSubButton.replaceWith(channelSubButton);
      channelContainer.taSubButton = channelSubButton;

      let channelDownloadButton = buildChannelDownloadButton();
      channelContainer.taDownloadButton.replaceWith(channelDownloadButton);
      channelContainer.taDownloadButton = channelDownloadButton;
    }
    channelContainer.taObserver = new MutationObserver(throttled(updateButtonsIfNecessary, 100));
    channelContainer.taObserver.observe(channelContainer, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }

  return buttonDiv;
}

function getChannelHandle(channelContainer) {

  function findeHandleString(container) {
    let result = null;
  
    function recursiveTraversal(element) {
      for (let child of element.children) {

        if (child.tagName === "A" && child.hasAttribute("href")) {
          const href = child.getAttribute("href");
          const match = href.match(/\/@[^/]+/); // Match the path starting with "@"
          if (match) {
            // handle is in channel link
            result = match[0].substring(1);
            return;
          }
        }

        if (child.children.length === 0 && child.textContent.trim().startsWith("@")) {
          // handle is in channel description text
          result = child.textContent.trim();
          return;
        }
  
        recursiveTraversal(child);
        if (result) return;
      }
    }
  
    recursiveTraversal(container);
    return result;
  }

  let channelHandle = findeHandleString(channelContainer.parentElement);

  return channelHandle;
}

function buildChannelButtonDiv() {
  let buttonDiv = document.createElement('div');
  buttonDiv.classList.add('ta-channel-button');
  Object.assign(buttonDiv.style, {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#00202f',
    color: '#fff',
    fontSize: '14px',
    padding: '5px',
    'margin-left': '8px',
    borderRadius: '18px',
  });
  return buttonDiv;
}

function buildChannelSubButton(channelHandle) {
  let channelSubButton = document.createElement('span');
  channelSubButton.innerText = 'Checking...';
  channelSubButton.title = `TA Subscribe: ${channelHandle}`;
  channelSubButton.setAttribute('data-id', channelHandle);
  channelSubButton.setAttribute('data-type', 'channel');

  channelSubButton.addEventListener('click', e => {
    e.preventDefault();
    if (channelSubButton.innerText === 'Subscribe') {
      console.log(`subscribe to: ${channelHandle}`);
      sendUrl(channelHandle, 'subscribe', channelSubButton);
    } else if (channelSubButton.innerText === 'Unsubscribe') {
      console.log(`unsubscribe from: ${channelHandle}`);
      sendUrl(channelHandle, 'unsubscribe', channelSubButton);
    } else {
      console.log('Unknown state');
    }
    e.stopPropagation();
  });
  Object.assign(channelSubButton.style, {
    padding: '5px',
    cursor: 'pointer',
  });
  checkChannelSubscribed(channelSubButton);

  return channelSubButton;
}

function checkChannelSubscribed(channelSubButton) {
  function handleResponse(message) {
    if (!message || (typeof message === 'object' && message.channel_subscribed === false)) {
      channelSubButton.innerText = 'Subscribe';
    } else if (typeof message === 'object' && message.channel_subscribed === true) {
      channelSubButton.innerText = 'Unsubscribe';
    } else {
      console.log('Unknown state');
    }
  }
  function handleError(e) {
    buttonError(channelSubButton);
    channelSubButton.innerText = 'Error';
    console.error('error', e);
  }

  let channelHandle = channelSubButton.dataset.id;
  let message = { type: 'getChannel', channelHandle };
  let sending = sendMessage(message);
  sending.then(handleResponse, handleError);
}

function buildSpacer() {
  let spacer = document.createElement('span');
  spacer.innerText = '|';

  return spacer;
}

function buildChannelDownloadButton() {
  let channelDownloadButton = document.createElement('span');
  let currentLocation = window.location.href;
  let urlObj = new URL(currentLocation);

  if (urlObj.pathname.startsWith('/watch')) {
    let params = new URLSearchParams(document.location.search);
    let videoId = params.get('v');
    channelDownloadButton.setAttribute('data-type', 'video');
    channelDownloadButton.setAttribute('data-id', videoId);
    channelDownloadButton.title = `TA download video: ${videoId}`;
    checkVideoExists(channelDownloadButton);
  } else {
    channelDownloadButton.setAttribute('data-id', currentLocation);
    channelDownloadButton.setAttribute('data-type', 'channel');
    channelDownloadButton.title = `TA download channel ${currentLocation}`;
  }
  channelDownloadButton.innerHTML = downloadIcon;
  channelDownloadButton.addEventListener('click', e => {
    e.preventDefault();
    console.log(`download: ${currentLocation}`);
    sendDownload(channelDownloadButton);
    e.stopPropagation();
  });
  Object.assign(channelDownloadButton.style, {
    filter: 'invert()',
    width: '20px',
    padding: '0 5px',
    cursor: 'pointer',
  });

  return channelDownloadButton;
}

function getTitleContainers() {
  let elements = document.querySelectorAll('#video-title');
  let videoNodes = [];
  elements.forEach(element => {
    if (isElementVisible(element)) {
      videoNodes.push(element);
    }
  });
  return elements;
}

function getVideoId(titleContainer) {
  if (!titleContainer) return undefined;

  let href = getNearestLink(titleContainer);
  if (!href) return;

  let videoId;
  if (href.startsWith('/watch?v')) {
    let params = new URLSearchParams(href);
    videoId = params.get('/watch?v');
  } else if (href.startsWith('/shorts/')) {
    videoId = href.split('/')[2];
  }
  return videoId;
}

function buildVideoButton(titleContainer) {
  let videoId = getVideoId(titleContainer);
  if (!videoId) return;

  const dlButton = document.createElement('a');
  dlButton.classList.add('ta-button');
  dlButton.href = '#';

  Object.assign(dlButton.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00202f',
    color: '#fff',
    fontSize: '1.4rem',
    textDecoration: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    height: 'fit-content',
    opacity: 0,
  });

  let dlIcon = document.createElement('span');
  dlIcon.innerHTML = defaultIcon;
  Object.assign(dlIcon.style, {
    filter: 'invert()',
    width: '15px',
    height: '15px',
    padding: '7px 8px',
  });

  dlButton.appendChild(dlIcon);

  dlButton.addEventListener('click', e => {
    e.preventDefault();
    sendDownload(dlButton);
    e.stopPropagation();
  });

  return dlButton;
}

function getNearestLink(element) {
  // Check siblings
  let sibling = element;
  while (sibling) {
    sibling = sibling.previousElementSibling;
    if (sibling && sibling.tagName === 'A' && sibling.getAttribute('href') !== '#') {
      return sibling.getAttribute('href');
    }
  }

  sibling = element;
  while (sibling) {
    sibling = sibling.nextElementSibling;
    if (sibling && sibling.tagName === 'A' && sibling.getAttribute('href') !== '#') {
      return sibling.getAttribute('href');
    }
  }

  // Check parent elements
  for (let i = 0; i < 5 && element && element !== document; i++) {
    if (element.tagName === 'A' && element.getAttribute('href') !== '#') {
      return element.getAttribute('href');
    }
    element = element.parentNode;
  }
  return null;
}

function getNearestH3(element) {
  for (let i = 0; i < 5 && element && element !== document; i++) {
    if (element.tagName === 'H3') {
      return element;
    }
    element = element.parentNode;
  }
  return null;
}

function processTitle(titleContainer) {
  if (titleContainer.hasListener) return;
  Object.assign(titleContainer.style, {
    display: 'flex',
    gap: '15px',
  });

  titleContainer.classList.add('title-container');
  titleContainer.addEventListener('mouseenter', () => {
    const taButton = titleContainer.querySelector('.ta-button');
    if (!taButton) return;
    if (!taButton.isChecked) checkVideoExists(taButton);
    taButton.style.opacity = 1;
  });

  titleContainer.addEventListener('mouseleave', () => {
    const taButton = titleContainer.querySelector('.ta-button');
    if (!taButton) return;
    taButton.style.opacity = 0;
  });
  titleContainer.hasListener = true;
}

function checkVideoExists(taButton) {
  function handleResponse(message) {
    let buttonSpan = taButton.querySelector('span') || taButton;
    if (message !== false) {
      buttonSpan.innerHTML = checkmarkIcon;
      buttonSpan.title = 'Open in TA';
      buttonSpan.addEventListener('click', () => {
        let win = window.open(message, '_blank');
        win.focus();
      });
    } else {
      buttonSpan.innerHTML = downloadIcon;
    }
    taButton.isChecked = true;
  }
  function handleError(e) {
    buttonError(taButton);
    let videoId = taButton.dataset.id;
    console.log(`error: failed to get info from TA for video ${videoId}`);
    console.error(e);
  }

  let videoId = taButton.dataset.id;
  if (!videoId) {
    videoId = getVideoId(taButton);
    if (videoId) {
      taButton.setAttribute('data-id', videoId);
      taButton.setAttribute('data-type', 'video');
      taButton.title = `TA download video: ${taButton.parentElement.innerText} [${videoId}]`;
    }
  }

  let message = { type: 'videoExists', videoId };
  let sending = sendMessage(message);
  sending.then(handleResponse, handleError);
}

function sendDownload(button) {
  let url = button.dataset.id;
  if (!url) return;
  sendUrl(url, 'download', button);
}

function buttonError(button) {
  let buttonSpan = button.querySelector('span');
  if (buttonSpan === null) {
    buttonSpan = button;
  }
  buttonSpan.style.filter =
    'invert(19%) sepia(93%) saturate(7472%) hue-rotate(359deg) brightness(105%) contrast(113%)';
  buttonSpan.style.color = 'red';

  button.style.opacity = 1;
  button.addEventListener('mouseout', () => {
    Object.assign(button.style, {
      opacity: 1,
    });
  });
}

function buttonSuccess(button) {
  let buttonSpan = button.querySelector('span');
  if (buttonSpan === null) {
    buttonSpan = button;
  }
  if (buttonSpan.innerHTML === 'Subscribe') {
    buttonSpan.innerHTML = 'Success';
    setTimeout(() => {
      buttonSpan.innerHTML = 'Unsubscribe';
    }, 2000);
  } else {
    buttonSpan.innerHTML = checkmarkIcon;
  }
}

function sendUrl(url, action, button) {
  function handleResponse(message) {
    console.log('sendUrl response: ' + JSON.stringify(message));
    if (message === null || message.detail === 'Invalid token.') {
      buttonError(button);
    } else {
      buttonSuccess(button);
    }
  }

  function handleError(e) {
    console.log('error', e);
    buttonError(button);
  }

  let message = { type: action, url };

  console.log('youtube link: ' + JSON.stringify(message));

  let sending = sendMessage(message);
  sending.then(handleResponse, handleError);
}

async function sendMessage(message) {
  let { success, value } = await browserType.runtime.sendMessage(message);
  if (!success) {
    throw value;
  }
  return value;
}

function cleanButtons() {
  console.log('trigger clean buttons');
  document.querySelectorAll('.ta-button').forEach(button => {
    button.parentElement.hasTA = false;
    button.remove();
  });
  document.querySelectorAll('.ta-channel-button').forEach(button => {
    button.parentElement.hasTA = false;
    button.remove();
  });
}

let oldHref = document.location.href;

function throttled(callback, time) {
  let throttleBlock = false;
  let lastArgs;
  return (...args) => {
    lastArgs = args;
    if (throttleBlock) return;
    throttleBlock = true;
    setTimeout(() => {
      throttleBlock = false;
      callback(...lastArgs);
    }, time);
  };
}

let observer = new MutationObserver(list => {
  const currentHref = document.location.href;
  if (currentHref !== oldHref) {
    cleanButtons();
    oldHref = currentHref;
  }
  if (list.some(i => i.type === 'childList' && i.addedNodes.length > 0)) {
    ensureTALinks();
  }
});

observer.observe(document.body, { attributes: false, childList: true, subtree: true });
