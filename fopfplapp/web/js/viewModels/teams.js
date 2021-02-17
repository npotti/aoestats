define(["require", "exports", "../utils/commonutils", "ojs/ojarraydataprovider", "knockout", "ojs/ojtable", "ojs/ojchart", "ojs/ojselectsingle"], function (require, exports, commonutils_1, ArrayDataProvider, ko) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class IncidentsViewModel {
        constructor() {
            this.selectedTeam = ko.observable();
            this.fplBaseUrl = 'https://fantasy.premierleague.com/api/';
            this.aoeTeams = [];
            this.curr_gw = 1;
            this.playerPicksMap = new Map();
            this.aoeTeamFplTeamMap = new Map();
            this.fplTeamAoeAvgMap = new Map();
            this.gainTableList = ko.observableArray([]);
            this.gainDataProvider = ko.observable();
            this.showTable = ko.observable(false);
            this.valueChangedHandler = (event) => {
                this.gainTableList.removeAll();
                console.log(event.detail.value);
                let map = this.aoeTeamFplTeamMap.get(event.detail.value);
                if (map) {
                    for (let entry of Array.from(commonutils_1.default.fplTeamsMap.entries())) {
                        let name = entry[1].name;
                        let count = map.has(name) ? map.get(name) : 0;
                        let avg = this.fplTeamAoeAvgMap.has(name) ? this.fplTeamAoeAvgMap.get(name) : 0;
                        let ele = { "team": name, "count": count, "avg": commonutils_1.default.roundToTwo(avg), "gain": commonutils_1.default.roundToTwo((count.valueOf() - avg.valueOf())) };
                        this.gainTableList.push(ele);
                    }
                    this.gainDataProvider(new ArrayDataProvider(this.gainTableList));
                    this.showTable(true);
                }
                else {
                    this.showTable(false);
                }
            };
            const promise = commonutils_1.default.fetchFPLPlayers();
            promise.then(res => {
                this.curr_gw = commonutils_1.default.curr_gw;
                const promise2 = commonutils_1.default.fetchAoeTeams();
                promise2.then(result => {
                    this.aoeTeams = result;
                    this.aoeTeams.forEach(team => {
                        const ptpromises = [];
                        team.players.forEach(player => {
                            const promise3 = this.fetchPicks(player.fpl_id);
                            ptpromises.push(promise3);
                        });
                        Promise.all(ptpromises).then(res => {
                            team.players.forEach(player => {
                                let picks = this.playerPicksMap.get(player.fpl_id);
                                picks.forEach(pick => {
                                    let currWkPoints = commonutils_1.default.fplPlayerMap.get(pick.element).event_points;
                                    let fplteam = commonutils_1.default.fplTeamsMap.get(commonutils_1.default.fplPlayerMap.get(pick.element).team).name;
                                    if (this.aoeTeamFplTeamMap.get(team.id)) {
                                        if (this.aoeTeamFplTeamMap.get(team.id).get(fplteam)) {
                                            let count = this.aoeTeamFplTeamMap.get(team.id).get(fplteam).valueOf() + (currWkPoints * pick.multiplier);
                                            this.aoeTeamFplTeamMap.get(team.id).set(fplteam, count);
                                        }
                                        else {
                                            let count = (currWkPoints * pick.multiplier);
                                            this.aoeTeamFplTeamMap.get(team.id).set(fplteam, count);
                                        }
                                    }
                                    else {
                                        console.log("Inside else");
                                        let newMap = new Map();
                                        let count = (currWkPoints * pick.multiplier);
                                        newMap.set(fplteam, count);
                                        this.aoeTeamFplTeamMap.set(team.id, newMap);
                                    }
                                });
                            });
                            for (let entry of Array.from(commonutils_1.default.fplTeamsMap.entries())) {
                                let name = entry[1].name;
                                let count = 0;
                                for (let entry2 of Array.from(this.aoeTeamFplTeamMap.entries())) {
                                    let xMap = entry2[1];
                                    if (xMap.has(name)) {
                                        count = count + xMap.get(name).valueOf();
                                    }
                                }
                                this.fplTeamAoeAvgMap.set(name, count / 10);
                            }
                            console.log("Execution completed");
                        });
                    });
                });
            });
            var teams = [
                { value: 1, label: 'Marathas' },
                { value: 2, label: 'Chozhas' },
                { value: 3, label: 'Nizams' },
                { value: 4, label: 'Mauryas' },
                { value: 5, label: 'Mughals' },
                { value: 6, label: 'Khiljis' },
                { value: 7, label: 'Travancore' },
                { value: 8, label: 'Nagas' },
                { value: 9, label: 'Vijayanagara' },
                { value: 10, label: 'Zamorins' }
            ];
            this.teamsLovDataProvider = new ArrayDataProvider(teams, { keyAttributes: 'value' });
        }
        /**
         * Optional ViewModel method invoked after the View is inserted into the
         * document DOM.  The application can put logic that requires the DOM being
         * attached here.
         * This method might be called multiple times - after the View is created
         * and inserted into the DOM and after the View is reconnected
         * after being disconnected.
         */
        connected() {
            // implement if needed
        }
        /**
         * Optional ViewModel method invoked after the View is disconnected from the DOM.
         */
        disconnected() {
            // implement if needed
        }
        /**
         * Optional ViewModel method invoked after transition to the new View is complete.
         * That includes any possible animation between the old and the new View.
         */
        transitionCompleted() {
            // implement if needed
        }
        fetchPicks(fpl_id) {
            return new Promise((resolve) => {
                let urlFinal = 'https://fantasy.premierleague.com/api/entry/' + fpl_id + '/event/' + this.curr_gw + "/picks/";
                fetch(urlFinal).then(res => res.json()).
                    then(res => {
                    const picksConst = res;
                    this.playerPicksMap.set(fpl_id, picksConst.picks);
                    resolve(true);
                });
            });
        }
    }
    exports.default = IncidentsViewModel;
});
//# sourceMappingURL=teams.js.map