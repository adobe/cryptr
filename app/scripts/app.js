/*
Copyright 2017 Adobe. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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