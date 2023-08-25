/*
content script running on youtube.com
*/

'use strict';

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

async function sendMessage(message) {
  let { success, value } = await browserType.runtime.sendMessage(message);
  if (!success) {
    throw value;
  }
  return value;
}

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

function buildButtonDiv() {
  let buttonDiv = document.createElement('div');
  buttonDiv.classList.add('ta-channel-button');

  Object.assign(buttonDiv.style, {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#00202f',
    color: '#fff',
    fontSize: '14px',
    padding: '5px',
    margin: '5px',
    borderRadius: '8px',
  });
  return buttonDiv;
}

function buildSubLink(channelHandle) {
  let subLink = document.createElement('span');
  subLink.innerText = 'Subscribe';
  subLink.title = `TA Subscribe: ${channelHandle}`;
  subLink.setAttribute('data-id', channelHandle);
  subLink.setAttribute('data-type', 'channel');

  subLink.addEventListener('click', e => {
    e.preventDefault();
    console.log(`subscribe to: ${channelHandle}`);
    sendUrl(channelHandle, 'subscribe', subLink);
  });
  subLink.addEventListener('mouseover', () => {
    checkChannelSubscribed(channelHandle);
  });
  Object.assign(subLink.style, {
    padding: '5px',
    cursor: 'pointer',
  });

  return subLink;
}

function checkChannelSubscribed(channelHandle) {
  console.log(`check channel subscribed: ${channelHandle}`);
}

function buildSpacer() {
  let spacer = document.createElement('span');
  spacer.innerText = '|';

  return spacer;
}

function buildDlLink() {
  let dlLink = document.createElement('span');
  let currentLocation = window.location.href;
  let urlObj = new URL(currentLocation);

  if (urlObj.pathname.startsWith('/watch')) {
    let videoId = urlObj.search.split('=')[1];
    dlLink.setAttribute('data-type', 'video');
    dlLink.setAttribute('data-id', videoId);
    dlLink.title = `TA download video: ${videoId}`;
  } else {
    let toDownload = urlObj.pathname.slice(1);
    dlLink.setAttribute('data-id', toDownload);
    dlLink.setAttribute('data-type', 'channel');
    dlLink.title = `TA download channel ${toDownload}`;
  }
  dlLink.innerHTML = downloadIcon;
  dlLink.addEventListener('click', e => {
    e.preventDefault();
    console.log(`download: ${currentLocation}`);
    sendUrl(currentLocation, 'download', dlLink);
  });
  Object.assign(dlLink.style, {
    filter: 'invert()',
    width: '20px',
    padding: '0 5px',
    cursor: 'pointer',
  });

  return dlLink;
}

function getChannelHandle(channelContainer) {
  const channelHandleContainer = document.querySelector('#channel-handle');
  let channelHandle = channelHandleContainer ? channelHandleContainer.innerText : null;
  if (!channelHandle) {
    let href = channelContainer.querySelector('.ytd-video-owner-renderer').href;
    const urlObj = new URL(href);
    channelHandle = urlObj.pathname.split('/')[1];
  }
  return channelHandle;
}

function buildChannelButton(channelContainer) {
  let channelHandle = getChannelHandle(channelContainer);
  let buttonDiv = buildButtonDiv();

  let subLink = buildSubLink(channelHandle);
  buttonDiv.appendChild(subLink);

  let spacer = buildSpacer();
  buttonDiv.appendChild(spacer);

  let dlLink = buildDlLink();
  buttonDiv.appendChild(dlLink);

  return buttonDiv;
}

function getChannelContainers() {
  let nodes = document.querySelectorAll('#inner-header-container, #owner');
  return nodes;
}

function getTitleContainers() {
  let nodes = document.querySelectorAll('#video-title');
  return nodes;
}

// fix positioning of #owner div to fit new button
function adjustOwner(channelContainer) {
  let sponsorButton = channelContainer.querySelector('#sponsor-button');
  if (sponsorButton === null) {
    return channelContainer;
  }

  let variableMinWidth;
  if (sponsorButton.hasChildNodes()) {
    variableMinWidth = '140px';
  } else {
    variableMinWidth = '45px';
  }

  Object.assign(channelContainer.firstElementChild.style, {
    minWidth: variableMinWidth,
  });
  Object.assign(channelContainer.style, {
    minWidth: 'calc(40% + 50px)',
  });
  return channelContainer;
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
    if (titleContainer.hasTA) continue;
    let videoButton = buildVideoButton(titleContainer);
    if (videoButton == null) continue;
    processTitle(titleContainer);
    titleContainer.appendChild(videoButton);
    titleContainer.hasTA = true;
  }
}

function getNearestLink(element) {
  for (let i = 0; i < 5 && element && element !== document; i++) {
    if (element.tagName === 'A' && element.getAttribute('href') !== '#') {
      return element.getAttribute('href');
    }
    element = element.parentNode;
  }
  return null;
}

function processTitle(titleContainer) {
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
}

function checkVideoExists(taButton) {
  function handleResponse(message) {
    let buttonSpan = taButton.querySelector('span');
    if (message) {
      buttonSpan.innerHTML = checkmarkIcon;
    } else {
      buttonSpan.innerHTML = downloadIcon;
    }
    taButton.isChecked = true;
  }
  function handleError() {
    console.log('error');
  }

  let videoId = taButton.dataset.id;
  let message = { type: 'videoExists', videoId };
  let sending = sendMessage(message);
  sending.then(handleResponse, handleError);
}

function buildVideoButton(titleContainer) {
  let href = getNearestLink(titleContainer);
  const dlButton = document.createElement('a');
  dlButton.classList.add('ta-button');
  dlButton.href = '#';

  let params = new URLSearchParams(href);
  let videoId = params.get('/watch?v');
  if (!videoId) return;

  dlButton.setAttribute('data-id', videoId);
  dlButton.setAttribute('data-type', 'video');
  dlButton.title = `TA download video: ${titleContainer.innerText} [${videoId}]`;

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
    width: '18px',
    height: '18px',
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
      buttonSpan.innerHTML = 'Subscribe';
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

  function handleError(error) {
    console.log('error');
    console.log(JSON.stringify(error));
    buttonError(button);
  }

  let message = { type: action, url };

  console.log('youtube link: ' + JSON.stringify(message));

  let sending = sendMessage(message);
  sending.then(handleResponse, handleError);
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
let throttleBlock;
const throttle = (callback, time) => {
  if (throttleBlock) return;
  throttleBlock = true;
  setTimeout(() => {
    callback();
    throttleBlock = false;
  }, time);
};

let observer = new MutationObserver(list => {
  const currentHref = document.location.href;
  if (currentHref !== oldHref) {
    cleanButtons();
    oldHref = currentHref;
  }
  if (list.some(i => i.type === 'childList' && i.addedNodes.length > 0)) {
    throttle(ensureTALinks, 700);
  }
});

observer.observe(document.body, { attributes: false, childList: true, subtree: true });
