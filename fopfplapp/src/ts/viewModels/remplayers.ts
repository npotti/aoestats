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
import { Bonus } from "../interfaces/bonus";

import { ElementSummary } from "../interfaces/elementsummary";

import * as ArrayDataProvider from "ojs/ojarraydataprovider";

import "ojs/ojtable";
import "ojs/ojchart";
import PagingDataProviderView = require("ojs/ojpagingdataproviderview");
import { PagingModel } from "ojs/ojpagingmodel";
import { ojButtonEventMap } from "ojs/ojbutton";

class RemPlayersViewModel {
  bonusUrl: string =
    "https://fopfpl.in/aoe/api/players_remaining/";

  remPlyTableList: ko.ObservableArray = ko.observableArray([]);
  remPlyDataProvider: ko.Observable = ko.observable();

  teamRemPlyMap: Map<String, Map<String, Number>> = new Map<String, Map<String, Number>>();

  constructor() {
    const promises = [];
    const globalPromise = CommonUtils.fetchFPLPlayers();
    const teamPromise = CommonUtils.fetchAoeTeams();

    promises.push(globalPromise);
    promises.push(teamPromise);

    Promise.all(promises).then((res) => {
        this.teamRemPlyMap.clear();
        fetch(this.bonusUrl+CommonUtils.curr_gw+"/")
          .then((res) => res.json())
          .then((res) => {
            const resResult: Bonus[] = <Bonus[]>res;
            resResult.forEach(ply => {
                if(!this.teamRemPlyMap.has(ply.team)){
                    let plyMap = new Map<String, Number>();
                    this.teamRemPlyMap.set(ply.team, plyMap);
                }
                ply.squad.forEach(remPly => {
                    if(remPly.color === 0){
                        let plyMap = this.teamRemPlyMap.get(ply.team);
                        let name = remPly.name;
                        let multiplier = 1;
                        if(name.endsWith(")")){
                          multiplier = parseInt(name.substring(name.indexOf("(")+1, name.length-1));
                          name = name.substring(0, name.indexOf("(")-1);
                        }

                        if(plyMap.has(name)){
                            let count: any = plyMap.get(name);
                            if(ply.is_captain){
                              count = count.valueOf()+(2*multiplier);
                            }
                            else if(ply.is_vice_captain){
                              count = count.valueOf()+(1.5*multiplier);
                            }
                            else if(ply.is_sub){
                              count = count.valueOf()+(0.5*multiplier);
                            }
                            else{
                              count= count.valueOf()+(1*multiplier);
                            }
                            plyMap.set(name, count);
                        }
                        else{
                          if(ply.is_captain){
                            plyMap.set(name, 2*multiplier);
                          }
                          else if(ply.is_vice_captain){
                            plyMap.set(name, 1.5*multiplier);
                          }
                          else if(ply.is_sub){
                            plyMap.set(name, 0.5*multiplier);
                          }
                          else{
                            plyMap.set(name, 1*multiplier);
                          }
                        }
                    }
                })
            })
            CommonUtils.aoeTeams.forEach(team =>{
                  let remPlyStr = '';
                  let count = 0;
    
                  if(this.teamRemPlyMap.has(team.name)){
                    let remPlyMap = this.teamRemPlyMap.get(team.name);
                    for (let entry of Array.from(remPlyMap.entries())) {
                        remPlyStr = remPlyStr+ entry[0] + "("+entry[1]+"),";
                        count = count.valueOf()+entry[1].valueOf();
                    }
                    let ele = {"team": team.name, "count":count, "plyrsRem" : remPlyStr.substring(0, remPlyStr.length-1)};
                    this.remPlyTableList.push(ele);
                  }
                  else{
                    let ele = {"team": team.name, "count":0, "plyrsRem" : "NA"};
                    this.remPlyTableList.push(ele);
                  }
    
                  
                  this.remPlyTableList.sort((a,b) => {
                    if(a.count > b.count){
                      return -1;
                    }
                    if(a.count < b.count){
                      return 1;
                    }
                    return 0;
                  })
              })
          });
        this.remPlyDataProvider(new ArrayDataProvider(this.remPlyTableList));
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

export default RemPlayersViewModel;
