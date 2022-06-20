/*
extension background script listening for events
*/

console.log("running background.js");

let browserType = getBrowser();


// boilerplate to dedect browser type api
function getBrowser() {
    if (typeof chrome !== "undefined") {
        if (typeof browser !== "undefined") {
            return browser;
        } else {
            return chrome;
        }
    } else {
        console.log("failed to dedect browser");
        throw "browser detection error"
    };
}


// send get request to API backend
async function sendGet(path) {

    let access = await getAccess();
    const url = `${access.url}:${access.port}/${path}`;
    console.log("GET: " + url);

    const rawResponse = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Token " + access.apiKey,
            "mode": "no-cors"
        }
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

    const rawResponse = await fetch(url, {
        method: method,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Token " + access.apiKey,
            "mode": "no-cors"
        },
        body: JSON.stringify(payload)
    });

    const content = await rawResponse.json();
    return content;
}


// read access details from storage.local
async function getAccess() {

    var storage = await browserType.storage.local.get("access");

    return storage.access

}


// send ping to server, return response
async function verifyConnection() {

    const path = "api/ping/";
    let response = await sendGet(path)
    console.log("verify connection: " + JSON.stringify(response));

    return response
}


// store last youtube link
function setYoutubeLink(data) {
    browserType.storage.local.set(data, function() {
        console.log("Stored history: " + JSON.stringify(data));
    });
}


// send download task to server, return response
async function downloadLink(toDownload) {

    const path = "api/download/";
    let payload = {
        "data": [
            {
                "youtube_id": toDownload,
                "status": "pending",
            }
        ]
    }
    let response = await sendData(path, payload, "POST")

    return response

}

async function subscribeLink(toSubscribe) {

    const path = "api/channel/";
    let payload = {
        "data": [
            {
                "channel_id": toSubscribe,
                "channel_subscribed": true,
            }
        ]
    }
    let response = await sendData(path, payload, "POST");

    return response

}

function buildCookieLine(cookie) {
    return [
        cookie.domain,
        cookie.hostOnly.toString().toUpperCase(),
        cookie.path,
        cookie.httpOnly.toString().toUpperCase(),
        cookie.expirationDate,
        cookie.name,
        cookie.value,
    ].join("\t");
}


async function sendCookies() {
    console.log("function sendCookies");

    let cookieStores = await browserType.cookies.getAllCookieStores();
    var cookieLines = [
        "# Netscape HTTP Cookie File",
        "# https://curl.haxx.se/rfc/cookie_spec.html",
        "# This is a generated file! Do not edit.\n"
    ];
    for (let i = 0; i < cookieStores.length; i++) {
        const cookieStore = cookieStores[i];
        var allCookiesStore = await browserType.cookies.getAll({
            domain: ".youtube.com",
            storeId: cookieStore["id"]
        });
        for (let j = 0; j < allCookiesStore.length; j++) {
            const cookie = allCookiesStore[j];
            cookieLines.push(buildCookieLine(cookie));
        }
    }
    console.log(cookieLines.length);
    console.log(cookieLines.join("\n"));

}



// process and return message if needed
function handleMessage(request, sender, sendResponse) {
    console.log("message background.js listener: " + JSON.stringify(request));

    if (request.verify === true) {
        let response = verifyConnection();
        response.then(message => {
            sendResponse(message);
        })
    } else if (request.youtube) {
        setYoutubeLink(request)
    } else if (request.download) {
        let response = downloadLink(request.download.url);
        response.then(message => {
            sendResponse(message)
        })
    } else if (request.subscribe) {
        let response = subscribeLink(request.subscribe.url);
        response.then(message => {
            sendResponse(message)
        })
    } else if (request.cookie) {
        console.log("backgound: " + JSON.stringify(request));
        let response = sendCookies();
    }

    return true;
}

browserType.runtime.onMessage.addListener(handleMessage);
