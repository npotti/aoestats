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
import { FPLTransfers } from "../interfaces/transfers";

import { ElementSummary } from "../interfaces/elementsummary";

import * as ArrayDataProvider from "ojs/ojarraydataprovider";

import "ojs/ojtable";
import "ojs/ojchart";
import PagingDataProviderView = require("ojs/ojpagingdataproviderview");
import { PagingModel } from "ojs/ojpagingmodel";
import { ojMenuEventMap } from "ojs/ojmenu";
import "ojs/ojmenu";
import { ojButtonEventMap } from "ojs/ojbutton";
import { FplMgrHistory, Chip, Current } from "../interfaces/fplmgrhistory";
import { LEVEL_ERROR } from "@oracle/oraclejet/dist/types/ojlogger";

class RRViewModel {
  rrTableList: ko.ObservableArray = ko.observableArray([]);
  rrDataProvider: ko.Observable = ko.observable();

  rrList = [
    {
      name: "Brothers Of Destruction",
      players: "Hisham & Rohit Dsouza",
      ids: [1770, 1160],
    },
    {
      name: "Jambanum Thumbanum",
      players: "Rahul Ramesh & Jithin Chandran",
      ids: [21009, 18717],
    },
    { name: "Vikram Vedha", players: "Shankar & Albin", ids: [844010, 431945] },
    {
      name: "Vantage 2OLEgends",
      players: "Appu Sankar V & Sreenath Jayaraj",
      ids: [10436, 692066],
    },
    {
      name: "Aluva & Mathicurry",
      players: "Sherin & Viju",
      ids: [1015, 2887967],
    },
    {
      name: "Thirontharam Machambis",
      players: "Anoop Nair & Aneesh Ajayan",
      ids: [176438, 5811],
    },
    {
      name: "Lakesiders",
      players: "Vipin Sreekumar & Rahul R",
      ids: [14550, 30810],
    },
    {
      name: "Liverpool! Go back!",
      players: "Vishnu Raj & Sugeeth Gopinathan",
      ids: [67577, 224691],
    },
    {
      name: "Knight & Warrior",
      players: "Vinay Ashwin & Karthik G",
      ids: [10422, 23702],
    },
    {
      name: "Kanu Kepa Secret?",
      players: "Fawaz Wahid & George Anagnostu",
      ids: [3121, 1910],
    },
  ];

  constructor() {
   
    const promises = [];
    let promise = null;
    const globalPromise = CommonUtils.fetchFPLPlayers();
    promises.push(globalPromise);
    globalPromise.then((res) => {
      promise = this.fetchLiveRRQual(this.rrList);
      promise.then((res) => {
        console.log("asas");
        console.log(this.rrTableList.length);
        this.rrTableList.sort((a, b) => {
          if (a.score > b.score) {
            return -1;
          }
          if (a.score < b.score) {
            return 1;
          }
          return 0;
        });
        let i = 0;
        this.rrTableList().forEach((ele) => {
          console.log(ele.name + "," + ele.order);
          i = i + 1;
          ele.order = i;
          console.log(ele.name + "," + ele.order);
        });
        this.rrDataProvider(new ArrayDataProvider(this.rrTableList));
      });
    });
  }

  private fetchLiveRRQual(list) {
    return new Promise((accept) => {
      this.rrTableList.removeAll();
      const promises = [];
      const promises2 = [];
      list.forEach((team) => {
        let teamScore = 0;
        let promiseCh = CommonUtils.fetchFplMgrHistory(team.ids[0]);
        let promiseCh2 = CommonUtils.fetchFplMgrHistory(team.ids[1]);
        promises.push(promiseCh);
        promises2.push(promiseCh);
        promises.push(promiseCh2);
        promises2.push(promiseCh2);
        
        promiseCh.then((res) => {
          let respHist: FplMgrHistory = <FplMgrHistory>res;
          let gweeks: Current[] = <Current[]>respHist.current;

          gweeks.forEach((gw) => {
            if (gw.event > 28 && gw.event <= 38) {
              teamScore = teamScore + gw.points - gw.event_transfers_cost;
            }
          });

        });

        promiseCh2.then((res) => {
            let respHist: FplMgrHistory = <FplMgrHistory>res;
            let gweeks: Current[] = <Current[]>respHist.current;

            gweeks.forEach((gw) => {
              if (gw.event > 28 && gw.event <= 38) {
                teamScore = teamScore + gw.points - gw.event_transfers_cost;
              }
            });
        });
        
        Promise.all(promises).then(res => {
            let promise2 = this.pushLiveEle(
                teamScore,
                team.name,
                team.players
            );
            promises2.push(promise2);
        })
      });

      Promise.all(promises2).then((resolve) => {
        accept(true);
      });
      
    });
  }

  private pushLiveEle(score: number, name: String, players: string) {
    return new Promise((accept) => {
      let ele = {
        score: score,
        name: name,
        players: players,
        order: 1,
      };
      this.rrTableList.push(ele);
      accept(true);
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

export default RRViewModel;
