var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var electron = require('electron-prebuilt');
var Application = require('spectron').Application;

global.before(function() {
    chai.should();
    chai.use(chaiAsPromised);
});

module.exports = function() {
    before(function() {
        this.app = new Application({
            path: electron,
            args: ['app']
        });

        return this.app.start().then(function(app) {
            chaiAsPromised.transferPromiseness = app.transferPromiseness;
            return app;
        });
    });

    after(function() {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    });
};