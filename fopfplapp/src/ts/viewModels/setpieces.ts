/*
 * Your about ViewModel code goes here
 */
import * as ko from "knockout";
import rootViewModel from "../appController";
import * as ModuleElementUtils from "ojs/ojmodule-element-utils";
import { ojModule } from "ojs/ojmodule-element";
import CommonUtils from "../utils/commonutils";


import {FplMgrHistory, Chip, Current} from '../interfaces/fplmgrhistory';

import {Pick, Picks} from '../interfaces/picks';
import {FPLBootStrap, Team} from '../interfaces/bootstrap';
import {FPLTransfers} from '../interfaces/transfers';

import * as ArrayDataProvider from 'ojs/ojarraydataprovider';

import "ojs/ojtable";
import "ojs/ojchart";
import PagingDataProviderView = require("ojs/ojpagingdataproviderview");
import { PagingModel } from "ojs/ojpagingmodel";
import { ojButtonEventMap } from 'ojs/ojbutton';

class SetPiecesViewModel {
  headerConfig: ko.Observable<ojModule["config"]>;
  teamPenOrderMap: Map<String, Map<Number, String>> = new Map<
  String,
  Map<Number, String>
>();
teamFkOrderMap: Map<String, Map<Number, String>> = new Map<
  String,
  Map<Number, String>
>();
teamCornerOrderMap: Map<String, Map<Number, String>> = new Map<
  String,
  Map<Number, String>
>();

setPiecesTableList: ko.ObservableArray = ko.observableArray([]);
setPiecesDataProvider:  ko.Observable = ko.observable();

  constructor() {

    const promise = CommonUtils.fetchFPLPlayers();
    promise.then((res) => {
      CommonUtils.fplPlayerMap.forEach((player) => {
        if (player.penalties_order) {
          let teamName = CommonUtils.fplTeamsMap.get(player.team);
          if (this.teamPenOrderMap.has(teamName.name)) {
            console.log("1 : "+teamName.name+" , "+player.web_name);
            this.teamPenOrderMap
              .get(teamName.name)
              .set(player.penalties_order, player.web_name);
          } else {
            console.log("2 : "+teamName.name+" , "+player.web_name);
            let penMap = new Map<Number, String>();
            penMap.set(player.penalties_order, player.web_name);
            this.teamPenOrderMap.set(teamName.name, penMap);
          }
        }
        if (player.direct_freekicks_order) {
          let teamName = CommonUtils.fplTeamsMap.get(player.team);
          if (this.teamFkOrderMap.has(teamName.name)) {
            console.log("3 : "+teamName.name+" , "+player.web_name);
            this.teamFkOrderMap
              .get(teamName.name)
              .set(player.direct_freekicks_order, player.web_name);
          } else {
            console.log("4 : "+teamName.name+" , "+player.web_name);
            let fkMap = new Map<Number, String>();
            fkMap.set(player.direct_freekicks_order, player.web_name);
            this.teamFkOrderMap.set(teamName.name, fkMap);
          }
        }
        if (player.corners_and_indirect_freekicks_order) {
          let teamName = CommonUtils.fplTeamsMap.get(player.team);
          if (this.teamCornerOrderMap.has(teamName.name)) {
            console.log("5 : "+teamName.name+" , "+player.web_name);
            this.teamCornerOrderMap
              .get(teamName.name)
              .set(player.corners_and_indirect_freekicks_order, player.web_name);
          } else {
            console.log("6 : "+teamName.name+" , "+player.web_name);
            let cornerMap = new Map<Number, String>();
            cornerMap.set(player.corners_and_indirect_freekicks_order, player.web_name);
            this.teamCornerOrderMap.set(teamName.name, cornerMap);
          }
        }
      });

      var penMapSort = new Map();
      var fkMapSort = new Map();
      var cornerMapSort = new Map();
      for (let entry of Array.from(this.teamPenOrderMap.entries())) {
        console.log("entry 0 :: "+entry[0]+ " entry 1 :: "+entry[1]);
        let penMap: Map<Number, String> = entry[1];
        penMapSort = new Map([...penMap.entries()].sort(function(a, b) {
          if (a[0] < b[0]) return -1;
          if (a[0] > b[0]) return 1;
          /* else */ return 0;
        }));
        this.teamPenOrderMap.set(entry[0], penMapSort);
      }

      for (let entry of Array.from(this.teamFkOrderMap.entries())) {
        let fkMap: Map<Number, String> = entry[1];
        fkMapSort = new Map([...fkMap.entries()].sort(function(a, b) {
          if (a[0] < b[0]) return -1;
          if (a[0] > b[0]) return 1;
          /* else */ return 0;
        }));

        this.teamFkOrderMap.set(entry[0], fkMapSort);
      }

      for (let entry of Array.from(this.teamCornerOrderMap.entries())) {
        let cornerMap: Map<Number, String> = entry[1];
        cornerMapSort = new Map([...cornerMap.entries()].sort(function(a, b) {
          if (a[0] < b[0]) return -1;
          if (a[0] > b[0]) return 1;
          /* else */ return 0;
        }));

        this.teamCornerOrderMap.set(entry[0], cornerMapSort);
      }


      CommonUtils.fplTeamsMap.forEach(team => {
        let penInfoMap: Map<Number, String> = this.teamPenOrderMap.get(team.name);
        let penInfo: String = '';
        for (let entry of Array.from(penInfoMap.entries())) {
          penInfo = penInfo + '' + entry[1] + ' , ';
        }
        let fkInfoMap: Map<Number, String> = this.teamFkOrderMap.get(team.name);
        let fkInfo: String = '';
        for (let entry of Array.from(fkInfoMap.entries())) {
          fkInfo = fkInfo + '' + entry[1] + ' , ';
        }
        let cornerInfoMap: Map<Number, String> = this.teamCornerOrderMap.get(team.name);
        let cornerInfo: String = '';
        for (let entry of Array.from(cornerInfoMap.entries())) {
          cornerInfo = cornerInfo + '' + entry[1] + ' , ';
        }

        let fplTeamPicUrl: String = "https://resources.premierleague.com/premierleague/badges/t";

        let ele = {"team": team.name, "pens" : penInfo.substring(0, penInfo.length-2), "fks": fkInfo.substring(0, fkInfo.length-2), "corners" : cornerInfo.substring(0, cornerInfo.length-2), "teamlogo" : fplTeamPicUrl+""+team.code+".png"};
        this.setPiecesTableList.push(ele);
      });
      this.setPiecesDataProvider(new ArrayDataProvider(this.setPiecesTableList)); 
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

export default SetPiecesViewModel;