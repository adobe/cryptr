(function(document) {
	'use strict';
	var app = document.querySelector('#app');
	app.baseUrl = '/';

	app.closeDrawer = function() {
		app.$.paperDrawerPanel.closeDrawer();
	};

})(document);
