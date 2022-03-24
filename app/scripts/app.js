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

// App configs
var app = document.querySelector('#app');
app.baseUrl = '/';
app.url = 'start';
app.secretRoute = '';
app.folderRoute = '';
app.cryptrVersion = "0.6.0";

// Index filtering and sorting
app.filterFolders = function(item) {
	return item.type == 'folder';
};
app.filterSecrets = function(item) {
	return item.type == 'secret';
};

// Sidebar Resizing
window.addEventListener('WebComponentsReady', function() {
    var dragging = false;
    document.getElementById('drag').addEventListener("mousedown", function(e) {
        e.preventDefault();
        dragging = true;
        var ghost = document.createElement("div");
        ghost.id = 'ghost';
        ghost.style.height = "100vh";
		ghost.style.width = "5px";
        ghost.style.left = parseInt(app.drawerWidth, 10) - 5 + 'px';
        document.body.appendChild(ghost);
		document.addEventListener("mousemove", resize);
    });

    document.addEventListener("mouseup", function(e) {
		document.removeEventListener('mousemove', resize);
        if (dragging) {
			if (e.pageX < 175) app.drawerWidth = '175px';
			else if (e.pageX > (window.outerWidth*3/4)) app.drawerWidth = window.outerWidth*3/4 + 'px';
            else app.drawerWidth = e.pageX + 5 + 'px';
			var child = document.getElementById('ghost');
            document.body.removeChild(child);
            dragging = false;
        }
    });
});

function resize(e) {
	if (e.pageX < 175) document.getElementById('ghost').style.left = '175px';
	else if (e.pageX > window.outerWidth*3/4) document.getElementById('ghost').style.left = window.outerWidth*3/4 + 'px';
	else document.getElementById('ghost').style.left = e.pageX + 5 + 'px';
}