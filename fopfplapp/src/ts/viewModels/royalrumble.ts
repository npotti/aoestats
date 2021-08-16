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
import { LEVEL_ERROR } from "@oracle/oraclejet/dist/types/ojlogger";

class RRViewModel {
  rrTableList: ko.ObservableArray = ko.observableArray([]);
  rrDataProvider: ko.Observable = ko.observable();

  rrList = [
    {
      name: "Vikram Vedha",
      players: "Shankar Hariharan & Albin Antony",
      ids: [1410674, 19658],
    },
    {
      name: "Fast and Furious",
      players: "Sagar Chowdhry & Samjad",
      ids: [9640, 6346],
    },
    { name: "Venom", players: "Visisht & Vinu Satheeshan", ids: [104706, 483788] },
    {
      name: "The Krishnans",
      players: "Unnikrishnan  & Hari MS ",
      ids: [25212, 802492],
    },
    {
      name: "Gangs of Sakthikulangara",
      players: "Ajith James & Tony Stanley",
      ids: [63937, 11783],
    },
    {
      name: "Lord of the Ings",
      players: "Aravind Nair & Visakh Padmanabhan",
      ids: [7082, 799088],
    },
    {
      name: "701",
      players: "SVS & Sreejith",
      ids: [798879, 47043],
    },
    {
      name: "Barsha Boys",
      players: "Shamnas Rahman & Muhammed Afeef",
      ids: [115203, 537195],
    },
    {
      name: "Glory Glory ManUnited",
      players: "Vishnu Raj & Sugeeth",
      ids: [4026, 825256],
    },
    {
      name: "Jambanum Thumbanum",
      players: "Jithin Chandran & Rahul Ramesh",
      ids: [1557, 184500],
    },
    {
      name: "Avengers Assemble",
      players: "Anand Alwan & Ahammed Shareef ",
      ids: [4271, 1032],
    },
    {
      name: "Rick and Morty",
      players: "Yasar Khan & Ashwin Ajith ",
      ids: [800020, 3272],
    },
    { name: "Campeones", 
    players: "Mahadevan & Appu Sankar V", ids: [102727, 474] },
    {
      name: "2 Countries",
      players: "Mithoon  & Jayakumar",
      ids: [41891, 8590],
    },
    {
      name: "Lakesiders",
      players: "Vipin Sreekumar  & Rahul R",
      ids: [80727, 19603],
    },
    {
      name: "Tequila gunrisers",
      players: "Aman Arora & Hari M",
      ids: [10662, 22245],
    },
    {
      name: "Manavalan and Dharmendra Returns!",
      players: "Raslam & Namsheed",
      ids: [78384, 26094],
    },
    {
      name: "Onayum Attinkuttiyum",
      players: "Sreekuttan S & Feroz Rahman",
      ids: [807427, 6298],
    },
    {
      name: "Knight & Warrior",
      players: "Karthik G & Vinay Ashwin",
      ids: [24222, 4593],
    },
    {
      name: "Los Guerreros",
      players: "Afsal BG & Thamjid",
      ids: [41841, 45285],
    },
    {
      name: "Lottulodukkum Gulgulmalum",
      players: "Joice & Vimal",
      ids: [78870, 808148],
    },
    {
      name: "The Schadenfreudists",
      players: "Maanas Gupta & Nitish Potti",
      ids: [6196, 1534],
    },
    {
      name: "Aluva and Mathicurry ",
      players: "Sherin & Vijesh",
      ids: [5987, 3636],
    },
    {
      name: "Thirontharam Machambis",
      players: "Aneesh Ajayan & Anoop Nair",
      ids: [30166, 146408],
    },
    {
      name: "Brothers of Destruction",
      players: "Rohit Dsouza & Hisham Ashraf",
      ids: [7520, 911],
    },
    {
      name: "Go Corona Go",
      players: "Vijay Venkatesh & Appu Aravind",
      ids: [824760, 1521514],
    },
    { name: "Kannan Srankum Dashamoolam Damuvum", 
    players: "Karthik Viswanathan & Alan S Pillai", ids: [1670, 825986] },
    {
      name: "2 Countries",
      players: "Mithoon  & Jayakumar",
      ids: [41891, 8590],
    },
    {
      name: "AWENGERS",
      players: "Jithesh Pothera & Adarsh Mahadevan",
      ids: [6197, 10818],
    },
    {
      name: "The Bro code.",
      players: "Udaif & Jefin",
      ids: [8830, 92411],
    },
    {
      name: "Tom and Jerry",
      players: "Adarsh Nair & Shabeeb",
      ids: [68, 16073],
    },
    {
      name: "Jojo Dragon United",
      players: "Sreenath Jayaraj & Anmole Singh",
      ids: [221087, 40881],
    },
    {
      name: "Padfoot & Prongs",
      players: "Mithun Nair & Mudit",
      ids: [3719, 7125],
    }
  ];

