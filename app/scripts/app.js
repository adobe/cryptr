// Setup Electron process integration
const clipboard = require('electron').clipboard;
const ipcRenderer = require('electron').ipcRenderer;


// Initialize
(function(document) {
	'use strict';
	var app = document.querySelector('#app');
	app.baseUrl = '/';
})(document);


app.closeDrawer = function() {
	app.$.paperDrawerPanel.closeDrawer();
};


// App configs
app.url = 'start';
app.drawerWidth = '220px';

ipcRenderer.on('url', function(event, arg) {
	app.url = arg;
});
ipcRenderer.on('user', function(event, arg) {
	app.u = arg;
	// Set cursor autofocus for login/password fields
	if (app.u === '') document.getElementById('userfield').autofocus = true;
	else document.getElementById('passfield').autofocus = true;
});
ipcRenderer.on('prevpass', function(event, arg) { app.prevPassword = arg; });
ipcRenderer.on('loginpage', function(event, arg) { app.loginPage = arg; });
ipcRenderer.send('initialized', 'ping');


// Index filtering and sorting
app.filterFolders = function(item) {
	return item.type == 'folder';
};
app.filterSecrets = function(item) {
	return item.type == 'secret';
};