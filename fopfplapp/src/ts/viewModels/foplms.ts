/*
 * Your about ViewModel code goes here
 */
import * as ko from "knockout";
import rootViewModel from "../appController";
import * as ModuleElementUtils from "ojs/ojmodule-element-utils";
import { ojModule } from "ojs/ojmodule-element";
import CommonUtils from "../utils/commonutils";

import { FplLeagues } from "../interfaces/fplleagues";

import { Pick, Picks } from "../interfaces/picks";
import { FplMgrHistory } from "../interfaces/fplmgrhistory";
import { FPLTransfers } from "../interfaces/transfers";

import { ElementSummary } from "../interfaces/elementsummary";

import * as ArrayDataProvider from "ojs/ojarraydataprovider";

import "ojs/ojtable";
import "ojs/ojchart";
import PagingDataProviderView = require("ojs/ojpagingdataproviderview");
import { PagingModel } from "ojs/ojpagingmodel";
import { ojButtonEventMap } from "ojs/ojbutton";

class FOPLMSViewModel {
  lmsUrl: string =
    "https://fantasy.premierleague.com/api/leagues-classic/133431/standings/";

  lmsTableList: ko.ObservableArray = ko.observableArray([]);
  lmsDataProvider: ko.Observable = ko.observable();

  constructor() {
    const promises = [];
    const globalPromise = CommonUtils.fetchFPLPlayers();
    promises.push(globalPromise);
    globalPromise.then((res) => {
      fetch(this.lmsUrl)
        .then((res) => res.json())
        .then((res) => {
          const resResult: FplLeagues = <FplLeagues>res;
          resResult.standings.results.forEach((team) => {
            console.log("inside constructor 3 : "+team.entry);
            console.log("inside constructor 4 : "+CommonUtils.curr_gw);
            const promisePick = CommonUtils.fetchPicks(
              team.entry,
              CommonUtils.curr_gw
            );
            promises.push(promisePick);




            
            promisePick.then((userPicks) => {
              const priorPromises = [];
              const picksConst: Picks = <Picks>userPicks;
              console.log("inside constructor 5"+picksConst.picks.length);
              let playersRem = "";
              let playersBench = "";
              picksConst.picks.forEach((pick) => {
                let promiseScore = CommonUtils.fetchElementSummary(
                  pick.element
                );
                priorPromises.push(promiseScore);
                promiseScore.then((res) => {
                  let elemSummary: ElementSummary = <ElementSummary>res;
                  elemSummary.history.forEach((gw) => {
                    console.log("gw fixture :: " + gw.round);
                    if (gw.round === CommonUtils.curr_gw) {
                      console.log("Inside gw fixture");
                      if (pick.multiplier > 0 && gw.minutes === 0) {
                        playersRem =
                          playersRem +
                          "," +
                          CommonUtils.fplPlayerMap.get(pick.element).web_name;
                      }
                      if (pick.multiplier === 0) {
                        playersBench =
                          playersBench +
                          "," +
                          CommonUtils.fplPlayerMap.get(pick.element).web_name +
                          "(" +
                          gw.total_points +
                          ")";
                      }
                    }
                  });
                });
              });

              Promise.all(priorPromises).then(res => {
                const histPromise = CommonUtils.fetchFplMgrHistory(team.entry);
                promises.push(histPromise);
                histPromise.then((hist) => {
                  const resResult: FplMgrHistory = <FplMgrHistory>hist;
                  resResult.current.forEach((curr) => {
                    if (curr.event === CommonUtils.curr_gw) {
                      let ele = {
                        team: team.entry_name,
                        player: team.player_name,
                        points: (curr.points - curr.event_transfers_cost),
                        playersRem: playersRem,
                        playersBench: playersBench,
                        rank: curr.overall_rank
                      };
                      this.lmsTableList.push(ele);
                      this.lmsTableList.sort((a,b) => {
                          if(a.points > b.points){
                            return -1;
                          }
                          if(a.points < b.points){
                            return 1;
                          }
                          return 0;
                      })
                    }
                  });
                });
              })
            });
          });
        });
        Promise.all(promises).then(res => {
            this.lmsDataProvider(new ArrayDataProvider(this.lmsTableList));
        })
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
    document.title = "Dashboard";
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

export default FOPLMSViewModel;
