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
import 'ojs/ojavatar';
class InjuriesViewModel {
  headerConfig: ko.Observable<ojModule["config"]>;

  injuriesTableList: ko.ObservableArray = ko.observableArray([]);
  injuriesDataProvider:  ko.Observable = ko.observable();

  team0OrderMap: Map<String, String[]> = new Map<String, String[]>();
  team25OrderMap: Map<String, String[]> = new Map<String, String[]>();
  team50OrderMap: Map<String, String[]> = new Map<String, String[]>();
  team75OrderMap: Map<String, String[]> = new Map<String, String[]>();

  constructor() {
    const promise = CommonUtils.fetchFPLPlayers();
    promise.then((res) => {
      CommonUtils.fplPlayerMap.forEach((player) => {
        if (player.chance_of_playing_next_round === 0) {
          let teamName = CommonUtils.fplTeamsMap.get(player.team);
          if (this.team0OrderMap.has(teamName.name)) {
            console.log("1 : "+teamName.name+" , "+player.web_name);
            this.team0OrderMap
              .get(teamName.name)
              .push(player.web_name);
          } else {
            console.log("2 : "+teamName.name+" , "+player.web_name);
            let players = [];
            players.push(player.web_name);
            this.team0OrderMap.set(teamName.name, players);
          }
        }
        if (player.chance_of_playing_next_round === 75) {
          let teamName = CommonUtils.fplTeamsMap.get(player.team);
          if (this.team75OrderMap.has(teamName.name)) {
            console.log("1 : "+teamName.name+" , "+player.web_name);
            this.team75OrderMap
              .get(teamName.name)
              .push(player.web_name);
          } else {
            console.log("2 : "+teamName.name+" , "+player.web_name);
            let players = [];
            players.push(player.web_name);
            this.team75OrderMap.set(teamName.name, players);
          }
        }
        if (player.chance_of_playing_next_round === 25) {
          let teamName = CommonUtils.fplTeamsMap.get(player.team);
          if (this.team25OrderMap.has(teamName.name)) {
            console.log("1 : "+teamName.name+" , "+player.web_name);
            this.team25OrderMap
              .get(teamName.name)
              .push(player.web_name);
          } else {
            console.log("2 : "+teamName.name+" , "+player.web_name);
            let players = [];
            players.push(player.web_name);
            this.team25OrderMap.set(teamName.name, players);
          }
        }
        if (player.chance_of_playing_next_round === 50) {
          let teamName = CommonUtils.fplTeamsMap.get(player.team);
          if (this.team50OrderMap.has(teamName.name)) {
            console.log("1 : "+teamName.name+" , "+player.web_name);
            this.team50OrderMap
              .get(teamName.name)
              .push(player.web_name);
          } else {
            console.log("2 : "+teamName.name+" , "+player.web_name);
            let players = [];
            players.push(player.web_name);
            this.team50OrderMap.set(teamName.name, players);
          }
        }
      });

      CommonUtils.fplTeamsMap.forEach(team => {
        let chance0: String[] = this.team0OrderMap.get(team.name);
        let info0: String = '';
        if(chance0){
          for (let entry of Array.from(chance0.entries())) {
            info0 = info0 + '' + entry[1] + ' , ';
          }
        }
        else{
          info0 = '';
        }

        let chance25: String[] = this.team25OrderMap.get(team.name);
        let info25: String = '';
        if(chance25){
          for (let entry of Array.from(chance25.entries())) {
            info25 = info25 + '' + entry[1] + ' , ';
          }
        }
        else{
          info25 = '';
        }
        

        let chance50: String[] = this.team50OrderMap.get(team.name);
        let info50: String = '';
        if(chance50){
          for (let entry of Array.from(chance50.entries())) {
            info50 = info50 + '' + entry[1] + ' , ';
          }
        }
        else{
          info50 = '';
        }

        let chance75: String[] = this.team75OrderMap.get(team.name);
        let info75: String = '';
        if(chance75){
          for (let entry of Array.from(chance75.entries())) {
            info75 = info75 + '' + entry[1] + ' , ';
          }
        }
        else{
          info75 = '';
        }

        info0 = (info0.length > 0) ? (info0.substring(0, info0.length-2)) : '';
        info25 = (info25.length > 0) ? (info25.substring(0, info25.length-2)) : '';
        info50 = (info50.length > 0) ? (info50.substring(0, info50.length-2)) : '';
        info75 = (info75.length > 0) ? (info75.substring(0, info75.length-2)) : '';

        let fplTeamPicUrl: String = "https://resources.premierleague.com/premierleague/badges/t";
       
        let ele = {"team": team.name, "chance0" : info0, "chance25": info25, "chance50" : info50, "chance75" : info75, "teamlogo" : fplTeamPicUrl+""+team.code+".png"};
        this.injuriesTableList.push(ele);
      });
      this.injuriesDataProvider(new ArrayDataProvider(this.injuriesTableList)); 
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
    document.title = "About";
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

export default InjuriesViewModel;
