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


function sendUrl() {

    let payload = {
        "youtube": {
            "url": document.URL,
            "title": document.title
        }
    }
    console.log("youtube link: " + JSON.stringify(payload));
    browserType.runtime.sendMessage(payload, function(response) {
        console.log(response.farewell);
    });

};


document.addEventListener("yt-navigate-finish", function (event) {
    setTimeout(function(){
        sendUrl();
        return false;
    }, 2000);
});
