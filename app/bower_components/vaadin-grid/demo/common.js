window.xCodeExampleSourceHead =
'  <script src="https://cdn.vaadin.com/vaadin-elements/latest/webcomponentsjs/webcomponents-lite.js"><\/script>\n' +
'  <link href="https://cdn.vaadin.com/vaadin-elements/latest/vaadin-grid/vaadin-grid.html" rel="import">\n' +
'  <script>\n' +
'  function getJSON(url, callback) {\n' +
'    var xhr = new XMLHttpRequest();\n' +
'    xhr.onreadystatechange = function() {\n' +
'      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {\n' +
'        callback(JSON.parse(xhr.responseText));\n' +
'      }\n' +
'    };\n' +
'    xhr.open(\'GET\', url, true);\n' +
'    xhr.send();\n' +
'  }\n' +
'  <\/script>\n';

var link = document.querySelector('link[href$="common.html"]');
var baseCommon = link.href.replace(/common.html/, '');
var bowerComponents = '../../';
var base = baseCommon + bowerComponents;

['polymer/polymer.html',
  'code-example/code-example.html',
  'table-of-contents/table-of-contents.html',
  'elements-demo-resources/getjson.html',
  'vaadin-grid/vaadin-grid.html'
].forEach(function(path) {
  if (!document.querySelector('link[href$="' + path + '"]')) {
    var link = document.createElement('link');
    link.rel = 'import';
    link.href = base + path;
    document.head.appendChild(link);
  }
});

// Delay all HTMLImports.whenReady calls until polymer and
// grid are ready.
var _whenReady = HTMLImports.whenReady;
HTMLImports.whenReady = function(done) {
  var id = setInterval(function() {
    if (window.Polymer && window.vaadin && vaadin.elements &&
          vaadin.elements.grid && vaadin.elements.grid.GridElement) {
      clearInterval(id);
      // Restore whenReady
      HTMLImports.whenReady = _whenReady;
      // Run original whenReady
      _whenReady(done);
      _whenReady(function() {
        // For some reason this is not removed in polyfilled browsers
        document.body.removeAttribute('unresolved');
      });
    }
  }, 3);
};
