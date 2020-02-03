# Releasing Cryptr

The script `npm run dist` is provided which should take care of most of the release needs. However, there are issues, depending on what platform you are releasing from.

#### For Mac

When running on Mac OS Catalina, modify `package.json` to be 
```
"dist": "electron-builder -m --x64"
```

and run `npm run dist`. This will only build the release for Mac OS.


#### Linux and Windows

Follow the guide at https://www.electron.build/multi-platform-build#build-electron-app-using-docker-on-a-local-machine to release using Docker on a Mac.

TL;DR:
Modify `package.json` to be
```
"dist": "electron-builder -wl --x64"
```
then
```
$ docker run --rm -ti \
 --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
 --env ELECTRON_CACHE="/root/.cache/electron" \
 --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
 -v ${PWD}:/project \
 -v ${PWD##*/}-node-modules:/project/node_modules \
 -v ~/.cache/electron:/root/.cache/electron \
 -v ~/.cache/electron-builder:/root/.cache/electron-builder \
 electronuserland/builder:wine

$ yarn dist
```

This will build releases for Linux and Windows.