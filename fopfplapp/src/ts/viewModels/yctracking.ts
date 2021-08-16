/*
 * Your about ViewModel code goes here
 */
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

import "ojs/ojtable";
import "ojs/ojchart";
import "ojs/ojlistview";
import "ojs/ojavatar";

class AoeLiveViewModel {
  ycTableList: ko.ObservableArray = ko.observableArray([]);
  ycDataProvider: ko.Observable = ko.observable();

  constructor() {
    if(CommonUtils.curr_gw === 1){
        const promise = CommonUtils.fetchCurrGW();
        promise.then(res => {
            this.loadYcTracking();
        })
    }
    else{
        this.loadYcTracking();
    }
  }

  loadYcTracking(){
        for (let entry of Array.from(CommonUtils.fplYcMap.entries())) {
            let name = entry[0];
            let count = entry[1];
            if(name === 'Fernandes'){
                console.log("Fernandes :: "+count);
            }
            if(count > 2 ){
                let ele = {"name": name, "count": count};
                this.ycTableList.push(ele);
            } 
          }
          this.ycTableList.sort((a,b) => {
            if(a.count < b.count){
              return 1;
            }
            if(a.count > b.count){
              return -1;
            }
            return 0;
          })
          this.ycDataProvider(new ArrayDataProvider(this.ycTableList));
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
