// var init = require('./init');
// 
// describe('Smoke Test', function() {
//     init();
//     this.timeout(10000);
// 
//     it('Opens a window', function () {
//         return this.app.webContents.getAllWebContents().then(function (main) {
//               console.log('main process: ' + main)
//             })
//     });
//     
//     it('Window is visible', function () {
//         return this.app.browserWindow.isVisible()
//             .should.eventually.be.true;
//     });
//     
//     it('A', function() {
//         return this.app.client.$('#paper-input-label-3').then(function (data) {
//             console.log('The data: ' + JSON.stringify(data));
//             // data.style.backgroundColor = '#f00';
//         });
//     });
//     
//     it('should search', function() {
//         var input = 'this is a test';
//         return this.app.client.url('https://duckduckgo.com')
//             .setValue('#search_form_input_homepage', input)
//             .getValue("#search_form_input_homepage")
//             .should.eventually.equal(input)
//             .click('#search_button_homepage')
//             .element('.result__a')
//             .should.eventually.exist;
//     });
// });