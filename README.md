![Tube Archivist Companion](assets/tube-archivist-companion-banner.png?raw=true "Tube Archivist Companion Banner")  

<h1 align="center">Browser Extension for Tube Archivist</h1>
<div align="center">
<a href="https://www.tilefy.me" target="_blank"><img src="https://tiles.tilefy.me/t/tubearchivist-firefox.png" alt="tubearchivist-firefox" title="TA Companion Firefox users" height="50" width="190"/></a>
<a href="https://www.tilefy.me" target="_blank"><img src="https://tiles.tilefy.me/t/tubearchivist-chrome.png" alt="tubearchivist-chrome" title="TA Companion Chrome users" height="50" width="190"/></a>
</div>

## Core Functionality
This is a browser extension to bridge YouTube with [Tube Archivist](https://github.com/tubearchivist/tubearchivist), your self hosted YouTube media server.
- Add your Tube Archivist connection details in the addon popup.
- On YouTube video pages, inject a download button to download that video and a subscribe button to subscribe to that channel.
- On YouTube channel pages, inject a button to subscribe to the channel or download the complete channel. Regarding the channel subpages, this follows the same rules as adding to the queue over the form.
- Throughout most places, hover over the video to reveal a download button for that video.
- Sync your cookies for yt-dlp.

## Screenshots
![popup screenshot](assets/screenshot.png?raw=true "Tube Archivist Companion Popup")
Popup to enter your connection details.
<br><br>

![video page](assets/screenshot-video.png?raw=true "Tube Archivist Companion Video Page")
Button injected on video page to download the video or subscribe to the channel.
<br><br>

![search page](assets/screenshot-search.png?raw=true "Tube Archivist Companion Search Page")
Download button injected showing when hovering over top left corned of thumbnail
<br><br>

![channel page](assets/screenshot-channel.png?raw=true "Tube Archivist Companion Channel Page")
Channel button injected to subscribe or download whole channel, video download button showing when hovering over topleft corner of thumbnail.
<br>

## Install
- Firefox: The addon is available on the [Extension store](https://addons.mozilla.org/addon/tubearchivist-companion/).
- Chrome: The addon is available on the [Chrome Web Store](https://chrome.google.com/webstore/detail/tubearchivist-companion/jjnkmicfnfojkkgobdfeieblocadmcie).

## Update
After a new release here on GitHub, you'll get updates automatically in your browser. Due to the verification process, for Firefox this usually takes 1-2 hours, for Chrome 2-3 days.

## Permissions
- **Access your data for www.youtube.com**: Needed to inject download and subscribe buttons directly into the page.
- **Storage**: Needed to store your connection details.
- **Cookie**: Needed to read your cookies for youtube.com to access restricted videos.

## Setup
- **URL**: This is where your Tube Archivist instance is located. Can be a host name or an IP address. Add the port if needed at the end, e.g. `:8000`.
- **API key**: You can find your API key on the settings page of your Tube Archivist instance.

A green checkmark will appear next to the *Save* button if your connection is working.

## Options
- **Sync YouTube cookies**: Send your cookies to TubeArchivist to use for yt-dlp requests.

## Test this extension
Use the correct manifest file for your browser. Either rename the browser specific file to `manifest.json` before loading the addon or symlink it to the correct location, e.g. `ln -s manifest-firefox.json manifest.json`.
- Firefox
  - Open `about:debugging#/runtime/this-firefox`
  - Click on *Load Temporary Add-on*
  - Select the *manifest.json* file to load the addon.
  - You can *inspect* background.js by lunching the debug tools from there.
- Chrome / Chromium
  - Open `chrome://extensions/`
  - Toggle *Developer mode* on top right
  - Click on *Load unpacked*
  - Open the folder containing the *manifest.json* file.
  - Click on *Service Worker* to open the dev tools at background.js. 

## Compatibility
- Verify that you are running the [latest version](https://github.com/tubearchivist/tubearchivist/releases/latest) of Tube Archivist as the API is under development and will change.
- For testing this extension between releases, use the *unstable* builds of Tube Archivist, only for your testing environment.

## Roadmap
Join us on [Discord](https://www.tubearchivist.com/discord) and help us improve and extend this project. This is a list of planned features, in no particular order:
- [ ] Get download and subscribe status from TA to show on the injected buttons
- [ ] Implement download button for videos on the YouTube homepage over inline preview
- [ ] Implement download/subscribe button for playlists
- [ ] Implement download button for videos on playlist
- [ ] Error handling for connection errors
- [X] Dynamically inject buttons with mutation observer

## Making changes to the JavaScript
The JavaScript does not require any build step; you just edit the files directly. However, there is config for eslint and prettier (a linter and formatter respectively); their use is recommended but not required. To use them, install `node`, run `npm i` from the root directory of this repository to install dependencies, then run `npm run lint` and `npm run format` to run eslint and prettier respectively.
