const { ipcRenderer } = require('electron')
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('startOIDCServer', function() {
  ipcRenderer.send("start-oidc", "start");
});

contextBridge.exposeInMainWorld('stopOIDCServer', function() {
  ipcRenderer.send("stop-oidc", "stop");
});

contextBridge.exposeInMainWorld('openOIDCURL', function(url) {
  ipcRenderer.send("open-oidc-url", url);
});


contextBridge.exposeInMainWorld('onOIDCAuthData', function(callback) {
  authData = callback
});

contextBridge.exposeInMainWorld('onOIDCAuthError', function(callback) {
  authError = callback
});

contextBridge.exposeInMainWorld('onOIDCAuthStartError', function(callback) {
  authStartError = callback
});

contextBridge.exposeInMainWorld('onOIDCAuthStartSuccess', function(callback) {
  authStartSuccess = callback
});

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