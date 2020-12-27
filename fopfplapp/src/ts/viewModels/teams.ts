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

class IncidentsViewModel {

  teamsLovDataProvider: ArrayDataProvider<string, string>;
  selectedTeam: ko.Observable = ko.observable();

  constructor() {
    var teams = [
      { value: '1', label: 'Marathas' },
      { value: '2', label: 'Chozhas' },
      { value: '3', label: 'Nizams' },
      { value: '4', label: 'Mauryas' },
      { value: '5', label: 'Mughals' },
      { value: '6', label: 'Khiljis' },
      { value: '7', label: 'Travancore' },
      { value: '8', label: 'Nagas' },
      { value: '9', label: 'Vijayanagara' },
      { value: '10', label: 'Zamorins' }
    ];
    this.teamsLovDataProvider = new ArrayDataProvider(teams, { keyAttributes: 'value' });
  }

  valueChangedHandler = (event): void=>{
    console.log(event.detail.value);
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

export default IncidentsViewModel;