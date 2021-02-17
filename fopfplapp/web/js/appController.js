define(["require", "exports", "knockout", "ojs/ojmodule-element-utils", "ojs/ojresponsiveutils", "ojs/ojresponsiveknockoututils", "ojs/ojoffcanvas", "ojs/ojrouter", "ojs/ojarraydataprovider", "ojs/ojknockout", "ojs/ojmodule-element"], function (require, exports, ko, ModuleUtils, ResponsiveUtils, ResponsiveKnockoutUtils, OffcanvasUtils, Router, ArrayDataProvider) {
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
            // called by navigation drawer toggle button and after selection of nav drawer item
            this.toggleDrawer = () => {
                return OffcanvasUtils.toggle(this.drawerParams);
            };
            // media queries for repsonsive layouts
            let smQuery = ResponsiveUtils.getFrameworkQuery("sm-only");
            if (smQuery) {
                this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
            }
            let mdQuery = ResponsiveUtils.getFrameworkQuery("md-up");
            if (mdQuery) {
                this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);
            }
            // router setup
            this.router = Router.rootInstance;
            this.router.configure({
                "dashboard": { label: "Dashboard", isDefault: true },
                "aoe": { label: "AOE" },
                "teams": { label: "Teams" },
                "players": { label: "Players" },
                "hfh": { label: "HFH" },
                "captains": { label: "Your Captain Picks" },
                "setpieces": { label: "Set Piece Specialists" },
                "injuries": { label: "Injuries" },
                "aoelive": { label: "AOE Cup" },
                "yctracking": { label: "YC Ban Tracking" },
                "foplms": { label: "FOP LMS Tracking" },
                "remplayers": { label: "Live Players Remaining" },
                "rivals": { label: "Rivals" },
                "fff": { label: "FFF Live Tracking" },
                "transferanalysis": { label: "Transfer Analysis" }
            });
            Router.defaults.urlAdapter = new Router.urlParamAdapter();
            // module config
            this.moduleConfig = ko.observable({ "view": [], "viewModel": null });
            // navigation setup
            let navData = [
                new NavDataItem({ name: "Dashboard", id: "dashboard", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-home-icon-24" }),
                new NavDataItem({ name: "AOE Level Stats", id: "aoe", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24" }),
                new NavDataItem({ name: "Team Level Stats", id: "teams", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24" }),
                new NavDataItem({ name: "Player Level Stats", id: "players", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24" }),
                new NavDataItem({ name: "AOE Cup", id: "aoelive",
                    iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24" }),
                new NavDataItem({ name: "FOP LMS Tracking", id: "foplms",
                    iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-location-icon-24" }),
                new NavDataItem({ name: "YC Ban Tracking", id: "yctracking",
                    iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-location-icon-24" }),
                new NavDataItem({ name: "Set Piece Takers", id: "setpieces",
                    iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-person-icon-24" }),
                new NavDataItem({ name: "Injuries", id: "injuries",
                    iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24" }),
                new NavDataItem({ name: "Captain Picks", id: "captains",
                    iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24" }),
                new NavDataItem({ name: "Live Remaining Players", id: "remplayers", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24" }),
                new NavDataItem({ name: "Rivals", id: "rivals", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24" }),
                new NavDataItem({ name: "FFF", id: "fff", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24" }),
                new NavDataItem({ name: "Transfer Analysis", id: "transferanalysis", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24" })
            ];
            this.navDataSource = new ArrayDataProvider(navData, { idAttribute: "id" });
            // drawer
            this.drawerParams = {
                displayMode: "push",
                selector: "#navDrawer",
                content: "#pageContent"
            };
            // close offcanvas on medium and larger screens
            this.mdScreen.subscribe(() => {
                OffcanvasUtils.close(this.drawerParams);
            });
            // add a close listener so we can move focus back to the toggle button when the drawer closes
            let navDrawerElement = document.querySelector("#navDrawer");
            navDrawerElement.addEventListener("ojclose", () => {
                let drawerToggleButtonElment = document.querySelector("#drawerToggleButton");
                drawerToggleButtonElment.focus();
            });
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