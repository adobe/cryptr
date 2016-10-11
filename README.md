# Cryptr
Cryptr is a GUI for [Vault](https://www.vaultproject.io/). Using Cryptr, a user may easily interact with their Vault instance's API, reading, creating, and modifying secrets with ease. While Cryptr is intended to ease the daily *usage of the secrets*, it also contains some administrative functionality.

![alt text](app/images/cryptr-demo.png "Cryptr")

Download Binaries
-----------------

Current release can be [downloaded from here](https://github.com/jcrowthe/cryptr/releases).
Cryptr supports Windows, Linux and Mac OS. It has been tested on Windows 10, Ubuntu 14.04 Desktop, and macOS 10.12 Sierra.


Building from Source
-----------------

```
git clone https://github.com/jcrowthe/cryptr.git
npm install
npm run build
```

This will run the npm 'build' script, which runs electron-packager. It will create a binary application for all distributions (Win/Mac/Linux) for both x32 and amd64. See electron-packager documentation for more info. Binaries are found in /dist.

NOTE: If building for the Windows platform on a non-windows machine, you will need to install Wine and node-rcedit as documented [here](https://www.npmjs.com/package/electron-packager#building-windows-apps-from-non-windows-platforms). This is due to the custom app icon.


License
-------

MIT License.
