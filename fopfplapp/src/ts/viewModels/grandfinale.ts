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
import { Bonus } from "../interfaces/bonus";
import "ojs/ojtable";
import "ojs/ojchart";
import "ojs/ojlistview";
import "ojs/ojavatar";
import { whenDocumentReady } from "ojs/ojbootstrap";
import "ojs/ojknockout";
import "ojs/ojfilmstrip";
import "ojs/ojradioset";
import "ojs/ojlabel";

interface TeamLocal {
  Name: string;
  id: number;
  Team: string;
  gw35: ko.Observable<number>;
  gw36: ko.Observable<number>;
  total: ko.Observable<number>;
}

class GrandFinaleViewModel {
  bonusUrl: string = "https://fopfpl.in/tes/api/players_remaining/";
  curr_gw = 1;
  chozhasScore = ko.observable(0);
  vijayangaraScore = ko.observable(0);
  cupRemPlyTableList: ko.ObservableArray = ko.observableArray([]);
  cupRemPlyDataProvider: ko.Observable = ko.observable();
  cupTeamRemPlyMap: Map<String, Map<String, Number>> = new Map<
    String,
    Map<String, Number>
  >();

  chozhasRemPlyMap: ko.Observable<Map<String, Number>> = ko.observable(null);
 
  vijayangaraRemPlyMap: ko.Observable<Map<String, Number>> = ko.observable(null);
  chozhasDiffRemPlyMap: Map<String, Number> = new Map<String, Number>();
  vijayangaraDiffRemPlyMap: Map<String, Number> = new Map<String, Number>();

  chozhasDiffs = ko.observable("");
  vijayanagaraDiffs = ko.observable("");

  liveScores: LiveScores[] = [];
  chozhasMap: TeamLocal[] = [
    {
      Name: "Anand Alwan",
      id: 31806,
      Team: "Get Beeked",
      gw35: ko.observable(0),
      gw36: ko.observable(0),
      total: ko.observable(0),
    },
    {
      Name: "Ahammed Shareef",
      id: 4996,
      Team: "Flying Bernd",
      gw35: ko.observable(0),
      gw36: ko.observable(0),
      total: ko.observable(0),
    },
    {
      Name: "Akshaydeep Singh",
      id: 992121,
      Team: "PHI",
      gw35: ko.observable(0),
      gw36: ko.observable(0),
      total: ko.observable(0),
    },
    {
      Name: "Aman Arora",
      id: 1182,
      Team: "Red Hulksters",
      gw35: ko.observable(0),
      gw36: ko.observable(0),
      total: ko.observable(0),
    },
    {
      Name: "Lijash Iqbal",
      id: 755125,
      Team: "Corona Squanderers",
      gw35: ko.observable(0),
      gw36: ko.observable(0),
      total: ko.observable(0),
    },
    {
      Name: "Ronnie Philip",
      id: 4538,
      Team: "Ronnie's United XI",
      gw35: ko.observable(0),
      gw36: ko.observable(0),
      total: ko.observable(0),
    },
  ];

  vijayanagaraMap: TeamLocal[] = [
    {
      Name: "Albin Antony",
      id: 431945,
      Team: "Taaram FC",
      gw35: ko.observable(0),
      gw36: ko.observable(0),
      total: ko.observable(0),
    },
    {
      Name: "Afsal BG",
      id: 1817599,
      Team: "supertramb",
      gw35: ko.observable(0),
      gw36: ko.observable(0),
      total: ko.observable(0),
    },
    {
      Name: "Gokul Pandala",
      id: 964668,
      Team: "Ole is well",
      gw35: ko.observable(0),
      gw36: ko.observable(0),
      total: ko.observable(0),
    },
    {
      Name: "Sreejith M",
      id: 613547,
      Team: "Randy Rona FC",
      gw35: ko.observable(0),
      gw36: ko.observable(0),
      total: ko.observable(0),
    },
    {
      Name: "Sreenath J",
      id: 692066,
      Team: "Dragon Warriors XI",
      gw35: ko.observable(0),
      gw36: ko.observable(0),
      total: ko.observable(0),
    },
    {
      Name: "Shankar Hari",
      id: 844010,
      Team: "Here we go !",
      gw35: ko.observable(0),
      gw36: ko.observable(0),
      total: ko.observable(0),
    },
  ];

