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
async function sendGet(path, access) {

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


// send post request to API backend
async function sendPost(path, access, payload) {

    const url = `${access.url}:${access.port}/${path}`;
    console.log("POST: " + url);
    console.log("POST: " + JSON.stringify(payload))

    const rawResponse = await fetch(url, {
        method: "POST",
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
    let access = await getAccess();
    let response = await sendGet(path, access)
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
    let access = await getAccess();
    let response = await sendPost(path, access, payload)

    return response

}


// event listener for messages from script.js and popup.js
browser.runtime.onMessage.addListener(
    (data, sender) => {
        console.log("message background.js listener: " + JSON.stringify(data))
        if (data.verify === true) {
            let response = verifyConnection()
            return Promise.resolve(response);
        } else if (data.youtube) {
            setYoutubeLink(data)
        } else if (data.download) {
            let response = downloadLink(data.download.url)
            return Promise.resolve(response);
        }

        return false;
        
    }
);
