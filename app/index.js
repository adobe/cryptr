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
const {Menu} = require('electron');
const {app} = require('electron');
const windowStateKeeper = require('electron-window-state');
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
	let mainWindowState = windowStateKeeper({
		defaultWidth: 880,
		defaultHeight: 600
	});
	
	mainWindow = new BrowserWindow({
		'x': mainWindowState.x,
		'y': mainWindowState.y,
		'width': mainWindowState.width,
		'height': mainWindowState.height,
		'minWidth': 880,
		'minHeight': 600,
		'icon': __dirname + '/images/sizes/128x128.png',
		'titleBarStyle': 'hidden',
		'show': false,
		'backgroundColor': '#333',
		'webPreferences': {
			'nodeIntegration': false,
			'sandbox': true,
			'disableBlinkFeatures': 'Auxclick'
		}
	});
	
	mainWindowState.manage(mainWindow);
	mainWindow.loadURL('file://' + __dirname + '/index.html');
	mainWindow.once('ready-to-show', () => {
	    mainWindow.show()
	});

	// Open the DevTools.
	if (process.env.CRYPTR_ENV && process.env.CRYPTR_ENV == 'development') mainWindow.webContents.openDevTools();

	// Menu items for MacOS. Specifically, this enables Copy/Paste while disallowing opening DevTools.
	if (process.platform == 'darwin') {
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
