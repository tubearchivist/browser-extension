# Tube Archivist Companion

![popup screenshot](assets/screenshot.png?raw=true "Tube Archivist Companion Popup") 

A browser extension to bridge YouTube with your Tube Archivist service.

## Install
- Firefox: The addon is available on the [Extension store](https://addons.mozilla.org/addon/tubearchivist-companion/).
- Chrome: The addon is available on the [Chrome Web Store](https://chrome.google.com/webstore/detail/tubearchivist-companion/jjnkmicfnfojkkgobdfeieblocadmcie).

## Update
After a new release here on GitHub, you'll get updates automatically in your browser. For Firefox this usually takes 1-2 hours, for Chrome 2-3 days, so please be patient.

## Permissions
- **Access your data for www.youtube.com**: Needed for the addon to know your current page on YouTube to send the link to Tube Archivist.
- **Storage**: Needed to store your connection details, needed to store your last visited YouTube link within the browser.

## Setup
- **URL**: This is where your Tube Archivist instance is located. Can be a host name or a IP address, use a full URL with protocol, e.g. *http://*. 
- **Port**: Network port of TA.
- **API key**: You can find your API key on the settings page of your Tube Archivist instance. 

A green checkmark will appear next to the *Save* button if your connection is working.

## All great things start small
This extension allows you to do the following:
- Add your Tube Archivist connection details in the addon popup
- Add a download button to the popup for YouTube links
- Add a subscribe button to subscribe to channels and playlists

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

## Compatibility
- Verify that you are running the latest version of Tube Archivist as the API is under development and will change.
- For testing this extension between releases, use the *unstable* builds of Tube Archivist, only for your tesing environment.

## Help needed
Join us on [Discord](https://discord.gg/AFwz8nE7BK) and help us improve and extend this project.
