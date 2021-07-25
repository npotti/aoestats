/*
 * Your about ViewModel code goes here
 */
import * as ko from "knockout";
import { ojModule } from "ojs/ojmodule-element";
import CommonUtils from "../utils/commonutils";

import * as ArrayDataProvider from "ojs/ojarraydataprovider";
import { Fixture } from "../interfaces/fixture";
import { Team } from "../interfaces/bootstrap";

import "ojs/ojtable";
import "ojs/ojchart";
import "ojs/ojavatar";

class FixtureViewModel {
  fixturesTableList: ko.ObservableArray = ko.observableArray([]);
  fixturesDataProvider: ko.Observable = ko.observable();

  curr_gw: number;

  fixtureMap: Map<Number, Map<Number, Number>> = new Map<Number, Map<Number, Number>>();
  selNoOfWeeks: ko.Observable<number> = ko.observable(5);
  teamDefMap: Map<Team, Number> = new Map<Team, Number>();
  teamAttMap: Map<Team, Number> = new Map<Team, Number>();

  constructor() {
    const promiseLoad = CommonUtils.fetchCurrGW();
    promiseLoad.then((res) => {
      this.curr_gw = <number>res;
      let urlFinal: string = "https://fantasy.premierleague.com/api/fixtures/";
      fetch(urlFinal)
        .then((res) => res.json())
        .then((res) => {
          const fixtures: Fixture[] = <Fixture[]>res;

            fixtures.forEach(fix => {
                if(fix.event > this.curr_gw){
                    if(this.fixtureMap.get(fix.event)){
                        this.fixtureMap.get(fix.event).set(fix.team_h, fix.team_a);
                    }
                    else{
                        let map : Map<Number, Number> = new Map<Number, Number>();
                        map.set(fix.team_h, fix.team_a);
                        this.fixtureMap.set(fix.event, map);
                    }
                }
            });

          const promise = CommonUtils.fetchFPLPlayers();
          promise.then((res) => {
            CommonUtils.fplTeamsMap.forEach((team) => {

              for(let x=this.curr_gw+1; x<=this.curr_gw+this.selNoOfWeeks() ; x++){
                  let map: Map<Number, Number> = this.fixtureMap.get(x);
                  for (let entry of Array.from(map.entries())) {
                    let home = entry[0];
                    let away = entry[1];
                    if(team.id === home){
                        
                        CommonUtils.fplTeamsMap.get(away).strength_attack_away;
                        CommonUtils.fplTeamsMap.get(away).strength_defence_away;
                    }
                    else if(team.id === away){
                        CommonUtils.fplTeamsMap.get(home).strength_attack_home;
                        CommonUtils.fplTeamsMap.get(home).strength_defence_home;
                    }
                  }
              }  


              // let fplTeamPicUrl: String =
              //   "https://resources.premierleague.com/premierleague/badges/t";

              // let ele = {
              //   team: team.name,
              //   chance0: info0,
              //   chance25: info25,
              //   chance50: info50,
              //   chance75: info75,
              //   teamlogo: fplTeamPicUrl + "" + team.code + ".png",
              // };
              // this.injuriesTableList.push(ele);
            });
            // this.injuriesDataProvider(
            //   new ArrayDataProvider(this.injuriesTableList)
            // );
          });
        });
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

export default FixtureViewModel;
