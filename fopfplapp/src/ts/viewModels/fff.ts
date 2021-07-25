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
import { ojMenuEventMap } from 'ojs/ojmenu';
import 'ojs/ojmenu';
import { ojButtonEventMap } from "ojs/ojbutton";
import { FplMgrHistory, Chip, Current } from "../interfaces/fplmgrhistory";

class FFFViewModel {
  selectedMenuItem: ko.Observable<string> = ko.observable('');
  lmsUrl: string =
    "https://fantasy.premierleague.com/api/leagues-classic/133431/standings/";

  fffTableList: ko.ObservableArray = ko.observableArray([]);
  fffDataProvider: ko.Observable = ko.observable();

  lolList = [{name: 'Vipin Sreekumar', id: 14550}, {name: 'Ahammed Shareef', id: 4996},
  {name: 'Mohammed Afeef', id: 254348},
    {name: 'Jais Joseph', id: 1132287}, {name: 'Hisham Ashraf', id: 1770},
    {name: 'Rohit Dsouza', id: 1160}, {name: 'Sreekuttan S', id: 2138},
    {name: 'J Aravind', id: 7631}, {name: 'Vinay Ashwin', id: 10422},
    {name: 'Appu Sankar', id: 10436}, {name: 'Ashwin Ajith', id: 1038},
    {name: 'Shabeeb CA', id: 1500}, 
    {name: 'Anand Alwan', id: 31806}, {name: 'Mihtun Nair', id: 1284},
    {name: 'Ajith Nath', id: 3209}, {name: 'Renju Varkey', id: 2163287},
    {name: 'Jefin JF Jose', id: 21370}, {name: 'Siddarth V Lakhani', id: 5586},
    {name: 'Vichu Mahadevan', id: 40942}, {name: 'Vijesh Pothera', id: 2887967}] ;

    clList = [{name: 'Jithin Chandran', id: 18717},  {name: 'Udhaif Hudman', id: 583},{name: 'Mithoon Raghavan', id: 471},{name: 'Hemang Patel', id: 2114},
    {name: 'Lijash Iqbal', id: 755125},
    {name: 'Sherin VS', id: 1015}, {name: 'Hari M', id: 103780},
    {name: 'Harikrishnan MS', id: 11631}, {name: 'Gokul Pandala', id: 964668},
    {name: 'Shamnas Rahman', id: 13742}, {name: 'Nitish Potti', id: 599},
    {name: 'Yasar Khan', id: 17952}, 
    {name: 'Ronnie James', id: 4538}, {name: 'Akshaydeep', id: 992121},
    {name: 'Joice Joseph', id: 30104}, {name: 'Vishnu Raj', id: 67577},
    {name: 'Dawn Jose', id: 2320912}, {name: 'Keshav Nair', id: 4509},
     {name: 'Shankar Hari', id: 844010},{name: 'S Adarsh Mahadevan', id: 8386}
     ] ;

    plList = [{name: 'Suneeth GS', id: 18508},{name: 'Rahul Ramesh', id: 21009},
    {name: 'Samjad Mohammad', id: 1820}, {name: 'Visisht VS', id: 54838},
    {name: 'Mudit Goyal', id: 349690},
     {name: 'Aman Arora', id: 1182},{name: 'Pranav Byatnal', id: 160699},
    {name: 'Aneesh Ajayan', id: 5811}, {name: 'Jithesh Pothera', id: 424461},
    {name: 'Albin Antony', id: 431945}, {name: 'Sreenath Jayaraj', id: 692066},
     {name: 'Feroz Rahman', id: 48403},{name: 'Ajith James', id: 19617},
    {name: 'Karthik Vishwanathan', id: 1569}, {name: 'Anoop PK', id: 176438},
    {name: 'Namsheed K S', id: 2397}, {name: 'Fasil Koodathai', id: 177892},
    {name: 'Adarsh Nair', id: 207}, {name: 'Anmole Singh', id: 685171},
     {name: 'Antony Stanley', id: 1306706}
     ] ;

