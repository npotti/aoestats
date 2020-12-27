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
import PagingDataProviderView = require("ojs/ojpagingdataproviderview");
import { PagingModel } from "ojs/ojpagingmodel";
import { ojButtonEventMap } from 'ojs/ojbutton';

class DashboardViewModel {
  tallyUrl: string = 'https://fopfpl.in/aoe/api/veg_tally';
  fplBaseUrl: string = 'https://fantasy.premierleague.com/api/';
  chipTableList: ko.ObservableArray = ko.observableArray([]);
  chipDataProvider:  ko.Observable = ko.observable();
  transferTableList: ko.ObservableArray = ko.observableArray([]);
  transferDataProvider:  ko.Observable = ko.observable();
  hitTableList: ko.ObservableArray = ko.observableArray([]);
  hitDataProvider:  ko.Observable = ko.observable();
  mostFPLTransferredIn: ko.Observable = ko.observable();
  mostFPLCaptained: ko.Observable = ko.observable();
  mostFPLTransferredOut: ko.Observable = ko.observable();
  mostAOETransferredIn: ko.Observable = ko.observable();
  mostAOECaptained: ko.Observable = ko.observable();
  mostAOETransferredOut: ko.Observable = ko.observable();
  fplPlayerMap = new Map();
  aoePlayerMap = new Map();
  aoeTeams: AoeTeam[] = [];
  curr_gw: number = 15;
  gwTransInMap = new Map();
  gwTransOutMap = new Map();
  captainMap = new Map();
  aoeGwPlayerTransfers = new Map();
  fplTeamsMap = new Map();
  loadTransTable: ko.Observable<boolean> = ko.observable(false);
  playerChipMap = new Map();
  playerCaptainMap = new Map();
  playerViceCaptainMap = new Map();
  playerRankMap = new Map();
  playerPicksMap = new Map<Number, Pick[]>();
  aoeFplTeamAvgMap = new Map();
  aoeLiveScoreMap = new Map<Number, Number>();

  constructor() {
    const promises = [];
    const promise = this.fetchFPLPlayers();
    const promise2 = this.fetchFplChipCounts();
    const promise3 = CommonUtils.fetchAoeTeams();
    const promise4 = this.fetchAoeScores();
    this.fetchFplHits();
    promises.push(promise);
    promises.push(promise2);
    promises.push(promise3);
    promises.push(promise4);

    Promise.all(promises).then(resolve =>{
      for (let entry of Array.from(this.aoePlayerMap.entries())) {
        let name = entry[0];
        let fpl_id = entry[1];
        const ptpromises = [];
        const picksPromise = this.fetchPicks(fpl_id, name);
        const transPromise = this.fetchTransfers(fpl_id);
        ptpromises.push(picksPromise);
        ptpromises.push(transPromise);
        picksPromise.then(picksRes =>{
        transPromise.then(transRes =>{
          let transMap = <Map<string, string>>transRes;
          let transInConcat: string = '';
          let transOutConcat: string = '';
          for (let transEntry of Array.from(transMap.entries())) {
            let transIn = transEntry[0];
            let transOut = transEntry[1];
            if(transInConcat === ''){
              transInConcat = transIn;
            }
            else{
              transInConcat = transInConcat+ ", "+transIn;
            }
            if(transOutConcat === ''){
              transOutConcat = transOut;
            }
            else{
              transOutConcat = transOutConcat+ ", "+transOut;
            }
            if(this.gwTransInMap.has(transIn)){
              let count=this.gwTransInMap.get(transIn);
              this.gwTransInMap.set(transIn, count+1);
            }
            else{
              this.gwTransInMap.set(transIn,1);
            }
            if(this.gwTransOutMap.has(transOut)){
              let count=this.gwTransOutMap.get(transOut);
              this.gwTransOutMap.set(transOut, count+1);
            }
            else{
              this.gwTransOutMap.set(transOut,1);
            }
          }
          this.aoeGwPlayerTransfers.set(name, "Transfers IN : "+transInConcat+", Transfers OUT : "+transOutConcat);
        });
      });
      }
    })
  }

