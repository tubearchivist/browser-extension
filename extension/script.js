/*
content script running on youtube.com
*/

let browserType = getBrowser();


// boilerplate to dedect browser type api
function getBrowser() {
    if (typeof chrome !== "undefined") {
        if (typeof browser !== "undefined") {
            console.log("detected firefox");
            return browser;
        } else {
            console.log("detected chrome");
            return chrome;
        }
    } else {
        console.log("failed to dedect browser");
        throw "browser detection error"
    };
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
</svg>`


function buildButtonDiv() {
    var buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("id", "ta-channel-button");

    Object.assign(buttonDiv.style, {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#00202f",
        color: "#fff",
        fontSize: "14px",
        padding: "5px",
        margin: "0 5px",
        borderRadius: "8px",
    });
    return buttonDiv
}

function buildSubLink(channelContainer) {
    var subLink = document.createElement("span");
    subLink.innerText = "Subscribe";
    subLink.addEventListener('click', e => {
        e.preventDefault();
        var currentLocation = window.location.href;
        console.log("subscribe to: " + currentLocation);
        sendUrl(currentLocation, "subscribe", subLink);
    });
    subLink.addEventListener("mouseover", e => {
        let subText
        if (window.location.pathname == "/watch") {
            var currentLocation = window.location.href;
            subText = currentLocation;
        } else {
            subText = channelContainer.querySelector("#text").textContent;
        };

        e.target.title = "TA Subscribe: " + subText;
    });
    Object.assign(subLink.style, {
        padding: "5px",
        cursor: "pointer",
    });
    
    return subLink
}

function buildSpacer() {
    var spacer = document.createElement("span");
    spacer.innerText = "|";

    return spacer
}

function buildDlLink(channelContainer) {
    var dlLink = document.createElement("span");
    dlLink.innerHTML = downloadIcon;

    dlLink.addEventListener('click', e => {
        e.preventDefault();
        var currentLocation = window.location.href;
        console.log("download: " + currentLocation)
        sendUrl(currentLocation, "download", dlLink);
    });
    dlLink.addEventListener("mouseover", e => {
        let subText
        if (window.location.pathname == "/watch") {
            var currentLocation = window.location.href;
            subText = currentLocation;
        } else {
            subText = channelContainer.querySelector("#text").textContent;
        };

        e.target.title = "TA Download: " + subText;
    });
    Object.assign(dlLink.style, {
        filter: "invert()",
        width: "20px",
        padding: "0 5px",
        cursor: "pointer",
    });

    return dlLink
}


function buildChannelButton(channelContainer) {

    var buttonDiv = buildButtonDiv()
    
    var subLink = buildSubLink(channelContainer);
    buttonDiv.appendChild(subLink)

    var spacer = buildSpacer()
    buttonDiv.appendChild(spacer);

    var dlLink = buildDlLink(channelContainer)
    buttonDiv.appendChild(dlLink);

    return buttonDiv

}

function getChannelContainers() {
    var nodes = document.querySelectorAll("#inner-header-container, #owner");
    return nodes
}

function getThubnailContainers() {
    var nodes = document.querySelectorAll('#thumbnail');
    return nodes
}

function buildVideoButton(thumbContainer) {
    var thumbLink = thumbContainer?.href;
    if (!thumbLink) return;
    if (thumbLink.includes('list=') || thumbLink.includes('/shorts/')) return;

    var dlButton = document.createElement("a");
    dlButton.setAttribute("id", "ta-video-button");
    dlButton.href = '#'

    dlButton.addEventListener('click', e => {
        e.preventDefault();
        let videoLink = thumbContainer.href;
        console.log("download: " + videoLink);
        sendUrl(videoLink, "download", dlButton)
    });
    dlButton.addEventListener('mouseover', e => {
        Object.assign(dlButton.style, {
            opacity: 1,
        });
        let videoTitle = thumbContainer.href;
        e.target.title = "TA download: " + videoTitle;
    })
    dlButton.addEventListener('mouseout', e => {
        Object.assign(dlButton.style, {
            opacity: 0,
        });
    })

    Object.assign(dlButton.style, {
        display: "flex",
        position: "absolute",
        top: "5px",
        left: "5px",
        alignItems: "center",
        backgroundColor: "#00202f",
        color: "#fff",
        fontSize: "1.4rem",
        textDecoration: "none",
        borderRadius: "8px",
        cursor: "pointer",
        opacity: 0,
        transition: "all 0.3s ease 0.3s",
    });
    
    var dlIcon = document.createElement("span");
    dlIcon.innerHTML = downloadIcon;
    Object.assign(dlIcon.style, {
        filter: "invert()",
        width: "20px",
        padding: "10px 13px",
    });
    
    dlButton.appendChild(dlIcon);

    return dlButton

}


// fix positioning of #owner div to fit new button
function adjustOwner(channelContainer) {
    let sponsorButton = channelContainer.querySelector('#sponsor-button');
    if (sponsorButton === null) {
        return channelContainer
    }

    let variableMinWidth
    if (sponsorButton.hasChildNodes()) {
        variableMinWidth = '140px';
    } else {
        variableMinWidth = '45px';
    }

    Object.assign(channelContainer.firstElementChild.style, {
        minWidth: variableMinWidth
    })
    Object.assign(channelContainer.style, {
        minWidth: 'calc(40% + 50px)'
    })
    return channelContainer
}


function ensureTALinks() {

    var channelContainerNodes = getChannelContainers()

    for (var channelContainer of channelContainerNodes) {
        channelContainer = adjustOwner(channelContainer);
        if (channelContainer.hasTA) continue;
        var channelButton = buildChannelButton(channelContainer);
        channelContainer.appendChild(channelButton);
        channelContainer.hasTA = true;
    }

    var thumbContainerNodes = getThubnailContainers();

    for (var thumbContainer of thumbContainerNodes) {
        if (thumbContainer.hasTA) continue;
        var videoButton = buildVideoButton(thumbContainer);
        if (videoButton == null) continue;
        thumbContainer.parentElement.appendChild(videoButton);
        thumbContainer.hasTA = true;
    }

}


function buttonError(button) {
    let buttonSpan = button.querySelector("span");
    if (buttonSpan === null) {
        buttonSpan = button
    }
    buttonSpan.style.filter = "invert(19%) sepia(93%) saturate(7472%) hue-rotate(359deg) brightness(105%) contrast(113%)";
    buttonSpan.style.color = "red";

    button.style.opacity = 1;
    button.addEventListener('mouseout', e => {
        Object.assign(button.style, {
            opacity: 1,
        });
    })
}

function buttonSuccess(button) {
    let buttonSpan = button.querySelector("span");
    if (buttonSpan === null) {
        buttonSpan = button;
    }
    if (buttonSpan.innerHTML === "Subscribe") {
        buttonSpan.innerHTML = "Success";
        setTimeout(() => {
            buttonSpan.innerHTML = "Subscribe";
        }, 2000);
    } else {
        buttonSpan.innerHTML = checkmarkIcon;
        setTimeout(() => {
            buttonSpan.innerHTML = downloadIcon;
        }, 2000);
    }
}


function sendUrl(url, action, button) {

    function handleResponse(message) {
        console.log("sendUrl response: " + JSON.stringify(message));
        if (message === null || message.detail === "Invalid token.") {
            buttonError(button);
        } else {
            buttonSuccess(button);
        }
    }

    function handleError(error) {
        console.log("error");
        console.log(JSON.stringify(error));
    }

    let payload = {
        "youtube": {
            "url": url,
            "action": action,
        }
    }

    console.log("youtube link: " + JSON.stringify(payload));

    let sending = browserType.runtime.sendMessage(payload);
    sending.then(handleResponse, handleError);

};


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
    if (list.some(i => i.type === 'childList' && i.addedNodes.length > 0)) {
        throttle(ensureTALinks, 700);
    }
});

observer.observe(document.body, { attributes: false, childList: true, subtree: true });
