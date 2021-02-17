/*
 * Your about ViewModel code goes here
 */
import * as ko from "knockout";
import rootViewModel from "../appController";
import * as ModuleElementUtils from "ojs/ojmodule-element-utils";
import { ojModule } from "ojs/ojmodule-element";
import { ojButtonEventMap } from "ojs/ojbutton";
import CommonUtils from "../utils/commonutils";
import { Picks, Pick } from "../interfaces/picks";
import { ElementSummary } from "../interfaces/elementsummary";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";

import { FplMgrHistory, Chip, Current } from "../interfaces/fplmgrhistory";
import { Rivals } from "../interfaces/ordsrivals";
import * as service from "../utils/service";
import { ServiceName } from "../utils/serviceconfig";
import { HttpMethod } from "../utils/serviceutil";

import "ojs/ojtable";
import "ojs/ojchart";
import "ojs/ojlistview";
import "ojs/ojavatar";
import "ojs/ojinputtext";

class RivalsViewModel {
  rivalsfplidList: ko.ObservableArray = ko.observableArray([]);
  rivalsList: ko.ObservableArray = ko.observableArray([]);
  rivalsDataProvider: ko.Observable = ko.observable();
  datasource: any = ko.observableArray();
  public fplid: ko.Observable<Number> = ko.observable(0);
  public name: ko.Observable<string> = ko.observable("");
  public yourid: ko.Observable<Number> = ko.observable(0);

  constructor() {
    this.fplid = ko.observable(0);
    this.yourid = ko.observable(0);
    this.name = ko.observable("");
  }

  public addRival = () => {
    console.log(this);
    console.log(this.fplid());
    if (this.fplid() !== 0 && this.name()) {
      const qp =
        "?mgrid=" +
        this.yourid() +
        "&rivalid=" +
        this.fplid() +
        "&rivalname=" +
        this.name();

        console.log(qp);
      service
        .invokeAPI(ServiceName.CREATE_RIVAL, HttpMethod.POST, {
          queryParams: qp,
          hideSpinner: true,
          data: {}
        })
        .then((res) => {
          console.log("success");
          let ele = { fplid: this.fplid(), name: this.name() };
          this.rivalsfplidList.push(ele);

          this.loadRivalData();
        });
    }
  }

  public loadRivalData = () => {
    console.log(this);
    if (this.yourid()) {
      this.rivalsfplidList.removeAll();
      fetch(
        "https://jz4uwxx2v91zpxt-fopstatsdb.adb.ap-hyderabad-1.oraclecloudapps.com/ords/fopstats/rest-v3/fetchrivalsformgr/" +
          this.yourid()
      )
        .then((res) => res.json())
        .then((res) => {
          const resResult: Rivals = <Rivals>res;
          resResult.items.forEach((item) => {
            let ele = { fplid: item.rival_id, name: item.rival_name };
            this.rivalsfplidList.push(ele);
          });
          this.rivalsList.removeAll();
          const promises = [];
          const globalPromise = CommonUtils.fetchFPLPlayers();
          promises.push(globalPromise);
          globalPromise.then((res) => {
            this.rivalsfplidList().forEach((rivalfplid) => {
              console.log("inside constructor 3 : " + rivalfplid.fplid);
              const promisePick = CommonUtils.fetchPicks(
                rivalfplid.fplid,
                CommonUtils.curr_gw
              );
              promises.push(promisePick);

              promisePick.then((userPicks) => {
                const priorPromises = [];
                const picksConst: Picks = <Picks>userPicks;
                console.log("inside constructor 5" + picksConst.picks.length);
                let playersRem = "";
                let playersBench = "";
                let squad = "";
                let captain = "";
                let vc = "";
                picksConst.picks.forEach((pick) => {
                  let promiseScore = CommonUtils.fetchElementSummary(
                    pick.element
                  );
                  priorPromises.push(promiseScore);
                  promiseScore.then((res) => {
                    let elemSummary: ElementSummary = <ElementSummary>res;
                    elemSummary.history.forEach((gw) => {
                      console.log("gw fixture :: " + gw.round);
                      if (gw.round === CommonUtils.curr_gw) {
                        console.log("Inside gw fixture");
                        squad = squad+","+CommonUtils.fplPlayerMap.get(pick.element).web_name;
                        if(pick.is_captain){
                          captain = CommonUtils.fplPlayerMap.get(pick.element).web_name;
                        }
                        if(pick.is_vice_captain){
                          vc = CommonUtils.fplPlayerMap.get(pick.element).web_name;
                        }
                        if (pick.multiplier > 0 && gw.minutes === 0) {
                          playersRem =
                            playersRem +
                            "," +
                            CommonUtils.fplPlayerMap.get(pick.element).web_name;
                        }
                        if (pick.multiplier === 0) {
                          playersBench =
                            playersBench +
                            "," +
                            CommonUtils.fplPlayerMap.get(pick.element)
                              .web_name +
                            "(" +
                            gw.total_points +
                            ")";
                        }
                      }
                    });
                  });
                });

                Promise.all(priorPromises).then((res) => {
                  const histPromise = CommonUtils.fetchFplMgrHistory(
                    rivalfplid.fplid
                  );
                  promises.push(histPromise);
                  histPromise.then((hist) => {
                    const resResult: FplMgrHistory = <FplMgrHistory>hist;
                    resResult.current.forEach((curr) => {
                      if (curr.event === CommonUtils.curr_gw) {
                        let ele = {
                          fplid: rivalfplid.fplid,
                          name: rivalfplid.name,
                          points: curr.points - curr.event_transfers_cost,
                          playersRem: playersRem,
                          playersBench: playersBench,
                          rank: curr.overall_rank,
                          squad: squad,
                          captain: captain,
                          vc: vc
                        };
                        this.rivalsList.push(ele);
                      }
                    });
                  });
                });
              });
            });
            Promise.all(promises).then((res) => {
              this.rivalsDataProvider(new ArrayDataProvider(this.rivalsList));
            });
          });
        });
    }
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

export default RivalsViewModel;
