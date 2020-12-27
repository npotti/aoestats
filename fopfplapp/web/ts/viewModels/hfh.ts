import {VegTallyPojo} from '../interfaces/vegtallypojo';
import {FplMgrHistory, Chip, Current} from '../interfaces/fplmgrhistory';
import {AoeTeam} from '../interfaces/aoeteams';
import {Pick, Picks} from '../interfaces/picks';
import {FPLBootStrap, Team} from '../interfaces/bootstrap';
import {FPLTransfers} from '../interfaces/transfers';
import {EOPojo} from '../interfaces/eopojo';
import {CapQuota} from '../interfaces/capquota';
import * as ArrayDataProvider from 'ojs/ojarraydataprovider';
import * as ko from 'knockout';
import "ojs/ojtable";
import "ojs/ojchart";
import PagingDataProviderView = require("ojs/ojpagingdataproviderview");
import { PagingModel } from "ojs/ojpagingmodel";
import { ojButtonEventMap } from 'ojs/ojbutton';

class AboutViewModel {

  public hfhObservableArray: ko.ObservableArray = ko.observableArray([]);
  hfhObservable: ko.Observable = ko.observable();

  constructor() {
    this.fetchHfhScores();
  }

  private fetchHfhScores(): void{
    fetch('http://fopfpl.in/hfh/api/game_week/scores').
    then(res => res.json())
        .then(res => {        
          let teamMap =  new Map();
          res.forEach(element => {
            element.forEach(teamgw => {
              let detailsRes =  JSON.parse(teamgw.details);
              let teamscore = 0;
              detailsRes.forEach(teamsgwscore => {
                teamscore = teamscore+teamsgwscore.score;
              });
              if(teamMap.has(teamgw.team.name)){
                let score = teamMap.get(teamgw.team.name);
                teamMap.set(teamgw.team.name, score+teamscore);
              }
              else{
                teamMap.set(teamgw.team.name, teamscore);
              }
            });
          });
          for (let entry of Array.from(teamMap.entries())) {
            let name = entry[0];
            let count = entry[1];
            let ele = {"team": name, "score" : count};
            this.hfhObservableArray.push(ele);
          }
          this.hfhObservableArray.sort((a,b) => {
            if(a.score > b.score){
              return -1;
            }
            if(a.score < b.score){
              return 1;
            }
            return 0;
          })
          this.hfhObservable(new ArrayDataProvider(this.hfhObservableArray));
        })
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

export default AboutViewModel;