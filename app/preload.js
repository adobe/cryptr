const { ipcRenderer } = require('electron')

window.startOIDCServer = function() {
  ipcRenderer.send("start-oidc", "start");
}

window.stopOIDCServer = function() {
  ipcRenderer.send("stop-oidc", "stop");
}

window.openOIDCURL = function(url) {
  ipcRenderer.send("open-oidc-url", url);
}


window.onOIDCAuthData = function(callback) {
  authData = callback
}

window.onOIDCAuthError = function(callback) {
  authError = callback
}

window.onOIDCAuthStartError = function(callback) {
  authStartError = callback
}

window.onOIDCAuthStartSuccess = function(callback) {
  authStartSuccess = callback
}

ipcRenderer.on('oidc-auth-data', (event, arg) => {
  if (authData) authData(arg);
});

ipcRenderer.on('oidc-auth-error', (event, arg) => {
  if (authError) authError(arg);
});

ipcRenderer.on('oidc-auth-start-error', (event, arg) => {
  if (authStartError) authStartError(arg);
});

ipcRenderer.on('oidc-auth-start-success', (event, arg) => {
  if (authStartSuccess) authStartSuccess(arg);
});