  constructor() {
   
    const promises = [];
    let promise = null;
    const globalPromise = CommonUtils.fetchFPLPlayers();
    promises.push(globalPromise);
    globalPromise.then((res) => {
      promise = this.fetchLiveRRQual(this.rrList);
      promise.then((res) => {
        console.log("asas");
        console.log(this.rrTableList.length);
        this.rrTableList.sort((a, b) => {
          if (a.score > b.score) {
            return -1;
          }
          if (a.score < b.score) {
            return 1;
          }
          return 0;
        });
        let i = 0;
        this.rrTableList().forEach((ele) => {
          console.log(ele.name + "," + ele.order);
          i = i + 1;
          ele.order = i;
          console.log(ele.name + "," + ele.order);
        });
        this.rrDataProvider(new ArrayDataProvider(this.rrTableList));
      });
    });
  }

  private fetchLiveRRQual(list) {
    return new Promise((accept) => {
      this.rrTableList.removeAll();
      const promises = [];
      const promises2 = [];
      list.forEach((team) => {
        let teamScore = 0;
        let score1 = 0;
        let score2 = 0;
        let promiseCh = CommonUtils.fetchFplMgrHistory(team.ids[0]);
        let promiseCh2 = CommonUtils.fetchFplMgrHistory(team.ids[1]);
        promises.push(promiseCh);
        promises2.push(promiseCh);
        promises.push(promiseCh2);
        promises2.push(promiseCh2);
        
        promiseCh.then((res) => {
          let respHist: FplMgrHistory = <FplMgrHistory>res;
          let gweeks: Current[] = <Current[]>respHist.current;

          gweeks.forEach((gw) => {
            if (gw.event > 0 && gw.event <= 4) {
              teamScore = teamScore + gw.points - gw.event_transfers_cost;
              score1 = score1 + gw.points - gw.event_transfers_cost;
            }
          });

        });

        promiseCh2.then((res) => {
            let respHist: FplMgrHistory = <FplMgrHistory>res;
            let gweeks: Current[] = <Current[]>respHist.current;

            gweeks.forEach((gw) => {
              if (gw.event > 0 && gw.event <= 4) {
                teamScore = teamScore + gw.points - gw.event_transfers_cost;
                score2 = score2 + gw.points - gw.event_transfers_cost;
              }
            });
        });
        
        Promise.all(promises).then(res => {
          let currUser = 'N';
          if(team.ids[0] === CommonUtils.fplId() || team.ids[1] === CommonUtils.fplId() ){
            currUser = 'Y';
          }
          let playerSplit = team.players.split("&");
            let promise2 = this.pushLiveEle(
                teamScore,
                team.name,
                team.players,
                score1,
                score2,
                playerSplit[0].trim(),
                playerSplit[1].trim(),
                currUser
            );
            promises2.push(promise2);
        })
      });

      Promise.all(promises2).then((resolve) => {
        accept(true);
      });
      
    });
  }

  private pushLiveEle(score: number, name: String, players: string, scoreA: number, scoreB: number, playerA: string, playerB : string, loggedInUser: string) {
    return new Promise((accept) => {
      let ele = {
        score: score,
        name: name,
        players: players,
        order: 1,
        scoreA: scoreA,
        scoreB: scoreB,
        playerA : playerA,
        playerB : playerB,
        currUser : loggedInUser
      };
      this.rrTableList.push(ele);
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

export default RRViewModel;
