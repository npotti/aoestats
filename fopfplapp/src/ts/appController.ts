import * as ko from "knockout";
import * as ModuleUtils from "ojs/ojmodule-element-utils";
import * as ResponsiveUtils from "ojs/ojresponsiveutils";
import * as ResponsiveKnockoutUtils from "ojs/ojresponsiveknockoututils";
import * as OffcanvasUtils from "ojs/ojoffcanvas";
import Router = require ("ojs/ojrouter");
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import "ojs/ojknockout";
import "ojs/ojmodule-element";
import { ojNavigationList } from "ojs/ojnavigationlist";
import { ojModule } from "ojs/ojmodule-element";

class FooterLink {
  name: string;
  id: string;
  linkTarget: string;
  constructor( { name, id, linkTarget } : {
    name: string;
    id: string;
    linkTarget: string;
   }) {
    this.name = name;
    this.id = id;
    this.linkTarget = linkTarget;
  }
}

class NavDataItem {
  id: string;
  name: string;
  iconClass: string;

  constructor ( { id, name, iconClass } : {
    id: string;
    name: string;
    iconClass: string
  }) {
    this.id = id;
    this.name = name;
    this.iconClass = iconClass;
  }
}

class RootViewModel {
  smScreen: ko.Observable<boolean>;
  mdScreen: ko.Observable<boolean>;
  router: Router;
  moduleConfig: ko.Observable<ojModule["config"]>;
  navDataSource: ojNavigationList<string, NavDataItem>["data"];
  drawerParams: {
    selector: string;
    content: string;
    edge?: "start" | "end" | "top" | "bottom";
    displayMode?: "push" | "overlay";
    autoDismiss?: "focusLoss" | "none";
    size?: string;
    modality?: "modal" | "modeless";
  };
  appName: ko.Observable<string>;
  userLogin: ko.Observable<string>;
  footerLinks: ko.ObservableArray<FooterLink>;

  constructor() {
    // media queries for repsonsive layouts
    let smQuery: string | null = ResponsiveUtils.getFrameworkQuery("sm-only");
    if (smQuery){
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
    }

    let mdQuery: string | null = ResponsiveUtils.getFrameworkQuery("md-up");
    if (mdQuery){
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);
    }

    // router setup
    this.router = Router.rootInstance;
    this.router.configure({
      "dashboard": {label:"Dashboard"},
      "aoe": {label: "TES"},
      "teams": {label: "Teams"},
      "players": {label: "Players"},
      "hfh": {label: "HFH"},
      "captains": {label: "Your Captain Picks"},
      "setpieces": {label: "Set Piece Specialists"},
      "injuries": {label: "Injuries"},
      "aoelive": {label: "TES Cup"},
      "grandfinale": {label: "Grand Finale"},
      "royalrumble": {label: "Royal Rumble"},
      "yctracking": {label: "YC Ban Tracking"},
      "foplms": {label: "FOP LMS Tracking"},
      "remplayers" : {label: "Live Players Remaining"},
      "rivals": {label: "Rivals"},
      "fff": {label: "FFF Live Tracking"},
      "transferanalysis": {label: "Transfer Analysis"},
      "login": {label: "Login", isDefault: true}
    });

    Router.defaults.urlAdapter = new Router.urlParamAdapter();

    // module config
    this.moduleConfig = ko.observable({"view": [], "viewModel": null});

    // navigation setup
    let navData: NavDataItem[] = [
      new NavDataItem({name: "Dashboard", id: "dashboard", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-home-icon-24"}),
      new NavDataItem({name: "TES Level Stats", id: "aoe", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24"}),
      new NavDataItem({name: "Team Level Stats", id: "teams", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24"}),
      new NavDataItem({name: "Player Level Stats", id: "players", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24"}),
      new NavDataItem({name: "TES Cup", id: "aoelive",
      iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24"}),
      new NavDataItem({name: "Royal Rumble", id: "royalrumble",
      iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24"}),
      new NavDataItem({name: "Grand Finale", id: "grandfinale",
      iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24"}),
      new NavDataItem({name: "FOP LMS Tracking", id: "foplms",
      iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-location-icon-24"}),
      new NavDataItem({name: "YC Ban Tracking", id: "yctracking",
      iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-location-icon-24"}),
      new NavDataItem({name: "Set Piece Takers", id: "setpieces",
      iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-person-icon-24"}),
      new NavDataItem({name: "Injuries", id: "injuries",
      iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24"}),
      new NavDataItem({name: "Captain Picks", id: "captains",
      iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24"}),
      new NavDataItem({name: "Live Remaining Players", id: "remplayers", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24"}),
      new NavDataItem({name: "Rivals", id: "rivals", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24"}),
      new NavDataItem({name: "FFF", id: "fff", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24"}),
      new NavDataItem({name: "Transfer Analysis", id: "transferanalysis", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24"})
    ];
    
    this.navDataSource = new ArrayDataProvider(navData, {idAttribute: "id"});

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
    let navDrawerElement: HTMLElement = document.querySelector("#navDrawer") as HTMLElement;
    navDrawerElement.addEventListener("ojclose", () => {
      let drawerToggleButtonElment: HTMLElement = document.querySelector("#drawerToggleButton") as HTMLElement;
      drawerToggleButtonElment.focus();
    });
  }

  // called by navigation drawer toggle button and after selection of nav drawer item
  toggleDrawer = (): Promise<boolean> => {
    return OffcanvasUtils.toggle(this.drawerParams);
  }

  loadModule(): void {
    ko.computed(() => {
      let name: string = this.router.moduleConfig.name();
      let viewPath: string = `views/${name}.html`;
      let modelPath: string = `viewModels/${name}`;
      let masterPromise: Promise<any> = Promise.all([
        ModuleUtils.createView({"viewPath": viewPath}),
        ModuleUtils.createViewModel({"viewModelPath": modelPath})
      ]);
      masterPromise.then((values) => {
          this.moduleConfig({"view": values[0],"viewModel": values[1].default});
      });
    });
  }
}

export default new RootViewModel();