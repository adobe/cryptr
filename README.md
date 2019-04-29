# Cryptr
Cryptr is a GUI for [Hashicorp's Vault](https://www.vaultproject.io/).

Using Cryptr, a user may easily interact with their Vault instance's API: reading, creating, and modifying secrets with ease.

![alt text](app/images/cryptr-demo.png "Cryptr")

## Download Binaries

Current release can be [downloaded here](https://github.com/adobe/cryptr/releases).
Cryptr supports Windows, Linux and Mac OS. It has been tested on Windows 10, Ubuntu 17.04 Desktop, and macOS 10.13 High Sierra.

For *Linux*, use the `.AppImage` files. They are self-contained binaries that run on every major linux distro. Just make it executable and run it. [AppImage information here!](https://appimage.org/)

## Install using Homebrew

Cryptr can be installed via Homebrew where Cryptr is available as a cask. Just type

```
brew cask install cryptr
```

## Building from Source
You only need to do this if you want to contribute code, or run Cryptr in developer mode. (For Linux binaries, see above).

```
git clone https://github.com/jcrowthe/cryptr.git
cd cryptr
npm install
npm run dev
```

## Unique Features

In addition to the default feature-set of Vault, Cryptr adds some things that are "nice to have". Some of these include:
- Secrets can be files
- Underscores in key names show as whitespace. ie. `secret/My_cool_Secret` shows up in the folder structure as `My cool Secret`
- Ability to move secrets.

## License
Apache 2.0 License

## HTTPS
Cryptr will ONLY access Vault servers enabled with HTTPS. These are your secrets. Keep them secret, keep them safe.

The only exception to this is a dev server running locally at `http://127.0.0.1:<port>`. Cryptr's URL field will automatically change to contain a `http://` prefix when `127.0.0.1:` is input. (Note the colon, which is required for the prefix to change. A port number provided after the colon is also required. For reference, a default Vault dev server is started on port 8200)

### Auth backends
Currently LDAP, UserPass and Token auth backends are accepted. Most others are not useful for a GUI, but if you feel otherwise, submit a pull request.


# Important Notes about Policies
## Secret Discovery

Cryptr requires that policies associated with a token to be readable by that token. The purpose for this is to discover what secrets are available to the token. An example ACL for a policy found at `sys/policy/demo` would be as follows:


```
path "secret/mysecrets/*" {
  policy = "write"
}

path "sys/policy/demo" {
    policy = "read"
}
```

Only the permission to `read` is advised for the policy. **NOTE: This policy addition is _critical_ to discovering available secrets.** Without this, there is no programatic way for Cryptr to know what secrets it can query to show the user. (Also, for that matter, there is no way for a human using the CLI to discover secrets, except for blindly attempting to `list` potential folders). As such, it is **highly** recommended to do this for all policies. All policies without this ability must necessarily be ignored by Cryptr.

### Globs and Secret Discovery

Cryptr currently only supports glob characters at the folder level (ie. `secret/*`), and not as a suffix (ie. `secret/group*`). This is due to the lack of any ability to list based on a prefix. As noted [here](https://www.vaultproject.io/docs/concepts/policies.html#list), `list` command outputs are not filtered by policy. You are welcome to add `list` permissions on the containing folder, but know that this is not recommended.
