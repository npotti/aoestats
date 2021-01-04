import {VegTallyPojo} from '../interfaces/vegtallypojo';
import {FplMgrHistory, Chip, Current} from '../interfaces/fplmgrhistory';
import {AoeTeam} from '../interfaces/aoeteams';
import {Pick, Picks} from '../interfaces/picks';
import {FPLBootStrap, Team} from '../interfaces/bootstrap';
import {FPLTransfers} from '../interfaces/transfers';
import {EOPojo} from '../interfaces/eopojo';
import {CapQuota} from '../interfaces/capquota';
import CommonUtils from '../utils/commonutils';
import * as ArrayDataProvider from 'ojs/ojarraydataprovider';
import * as ko from 'knockout';
import "ojs/ojtable";
import "ojs/ojchart";
import "ojs/ojselectsingle";
import PagingDataProviderView = require("ojs/ojpagingdataproviderview");
import { PagingModel } from "ojs/ojpagingmodel";
import { ojButtonEventMap } from 'ojs/ojbutton';
import commonutils from '../utils/commonutils';

class IncidentsViewModel {

  teamsLovDataProvider: ArrayDataProvider<string, string>;
  selectedTeam: ko.Observable = ko.observable();
  fplBaseUrl: string = 'https://fantasy.premierleague.com/api/';
  aoeTeams: AoeTeam[] = [];
  curr_gw = 1;
  playerPicksMap = new Map<Number, Pick[]>();
  aoeTeamFplTeamMap = new Map<Number, Map<String, Number>>();
  fplTeamAoeAvgMap = new Map<String, Number>();
  gainTableList: ko.ObservableArray = ko.observableArray([]);
  gainDataProvider:  ko.Observable = ko.observable();
  showTable: ko.Observable<Boolean> = ko.observable(false);

  constructor() {
    const promise = CommonUtils.fetchFPLPlayers();
    promise.then(res => {
      this.curr_gw = CommonUtils.curr_gw;
      const promise2 = CommonUtils.fetchAoeTeams();
      promise2.then(result => {
        this.aoeTeams = <AoeTeam[]>result;
        this.aoeTeams.forEach(team => {
            const ptpromises = [];
            team.players.forEach(player => {
              const promise3 = this.fetchPicks(player.fpl_id);
              ptpromises.push(promise3);
            });
            Promise.all(ptpromises).then(res => {
              team.players.forEach(player => {
                let picks: Pick[] = this.playerPicksMap.get(player.fpl_id);
                picks.forEach(pick => {
                   let currWkPoints=CommonUtils.fplPlayerMap.get(pick.element).event_points;
                   let fplteam = CommonUtils.fplTeamsMap.get(CommonUtils.fplPlayerMap.get(pick.element).team).name;
                   if(this.aoeTeamFplTeamMap.get(team.id)){
                    if(this.aoeTeamFplTeamMap.get(team.id).get(fplteam)){
                      let count = this.aoeTeamFplTeamMap.get(team.id).get(fplteam).valueOf() + (currWkPoints*pick.multiplier);
                      this.aoeTeamFplTeamMap.get(team.id).set(fplteam, count);
                    }
                    else{
                      let count = (currWkPoints*pick.multiplier);
                      this.aoeTeamFplTeamMap.get(team.id).set(fplteam, count);
                    }
                   }
                   else{
                     console.log("Inside else");
                     let newMap : Map<String, Number> = new Map<String, Number>();
                     let count = (currWkPoints*pick.multiplier);
                     newMap.set(fplteam, count);
                     this.aoeTeamFplTeamMap.set(team.id, newMap);
                   }
                });
              });

              for (let entry of Array.from(CommonUtils.fplTeamsMap.entries())) {
                let name = entry[1].name;
                let count= 0;
                for(let entry2 of Array.from(this.aoeTeamFplTeamMap.entries())){
                  let xMap = entry2[1];
                  if(xMap.has(name)){
                    count=count+xMap.get(name).valueOf();
                  }
                }
                this.fplTeamAoeAvgMap.set(name, count/10);
              }
              console.log("Execution completed");
            });
        });
      });
    })


    var teams = [
      { value: 1, label: 'Marathas' },
      { value: 2, label: 'Chozhas' },
      { value: 3, label: 'Nizams' },
      { value: 4, label: 'Mauryas' },
      { value: 5, label: 'Mughals' },
      { value: 6, label: 'Khiljis' },
      { value: 7, label: 'Travancore' },
      { value: 8, label: 'Nagas' },
      { value: 9, label: 'Vijayanagara' },
      { value: 10, label: 'Zamorins' }
    ];
    this.teamsLovDataProvider = new ArrayDataProvider(teams, { keyAttributes: 'value' });
  }

  valueChangedHandler = (event): void=>{
    this.gainTableList.removeAll();
    console.log(event.detail.value);
    let map: Map<String, Number> = this.aoeTeamFplTeamMap.get(event.detail.value);
    if(map){
      for (let entry of Array.from(CommonUtils.fplTeamsMap.entries())) {
        let name = entry[1].name;
        let count = map.has(name) ? map.get(name) : 0;
        let avg = this.fplTeamAoeAvgMap.has(name) ? this.fplTeamAoeAvgMap.get(name) : 0;
        let ele = {"team": name, "count" : count, "avg": CommonUtils.roundToTwo(avg), "gain": CommonUtils.roundToTwo((count.valueOf()-avg.valueOf()))};
        this.gainTableList.push(ele);
      }
      this.gainDataProvider(new ArrayDataProvider(this.gainTableList));
      this.showTable(true);
    }
    else{
      this.showTable(false);
    }
  }

  /**
   * Optional ViewModel method invoked after the View is inserted into the
   * document DOM.  The application can put logic that requires the DOM being
   * attached here.
   * This method might be called multiple times - after the View is created
   * and inserted into the DOM and after the View is reconnected
   * after being disconnected.
   */
  connected(): void {
    // implement if needed
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

  private fetchPicks(fpl_id: number){
    return new Promise((resolve) =>{
      let urlFinal: string = 'https://fantasy.premierleague.com/api/entry/'+fpl_id+'/event/'+this.curr_gw+"/picks/";
      fetch(urlFinal).then(res => res.json()).
        then(res => {
          const picksConst: Picks = <Picks>res;
          this.playerPicksMap.set(fpl_id, picksConst.picks);
          resolve(true);
        });
    });
  }
}

export default IncidentsViewModel;