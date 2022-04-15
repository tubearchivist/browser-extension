# Tube Archivist Companion

![popup screenshot](assets/screenshot.png?raw=true "Tube Archivist Companion Popup") 

A browser extension to directly add videos from YouTube to Tube Archivist.

## Install
- Firefox: The addon is available on the official [Extension store](https://addons.mozilla.org/addon/tubearchivist-companion/)
- Chrome: Approval is pending, see below to *Test this extension*.

## Permissions
- **Access your data for www.youtube.com**: Needed for the addon to know your current page on YouTube to send the link to Tube Archivist.
- **Storage**: Needed to store your connection details, needed to store your last visited YouTube link within the broser. 

## MVP or better *bearly viable product*
This is a proof of concept with the following functionality:
- Add your Tube Archivist connection details in the addon popup
- Add a download button to the pop up for youtube links

## Test this extension
Use the correct manifest file for your browser. Either rename the browser specific file to `manifest.json` before loading the addon or symlink it to the correct location, e.g. `ln -s manifest-firefox.json manifest.json`.
- Firefox
  - Open `about:debugging#/runtime/this-firefox`
  - Click on *Load Temporary Add-on*
  - Select the *manifest.json* file to load the addon. 
- Chrome / Chromium
  - Open `chrome://extensions/`
  - Toggle *Developer mode* on top right
  - Click on *Load unpacked*
  - Open the folder containing the *manifest.json* file.

## Help needed
This is only minimally useful in this state. Join us on our Discord and please help us improve that.

## Note:
- This requires Tube Archivist v0.1.4 or later.
