#!/bin/bash
# build package

set -e

if [[ $(basename "$(pwd)") != 'tubearchivist_browserextension' ]]; then
    echo 'not in tubearchivist_browserextension folder'
    exit 1
fi

echo "latest tags:"
git tag | tail -n 5 | sort -r

printf "\ncreate new version:\n"
read -r VERSION


# build release zip files
function create_zip {
    cd extension

    # firefox
    rm manifest.json
    cp manifest-firefox.json manifest.json
    zip -rq ../release/ta-companion-"$VERSION"-firefox.zip . \
        -x manifest-chrome.json -x manifest-firefox.json

    # chrome
    rm manifest.json
    cp manifest-chrome.json manifest.json
    zip -rq ../release/ta-companion-"$VERSION"-chrome.zip . \
        -x manifest-chrome.json -x manifest-firefox.json

    rm manifest.json
    cd ..

}


# create release tag
function create_release {

    git tag -a "$VERSION" -m "new release version $VERSION"
    git push origin "$VERSION"

}


create_zip
create_release


##
exit 0