  private fetchAoeFPLTeamAvgs(){
    for (let entry of Array.from(this.aoePlayerMap.entries())) {
      let playerConcatName: String = entry[0];
      let fplId = entry[1];
      let playerName = playerConcatName.substring(0, playerConcatName.indexOf("(")-1);
      let aoeTeamName = playerConcatName.substring(playerConcatName.indexOf("("), playerConcatName.length-2);

    }
  }

  onLoadTransferTable = (event: ojButtonEventMap['ojAction']) => {
    
    for (let entry of Array.from(this.aoeGwPlayerTransfers.entries())) {

      let currPoints: Number = this.playerRankMap.get(entry[0]).total_points;

      let livePoints: Number = this.aoeLiveScoreMap.get(this.aoePlayerMap.get(entry[0]));
      // let livePoints = 0;
      let totalPoints = currPoints.valueOf() + livePoints.valueOf();


      let ele = {"player": entry[0], "info" : entry[1], "chip" : this.playerChipMap.get(entry[0]), "captain" : this.playerCaptainMap.get(entry[0]), "vicecaptain" : this.playerViceCaptainMap.get(entry[0]), "rank" : this.playerRankMap.get(entry[0]).overall_rank, "hits": ((this.playerRankMap.get(entry[0]).event_transfers_cost)/4), "tv": ((this.playerRankMap.get(entry[0]).value)/10), "points": currPoints, "livepoints": livePoints, "totalpoints" : totalPoints};

      this.transferTableList.push(ele);
    }

    this.transferTableList.sort((a,b) => {
      if(a.totalpoints > b.totalpoints){
        return -1;
      }
      if(a.totalpoints < b.totalpoints){
        return 1;
      }
      return 0;
    })

    this.transferDataProvider(new ArrayDataProvider(this.transferTableList));
    this.chipDataProvider(new ArrayDataProvider(this.chipTableList));

    var mapOut = new Map([...this.gwTransOutMap.entries()].sort(function(a, b) {
      if (a[1] > b[1]) return -1;
      if (a[1] < b[1]) return 1;
      /* else */ return 0;
    }));

    var mapIn = new Map([...this.gwTransInMap.entries()].sort(function(a, b) {
      if (a[1] > b[1]) return -1;
      if (a[1] < b[1]) return 1;
      /* else */ return 0;
    }));

    this.mostAOETransferredOut(mapOut.keys().next().value);

    this.mostAOETransferredIn(mapIn.keys().next().value);


    this.loadTransTable(true);
  };

  private fetchTransfers(fpl_id: number){
    return new Promise((resolve) =>{
      let transfersMap = new Map<string, string>();
      let urlFinal: string = 'https://fantasy.premierleague.com/api/entry/'+fpl_id+'/transfers/';
      fetch(urlFinal).then(res => res.json()).
        then(res => {
          const resResult: FPLTransfers[] = <FPLTransfers[]>res;
          resResult.forEach(ele => {
            if(ele.event === this.curr_gw){
              transfersMap.set(this.fplPlayerMap.get(ele.element_in).web_name, this.fplPlayerMap.get(ele.element_out).web_name);
            }
            resolve(transfersMap);
          })
        });
    });
  }

  private fetchPicks(fpl_id: number, name: string){
    return new Promise((resolve) =>{
      let urlFinal: string = 'https://fantasy.premierleague.com/api/entry/'+fpl_id+'/event/'+this.curr_gw+"/picks/";
      fetch(urlFinal).then(res => res.json()).
        then(res => {
          const picksConst: Picks = <Picks>res;
          if(picksConst.active_chip){
            this.playerChipMap.set(name, picksConst.active_chip);
          }
          this.playerPicksMap.set(fpl_id, picksConst.picks);
          picksConst.picks.forEach(ele => {
            if(ele.is_captain){
              this.playerCaptainMap.set(name, this.fplPlayerMap.get(ele.element).web_name);
            }
            else if(ele.is_vice_captain){
              this.playerViceCaptainMap.set(name, this.fplPlayerMap.get(ele.element).web_name);
            }
          })
          this.playerRankMap.set(name, picksConst.entry_history);
          resolve(true);
        });
    });
  }

