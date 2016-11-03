(function(document) {
	'use strict';
	var app = document.querySelector('#app');
	app.baseUrl = '/';

	app.addEventListener('dom-change', function() {
		// console.log('App ready');
	});

	window.addEventListener('WebComponentsReady', function() {
		// imports are loaded and elements have been registered
	});

	app.closeDrawer = function() {
		app.$.paperDrawerPanel.closeDrawer();
	};

})(document);
