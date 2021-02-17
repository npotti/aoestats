define(["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CommonUtils {
        constructor() {
            this.aoeTeamsUrl = 'https://fopfpl.in/aoe/api/teams';
            this.aoeTeams = [];
            this.fplBaseUrl = 'https://fantasy.premierleague.com/api/';
            this.fplPlayerMap = new Map();
            this.fplTeamsMap = new Map();
            this.curr_gw = 1;
            this.finished = false;
            this.fplId = ko.observable(0);
            this.fplYcMap = new Map();
            this.userPicksMap = new Map();
        }
        fetchPicks(fpl_id, gw) {
            return new Promise((resolve) => {
                let urlFinal = 'https://fantasy.premierleague.com/api/entry/' + fpl_id + '/event/' + gw + "/picks/";
                fetch(urlFinal).then(res => res.json()).
                    then(res => {
                    const picksConst = res;
                    resolve(picksConst);
                });
            });
        }
        fetchUserPicks(fpl_id) {
            return new Promise((resolve) => {
                const promises = [];
                let i = 0;
                for (i = 0; i <= this.curr_gw; i++) {
                    console.log("inside user picks " + i + " : " + this.curr_gw);
                    const promise = this.fetchPicks(fpl_id, i);
                    promises.push(promise);
                    promise.then(res => {
                        const picksConst = res;
                        console.log("set user picks " + picksConst.entry_history.event);
                        this.userPicksMap.set(picksConst.entry_history.event, picksConst);
                    });
                }
                Promise.all(promises).then(res => {
                    resolve(true);
                });
            });
        }
        fetchElementSummary(player_id) {
            let fpl_elem_sum_url = 'https://fantasy.premierleague.com/api/element-summary/' + player_id + "/";
            return new Promise((resolve) => {
                fetch(fpl_elem_sum_url).then(res => res.json()).
                    then(res => {
                    const ele = res;
                    resolve(ele);
                });
            });
        }
        fetchFplMgrHistory(mgrId) {
            return new Promise((resolve) => {
                let urlFinal = this.fplBaseUrl + "entry/" + mgrId + "/history/";
                fetch(urlFinal).
                    then(res => res.json())
                    .then(res => {
                    const resResult = res;
                    resolve(res);
                });
            });
        }
        fetchAoeTeams() {
            return new Promise((resolve) => {
                let urlFinal = this.aoeTeamsUrl;
                fetch(urlFinal).
                    then(res => res.json())
                    .then(res => {
                    const resResult = res;
                    this.aoeTeams = resResult;
                    resolve((this.aoeTeams));
                });
            });
        }
        fetchTeamName(team) {
            let teamName = "";
            switch (team) {
                case 1: {
                    teamName = "Marathas";
                    break;
                }
                case 2: {
                    teamName = "Chozhas";
                    break;
                }
                case 3: {
                    teamName = "Nizams";
                    break;
                }
                case 4: {
                    teamName = "Mauryas";
                    break;
                }
                case 5: {
                    teamName = "Mughals";
                    break;
                }
                case 6: {
                    teamName = "Khiljis";
                    break;
                }
                case 7: {
                    teamName = "Travancore";
                    break;
                }
                case 8: {
                    teamName = "Nagas";
                    break;
                }
                case 9: {
                    teamName = "Vijayanagara";
                    break;
                }
                case 10: {
                    teamName = "Zamorins";
                    break;
                }
            }
            return teamName;
        }
        roundToTwo(num) {
            return Math.round((num + Number.EPSILON) * 100) / 100;
        }
        fetchFPLPlayers() {
            return new Promise((resolve) => {
                let urlFinal = 'https://fantasy.premierleague.com/api/bootstrap-static/';
                fetch(urlFinal).
                    then(res => res.json())
                    .then(res => {
                    const resResult = res;
                    if (resResult.teams) {
                        resResult.teams.forEach(team => {
                            this.fplTeamsMap.set(team.id, team);
                        });
                    }
                    if (resResult.elements) {
                        resResult.elements.forEach(element => {
                            this.fplPlayerMap.set(element.id, element);
                            this.fplYcMap.set(element.first_name + " " + element.second_name, element.yellow_cards);
                        });
                    }
                    if (resResult.events) {
                        resResult.events.forEach(event => {
                            if (event.is_current) {
                                this.curr_gw = event.id;
                                this.finished = event.finished;
                            }
                        });
                    }
                    resolve(true);
                });
            });
        }
        fetchCurrGW() {
            return new Promise((resolve) => {
                let gw = 1;
                if (this.curr_gw !== 1) {
                    gw = this.curr_gw;
                    resolve(gw);
                }
                else {
                    this.fetchFPLPlayers().then(res => {
                        gw = this.curr_gw;
                        resolve(gw);
                    });
                }
            });
        }
    }
    exports.default = new CommonUtils();
});
//# sourceMappingURL=commonutils.js.map