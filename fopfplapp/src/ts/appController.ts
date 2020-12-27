import * as ko from "knockout";
import * as ModuleUtils from "ojs/ojmodule-element-utils";
import * as ResponsiveUtils from "ojs/ojresponsiveutils";
import * as  ResponsiveKnockoutUtils from "ojs/ojresponsiveknockoututils";
import Router = require("ojs/ojrouter");
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
  router: Router;
  moduleConfig: ko.Observable<ojModule["config"]>;
  navDataSource: ojNavigationList<string, NavDataItem>["data"];
  appName: ko.Observable<string>;
  userLogin: ko.Observable<string>;
  footerLinks: ko.ObservableArray<FooterLink>;

  constructor() {
    // media queries for repsonsive layouts
    let smQuery: string | null = ResponsiveUtils.getFrameworkQuery("sm-only");
    if (smQuery){
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
    }
    
    // router setup
    this.router = Router.rootInstance;
    this.router.configure({
      "aoe": {label: "AOE", isDefault: true},
      "teams": {label: "Teams"},
      "players": {label: "Players"},
      "hfh": {label: "HFH"}
    });

    Router.defaults.urlAdapter = new Router.urlParamAdapter();

    // module config
    this.moduleConfig = ko.observable({"view": [], "viewModel": null});

    // navigation setup
    let navData: NavDataItem[] = [
      new NavDataItem({name: "AOE Level Stats", id: "aoe", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24"}),
      new NavDataItem({name: "Team Level Stats", id: "teams", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24"}),
      new NavDataItem({name: "Player Level Stats", id: "players", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24"}),
      new NavDataItem({name: "HFH (Last Season) Stats", id: "hfh", iconClass: "oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24"})
    ];

    this.navDataSource = new ArrayDataProvider(navData, {idAttribute: "id"});

    // header
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
        }
      );
    });
  }
}

export default new RootViewModel();