define(["require","exports","knockout","ojs/ojmodule-element-utils","ojs/ojresponsiveutils","ojs/ojresponsiveknockoututils","ojs/ojoffcanvas","ojs/ojrouter","ojs/ojarraydataprovider","ojs/ojknockout","ojs/ojmodule-element"],(function(require,e,o,i,n,a,t,s,l){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class r{constructor({id:e,name:o,iconClass:i}){this.id=e,this.name=o,this.iconClass=i}}e.default=new class{constructor(){this.toggleDrawer=()=>t.toggle(this.drawerParams);let e=n.getFrameworkQuery("sm-only");e&&(this.smScreen=a.createMediaQueryObservable(e));let i=n.getFrameworkQuery("md-up");i&&(this.mdScreen=a.createMediaQueryObservable(i)),this.router=s.rootInstance,this.router.configure({dashboard:{label:"Dashboard"},aoe:{label:"TES"},teams:{label:"Teams"},players:{label:"Players"},hfh:{label:"HFH"},captains:{label:"Your Captain Picks"},setpieces:{label:"Set Piece Specialists"},injuries:{label:"Injuries"},aoelive:{label:"TES Cup"},grandfinale:{label:"Grand Finale"},royalrumble:{label:"Royal Rumble"},yctracking:{label:"YC Ban Tracking"},foplms:{label:"FOP LMS Tracking"},remplayers:{label:"Live Players Remaining"},rivals:{label:"Rivals"},fff:{label:"FFF Live Tracking"},transferanalysis:{label:"Transfer Analysis"},login:{label:"Login",isDefault:!0}}),s.defaults.urlAdapter=new s.urlParamAdapter,this.moduleConfig=o.observable({view:[],viewModel:null});let c=[new r({name:"Dashboard",id:"dashboard",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-home-icon-24"}),new r({name:"TES Level Stats",id:"aoe",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24"}),new r({name:"Team Level Stats",id:"teams",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24"}),new r({name:"Player Level Stats",id:"players",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24"}),new r({name:"TES Cup",id:"aoelive",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24"}),new r({name:"Royal Rumble",id:"royalrumble",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24"}),new r({name:"Grand Finale",id:"grandfinale",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24"}),new r({name:"FOP LMS Tracking",id:"foplms",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-location-icon-24"}),new r({name:"YC Ban Tracking",id:"yctracking",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-location-icon-24"}),new r({name:"Set Piece Takers",id:"setpieces",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-person-icon-24"}),new r({name:"Injuries",id:"injuries",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24"}),new r({name:"Captain Picks",id:"captains",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24"}),new r({name:"Live Remaining Players",id:"remplayers",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24"}),new r({name:"Rivals",id:"rivals",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24"}),new r({name:"FFF",id:"fff",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24"}),new r({name:"Transfer Analysis",id:"transferanalysis",iconClass:"oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24"})];this.navDataSource=new l(c,{idAttribute:"id"}),this.drawerParams={displayMode:"push",selector:"#navDrawer",content:"#pageContent"},this.mdScreen.subscribe(()=>{t.close(this.drawerParams)}),document.querySelector("#navDrawer").addEventListener("ojclose",()=>{document.querySelector("#drawerToggleButton").focus()})}loadModule(){o.computed(()=>{let e=this.router.moduleConfig.name(),o=`views/${e}.html`,n="viewModels/"+e;Promise.all([i.createView({viewPath:o}),i.createViewModel({viewModelPath:n})]).then(e=>{this.moduleConfig({view:e[0],viewModel:e[1].default})})})}}}));