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
const {ipcMain} = require('electron')
const {shell} = require('electron');
const http = require("http");
const url = require('url');
const path = require('path')
const windowStateKeeper = require('electron-window-state');
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
var timer;

var server = http.createServer(function (req, res) {
	var url_obj = url.parse(req.url, true);
	if (url_obj.pathname === '/oidc/callback') {
		var query_parameters = url_obj.query;
		var fail = false;

		if ((JSON.stringify(query_parameters) === '{}') ||
		   (!('state' in query_parameters)) ||
		   (!('code' in query_parameters)) ||
		   (query_parameters['state'] == "") ||
		   (query_parameters['code'] == "")) fail = true;

		if (fail) {
			mainWindow.webContents.send('oidc-auth-error', 'OIDC provider returned an unexpected result (empty required params)');
			res.end();
		} else {
			mainWindow.webContents.send('oidc-auth-data', query_parameters);
		}

		res.writeHead(200);
		res.end("<html>success <script>window.close()</script></html>");
	} else {
		res.end();
	}
});

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
			'disableBlinkFeatures': 'Auxclick',
			'contextIsolation': false,
			'preload': path.join(__dirname, 'preload.js')
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
		server.close()
		app.quit();
	});
	
	mainWindow.webContents.on('will-navigate', function(e){
	  e.preventDefault();
	});

	// OIDC server: on failure to start, retry and report error to frontend
	server.on('error', (e) => {
	  mainWindow.webContents.send('oidc-auth-start-error', 'OIDC Auth: Unable to start web server to capture OIDC login callback. Error code: ' + e.code + '. Retrying in 10 seconds.');
		server.close();
		timer = setTimeout(() => {
			startServer()
		}, 10000);
	});

	// IPC to support OIDC auth flow
	ipcMain.on("start-oidc", startServer);
  ipcMain.on("stop-oidc", function (ev) {
		server.close();
		clearTimeout(timer);
  });
  ipcMain.on("open-oidc-url", function (ev, location) {
		if (!['https:', 'http:'].includes(url.parse(location).protocol)) return;
		shell.openExternal(location);
  });
}

function startServer() {
	console.log(server.listening)
	if (server.listening != true) {
		server.listen({
			host: '127.0.0.1',
			port: 8250,
			exclusive: true
		}, function() {
			mainWindow.webContents.send('oidc-auth-start-success', '');
		});
	}
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
