// var init = require('./init');
// 
// describe('Smoke Test', function() {
//     init();
//     this.timeout(10000);
// 
//     it('Opens a valid window', function() {
//         return this.app.client.waitUntilWindowLoaded()
//             .getWindowCount().should.eventually.equal(1)
//             .browserWindow.isMinimized().should.eventually.be.false
//             .browserWindow.isDevToolsOpened().should.eventually.be.false
//             .browserWindow.isVisible().should.eventually.be.true
//             .browserWindow.isFocused().should.eventually.be.true
//             .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
//             .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0)
//             .getTitle().should.eventually.equal('Cryptr');
//     });
// });