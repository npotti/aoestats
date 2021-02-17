/*
 * Your about ViewModel code goes here
 */
import * as ko from "knockout";
import rootViewModel from "../appController";
import * as ModuleElementUtils from "ojs/ojmodule-element-utils";
import { ojModule } from "ojs/ojmodule-element";
import { ojButtonEventMap } from "ojs/ojbutton";
import CommonUtils from "../utils/commonutils";
import { FPLBootStrap, Team, Element } from "../interfaces/bootstrap";
import { Picks, Pick } from "../interfaces/picks";
import { ElementSummary } from "../interfaces/elementsummary";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
import { CapQuota } from "../interfaces/capquota";
import { AoeLive } from "../interfaces/aoelive";
import { FplMgrHistory, Chip, Current } from "../interfaces/fplmgrhistory";
import { AoeTeam } from "../interfaces/aoeteams";

import "ojs/ojtable";
import "ojs/ojchart";
import "ojs/ojlistview";
import "ojs/ojavatar";

class AoeLiveViewModel {
  liveTableList: ko.ObservableArray = ko.observableArray([]);
  liveDataProvider: ko.Observable = ko.observable();
  fplId: ko.Observable<Number> = CommonUtils.fplId;
  userCaptainMap: Map<Number, Element> = new Map<Number, Element>();
  captainPicksTableList: ko.ObservableArray = ko.observableArray([]);
  captainPicksDataProvider: ko.Observable = ko.observable();
  showCaptainTable: ko.Observable<Boolean> = ko.observable(false);

  constructor() {
    const promise2 = this.fetchLiveCupQual();
    promise2.then((res) => {
      this.liveTableList.sort((a, b) => {
          if (a.score > b.score) {
            return -1;
          }
          if (a.score < b.score) {
            return 1;
          }
          return 0;
      });
      let i=0;
      this.liveTableList().forEach(ele =>{
        console.log(ele.team+ "," +ele.order);
        i= i+1;
        ele.order = i;
        console.log(ele.team+ "," +ele.order);
      });
      this.liveDataProvider(new ArrayDataProvider(this.liveTableList));
    });
  }

  private fetchLiveCupQual() {
    return new Promise((accept) => {
      let promise = CommonUtils.fetchAoeTeams();
      this.liveTableList.removeAll();
      const promises = [];
      const promises2 = [];
      promise.then((res) => {
        let aoeTeams = <AoeTeam[]>res;
        aoeTeams.forEach((team) => {
          let teamScore = 0;
          team.players.forEach((player) => {
            let promiseCh = CommonUtils.fetchFplMgrHistory(player.fpl_id);
            promises.push(promiseCh);
            promises2.push(promiseCh);
            promiseCh.then((res) => {
              let respHist: FplMgrHistory = <FplMgrHistory>res;
              let gweeks: Current[] = <Current[]>respHist.current;

              gweeks.forEach((gw) => {
                if (
                  gw.event === 21 ||
                  gw.event === 22 ||
                  gw.event === 23 ||
                  gw.event === 24
                ) {
                  teamScore = teamScore + gw.points - gw.event_transfers_cost;
                }
              });
            });
          });
          
          Promise.all(promises).then((resolve) => {
            let promise2 = this.pushLiveEle(team.id, teamScore);
            promises2.push(promise2);
          });
        });
        console.log(this.liveTableList.length);
        Promise.all(promises2).then(resolve => {
          accept(true);
        })
      });
    });
  }

  private pushLiveEle(id: number, score: number) {
    return new Promise(accept => {
      let ele = {
        team: CommonUtils.fetchTeamName(id),
        score: score,
        order: 1
      };
      this.liveTableList.push(ele);
    });
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

export default AoeLiveViewModel;