    champList = [ {name: 'Thomas George', id: 4818603},{name: 'Nirmal Tom', id: 2274874},{name: 'Roshan Thomas', id: 1288086},
    {name: 'Adersh MT', id: 1853529},
    {name: 'Karthik Vijayaraghavan', id: 4661522}, {name: 'Afsal Bg', id: 1817599},
    {name: 'Joseph T Daniel', id: 4172394}, {name: 'Sarath V M', id: 5416650},
    {name: 'Vinu Satheesan', id: 68409}, {name: 'Sreejith Menon', id: 613547},
     {name: 'Rahul Rajeev', id: 30810},
    {name: 'Sugeeth GS', id: 224691}, {name: 'Anirudh Bansal', id: 132887},
    {name: 'Vijay', id: 2088294}, {name: 'Safthar', id: 5199},
    {name: 'Swaroop Saju', id: 611345}, {name: 'Karthik G', id: 23702},
    {name: 'Suraj SK', id: 2352879}, {name: 'Alan S Pillai', id: 2062600},
    {name: 'Visakh Padmanbhan', id: 5362247}, {name: 'Vimal Viswanath', id: 512278},
    {name: 'Maanas Gupta', id: 1566}, {name: 'Girish Ravindra', id: 258353},
    {name: 'Raslam Showkath', id: 696363}, 
    {name: 'Ashwin Kumar B', id: 489090}, {name: 'Unnikrishnan PM', id: 36256}] ;


  constructor() {
    const promises = [];
    let promise = null;
    const globalPromise = CommonUtils.fetchFPLPlayers();
    promises.push(globalPromise);
    globalPromise.then((res) => {

       promise=this.fetchLiveFFFQual(this.lolList);
       promise.then((res) => {
        this.selectedMenuItem('lol');
        this.fffTableList.sort((a, b) => {
            if (a.score > b.score) {
              return -1;
            }
            if (a.score < b.score) {
              return 1;
            }
            return 0;
        });
        let i=0;
        this.fffTableList().forEach(ele =>{
          console.log(ele.name+ "," +ele.order);
          i= i+1;
          ele.order = i;
          console.log(ele.name+ "," +ele.order);
        });
        this.fffDataProvider(new ArrayDataProvider(this.fffTableList));
      });
    });
  }

  public menuItemAction = (event: ojMenuEventMap['ojAction']) => {
    this.selectedMenuItem((event.target as HTMLInputElement).value);
    let promise = null;
    if(this.selectedMenuItem() === 'lol'){
        promise = this.fetchLiveFFFQual(this.lolList);
    }
    else if(this.selectedMenuItem() === 'cl'){
        promise = this.fetchLiveFFFQual(this.clList);
    }
    else if(this.selectedMenuItem() === 'pl'){
        promise = this.fetchLiveFFFQual(this.plList);
    }
    else if(this.selectedMenuItem() === 'champ'){
        promise = this.fetchLiveFFFQual(this.champList);
    }
    promise.then((res) => {
        this.fffTableList.sort((a, b) => {
            if (a.score > b.score) {
              return -1;
            }
            if (a.score < b.score) {
              return 1;
            }
            return 0;
        });
        let i=0;
        this.fffTableList().forEach(ele =>{
          console.log(ele.name+ "," +ele.order);
          i= i+1;
          ele.order = i;
          console.log(ele.name+ "," +ele.order);
        });
        this.fffDataProvider(new ArrayDataProvider(this.fffTableList));
      });
  }

  private fetchLiveFFFQual(list) {
      console.log("as "+list);
    return new Promise((accept) => {
      this.fffTableList.removeAll();
      const promises = [];
      const promises2 = [];
      list.forEach((player) => {
          let playerScore = 0;
        let promiseCh = CommonUtils.fetchFplMgrHistory(player.id);
        promises.push(promiseCh);
        promises2.push(promiseCh);
        promiseCh.then((res) => {
            let respHist: FplMgrHistory = <FplMgrHistory>res;
            let gweeks: Current[] = <Current[]>respHist.current;

              gweeks.forEach((gw) => {
                if (
                  gw.event > 26 && gw.event <= 38){
                  playerScore = playerScore + gw.points - gw.event_transfers_cost;
                }
              });
            });
          
          Promise.all(promises).then((resolve) => {
            let promise2 = this.pushLiveEle(playerScore, player.name);
            promises2.push(promise2);
          });
        });
        console.log(this.fffTableList.length);
        Promise.all(promises2).then(resolve => {
          accept(true);
        })
      });
  }

  private pushLiveEle(score: number, name: String) {
    return new Promise(accept => {
      let ele = {
        score: score,
        name: name,
        order: 1
      };
      this.fffTableList.push(ele);
      accept(true);
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

export default FFFViewModel;
