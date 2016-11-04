'use strict';
const electron = require('electron');
const ipcMain = require('electron').ipcMain;
const {Menu} = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

var path = require("path");
var fs = require("fs");
var initPath = path.join(app.getPath('appData'), "Cryptr/Cache/initvault.json");


var settings = {};
function createWindow() {
	try {
		settings = JSON.parse(fs.readFileSync(initPath, 'utf8'));
		if (settings.init === undefined || settings.init === null) settings.init = '';
		if (settings.prevpass === undefined || settings.prevpass === null) settings.prevpass = false;
		if (settings.loginpage === undefined || settings.loginpage === null) settings.loginpage = 0;
	}
	catch(e) {
		settings.width = 1052;
		settings.height = 612;
		settings.init = '';
		settings.prevpass = false;
		settings.loginpage = 0;
	}

	// Create the browser window.
	settings.minWidth = 500;
	settings.minHeight = 500;
	settings.icon = __dirname + '/images/sizes/128x128.png';
	mainWindow = new BrowserWindow(settings);
	mainWindow.loadURL('file://' + __dirname + '/index.html');

	// Open the DevTools.
	mainWindow.webContents.openDevTools();

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
		var temp = mainWindow.getBounds();
		for (var attribute in temp) {
			settings[attribute] = temp[attribute];
		}
		fs.writeFileSync(initPath, JSON.stringify(settings));
	});

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		mainWindow = null;
		app.quit();
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
	event.sender.send('url', settings.init);
	event.sender.send('user', settings.user);
	event.sender.send('prevpass', settings.prevpass);
	event.sender.send('loginpage', settings.loginpage);
});
ipcMain.on('update-url', function(event, arg) {
	settings.init = arg;
});
ipcMain.on('update-user', function(event, arg) {
	settings.user = arg;
});
ipcMain.on('update-prevpass', function(event, arg) {
	settings.prevpass = arg;
});
ipcMain.on('update-loginpage', function(event, arg) {
	settings.loginpage = arg;
});
