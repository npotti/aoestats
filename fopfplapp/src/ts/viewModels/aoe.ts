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
import { ojMenuEventMap } from 'ojs/ojmenu';
import 'ojs/ojmenu';
import PagingDataProviderView = require("ojs/ojpagingdataproviderview");
import { PagingModel } from "ojs/ojpagingmodel";
import { ojButtonEventMap } from 'ojs/ojbutton';
import 'ojs/ojoption';
import 'ojs/ojarraytabledatasource';

class CustomersViewModel {

  public capQuotaObservableArray: ko.ObservableArray = ko.observableArray([]);
  capQuotaObservable: ko.Observable = ko.observable();
  public playersPlayedObservableArray: ko.ObservableArray = ko.observableArray([]);
  playersPlayedObservable: ko.Observable = ko.observable();
  vegTallyTableList: ko.ObservableArray<VegTallyPojo> = ko.observableArray([]);
  vegTallyDataProvider: ko.Observable<ArrayDataProvider<string, string>>;
  public chartObservableArray: ko.ObservableArray = ko.observableArray([]);
  chartObservable: ko.Observable = ko.observable();
  tallyUrl: string = 'https://fopfpl.in/aoe/api/veg_tally';
  curr_gw = 1;
  eoTableList: ko.ObservableArray = ko.observableArray([]);
  eoDataProvider:  ko.Observable = ko.observable();
  aoePlayerMap = new Map();
  chipTableList: ko.ObservableArray = ko.observableArray([]);
  chipDataProvider:  ko.Observable = ko.observable();
  selectedMenuItem: ko.Observable<string> = ko.observable('');
  aoeEoVisible: ko.Observable<Boolean> = ko.observable(false);
  capVCVisible: ko.Observable<Boolean> = ko.observable(true);
  livePlayerVisible: ko.Observable<Boolean> = ko.observable(false);
  chipStatusVisible: ko.Observable<Boolean> = ko.observable(false);
  livePlayerChartVisible: ko.Observable<Boolean> = ko.observable(false);
  datasource= ko.observableArray();

  constructor() {

    var self = this;
    var deptArray = [];
    var db = null;
    // On device ready, create the table if it does not exists.
    // document.addEventListener("deviceready", function () {
    //     db = (<any>window).sqlitePlugin.openDatabase({name: "aoe.db"});
    //     db.transaction(function (tx) {
    //         tx.executeSql("CREATE TABLE IF NOT EXISTS RIVALS (fplid text primary key, name text)");
    //     }, function (err) {
    //         alert("An error occured while initializing the app");
    //     });
    // }, false);



    const promise = CommonUtils.fetchCurrGW();
    promise.then(res => {
      this.curr_gw = <number>res;
      this.fetchAoeEO(this.curr_gw);
      this.vegTallyDataProvider = ko.observable(new ArrayDataProvider(this.vegTallyTableList));
      let i=1;
      for(i;i<=10;i++){
        this.fetchTeamVegTally(this.curr_gw,i);
      }
    })
    const promise2 = this.fetchFplChipCounts();
    promise2.then(res => {
      this.chipDataProvider(new ArrayDataProvider(this.chipTableList));
    })
    this.fetchCapQuota();
  }

  public menuItemAction = (event: ojMenuEventMap['ojAction']) => {
    this.selectedMenuItem((event.target as HTMLInputElement).value);
    if(this.selectedMenuItem() === 'capVC'){
      this.capVCVisible(true);
      this.aoeEoVisible(false);
      this.chipStatusVisible(false);
      this.livePlayerChartVisible(false);
      this.livePlayerVisible(false);
    }
    else if(this.selectedMenuItem() === 'aoeEO'){
      this.capVCVisible(false);
      this.aoeEoVisible(true);
      this.chipStatusVisible(false);
      this.livePlayerChartVisible(false);
      this.livePlayerVisible(false);
    }
    else if(this.selectedMenuItem() === 'livePlyrsRem'){
      this.capVCVisible(false);
      this.aoeEoVisible(false);
      this.chipStatusVisible(false);
      this.livePlayerChartVisible(false);
      this.livePlayerVisible(true);
    }
    else if(this.selectedMenuItem() === 'livePlyrsChart'){
      this.capVCVisible(false);
      this.aoeEoVisible(false);
      this.chipStatusVisible(false);
      this.livePlayerChartVisible(true);
      this.livePlayerVisible(false);
    }
    else if(this.selectedMenuItem() === 'chipStatus'){
      this.capVCVisible(false);
      this.aoeEoVisible(false);
      this.chipStatusVisible(true);
      this.livePlayerChartVisible(false);
      this.livePlayerVisible(false);
    }
  }