  private fetchFPLPlayers(){
    return new Promise((resolve) => {
      let urlFinal: string = 'https://fantasy.premierleague.com/api/bootstrap-static/';
      fetch(urlFinal).
      then(res => res.json())
          .then(res => {
            const resResult: FPLBootStrap = <FPLBootStrap>res;
            if(resResult.teams){
              resResult.teams.forEach(team => {
                this.fplTeamsMap.set(team.id, team);
              })
            }
            if(resResult.elements){
              resResult.elements.forEach(element => {
                this.fplPlayerMap.set(element.id, element);
              });
            }
            resolve(true);
          })
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
          let ele = {"team": CommonUtils.fetchTeamName(team.id), "info" : info};
          this.chipTableList.push(ele);
          accept(true);
        });
      });
    });
    });
  }

  private fetchFplHits(){
    let promise= CommonUtils.fetchAoeTeams();
    const promises = [];
    let hitsEles = [];
    promise.then((res) => {
      let aoeTeams = <AoeTeam[]>res;
      aoeTeams.forEach(team => {
        team.players.forEach(player => {
          let promiseCh= CommonUtils.fetchFplMgrHistory(player.fpl_id);
          promises.push(promiseCh);
          promiseCh.then((res) => {
            let respHist: FplMgrHistory = <FplMgrHistory>res;
            let current :Current[] = <Current[]>respHist.current;
            if(current.length > 0){
                let totalCost: number = 0;
                current.forEach(week => {
                  totalCost = totalCost + week.event_transfers_cost;
                });
                let ele = {"player": player.first_name+ " "+player.last_name, "cost" : totalCost, "team": CommonUtils.fetchTeamName(team.id)};
                this.hitTableList.push(ele);
            }
          });
        });
      });
      Promise.all(promises).then(resolve =>{
        this.hitTableList.sort((a,b) => {
          if(a.cost > b.cost){
            return -1;
          }
          if(a.cost < b.cost){
            return 1;
          }
          return 0;
        })
        this.hitDataProvider(new ArrayDataProvider(this.hitTableList));
      })
    });
  }

  private fetchAoeScores(): void{
    fetch('http://fopfpl.in/aoe/api/game_week/scores').
    then(res => res.json())
        .then(res => {        
          let teamMap =  new Map();
          res.forEach(element => {
            element.forEach(teamgw => {
              let detailsRes =  JSON.parse(teamgw.details);
              detailsRes.forEach(teamsgwscore => {
                
                if(!this.aoeLiveScoreMap.has(teamsgwscore.fpl_id))
                  this.aoeLiveScoreMap.set(teamsgwscore.fpl_id, teamsgwscore.score);
              });
            });
          });
        })
  }

  }

   
    

          

  //         var ele = {"team": team, "teamName": teamName, "playersPlayed" : playersPlayed, "playersRemaining" : playersRemaining, "totalPlayers" : totalPlayers, "remainingPlayerData" : remStr};
  //         var chartEle = {"id": team, "group" : "Players Played", "value" : playersPlayed,
  //         "series": teamName};
  //         var chartEle2 = {"id": team, "group" : "Players Remaining", "value" : playersRemaining,
  //         "series": teamName};
  //         this.chartObservableArray.push(chartEle); 
  //         this.chartObservableArray.push(chartEle2);
  //         this.playersPlayedObservableArray.push(ele);
  //         this.playersPlayedObservableArray.sort((a,b) => {
  //           if(a.playersRemaining > b.playersRemaining){
  //             return -1;
  //           }
  //           if(a.playersRemaining < b.playersRemaining){
  //             return 1;
  //           }
  //           return 0;
  //         })
  //         this.vegTallyDataProvider(new ArrayDataProvider(this.vegTallyTableList));
  //         this.playersPlayedObservable(new ArrayDataProvider(this.playersPlayedObservableArray));
  //         this.chartObservable(new ArrayDataProvider(this.chartObservableArray));
  //       })
  // }}


export default DashboardViewModel;
