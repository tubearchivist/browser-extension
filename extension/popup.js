/*
Loaded into popup index.html
*/

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


// store access details
document.getElementById("save-login").addEventListener("click", function () {
    let toStore = {
        "access": {
            "url": document.getElementById("url").value,
            "port": document.getElementById("port").value,
            "apiKey": document.getElementById("api-key").value
        }
    };
    browserType.storage.local.set(toStore, function() {
        console.log("Stored connection details: " + JSON.stringify(toStore));
        pingBackend();
    });
})


// verify connection status
document.getElementById("status-icon").addEventListener("click", function() {
    pingBackend();
})


// send ping message to TA backend
function pingBackend() {

    function handleResponse(message) {
        if (message.response === "pong") {
            setStatusIcon(true);
            console.log("connection validated")
        }
    }
    
    function handleError(error) {
        console.log(`Error: ${error}`);
        setStatusIcon(false);
    }

    console.log("ping TA server")
    let sending = browserType.runtime.sendMessage({"verify": true});
    sending.then(handleResponse, handleError);

}


// change status icon based on connection status
function setStatusIcon(connected) {

    let statusIcon = document.getElementById("status-icon")
    if (connected == true) {
        statusIcon.innerHTML = "&#9745;";
        statusIcon.style.color = "green";
    } else {
        statusIcon.innerHTML = "&#9746;";
        statusIcon.style.color = "red";
    }

}


// download link
document.getElementById("download").addEventListener("click", function () {

    let button = document.getElementById("downloadButton");
    let payload = {
        "download": {
            "url": button.getAttribute("data-id")
        }
    };

    function handleResponse(message) {
        console.log("popup.js response: " + JSON.stringify(message));
        browserType.storage.local.remove("youtube").then(response => {
            let download = document.getElementById("download");
            download.innerHTML = ""
            let message = document.createElement("p");
            message.innerText = "Link sent to Tube Archivist"
            download.appendChild(message)
            download.appendChild(document.createElement("hr"));
        })
    }
    
    function handleError(error) {
        console.log(`Error: ${error}`);
    }

    let sending = browserType.runtime.sendMessage(payload);
    sending.then(handleResponse, handleError)

})


// fill in form
document.addEventListener("DOMContentLoaded", async () => {

    function onGot(item) {
        if (!item.access) {
            console.log("no access details found");
            setStatusIcon(false);
            return
        }
        document.getElementById("url").value = item.access.url;
        document.getElementById("port").value = item.access.port;
        document.getElementById("api-key").value = item.access.apiKey;
        pingBackend();
    };
    
    function onError(error) {
        console.log(`Error: ${error}`);
    };

    browserType.storage.local.get("access", function(result) {
        onGot(result)
    });

    browserType.storage.local.get("youtube", function(result) {
        downlodButton(result);
    })

})

function downlodButton(result) {

    let download = document.getElementById("download");
    let title = document.createElement("p");
    title.innerText = result.youtube.title;

    let button = document.createElement("button");
    button.innerText = "download";
    button.id = "downloadButton";
    button.setAttribute("data-id", result.youtube.url);

    download.appendChild(title);
    download.appendChild(button);
    download.appendChild(document.createElement("hr"));

}