  private fetcheo(urlFinal: string, playerMap: Map<string, number>) {
    return new Promise((resolve) => {
      fetch(urlFinal).
      then(res => res.json())
          .then(res => {
            const resResult: VegTallyPojo[] = <VegTallyPojo[]>res;

            
            resResult.forEach(row =>{
                if(!playerMap.get(row.name)){
                  playerMap.set(row.name, row.count);
                }
                else{
                  let count = playerMap.get(row.name);
                  count = count+row.count;
                  playerMap.set(row.name, count);
                }
           });
           resolve(res);
      });  
    });
  }

  private fetchCapQuota(): void{
    fetch('https://fopfpl.in/aoe/api/game_week/scores/').
    then(res => res.json())
        .then(res => {
          const resResult: CapQuota[] = <CapQuota[]>res;
          let teamCapMap = new Map();
          let teamSubMap = new Map();
          let teamVcMap = new Map();
          resResult.forEach(row =>{
            let i = 0;
            for(i;i<10;i++){
              let capMap = teamCapMap.get(i);
              let subMap = teamSubMap.get(i);
              let vcMap = teamVcMap.get(i);
              if(!capMap){
                capMap = new Map();
              }
              if(!subMap){
                subMap = new Map();
              }
              if(!vcMap){
                vcMap = new Map();
              }
              if(capMap.has(row[i].captain.first_name)){
                let cnt = capMap.get(row[i].captain.first_name);
                cnt = cnt+1;
                capMap.set(row[i].captain.first_name, cnt);
              }
              else{
                capMap.set(row[i].captain.first_name, 1);
              }
              if(subMap.has(row[i].substitute.first_name)){
                let cnt = subMap.get(row[i].substitute.first_name);
                cnt = cnt+1;
                subMap.set(row[i].substitute.first_name, cnt);
              }
              else{
                subMap.set(row[i].substitute.first_name, 1);
              }
              if(vcMap.has(row[i].vice_captain.first_name)){
                let cnt = vcMap.get(row[i].vice_captain.first_name);
                cnt = cnt+1;
                vcMap.set(row[i].vice_captain.first_name, cnt);
              }
              else{
                vcMap.set(row[i].vice_captain.first_name, 1);
              }
              teamCapMap.set(i, capMap);
              teamSubMap.set(i, subMap);
              teamVcMap.set(i, vcMap);
            }
          })

          let i=0;
          for(i;i<10;i++){
            
            let capStr: string = "";
            for (let entry of Array.from(teamCapMap.get(i).entries())) {
              let name = entry[0];
              let count = entry[1];
              capStr = capStr+name+":"+count+",";
            }
            let subStr: string = "";
            for (let entry of Array.from(teamSubMap.get(i).entries())) {
              let name = entry[0];
              let count = entry[1];
              subStr = subStr+name+":"+count+",";
            }
            let vcStr: string = "";
            for (let entry of Array.from(teamVcMap.get(i).entries())) {
              let name = entry[0];
              let count = entry[1];
              vcStr = vcStr+name+":"+count+",";
            }
            if(capStr.endsWith(",")){
              capStr = capStr.substring(0, capStr.length-1);
            }
            if(subStr.endsWith(",")){
              subStr = subStr.substring(0, subStr.length-1);
            }
            if(vcStr.endsWith(",")){
              vcStr = vcStr.substring(0, vcStr.length-1);
            }
            var ele = {"teamName" : CommonUtils.fetchTeamName(i+1), "capQuota" : capStr, "subQuota" : subStr, "vcCount" : vcStr};
            this.capQuotaObservableArray.push(ele);
          }
          this.capQuotaObservable(new ArrayDataProvider(this.capQuotaObservableArray));
        })
      }

