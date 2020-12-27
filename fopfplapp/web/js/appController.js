define(["require", "exports", "knockout", "ojs/ojmodule-element-utils", "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojrouter", "ojs/ojarraydataprovider", "ojs/ojknockout", "ojs/ojmodule-element"], function (require, exports, ko, ModuleUtils, ResponsiveUtils, ResponsiveKnockoutUtils, Router, ArrayDataProvider) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FooterLink {
        constructor({ name, id, linkTarget }) {
            this.name = name;
            this.id = id;
            this.linkTarget = linkTarget;
        }
    }
    class NavDataItem {
        constructor({ id, name, iconClass }) {
            this.id = id;
            this.name = name;
            this.iconClass = iconClass;
        }
    }
    class RootViewModel {
        constructor() {
            // media queries for repsonsive layouts
            let smQuery = ResponsiveUtils.getFrameworkQuery("sm-only");
            if (smQuery) {
                this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
            }
            // router setup
            this.router = Router.rootInstance;
            this.router.configure({
                "aoe": { label: "AOE", isDefault: true },
                "teams": { label: "Teams" },
                "players": { label: "Players" },
                "hfh": { label: "HFH" }
            });
            Router.defaults.urlAdapter = new Router.urlParamAdapter();
            // module config
            this.moduleConfig = ko.observable({ "view": [], "viewModel": null });
            // navigation setup
            let navData = [
                new NavDataItem({ name: "AOE Level Stats", id: "aoe", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24" }),
                new NavDataItem({ name: "Team Level Stats", id: "teams", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24" }),
                new NavDataItem({ name: "Player Level Stats", id: "players", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24" }),
                new NavDataItem({ name: "HFH (Last Season) Stats", id: "hfh", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24" })
            ];
            this.navDataSource = new ArrayDataProvider(navData, { idAttribute: "id" });
            // header
        }
        loadModule() {
            ko.computed(() => {
                let name = this.router.moduleConfig.name();
                let viewPath = `views/${name}.html`;
                let modelPath = `viewModels/${name}`;
                let masterPromise = Promise.all([
                    ModuleUtils.createView({ "viewPath": viewPath }),
                    ModuleUtils.createViewModel({ "viewModelPath": modelPath })
                ]);
                masterPromise.then((values) => {
                    this.moduleConfig({ "view": values[0], "viewModel": values[1].default });
                });
            });
        }
    }
    exports.default = new RootViewModel();
});
//# sourceMappingURL=appController.js.map