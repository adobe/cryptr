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

'use strict';
const { app, BrowserWindow, ipcMain, Menu } = require('electron');

let mainWindow;
let backgroundWindow;

var path = require("path");
var fs = require("fs");
var initPath = path.join(app.getPath('appData'), "Cryptr");
if (!fs.existsSync(initPath)) fs.mkdirSync(initPath);
initPath += '/init.json';

var settings = {};
function createMainWindow() {
	try {
		settings = JSON.parse(fs.readFileSync(initPath, 'utf8'));
		if (settings.init === undefined || settings.init === null) settings.init = '';
		if (settings.loginpage === undefined || settings.loginpage === null) settings.loginpage = 0;
		if (settings.drawerWidth === undefined || settings.drawerWidth === null) settings.drawerWidth = '220px';
	}
	catch(e) {
		settings.width = 800;
		settings.height = 600;
		settings.init = '';
		settings.loginpage = 0;
		settings.drawerWidth = '220px';
	}

	// Create the browser window.
	settings.minWidth = 500;
	settings.minHeight = 500;
	settings.icon = __dirname + '/images/sizes/128x128.png';
	settings.titleBarStyle = 'hidden';
	settings.show = false;
	settings.backgroundColor = '#333';
	mainWindow = new BrowserWindow(settings);
	mainWindow.loadURL('file://' + __dirname + '/index.html');
	mainWindow.once('ready-to-show', () => {
	    mainWindow.show()
	})

	if (process.platform == 'darwin') {
		// Menu items for MacOS. Specifically, this enables Copy/Paste while disallowing opening DevTools.
		var template = [{
	        label: "Cryptr",
	        submenu: [
	            { label: "About Cryptr", selector: "orderFrontStandardAboutPanel:" },
	            { type: "separator" },
	            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
	        ]}, {
	        label: "Edit",
	        submenu: [
	            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
	            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
	            { type: "separator" },
	            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
	            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
	            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
	            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
	        ]}
	    ];
	    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
	}


	mainWindow.on("close", function() {
		// Save the current browser window location and size
		var oldWindow = mainWindow.getBounds();
		var newSettings = {
			x: oldWindow.x,
			y: oldWindow.y,
			width: oldWindow.width,
			height: oldWindow.height,
			init: settings.init,
			loginpage: settings.loginpage,
			drawerWidth: settings.drawerWidth,
			user: settings.user
		};
		fs.writeFileSync(initPath, JSON.stringify(newSettings));
	});

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		mainWindow = null;
		backgroundWindow = null;
		app.quit();
	});
	return mainWindow;
}

function createBackgroundWindow() {
	const backgroundWindow = new BrowserWindow();
	// const backgroundWindow = new BrowserWindow({ show: false });
	backgroundWindow.loadURL(`file://${__dirname}/background/background.html`);
	return backgroundWindow;
}

// This method will be called when Electron has finished initialization and is ready to create browser windows.
app.on('ready', function() {
	mainWindow = createMainWindow();
	backgroundWindow = createBackgroundWindow();
	
	// Open the DevTools.
	if (process.env.CRYPTR_ENV && process.env.CRYPTR_ENV == 'development') {
		mainWindow.webContents.openDevTools();
		backgroundWindow.webContents.openDevTools();
	}
});

// On OS X it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate-with-no-open-windows', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
		backgroundWindow = null;
		backgroundWindow = createBackgroundWindow();
	}
});

// On OS X it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
app.on('activate', function () {
	if (!mainWindow || !backgroundWindow) {
		mainWindow = null;
		backgroundWindow = null;
		mainWindow = createMainWindow();
		backgroundWindow = createBackgroundWindow();
	}
});

// Save data back to settings file
ipcMain.on('initialized', (event, arg) => {
	event.sender.send('domain', settings.init);
	event.sender.send('loginpage', settings.loginpage);
	event.sender.send('drawerWidth', settings.drawerWidth);
	event.sender.send('user', settings.user);
});
ipcMain.on('update-domain', (event, arg) => settings.init = arg);
ipcMain.on('update-user', (event, arg) => settings.user = arg);
ipcMain.on('update-loginpage', (event, arg) => settings.loginpage = arg);
ipcMain.on('update-drawerWidth', (event, arg) => settings.drawerWidth = arg);

// Communication from backgroundWindow to mainWindow
ipcMain.on('background-secrets', (event, value) => mainWindow.webContents.send('background-secrets', value));
ipcMain.on('background-loading', (event, value) => mainWindow.webContents.send('background-loading', value));

// Communication from mainWindow to backgroundWindow
ipcMain.on('main-status', (event, value) => backgroundWindow.webContents.send('main-status', value));
ipcMain.on('main-url', (event, value) => backgroundWindow.webContents.send('main-url', value));
ipcMain.on('main-access', (event, value) => backgroundWindow.webContents.send('main-access', value));
ipcMain.on('main-secrets', (event, value) => backgroundWindow.webContents.send('main-secrets', value));
ipcMain.on('main-header', (event, value) => backgroundWindow.webContents.send('main-header', value));
ipcMain.on('main-loading', (event, value) => backgroundWindow.webContents.send('main-loading', value));
ipcMain.on('main-loginResponse', (event, value) => backgroundWindow.webContents.send('main-loginResponse', value));