  livescoreMap: Map<Number, Number> = new Map<Number, Number>();
  constructor() {
    this.chozhasRemPlyMap(new Map<String, Number>());
    this.vijayangaraRemPlyMap(new Map<String, Number>());
    const promises = [];

    const promise = CommonUtils.fetchCurrGW();
    promise.then((res) => {
      this.curr_gw = <number>res;
    });

    promises.push(promise);

    const promiseLive = CommonUtils.fetchPlayerLiveScores();
    promiseLive.then((res) => {
      this.liveScores = <LiveScores[]>res;
      this.liveScores.forEach((player) => {
        this.livescoreMap.set(player.fpl_id, player.live_score);
      });
    });

    promises.push(promiseLive);

    const promises2 = [];
    Promise.all(promises).then((res) => {
      const promiseC = this.fetchChozhasScores();
      const promiseV = this.fetchVijayanagaraScores();
      promises2.push(promiseC);
      promises2.push(promiseV);

      const globalPromise = CommonUtils.fetchFPLPlayers();
      const teamPromise = CommonUtils.fetchAoeTeams();

      promises2.push(globalPromise);
      promises2.push(teamPromise);

      const promise22 = fetch(this.bonusUrl + CommonUtils.curr_gw + "/");
      promises2.push(promise22);

      Promise.all(promises2).then((res) => {
        this.cupTeamRemPlyMap.clear();
          promise22.then((res) => res.json())
          .then((res) => {
            const resResult: Bonus[] = <Bonus[]>res;
            resResult.forEach((ply) => {
              if (!this.cupTeamRemPlyMap.has(ply.team)) {
                let cupPlyMap = new Map<String, Number>();
                this.cupTeamRemPlyMap.set(ply.team, cupPlyMap);
              }
              ply.squad.forEach((remPly) => {
                if (remPly.color === 0) {
                  let cupPlyMap = this.cupTeamRemPlyMap.get(ply.team);
                  let name = remPly.name;
                  let multiplier = 1;
                  if (name.endsWith(")")) {
                    multiplier = parseInt(
                      name.substring(name.indexOf("(") + 1, name.length - 1)
                    );
                    name = name.substring(0, name.indexOf("(") - 1);
                  }

                  if (cupPlyMap.has(name)) {
                    let cupCount: any = cupPlyMap.get(name);

                    cupCount = cupCount.valueOf() + 1 * multiplier;
                    cupPlyMap.set(name, cupCount);
                  } else {
                    cupPlyMap.set(name, multiplier);
                  }
                }
              });
            });
            CommonUtils.aoeTeams.forEach((team) => {
              let remPlyStr = "";
              let cupRemPlyStr = "";
              let count = 0;
              let cupCount = 0;

              if (this.cupTeamRemPlyMap.has(team.name)) {
                let cupRemPlyMap = this.cupTeamRemPlyMap.get(team.name);
                for (let entry of Array.from(cupRemPlyMap.entries())) {
                  cupRemPlyStr =
                    cupRemPlyStr + entry[0] + "(" + entry[1] + "),";
                  cupCount = cupCount.valueOf() + entry[1].valueOf();
                  if (team.name === "Chozhas") {
                    this.chozhasRemPlyMap().set(entry[0], entry[1]);
                  }
                  if (team.name === "Vijayanagara") {
                    this.vijayangaraRemPlyMap().set(entry[0], entry[1]);
                  }
                }
                let ele1 = {
                  team: team.name,
                  count: cupCount,
                  plyrsRem: cupRemPlyStr.substring(0, cupRemPlyStr.length - 1),
                };
                this.cupRemPlyTableList.push(ele1);
              } else {
                let ele1 = { team: team.name, count: 0, plyrsRem: "NA" };
                this.cupRemPlyTableList.push(ele1);
              }
              this.cupRemPlyTableList.sort((a, b) => {
                if (a.count > b.count) {
                  return -1;
                }
                if (a.count < b.count) {
                  return 1;
                }
                return 0;
              });
            });
          });
        this.cupRemPlyDataProvider(
          new ArrayDataProvider(this.cupRemPlyTableList)
        );

                
      });


    });
  }

