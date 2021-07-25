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
import { LiveScores } from "../interfaces/livescores";

import "ojs/ojtable";
import "ojs/ojchart";
import "ojs/ojlistview";
import "ojs/ojavatar";

class AoeLiveViewModel {
  liveTableList: ko.ObservableArray = ko.observableArray([]);
  liveDataProvider: ko.Observable = ko.observable();

  koTableList: ko.ObservableArray = ko.observableArray([]);
  koDataProvider: ko.Observable = ko.observable();

  gwScoreMap : Map<Number, Map<Number, Number>> = new Map<Number, Map<Number, Number>>();
  
  cupListMap: Map<Number, Map<Number, Number>> = new Map<Number, Map<Number, Number>>();

  curr_gw =1;

  liveScores : LiveScores[] = [];

  livescoreMap : Map<Number, Number> = new Map<Number, Number>();;

  constructor() {

    const promises = [];

    const promise = CommonUtils.fetchCurrGW();
    promise.then(res => {
      this.curr_gw = <number>res;
    })

    promises.push(promise);

    const promiseLive = CommonUtils.fetchPlayerLiveScores();
    promiseLive.then(res => {
      this.liveScores = <LiveScores[]>res;
      this.liveScores.forEach(player => {
        this.livescoreMap.set(player.fpl_id, player.live_score);
      })
    })

    promises.push(promiseLive);


    Promise.all(promises).then((res) => {
      const promise2 = this.fetchLiveCupQual();
      promise2.then((res) => {
        const promise3 = this.populateLiveCupQual();
        promise3.then((res) => {
          this.populateKoCupQual();
        });
      });
    });
  }

