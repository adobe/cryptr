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
const electron = require('electron');
const ipcMain = require('electron').ipcMain;
const {Menu} = require('electron');
const {app} = require('electron');
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

var path = require("path");
var fs = require("fs");
var initPath = path.join(app.getPath('appData'), "Cryptr");
if (!fs.existsSync(initPath)) fs.mkdirSync(initPath);
initPath += '/init.json';

var settings = {};
function createWindow() {
	try {
		settings = JSON.parse(fs.readFileSync(initPath, 'utf8'));
		if (settings.loginpage === undefined || settings.loginpage === null) settings.loginpage = 0;
		if (settings.drawerWidth === undefined || settings.drawerWidth === null) settings.drawerWidth = '220px';
	}
	catch(e) {
		settings.width = 800;
		settings.height = 600;
		settings.loginpage = 0;
		settings.drawerWidth = '220px';
		settings.urls = [];
	}

	// Create the browser window.
	settings.minWidth = 880;
	settings.minHeight = 600;
	settings.icon = __dirname + '/images/sizes/128x128.png';
	settings.titleBarStyle = 'hidden';
	settings.show = false;
	settings.backgroundColor = '#333';
	mainWindow = new BrowserWindow(settings);
	mainWindow.loadURL('file://' + __dirname + '/index.html');
	mainWindow.once('ready-to-show', () => {
	    mainWindow.show()
	})

	// Open the DevTools.
	if (process.env.CRYPTR_ENV && process.env.CRYPTR_ENV == 'development') mainWindow.webContents.openDevTools();

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
			loginpage: settings.loginpage,
			drawerWidth: settings.drawerWidth,
			user: settings.user,
			urls: settings.urls
		};
		fs.writeFileSync(initPath, JSON.stringify(newSettings));
	});

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		mainWindow = null;
		app.quit();
	});
	
	mainWindow.webContents.on('will-navigate', function(e){
	  e.preventDefault();
	});
}

// This method will be called when Electron has finished initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on('initialized', function(event, arg) {
	event.sender.send('loginpage', settings.loginpage);
	event.sender.send('drawerWidth', settings.drawerWidth);
	event.sender.send('user', settings.user);
	event.sender.send('urls', settings.urls);
});
ipcMain.on('update-user', function(event, arg) {
	settings.user = arg;
});
ipcMain.on('update-loginpage', function(event, arg) {
	settings.loginpage = arg;
});
ipcMain.on('update-drawerWidth', function(event, arg) {
	settings.drawerWidth = arg;
});
ipcMain.on('update-urls', function(event, arg) {
	settings.urls = arg;
});
