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
import { FPLTransfers } from "../interfaces/transfers";

import { ElementSummary } from "../interfaces/elementsummary";

import * as ArrayDataProvider from "ojs/ojarraydataprovider";

import "ojs/ojtable";
import "ojs/ojchart";
import PagingDataProviderView = require("ojs/ojpagingdataproviderview");
import { PagingModel } from "ojs/ojpagingmodel";
import { ojMenuEventMap } from "ojs/ojmenu";
import "ojs/ojmenu";
import { ojButtonEventMap } from "ojs/ojbutton";
import { FplMgrHistory, Chip, Current } from "../interfaces/fplmgrhistory";
import { Element } from "../interfaces/bootstrap";
import { Tween } from "jquery";

class TransferViewModel {
  transferTableList: ko.ObservableArray = ko.observableArray([]);
  transferDataProvider: ko.Observable = ko.observable();
  fplId: ko.Observable<Number> = CommonUtils.fplId;
  transfersMap: Map<Number, Map<Element, Element>> = new Map<
    Number,
    Map<Element, Element>
  >();
  hitCostMap: Map<Number, Number> = new Map<Number, Number>();
  totalGain: ko.Observable<Number> = ko.observable(0);
  worstTransfer: ko.Observable<String> = ko.observable('');
  bestTransfer: ko.Observable<String> = ko.observable('');
  bestTransferGain: ko.Observable<Number> = ko.observable(0);
  worstTransferGain: ko.Observable<Number> = ko.observable(0);

  constructor() {
    if (CommonUtils.curr_gw === 1) {
      CommonUtils.fetchCurrGW();
    }
  }

  private fetchTransfers(fpl_id: number) {
    return new Promise((resolve) => {
      let urlFinal: string =
        "https://fantasy.premierleague.com/api/entry/" + fpl_id + "/transfers/";
      fetch(urlFinal)
        .then((res) => res.json())
        .then((res) => {
          const resResult: FPLTransfers[] = <FPLTransfers[]>res;
          resResult.forEach((ele) => {
            if (this.transfersMap.has(ele.event)) {
              let map = this.transfersMap.get(ele.event);
              map.set(
                CommonUtils.fplPlayerMap.get(ele.element_in),
                CommonUtils.fplPlayerMap.get(ele.element_out)
              );
            } else {
              let map = new Map<Element, Element>();
              map.set(
                CommonUtils.fplPlayerMap.get(ele.element_in),
                CommonUtils.fplPlayerMap.get(ele.element_out)
              );
              this.transfersMap.set(ele.event, map);
            }
          });
          resolve(this.transfersMap);
        });
    });
  }

  private calculateTransfersGainLoss(fpl_id: number) {
    return new Promise((resolve) => {
      let promises = [];
      for (let i = 0; i < CommonUtils.curr_gw; i++) {
        if(this.transfersMap.get(i)){
        for (let entry of Array.from(this.transfersMap.get(i).entries())) {
          let transferIn = entry[0];
          let transferOut = entry[1];
          let transInPoints = 0;
          let transOutPoints = 0;
          let transInPromise = CommonUtils.fetchElementSummary(transferIn.id);
          let transOutPromise = CommonUtils.fetchElementSummary(transferOut.id);
          let promiseCh = CommonUtils.fetchFplMgrHistory(fpl_id);
          promiseCh.then((res) => {
            let respHist: FplMgrHistory = <FplMgrHistory>res;
            let current: Current[] = <Current[]>respHist.current;
            if (current.length > 0) {
              current.forEach((week) => {
                let numberOfTrans = week.event_transfers;
                let transCost = week.event_transfers_cost;
                if (transCost === 0) {
                  if(numberOfTrans === 0){
                    this.hitCostMap.set(week.event, -1);
                  }
                  else{
                    this.hitCostMap.set(week.event, 0);
                  }
                }
                if (transCost > 0) {
                  this.hitCostMap.set(week.event, transCost / numberOfTrans);
                }
              });
              promises.push(transOutPromise);
              promises.push(transInPromise);
              transInPromise.then((res) => {
                let elemSummary: ElementSummary = <ElementSummary>res;
                elemSummary.history.forEach((gw) => {
                  if (gw.round === i) {
                    transInPoints = gw.total_points;
                  }
                });
                transOutPromise.then((res) => {
                  let elemSummary: ElementSummary = <ElementSummary>res;
                  elemSummary.history.forEach((gw) => {
                    if (gw.round === i) {
                      transOutPoints = gw.total_points;
                    }
                  });
                  let effectiveGain = transInPoints-transOutPoints-(this.hitCostMap.get(i).valueOf());
                  this.totalGain(this.totalGain().valueOf() + effectiveGain);
                  if(effectiveGain > this.bestTransferGain()){
                    this.bestTransfer(CommonUtils.fplPlayerMap.get(entry[0].id)
                    .web_name + " ahead of GW " + i);
                    this.bestTransferGain(effectiveGain);
                  }
                  if(effectiveGain < this.worstTransferGain()){
                    this.worstTransfer(CommonUtils.fplPlayerMap.get(entry[1].id)
                    .web_name + " ahead of GW " + i);
                    this.worstTransferGain(effectiveGain);
                  }
                  let ele = {
                    gw: i,
                    transferIn: CommonUtils.fplPlayerMap.get(entry[0].id)
                      .web_name,
                    transferOut: CommonUtils.fplPlayerMap.get(entry[1].id)
                      .web_name,
                    transInPts: transInPoints,
                    transOutPts: transOutPoints,
                    cost: this.hitCostMap.get(i),
                    effectiveGain: effectiveGain
                  };
                  if(this.hitCostMap.get(i) !== -1){
                    this.transferTableList.push(ele);
                  }
                });
              });
            }
          });
        }
      }
      }
      Promise.all(promises).then((res) => {
        resolve(true);
      });
    });
  }

  onLoadTransferGains = (event: ojButtonEventMap['ojAction']) => {
    if (this.fplId() !== 0) {
      this.transferTableList.removeAll();
      const promise = this.fetchTransfers(this.fplId().valueOf());
      promise.then((res) => {
        const promise2 = this.calculateTransfersGainLoss(
          this.fplId().valueOf()
        );
        promise2.then((res) => {
          this.transferTableList.sort((a, b) => {
            if (a.gw < b.gw) {
              return -1;
            }
            if (a.gw > b.gw) {
              return 1;
            }
            return 0;
          });
          this.totalGain(0);
          let gain = 0;
          this.transferTableList().forEach(rw => {
            console.log("asa" +rw.effectiveGain);
            gain = gain + rw.effectiveGain;
          });
          console.log("asa" +gain);
          this.totalGain(gain);
          this.transferDataProvider(
            new ArrayDataProvider(this.transferTableList)
          );
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

export default TransferViewModel;