  private populateKoCupQual(){
    return new Promise((accept) => {
      let s1 = 0;
      let s2 = 0;
      let s3 = 0;
      let s4 = 0;
      let s5 = 0;
      let s6 = 0;
      let s7 = 0;
      let s8 = 0;

      this.liveTableList().forEach(row => {
        if(row.order === 1){
          s1 = row.id
        }
        else if(row.order === 2){
          s2 = row.id
        }
        else if(row.order === 3){
          s3 = row.id
        }
        else if(row.order === 4){
          s4 = row.id
        }
        else if(row.order === 5){
          s5 = row.id
        }
        else if(row.order === 6){
          s6 = row.id
        }
        else if(row.order === 7){
          s7 = row.id
        }
        else if(row.order === 8){
          s8 = row.id
        }
      })
      


      let ele1 = {teamA: CommonUtils.fetchTeamName(s1), teamAscore: (this.gwScoreMap.get(25).get(s1).valueOf()+this.gwScoreMap.get(26).get(s1).valueOf()), teamB: CommonUtils.fetchTeamName(s8), teamBscore: (this.gwScoreMap.get(25).get(s8).valueOf()+this.gwScoreMap.get(26).get(s8).valueOf()), round: 'UBR1', teamAid: s1, teamBid: s8}

      let ele2 = {teamA: CommonUtils.fetchTeamName(s2), teamAscore: (this.gwScoreMap.get(25).get(s2).valueOf()+this.gwScoreMap.get(26).get(s2).valueOf()), teamB: CommonUtils.fetchTeamName(s7), teamBscore: (this.gwScoreMap.get(25).get(s7).valueOf()+this.gwScoreMap.get(26).get(s7).valueOf()), round: 'UBR1', teamAid: s2, teamBid: s7}

      let ele3 = {teamA: CommonUtils.fetchTeamName(s3), teamAscore: (this.gwScoreMap.get(25).get(s3).valueOf()+this.gwScoreMap.get(26).get(s3).valueOf()), teamB: CommonUtils.fetchTeamName(s6), teamBscore: (this.gwScoreMap.get(25).get(s6).valueOf()+this.gwScoreMap.get(26).get(s6).valueOf()), round: 'UBR1', teamAid: s3, teamBid: s6}

      let ele4 = {teamA: CommonUtils.fetchTeamName(s4), teamAscore: (this.gwScoreMap.get(25).get(s4).valueOf()+this.gwScoreMap.get(26).get(s4).valueOf()), teamB: CommonUtils.fetchTeamName(s5), teamBscore: (this.gwScoreMap.get(25).get(s5).valueOf()+this.gwScoreMap.get(26).get(s5).valueOf()), round: 'UBR1', teamAid: s4, teamBid: s5}


      let s9 = 0;
      let s10 = 0;
      let s11 = 0;
      let s12 = 0;

      let s13 = 0;
      let s14 = 0;
      let s15 = 0;
      let s16 = 0;

      if(ele1.teamAscore < ele1.teamBscore){
        s9 = ele1.teamAid
        s13 = ele1.teamBid;
      }
      else{
        s9 = ele1.teamBid
        s13 = ele1.teamAid;
      }

      if(ele2.teamAscore < ele2.teamBscore){
        s10 = ele2.teamAid
        s14 = ele2.teamBid;
      }
      else{
        s10 = ele2.teamBid
        s14 = ele2.teamAid;
      }

      if(ele3.teamAscore < ele3.teamBscore){
        s11 = ele3.teamAid;
        s15 = ele3.teamBid;
      }
      else{
        s11 = ele3.teamBid
        s15 = ele3.teamAid;
      }

      if(ele4.teamAscore < ele4.teamBscore){
        s12 = ele4.teamAid
        s16 = ele4.teamBid;
      }
      else{
        s12 = ele4.teamBid
        s16 = ele4.teamAid;
      }

      let ele7= {teamA: CommonUtils.fetchTeamName(s9), teamAscore: (this.gwScoreMap.get(27).get(s9).valueOf()+this.gwScoreMap.get(28).get(s9).valueOf()), teamB: CommonUtils.fetchTeamName(s10), teamBscore: (this.gwScoreMap.get(27).get(s10).valueOf()+this.gwScoreMap.get(28).get(s10).valueOf()), round: 'LBR1', teamAid: s9, teamBid: s10}

      let ele8 = {teamA: CommonUtils.fetchTeamName(s11), teamAscore: (this.gwScoreMap.get(27).get(s11).valueOf()+this.gwScoreMap.get(28).get(s11).valueOf()), teamB: CommonUtils.fetchTeamName(s12), teamBscore: (this.gwScoreMap.get(27).get(s12).valueOf()+this.gwScoreMap.get(28).get(s12).valueOf()), round: 'LBR1', teamAid: s11, teamBid: s12}

      let ele5 = {teamA: CommonUtils.fetchTeamName(s13), teamAscore: (this.gwScoreMap.get(27).get(s13).valueOf()+this.gwScoreMap.get(28).get(s13).valueOf()), teamB: CommonUtils.fetchTeamName(s14), teamBscore: (this.gwScoreMap.get(27).get(s14).valueOf()+this.gwScoreMap.get(28).get(s14).valueOf()), round: 'UBR2', teamAid: s13, teamBid: s14}

      let ele6 = {teamA: CommonUtils.fetchTeamName(s15), teamAscore: (this.gwScoreMap.get(27).get(s15).valueOf()+this.gwScoreMap.get(28).get(s15).valueOf()), teamB: CommonUtils.fetchTeamName(s16), teamBscore: (this.gwScoreMap.get(27).get(s16).valueOf()+this.gwScoreMap.get(28).get(s16).valueOf()), round: 'UBR2', teamAid: s15, teamBid: s16}


      let s17 = 0;
      let s18 = 0;
      let s19 = 0;
      let s20 = 0;
      let s21 = 0;
      let s22 = 0;

      if(ele5.teamAscore < ele5.teamBscore){
        s17 = ele5.teamAid
        s21 = ele5.teamBid;
      }
      else{
        s17 = ele5.teamBid
        s21 = ele5.teamAid;
      }

      if(ele7.teamAscore > ele7.teamBscore){
        s18 = ele7.teamAid
      }
      else{
        s18 = ele7.teamBid
      }

      if(ele6.teamAscore < ele6.teamBscore){
        s19 = ele6.teamAid
        s22 = ele6.teamBid;
      }
      else{
        s19 = ele6.teamBid
        s22 = ele6.teamAid;
      }

      if(ele8.teamAscore > ele8.teamBscore){
        s20 = ele8.teamAid
      }
      else{
        s20 = ele8.teamBid
      }

      let ele9 = {teamA: CommonUtils.fetchTeamName(s17), teamAscore: (this.gwScoreMap.get(29).get(s17).valueOf()+this.gwScoreMap.get(30).get(s17).valueOf()), teamB: CommonUtils.fetchTeamName(s18), teamBscore: (this.gwScoreMap.get(29).get(s18).valueOf()+this.gwScoreMap.get(30).get(s18).valueOf()), round: 'LBR2', teamAid: s17, teamBid: s18}

      let ele10 = {teamA: CommonUtils.fetchTeamName(s19), teamAscore: (this.gwScoreMap.get(29).get(s19).valueOf()+this.gwScoreMap.get(30).get(s19).valueOf()), teamB: CommonUtils.fetchTeamName(s20), teamBscore: (this.gwScoreMap.get(29).get(s20).valueOf()+this.gwScoreMap.get(30).get(s20).valueOf()), round: 'LBR2', teamAid: s19, teamBid: s20}

      let ele11 = {teamA: CommonUtils.fetchTeamName(s21), teamAscore: (this.gwScoreMap.get(31).get(s21).valueOf()+this.gwScoreMap.get(32).get(s21).valueOf()), teamB: CommonUtils.fetchTeamName(s22), teamBscore: (this.gwScoreMap.get(31).get(s22).valueOf()+this.gwScoreMap.get(32).get(s22).valueOf()), round: 'UBF', teamAid: s21, teamBid: s22}

      let s23 = 0;
      let s24 = 0;

      if(ele9.teamAscore > ele9.teamBscore){
        s23 = ele9.teamAid
      }
      else{
        s23 = ele9.teamBid
      }

      if(ele10.teamAscore > ele10.teamBscore){
        s24 = ele10.teamAid
      }
      else{
        s24 = ele10.teamBid
      }

      let ele12 = {teamA: CommonUtils.fetchTeamName(s23), teamAscore: (this.gwScoreMap.get(31).get(s23).valueOf()+this.gwScoreMap.get(32).get(s23).valueOf()), teamB: CommonUtils.fetchTeamName(s24), teamBscore: (this.gwScoreMap.get(31).get(s24).valueOf()+this.gwScoreMap.get(32).get(s24).valueOf()), round: 'LBR3', teamAid: s23, teamBid: s24}

      let s25 = 0;
      let s26 = 0;
      let s27 = 0;

      if(ele11.teamAscore < ele11.teamBscore){
        s25 = ele11.teamAid
        s27 = ele11.teamBid;
      }
      else{
        s25 = ele11.teamBid
        s27 = ele11.teamAid;
      }

      if(ele12.teamAscore > ele12.teamBscore){
        s26 = ele12.teamAid
      }
      else{
        s26 = ele12.teamBid
      }

      let ele13 = {teamA: CommonUtils.fetchTeamName(s25), teamAscore: (this.gwScoreMap.get(33).get(s25).valueOf()+this.gwScoreMap.get(34).get(s25).valueOf()), teamB: CommonUtils.fetchTeamName(s26), teamBscore: (this.gwScoreMap.get(33).get(s26).valueOf()+this.gwScoreMap.get(34).get(s26).valueOf()), round: 'LBF', teamAid: s25, teamBid: s26}

      let s28 = 0;

      if(ele13.teamAscore > ele13.teamBscore){
        s28 = ele13.teamAid
      }
      else{
        s28 = ele13.teamBid
      }

      let ele14 = {teamA: CommonUtils.fetchTeamName(s27), teamAscore: (this.gwScoreMap.get(35).get(s27).valueOf()+this.gwScoreMap.get(36).get(s27).valueOf()), teamB: CommonUtils.fetchTeamName(s28), teamBscore: (this.gwScoreMap.get(35).get(s28).valueOf()+this.gwScoreMap.get(36).get(s28).valueOf()), round: 'GF', teamAid: s27, teamBid: s28}

      this.koTableList.push(ele1);
      this.koTableList.push(ele2);
      this.koTableList.push(ele3);
      this.koTableList.push(ele4);
      this.koTableList.push(ele5);
      this.koTableList.push(ele6);
      this.koTableList.push(ele7);
      this.koTableList.push(ele8);
      this.koTableList.push(ele9);
      this.koTableList.push(ele10);
      this.koTableList.push(ele11);
      this.koTableList.push(ele12);
      this.koTableList.push(ele13);
      this.koTableList.push(ele14);


    
    this.koDataProvider(new ArrayDataProvider(this.koTableList));
    accept(true);
    })
  }

