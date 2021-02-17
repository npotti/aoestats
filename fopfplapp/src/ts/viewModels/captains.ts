/*
 * Your about ViewModel code goes here
 */
import * as ko from "knockout";
import rootViewModel from "../appController";
import * as ModuleElementUtils from "ojs/ojmodule-element-utils";
import { ojModule } from "ojs/ojmodule-element";
import { ojButtonEventMap } from 'ojs/ojbutton';
import CommonUtils from "../utils/commonutils";
import { FPLBootStrap, Team, Element } from "../interfaces/bootstrap";
import { Picks, Pick } from "../interfaces/picks";
import { ElementSummary } from "../interfaces/elementsummary";
import * as ArrayDataProvider from 'ojs/ojarraydataprovider';

import "ojs/ojtable";
import "ojs/ojchart";
import 'ojs/ojlistview';
import 'ojs/ojavatar';

class CaptainsViewModel {
  headerConfig: ko.Observable<ojModule["config"]>;
  fplId: ko.Observable<Number> = CommonUtils.fplId;
  userCaptainMap: Map<Number, Element> = new Map<Number, Element>();
  captainPicksTableList: ko.ObservableArray = ko.observableArray([]);
  captainPicksDataProvider:  ko.Observable = ko.observable();
  showCaptainTable: ko.Observable<Boolean> = ko.observable(false);

  constructor() {

    if(CommonUtils.curr_gw === 1){
      CommonUtils.fetchCurrGW();
    }
  }

  onLoadCaptainsTable = (event: ojButtonEventMap['ojAction']) => {
    console.log("inside cap table :: "+this.fplId());
    this.captainPicksTableList.removeAll();
    let fplPlayerPicUrl: String = "https://resources.premierleague.com/premierleague/photos/players/110x140/p";
    if(this.fplId() !== 0){
      CommonUtils.fplId = this.fplId;
      console.log("inside cap table if");
      CommonUtils.fetchUserPicks(this.fplId()).then(res => {
        for (let entry of Array.from(CommonUtils.userPicksMap.entries())) {
          let gw: Number = entry[0];
          let picks: Picks = <Picks>entry[1];
          picks.picks.forEach(pick => {
            if(pick.multiplier > 1){
              this.userCaptainMap.set(gw, CommonUtils.fplPlayerMap.get(pick.element));
            }
          });
        }

        const promisesScore = [];
        for (let entry of Array.from(this.userCaptainMap.entries())) {
          let promise = CommonUtils.fetchElementSummary(entry[1].id);
          promisesScore.push(promise);
          let points = 0;
          promise.then(res => {
            let elemSummary: ElementSummary = <ElementSummary>res;
            elemSummary.history.forEach(gw => {
              console.log("gw fixture :: "+gw.round);
              console.log("entry 0 :: "+entry[0]);
              if(gw.round === entry[0]){
                console.log("Inside gw fixture");
                points = gw.total_points;
              }
            })
            console.log("points :: "+points);
            console.log("enty 1 code "+entry[1].code);
            console.log("image "+fplPlayerPicUrl);
            let playerPic = fplPlayerPicUrl+ '' + entry[1].code+".png";
            console.log("Pic :: "+playerPic);
            let hit: String = 'css/images/miss.png';
            if(points > 3){
              hit = 'css/images/hit.png';;
            }
            console.log("hit :: "+hit);
            let ele = {"gw" : entry[0], "image": playerPic, "name" : entry[1].web_name, "points": points, "hit": hit};
            this.captainPicksTableList.push(ele);
          })
        }
        Promise.all(promisesScore).then(res => {
          this.captainPicksTableList.sort((a,b) => {
            if(a.gw < b.gw){
              return -1;
            }
            if(a.gw > b.gw){
              return 1;
            }
            return 0;
          })


          this.showCaptainTable(true);
          this.captainPicksDataProvider(new ArrayDataProvider(this.captainPicksTableList));
        }) 
      });
    }
  }
  

  // below are a set of the ViewModel methods invoked by the oj-module component.
  // please reference the oj-module jsDoc for additional information.

  /**
   * Optional ViewModel method invoked after the View is inserted into the
   * document DOM.  The application can put logic that requires the DOM being
   * attached here.
   * This method might be called multiple times - after the View is created
   * and inserted into the DOM and after the View is reconnected
   * after being disconnected.
   */
  connected(): void {
    document.title = "Incidents";
    // implement further logic if needed
  }

  /**
   * Optional ViewModel method invoked after the View is disconnected from the DOM.
   */
  disconnected(): void {
    // implement if needed
  }

  /**
   * Optional ViewModel method invoked after transition to the new View is complete.
   * That includes any possible animation between the old and the new View.
   */
  transitionCompleted(): void {
    // implement if needed
  }
}

export default CaptainsViewModel;