      private fetchTeamVegTally(gameweek: number, team: number): void{
        let urlFinal: string = this.tallyUrl + '/' + gameweek + '/' + team;
        fetch(urlFinal).
        then(res => res.json())
            .then(res => {
              const resResult: VegTallyPojo[] = <VegTallyPojo[]>res;
              let playersPlayed : number = 0;
              let playersRemaining: number = 0;
              let totalPlayers: number = 0;
              let remMap = new Map();
              resResult.forEach(row =>{
                if(row.score !== 0){ //players with 0
                  playersPlayed += row.count;
                }
                else{
                  playersRemaining += row.count;
                  remMap.set(row.name, row.count)
                }
                totalPlayers += row.count;
                this.vegTallyTableList().push(row);
              })
    
              let remStr = "";
              for (let entry of Array.from(remMap.entries())) {
                let name = entry[0];
                let count = entry[1];
                remStr = remStr+name+":"+count+",";
              }
              if(remStr.endsWith(",")){
                remStr = remStr.substring(0, remStr.length-1);
              }
    
              let teamName : string = CommonUtils.fetchTeamName(team);
              
    
              var ele = {"team": team, "teamName": teamName, "playersPlayed" : playersPlayed, "playersRemaining" : playersRemaining, "totalPlayers" : totalPlayers, "remainingPlayerData" : remStr};
              var chartEle = {"id": team, "group" : "Players Played", "value" : playersPlayed,
              "series": teamName};
              var chartEle2 = {"id": team, "group" : "Players Remaining", "value" : playersRemaining,
              "series": teamName};
              this.chartObservableArray.push(chartEle); 
              this.chartObservableArray.push(chartEle2);
              this.playersPlayedObservableArray.push(ele);
              this.playersPlayedObservableArray.sort((a,b) => {
                if(a.playersRemaining > b.playersRemaining){
                  return -1;
                }
                if(a.playersRemaining < b.playersRemaining){
                  return 1;
                }
                return 0;
              })
              this.vegTallyDataProvider(new ArrayDataProvider(this.vegTallyTableList));
              this.playersPlayedObservable(new ArrayDataProvider(this.playersPlayedObservableArray));
              this.chartObservable(new ArrayDataProvider(this.chartObservableArray));
            })
      }

      private fetchAoeEO(gameweek: number): void{
        let playerMap = new Map();
        const promises = [];
        for(let i=1; i<=10; i++){
          let urlFinal: string = this.tallyUrl + '/' + gameweek + '/' + i;
          promises.push(this.fetcheo(urlFinal, playerMap));
    
        }
    
       
        Promise.all(promises).then(resolve =>{
          for (let entry of Array.from(playerMap.entries())) {
            let name = entry[0];
            let count = entry[1];
            let percent = ((count/60)*100);
            let ele = {"player": name, "count" : count, "percent": CommonUtils.roundToTwo(percent)};
            this.eoTableList.push(ele);
          }
          this.eoTableList.sort((a,b) => {
            if(a.percent > b.percent){
              return -1;
            }
            if(a.percent < b.percent){
              return 1;
            }
            return 0;
          })
          this.eoDataProvider(new ArrayDataProvider(this.eoTableList));
        })
      }

      private fetchFplChipCounts(){
        return new Promise((accept) => {
        let promise= CommonUtils.fetchAoeTeams();
        const promises = [];
        promise.then((res) => {
          let aoeTeams = <AoeTeam[]>res;
          aoeTeams.forEach(team => {
            let wcUsed : number = 0;
            let fhUsed : number = 0;
            let bbUsed : number = 0;
            let tcUsed : number = 0;
            team.players.forEach(player => {
              this.aoePlayerMap.set(player.first_name+" "+player.last_name+" ("+CommonUtils.fetchTeamName(team.id)+" )", player.fpl_id);
              let promiseCh= CommonUtils.fetchFplMgrHistory(player.fpl_id);
              promises.push(promiseCh);
              promiseCh.then((res) => {
                let respHist: FplMgrHistory = <FplMgrHistory>res;
                let chips :Chip[] = <Chip[]>respHist.chips;
                if(chips.length > 0){
                    chips.forEach(chip => {
                      if(chip.name === 'wildcard'){
                        wcUsed = wcUsed +1;
                      }
                      else if(chip.name === '3xc'){
                        tcUsed = tcUsed +1;
                      }
                      else if(chip.name === 'freehit'){
                        fhUsed = fhUsed + 1;
                      }
                      else if(chip.name === 'bboost'){
                        bbUsed = bbUsed + 1;
                      }
                    });
                }
              });
            });
            Promise.all(promises).then(resolve =>{
              let info: string = "WCs Used :: "+wcUsed+", TCs Used :: "+tcUsed+", FHs Used :: "+fhUsed+" BBs Used :: "+bbUsed;
              let ele = {"team": CommonUtils.fetchTeamName(team.id), "info" : info, "wcUsed" : wcUsed, "tcUsed": tcUsed, "fhUsed": fhUsed, "bbUsed": bbUsed};
              this.chipTableList.push(ele);
              accept(true);
            });
          });
        });
        });
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
}

export default CustomersViewModel;