  private populateLiveCupQual(){
    return new Promise((accept) => {
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
      i= i+1;
      ele.order = i;
    });
    this.liveDataProvider(new ArrayDataProvider(this.liveTableList));
    accept(true);
    })
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
          let liveTeamScore = 0;
          let teamScore = 0;
          let teamScore25 = 0;
          let teamScore26 = 0;
          let teamScore27 = 0;
          let teamScore28 = 0;
          let teamScore29 = 0;
          let teamScore30 = 0;
          let teamScore31 = 0;
          let teamScore32 = 0;
          let teamScore33 = 0;
          let teamScore34 = 0;
          let teamScore35 = 0;
          let teamScore36 = 0;
          team.players.forEach((player) => {
            let promiseCh = CommonUtils.fetchFplMgrHistory(player.fpl_id);
            promises.push(promiseCh);
            promises2.push(promiseCh);
            promiseCh.then((res) => {
              let respHist: FplMgrHistory = <FplMgrHistory>res;
              let gweeks: Current[] = <Current[]>respHist.current;

              gweeks.forEach((gw) => {

                if(gw.event === this.curr_gw){
                  liveTeamScore = liveTeamScore + this.livescoreMap.get(player.fpl_id).valueOf();
                }

                if (
                  gw.event === 21 ||
                  gw.event === 22 ||
                  gw.event === 23 ||
                  gw.event === 24
                ) {
                  teamScore = teamScore + gw.points - gw.event_transfers_cost;
                }
                else if(gw.event === 25){
                  teamScore25 = teamScore25 + gw.points -gw.event_transfers_cost
                }
                else if(gw.event === 26){
                  teamScore26 = teamScore26 + gw.points -gw.event_transfers_cost
                }
                else if(gw.event === 27){
                  teamScore27 = teamScore27 + gw.points -gw.event_transfers_cost
                }
                else if(gw.event === 28){
                  teamScore28 = teamScore28 + gw.points -gw.event_transfers_cost
                }
                else if(gw.event === 29){
                  teamScore29 = teamScore29 + gw.points -gw.event_transfers_cost
                }
                else if(gw.event === 30){
                  teamScore30 = teamScore30 + gw.points -gw.event_transfers_cost
                }
                else if(gw.event === 31){
                  teamScore31 = teamScore31 + gw.points -gw.event_transfers_cost
                }
                else if(gw.event === 32){
                  teamScore32 = teamScore32 + gw.points -gw.event_transfers_cost
                }
                else if(gw.event === 33){
                  teamScore33 = teamScore33 + gw.points -gw.event_transfers_cost
                }
                else if(gw.event === 34){
                  teamScore34 = teamScore34 + gw.points -gw.event_transfers_cost
                }
                else if(gw.event === 35){
                  teamScore35 = teamScore35 + gw.points -gw.event_transfers_cost
                }
                else if(gw.event === 36){
                  teamScore36 = teamScore36 + gw.points -gw.event_transfers_cost
                }
              });
            });
          });
          
          Promise.all(promises).then((resolve) => {
          
            let promise2 = this.pushLiveEle(team.id, teamScore);
            promises2.push(promise2);
            if(this.gwScoreMap.get(25)){
              this.gwScoreMap.get(25).set(team.id, teamScore25);
            }
            else{
              let gwMap: Map<Number, Number> = new Map<Number, Number>();
              gwMap.set(team.id, teamScore25);
              this.gwScoreMap.set(25, gwMap);
            }

            if(this.gwScoreMap.get(26)){
              this.gwScoreMap.get(26).set(team.id, teamScore26);
            }
            else{
              let gwMap: Map<Number, Number> = new Map<Number, Number>();
              gwMap.set(team.id, teamScore26);
              this.gwScoreMap.set(26, gwMap);
            }

            if(this.gwScoreMap.get(27)){
              this.gwScoreMap.get(27).set(team.id, teamScore27);
            }
            else{
              let gwMap: Map<Number, Number> = new Map<Number, Number>();
              gwMap.set(team.id, teamScore27);
              this.gwScoreMap.set(27, gwMap);
            }

            if(this.gwScoreMap.get(28)){
              this.gwScoreMap.get(28).set(team.id, teamScore28);
            }
            else{
              let gwMap: Map<Number, Number> = new Map<Number, Number>();
              gwMap.set(team.id, teamScore28);
              this.gwScoreMap.set(28, gwMap);
            }

            if(this.gwScoreMap.get(29)){
              this.gwScoreMap.get(29).set(team.id, teamScore29);
            }
            else{
              let gwMap: Map<Number, Number> = new Map<Number, Number>();
              gwMap.set(team.id, teamScore29);
              this.gwScoreMap.set(29, gwMap);
            }

            if(this.gwScoreMap.get(30)){
              this.gwScoreMap.get(30).set(team.id, teamScore30);
            }
            else{
              let gwMap: Map<Number, Number> = new Map<Number, Number>();
              gwMap.set(team.id, teamScore30);
              this.gwScoreMap.set(30, gwMap);
            }

            if(this.gwScoreMap.get(31)){
              this.gwScoreMap.get(31).set(team.id, teamScore31);
            }
            else{
              let gwMap: Map<Number, Number> = new Map<Number, Number>();
              gwMap.set(team.id, teamScore31);
              this.gwScoreMap.set(31, gwMap);
            }

            if(this.gwScoreMap.get(32)){
              this.gwScoreMap.get(32).set(team.id, teamScore32);
            }
            else{
              let gwMap: Map<Number, Number> = new Map<Number, Number>();
              gwMap.set(team.id, teamScore32);
              this.gwScoreMap.set(32, gwMap);
            }

            if(this.gwScoreMap.get(33)){
              this.gwScoreMap.get(33).set(team.id, teamScore33);
            }
            else{
              let gwMap: Map<Number, Number> = new Map<Number, Number>();
              gwMap.set(team.id, teamScore33);
              this.gwScoreMap.set(33, gwMap);
            }

            if(this.gwScoreMap.get(34)){
              this.gwScoreMap.get(34).set(team.id, teamScore34);
            }
            else{
              let gwMap: Map<Number, Number> = new Map<Number, Number>();
              gwMap.set(team.id, teamScore34);
              this.gwScoreMap.set(34, gwMap);
            }

            if(this.gwScoreMap.get(35)){
              this.gwScoreMap.get(35).set(team.id, teamScore35);
            }
            else{
              let gwMap: Map<Number, Number> = new Map<Number, Number>();
              gwMap.set(team.id, teamScore35);
              this.gwScoreMap.set(35, gwMap);
            }

            if(this.gwScoreMap.get(36)){
              this.gwScoreMap.get(36).set(team.id, teamScore36);
            }
            else{
              let gwMap: Map<Number, Number> = new Map<Number, Number>();
              gwMap.set(team.id, teamScore36);
              this.gwScoreMap.set(36, gwMap);
            }

            if(this.gwScoreMap.get(this.curr_gw)){
              this.gwScoreMap.get(this.curr_gw).set(team.id, liveTeamScore);
            }
            else{
              let gwMap: Map<Number, Number> = new Map<Number, Number>();
              gwMap.set(team.id, liveTeamScore);
              this.gwScoreMap.set(this.curr_gw, gwMap);
            }
            
          });
        });
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
        order: 1,
        id: id
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