  loadDiffs = (event: ojButtonEventMap['ojAction']) => {
   
        for (let entry of Array.from(this.chozhasRemPlyMap().entries())) {
          let player = entry[0];
          let count = entry[1];
          let vCount = this.vijayangaraRemPlyMap().get(player);
          if (vCount) {
            if (vCount > count) {
              this.vijayangaraDiffRemPlyMap.set(
                player,
                vCount.valueOf() - count.valueOf()
              );
            } else if (count > vCount) {
              this.chozhasDiffRemPlyMap.set(
                player,
                count.valueOf() - vCount.valueOf()
              );
            }
          } else {
            this.chozhasDiffRemPlyMap.set(player, count.valueOf());
          }
        }

        for (let entry of Array.from(this.vijayangaraRemPlyMap().entries())) {
          let player = entry[0];
          let count = entry[1];
          let cCount = this.chozhasRemPlyMap().get(player);
          if (cCount) {
          } else {
            this.vijayangaraDiffRemPlyMap.set(player, count.valueOf());
          }
        }

      for (let entry of Array.from(this.chozhasDiffRemPlyMap.entries())) {
        this.chozhasDiffs(
          this.chozhasDiffs() + " ; " + entry[0] + " : (" + entry[1] + ")"
        );
      }

      for (let entry of Array.from(this.vijayangaraDiffRemPlyMap.entries())) {
        this.vijayanagaraDiffs(
          this.vijayanagaraDiffs() + " ; " + entry[0] + " : (" + entry[1] + ")"
        );
      }


  }

  fetchChozhasScores() {
    return new Promise((accept) => {
      const promises = [];
      const promises2 = [];
      let liveTeamScore = 0;
      let teamScore35 = 0;
      let teamScore36 = 0;
      this.chozhasMap.forEach((player) => {
        let promiseCh = CommonUtils.fetchFplMgrHistory(player.id);
        promises.push(promiseCh);
        promises2.push(promiseCh);
        promiseCh.then((res) => {
          let respHist: FplMgrHistory = <FplMgrHistory>res;
          let gweeks: Current[] = <Current[]>respHist.current;

          gweeks.forEach((gw) => {
            if (gw.event === 35) {
              teamScore35 = teamScore35 + gw.points - gw.event_transfers_cost;
              player.gw35(gw.points - gw.event_transfers_cost);
            } else if (gw.event === 36) {
              teamScore36 = teamScore36 + gw.points - gw.event_transfers_cost;
              player.gw36(gw.points - gw.event_transfers_cost);
            }

            if (gw.event === this.curr_gw) {
              liveTeamScore =
                liveTeamScore + this.livescoreMap.get(player.id).valueOf();
              if (gw.event === 35) {
                player.gw35(this.livescoreMap.get(player.id).valueOf());
              }
              if (gw.event === 36) {
                player.gw36(this.livescoreMap.get(player.id).valueOf());
              }
            }

            player.total(player.gw35() + player.gw36());

            this.chozhasScore(
              this.chozhasScore() + player.gw35() + player.gw36()
            );
          });
        });
      });
      Promise.all(promises2).then((resolve) => {
        accept(true);
      });
    });
  }

  fetchVijayanagaraScores() {
    return new Promise((accept) => {
      const promises = [];
      const promises2 = [];
      let liveTeamScore = 0;
      let teamScore35 = 0;
      let teamScore36 = 0;
      this.vijayanagaraMap.forEach((player) => {
        let promiseCh = CommonUtils.fetchFplMgrHistory(player.id);
        promises.push(promiseCh);
        promises2.push(promiseCh);
        promiseCh.then((res) => {
          let respHist: FplMgrHistory = <FplMgrHistory>res;
          let gweeks: Current[] = <Current[]>respHist.current;

          gweeks.forEach((gw) => {
            if (gw.event === 35) {
              teamScore35 = teamScore35 + gw.points - gw.event_transfers_cost;
              player.gw35(gw.points - gw.event_transfers_cost);
            } else if (gw.event === 36) {
              teamScore36 = teamScore36 + gw.points - gw.event_transfers_cost;
              player.gw36(gw.points - gw.event_transfers_cost);
            }

            if (gw.event === this.curr_gw) {
              liveTeamScore =
                liveTeamScore + this.livescoreMap.get(player.id).valueOf();
              if (gw.event === 35) {
                player.gw35(this.livescoreMap.get(player.id).valueOf());
              }
              if (gw.event === 36) {
                player.gw36(this.livescoreMap.get(player.id).valueOf());
              }
            }
            player.total(player.gw35() + player.gw36());
            this.vijayangaraScore(
              this.vijayangaraScore() + player.gw35() + player.gw36()
            );
          });
        });
      });
      Promise.all(promises2).then((resolve) => {
        accept(true);
      });
    });
  }

  public getItemInitialDisplay(index): string {
    return index < 3 ? "" : "none";
  }
}

export default GrandFinaleViewModel;
