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


function detectUrlType(url) {

    const videoRe = new RegExp(/^https:\/\/(www\.)?(youtube.com\/watch\?v=|youtu\.be\/)\w{11}/);
    if (videoRe.test(url)) {
        return "video"
    }
    const channelRe = new RegExp(/^https:?\/\/www\.?youtube.com\/c|channel|user\/\w+(\/|featured|videos)?$/);
    if (channelRe.test(url)) {
        return "channel"
    }
    const playlistRe = new RegExp(/^https:\/\/(www\.)?youtube.com\/playlist\?list=/);
    if (playlistRe.test(url)) {
        return "playlist"
    }

    return false

}


function sendUrl() {

    let url = document.URL

    let urlType = detectUrlType(url);
    if (urlType == false) {
        console.log("not relevant")
        return
    }

    let payload = {
        "youtube": {
            "url": url,
            "title": document.title,
            "type": urlType,
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
