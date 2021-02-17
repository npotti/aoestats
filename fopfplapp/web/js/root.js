define(["require", "exports", "knockout", "ojs/ojlogger", "ojs/ojrouter", "./appController", "ojs/ojknockout", "ojs/ojmodule", "ojs/ojnavigationlist", "ojs/ojbutton", "ojs/ojtoolbar"], function (require, exports, ko, Logger, Router, appController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Root {
        constructor() {
            // if running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready
            // event before executing any code that might interact with Cordova APIs or plugins.
            if (document.body.classList.contains("oj-hybrid")) {
                document.addEventListener("deviceready", this.init);
            }
            else {
                this.init();
            }
        }
        init() {
            Router.sync().then(function () {
                appController_1.default.loadModule();
                // bind your ViewModel for the content of the whole page body.
                ko.applyBindings(appController_1.default, document.getElementById("globalBody"));
            }, function (error) {
                Logger.error("Error in root start: " + error.message);
            });
        }
    }
    exports.default = Root;
});
//# sourceMappingURL=root.js.map