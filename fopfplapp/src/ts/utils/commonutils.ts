import {AoeTeam} from '../interfaces/aoeteams';
import {FplMgrHistory, Chip, Current} from '../interfaces/fplmgrhistory';
import {FPLBootStrap, Team, Element} from '../interfaces/bootstrap';
import * as ko from "knockout";
import { Picks } from "../interfaces/picks";
import { ElementSummary } from "../interfaces/elementsummary";
import { LiveScores } from "../interfaces/livescores";

class CommonUtils{

  aoeTeamsUrl: string = 'https://fopfpl.in/tes/api/teams';
  livescoresUrl: string = 'https://fopfpl.in/tes/api/player_live_scores';
  aoeTeams: AoeTeam[] = [];
  fplBaseUrl: string = 'https://fantasy.premierleague.com/api/';
  public fplPlayerMap = new Map<Number, Element>();
  public fplTeamsMap = new Map<Number, Team>();
  curr_gw: number = 1;
  finished: boolean = false;
  public fplId: ko.Observable<Number> = ko.observable(0);
  fplYcMap = new Map<String, Number>();
  public userPicksMap = new Map<Number, Picks>();

  public name: ko.Observable<string> = ko.observable("");
  public team: ko.Observable<string> = ko.observable("");
  public isFFFVisible: ko.Observable<string> = ko.observable("Y");
  public isRRVisible: ko.Observable<string> = ko.observable("Y");
  public isFOPVisible: ko.Observable<string> = ko.observable("Y");
  public isCupVisible: ko.Observable<string> = ko.observable("Y");
  public isPodcastVisible: ko.Observable<string> = ko.observable("Y");
  public isLMSVisible: ko.Observable<string> = ko.observable("Y");
  public isYCVisible: ko.Observable<string> = ko.observable("Y");
  public isSetpieceVisible: ko.Observable<string> = ko.observable("Y");
  public isCapPicksVisible: ko.Observable<string> = ko.observable("Y");
  public isTransferVisible: ko.Observable<string> = ko.observable("Y");
  public isStatsVisible: ko.Observable<string> = ko.observable("Y");
  public isTStatsVisible: ko.Observable<string> = ko.observable("Y");
  public isPStatsVisible: ko.Observable<string> = ko.observable("Y");
  public isInjuriesVisible: ko.Observable<string> = ko.observable("Y");


  public fetchPicks(fpl_id: Number, gw: Number){
    return new Promise((resolve) =>{
      let urlFinal: string = 'https://fantasy.premierleague.com/api/entry/'+fpl_id+'/event/'+gw+"/picks/";
      fetch(urlFinal).then(res => res.json()).
        then(res => {
          const picksConst: Picks = <Picks>res;
          resolve(picksConst);
        });
    });
  }

  public fetchUserPicks(fpl_id: Number){
    return new Promise((resolve) => {
      const promises = [];
      let i=0;
      for(i=0; i<=this.curr_gw; i++){
        console.log("inside user picks "+i+ " : "+this.curr_gw);
        const promise = this.fetchPicks(fpl_id, i);
        promises.push(promise);
        promise.then(res => {
          const picksConst: Picks = <Picks>res;
          console.log("set user picks "+picksConst.entry_history.event);
          this.userPicksMap.set(picksConst.entry_history.event, picksConst);
        })
      }
      Promise.all(promises).then(res => {
        resolve(true);
      })
    })
  }

  public fetchElementSummary(player_id: Number){
    let fpl_elem_sum_url = 'https://fantasy.premierleague.com/api/element-summary/'+player_id+"/";
    return new Promise((resolve) => {
      fetch(fpl_elem_sum_url).then(res => res.json()).
      then(res => {
        const ele: ElementSummary = <ElementSummary>res;
        resolve(ele);
      });
    })
  }

  fetchFplMgrHistory(mgrId: number){
    return new Promise((resolve) => {
      let urlFinal: string = this.fplBaseUrl + "entry/" +mgrId+ "/history/";
      fetch(urlFinal).
      then(res => res.json())
          .then(res => {
            const resResult: FplMgrHistory = <FplMgrHistory>res;
            resolve(res);
          })
      });
  }

  fetchAoeTeams(){
    return new Promise((resolve) => {
      let urlFinal: string = this.aoeTeamsUrl;
      fetch(urlFinal).
      then(res => res.json())
          .then(res => {
            const resResult: AoeTeam[] = <AoeTeam[]>res;
            this.aoeTeams = resResult;  
            resolve((this.aoeTeams));
          })
    })
  }

  
  fetchPlayerLiveScores(){
    return new Promise((resolve) => {
      let urlFinal: string = this.livescoresUrl;
      fetch(urlFinal).
      then(res => res.json())
          .then(res => {
            const resResult: LiveScores[] = <LiveScores[]>res;
            resolve((resResult));
          })
    })
  }

    fetchTeamName(team: number): string{
        let teamName : string = "";
        switch(team){
          case 1: { 
            teamName = "Peaky Blinders";
            break;
          }
          case 2: {
            teamName = "Reservoir Dogs";
            break;
          }
          case 3: {
            teamName = "Brooklyn 6-6";
            break;
          }
          case 4: {
            teamName = "Dunder Mifflin";
            break;
          }
          case 5: {
            teamName = "Sons of Anarchy";
            break;
          }
          case 6: {
            teamName = "Watchmen";
            break;
          }
          case 7: {
            teamName = "The Boys";
            break;
          }
          case 8: {
            teamName = "True Detectives";
            break;
          }
          case 9: {
            teamName = "F.R.I.E.N.D.S";
            break;
          }
          case 10: {
            teamName = "Vikings";
            break;
          }
        }
        return teamName;
      }

      fetchTeamId(team: string): number{
        let teamId : number = 0;
        switch(team){
          case "Peaky Blinders": { 
            teamId = 1;
            break;
          }
          case "Reservoir Dogs": {
            teamId = 2;
            break;
          }
          case "Brooklyn 6-6": {
            teamId = 3;
            break;
          }
          case "Dunder Mifflin": {
            teamId = 4;
            break;
          }
          case "Sons of Anarchy": {
            teamId = 5;
            break;
          }
          case "Watchmen": {
            teamId = 6;
            break;
          }
          case "The Boys": {
            teamId = 7;
            break;
          }
          case "True Detectives": {
            teamId = 8;
            break;
          }
          case "F.R.I.E.N.D.S": {
            teamId = 9;
            break;
          }
          case "Vikings": {
            teamId = 10;
            break;
          }
        }
        return teamId;
      }

      roundToTwo(num) {    
        return Math.round((num + Number.EPSILON) * 100) / 100;
      }

      fetchFPLPlayers(){
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
                    this.fplYcMap.set(element.first_name+" "+element.second_name, element.yellow_cards);
                  });
                }
                if(resResult.events){
                  resResult.events.forEach(event =>{
                    if(event.is_current){
                      this.curr_gw = event.id;
                      this.finished = event.finished;
                    }
                  });
                }
                resolve(true);
              })
          })
      }

      fetchCurrGW(){
        return new Promise((resolve) => {
          let gw = 1;
          if(this.curr_gw !== 1){
            gw = this.curr_gw;
            resolve(gw);
          }
          else{
            this.fetchFPLPlayers().then(res =>{
                gw =this.curr_gw;
                resolve(gw);
            })
          }
        });
      }
}

export default new CommonUtils();