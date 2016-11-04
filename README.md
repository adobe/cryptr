# Cryptr
Cryptr is a GUI for [Vault](https://www.vaultproject.io/).

Using Cryptr, a user may easily interact with their Vault instance's API, reading, creating, and modifying secrets with ease.

![alt text](app/images/cryptr-demo.png "Cryptr")

## Download Binaries

Current release can be [downloaded from here](https://github.com/jcrowthe/cryptr/releases).
Cryptr supports Windows, Linux and Mac OS. It has been tested on Windows 10, Ubuntu 14.04 Desktop, and macOS 10.12 Sierra.


## Building from Source

```
git clone https://github.com/jcrowthe/cryptr.git
npm install
npm run build
```

This will run the npm 'build' script, which runs electron-packager. It will create a binary application for all distributions (Win/Mac/Linux) for both x32 and amd64. See electron-packager documentation for more info. Binaries are found in /dist.

NOTE: If building for the Windows platform on a non-windows machine, you will need to install Wine and node-rcedit as documented [here](https://www.npmjs.com/package/electron-packager#building-windows-apps-from-non-windows-platforms). This is due to the custom app icon.


## License

MIT License.


## HTTPS

Encryption in transit (HTTPS) is required. These are your secrets. Don't be stupid.


## Auth backends

Currently LDAP, UserPass and Token auth backends are accepted. Most others are not useful for a GUI, but if you feel otherwise, submit a pull request.


# Policies

## Secret Discovery

Cryptr requires the policies associated with the token to be readable by the token. The purpose for this is to discover what secrets are available to the token. An example ACL for policy named "allsecrets" follows:


```
path "secret/mysecrets/*" {
  policy = "write"
}

path "sys/policy/allsecrets" {
    policy = "read"
}
```

Only read permissions are advised. This policy addition is critical to discovering available secrets. Without this, there is no programatic way for Cryptr to know what secrets it may access. (Also for that matter, there is no way for a human using the CLI to discover secrets either) As such, it is highly recommended to do this for all policies. All policies without this ability will be ignored by Cryptr.

## Wildcards and Secret Discovery

Wildcards in path names are supported. However, there is a caveat that is best described with an example. Take the following policy as an example, understanding it being the only policy applied in this example:

```
path "secret/myteam*" {
  policy = "write"
}
```

With this policy, a user may create secrets such as `secret/myteam-keys` or `secret/myteam/certs`. This is absolutely accepted in Cryptr. However, without an additional policy, neither Cryptr nor a human being on the CLI will be able to *discover* any of these secrets. This is because there is no containing folder upon which to execute a `list` command. The natural next step, then, would be to make an addition to the policy, as follows:

```
path "secret/myteam*" {
  policy = "write"
}

path "secret/*" {
  policy = "list"
}
```

But this is _not_ recommended for multiple reasons (the above being one obvious reason). Noted [here](https://www.vaultproject.io/docs/concepts/policies.html#list), `list` command outputs are not filtered by policy. This means all secrets found at `secret/*` will be printed, regardless if the token has rights to use any of them in some way.

As such, the recommended procedure is to set policies _based on folders_ and not on secrets. ie:

```
path "secret/myteam/*" {
  policy = "write"
}
```

(Notice the slash prefixing the \*, compared to the code block above) This insures that a user not only may use the secret found in this folder, but know what secrets are available too.

The one exception to this recommendation is if a policy is created and applied to one secret only (no wildcard). In this case, the secret may be discovered by referencing the policy, so long as the policy complies with the above section, Policies.
