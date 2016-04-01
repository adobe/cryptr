# Cryptr
Cryptr is a secret store GUI built for secrets managed by SaltStack's [GPG renderer](http://docs.saltstack.com/en/latest/ref/renderers/all/salt.renderers.gpg.html). Using Salt's gpg renderer, you can securely save passwords, certificates, or other secrets on the salt master, where minions may request them as needed. This repo houses the front-end GUI to integrate with cryptr-server, which runs on a salt-master housing salt gpg-encrypted passwords. Using Cryptr, a user may easily interact with the secrets in the saltstore, including reading and (eventually) modifying secrets easily.

![alt text](app/images/cryptr-demo.png "Cryptr")

Download Binaries
-----------------

Current release can be [downloaded from here](https://github.com/jcrowthe/cryptr/releases).
Cryptr supports Windows, Linux and Mac OS. It has been tested on Windows 10, Ubuntu 14.04 Desktop, and Mac OS 10.10 Yosemite.

On first run, Cryptr prompts you for the url of cryptr-server. If you haven't already set it up, you may do so [here](https://github.com/jcrowthe/cryptr-server.git).


Status
------

Currently Cryptr only allows read-only access to the salt secret storage. Write access is in progress.


Building from Source
-----------------

```
git clone https://github.com/jcrowthe/cryptr.git
npm install
npm run build
```

This will run the npm 'build' script, which runs electron-packager. It will create a binary application for all distributions (Win/Mac/Linux) for both x32 and amd64. See electron-packager documentation for more info. Binaries are found in /dist.

NOTE: If building for the Windows platform on a non-windows machine, you will [need](https://www.npmjs.com/package/electron-packager#building-windows-apps-from-non-windows-platforms) to install Wine and node-rcedit. This is due to the custom app icon.


License
-------

MIT License.
