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
const ipcRenderer = require('electron').ipcRenderer;
var app = document.querySelector('#app');

ipcRenderer.on('main-status', (event, value) => app.status = value);
ipcRenderer.on('main-url', (event, value) => app.url = value);
ipcRenderer.on('main-loading', (event, value) => app.loading = value);
ipcRenderer.on('main-access', (event, value) => app.access = value);
ipcRenderer.on('main-secrets', (event, value) => app.secrets = value);
ipcRenderer.on('main-header', (event, value) => app.header = value);
ipcRenderer.on('main-loginResponse', (event, value) => app.loginResponse = value);