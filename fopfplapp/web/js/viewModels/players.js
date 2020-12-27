define(["require", "exports", "../utils/commonutils", "ojs/ojarraydataprovider", "knockout", "ojs/ojtable", "ojs/ojchart"], function (require, exports, commonutils_1, ArrayDataProvider, ko) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DashboardViewModel {
        constructor() {
            this.tallyUrl = 'https://fopfpl.in/aoe/api/veg_tally';
            this.fplBaseUrl = 'https://fantasy.premierleague.com/api/';
            this.chipTableList = ko.observableArray([]);
            this.chipDataProvider = ko.observable();
            this.transferTableList = ko.observableArray([]);
            this.transferDataProvider = ko.observable();
            this.hitTableList = ko.observableArray([]);
            this.hitDataProvider = ko.observable();
            this.mostFPLTransferredIn = ko.observable();
            this.mostFPLCaptained = ko.observable();
            this.mostFPLTransferredOut = ko.observable();
            this.mostAOETransferredIn = ko.observable();
            this.mostAOECaptained = ko.observable();
            this.mostAOETransferredOut = ko.observable();
            this.fplPlayerMap = new Map();
            this.aoePlayerMap = new Map();
            this.aoeTeams = [];
            this.curr_gw = 15;
            this.gwTransInMap = new Map();
            this.gwTransOutMap = new Map();
            this.captainMap = new Map();
            this.aoeGwPlayerTransfers = new Map();
            this.fplTeamsMap = new Map();
            this.loadTransTable = ko.observable(false);
            this.playerChipMap = new Map();
            this.playerCaptainMap = new Map();
            this.playerViceCaptainMap = new Map();
            this.playerRankMap = new Map();
            this.playerPicksMap = new Map();
            this.aoeFplTeamAvgMap = new Map();
            this.aoeLiveScoreMap = new Map();
            this.onLoadTransferTable = (event) => {
                for (let entry of Array.from(this.aoeGwPlayerTransfers.entries())) {
                    let currPoints = this.playerRankMap.get(entry[0]).total_points;
                    let livePoints = this.aoeLiveScoreMap.get(this.aoePlayerMap.get(entry[0]));
                    // let livePoints = 0;
                    let totalPoints = currPoints.valueOf() + livePoints.valueOf();
                    let ele = { "player": entry[0], "info": entry[1], "chip": this.playerChipMap.get(entry[0]), "captain": this.playerCaptainMap.get(entry[0]), "vicecaptain": this.playerViceCaptainMap.get(entry[0]), "rank": this.playerRankMap.get(entry[0]).overall_rank, "hits": ((this.playerRankMap.get(entry[0]).event_transfers_cost) / 4), "tv": ((this.playerRankMap.get(entry[0]).value) / 10), "points": currPoints, "livepoints": livePoints, "totalpoints": totalPoints };
                    this.transferTableList.push(ele);
                }
                this.transferTableList.sort((a, b) => {
                    if (a.totalpoints > b.totalpoints) {
                        return -1;
                    }
                    if (a.totalpoints < b.totalpoints) {
                        return 1;
                    }
                    return 0;
                });
                this.transferDataProvider(new ArrayDataProvider(this.transferTableList));
                this.chipDataProvider(new ArrayDataProvider(this.chipTableList));
                var mapOut = new Map([...this.gwTransOutMap.entries()].sort(function (a, b) {
                    if (a[1] > b[1])
                        return -1;
                    if (a[1] < b[1])
                        return 1;
                    /* else */ return 0;
                }));
                var mapIn = new Map([...this.gwTransInMap.entries()].sort(function (a, b) {
                    if (a[1] > b[1])
                        return -1;
                    if (a[1] < b[1])
                        return 1;
                    /* else */ return 0;
                }));
                this.mostAOETransferredOut(mapOut.keys().next().value);
                this.mostAOETransferredIn(mapIn.keys().next().value);
                this.loadTransTable(true);
            };
            const promises = [];
            const promise = this.fetchFPLPlayers();
            const promise2 = this.fetchFplChipCounts();
            const promise3 = commonutils_1.default.fetchAoeTeams();
            const promise4 = this.fetchAoeScores();
            this.fetchFplHits();
            promises.push(promise);
            promises.push(promise2);
            promises.push(promise3);
            promises.push(promise4);
            Promise.all(promises).then(resolve => {
                for (let entry of Array.from(this.aoePlayerMap.entries())) {
                    let name = entry[0];
                    let fpl_id = entry[1];
                    const ptpromises = [];
                    const picksPromise = this.fetchPicks(fpl_id, name);
                    const transPromise = this.fetchTransfers(fpl_id);
                    ptpromises.push(picksPromise);
                    ptpromises.push(transPromise);
                    picksPromise.then(picksRes => {
                        transPromise.then(transRes => {
                            let transMap = transRes;
                            let transInConcat = '';
                            let transOutConcat = '';
                            for (let transEntry of Array.from(transMap.entries())) {
                                let transIn = transEntry[0];
                                let transOut = transEntry[1];
                                if (transInConcat === '') {
                                    transInConcat = transIn;
                                }
                                else {
                                    transInConcat = transInConcat + ", " + transIn;
                                }
                                if (transOutConcat === '') {
                                    transOutConcat = transOut;
                                }
                                else {
                                    transOutConcat = transOutConcat + ", " + transOut;
                                }
                                if (this.gwTransInMap.has(transIn)) {
                                    let count = this.gwTransInMap.get(transIn);
                                    this.gwTransInMap.set(transIn, count + 1);
                                }
                                else {
                                    this.gwTransInMap.set(transIn, 1);
                                }
                                if (this.gwTransOutMap.has(transOut)) {
                                    let count = this.gwTransOutMap.get(transOut);
                                    this.gwTransOutMap.set(transOut, count + 1);
                                }
                                else {
                                    this.gwTransOutMap.set(transOut, 1);
                                }
                            }
                            this.aoeGwPlayerTransfers.set(name, "Transfers IN : " + transInConcat + ", Transfers OUT : " + transOutConcat);
                        });
                    });
                }
            });
        }
        fetchAoeFPLTeamAvgs() {
            for (let entry of Array.from(this.aoePlayerMap.entries())) {
                let playerConcatName = entry[0];
                let fplId = entry[1];
                let playerName = playerConcatName.substring(0, playerConcatName.indexOf("(") - 1);
                let aoeTeamName = playerConcatName.substring(playerConcatName.indexOf("("), playerConcatName.length - 2);
            }
        }
        fetchTransfers(fpl_id) {
            return new Promise((resolve) => {
                let transfersMap = new Map();
                let urlFinal = 'https://fantasy.premierleague.com/api/entry/' + fpl_id + '/transfers/';
                fetch(urlFinal).then(res => res.json()).
                    then(res => {
                    const resResult = res;
                    resResult.forEach(ele => {
                        if (ele.event === this.curr_gw) {
                            transfersMap.set(this.fplPlayerMap.get(ele.element_in).web_name, this.fplPlayerMap.get(ele.element_out).web_name);
                        }
                        resolve(transfersMap);
                    });
                });
            });
        }
        fetchPicks(fpl_id, name) {
            return new Promise((resolve) => {
                let urlFinal = 'https://fantasy.premierleague.com/api/entry/' + fpl_id + '/event/' + this.curr_gw + "/picks/";
                fetch(urlFinal).then(res => res.json()).
                    then(res => {
                    const picksConst = res;
                    if (picksConst.active_chip) {
                        this.playerChipMap.set(name, picksConst.active_chip);
                    }
                    this.playerPicksMap.set(fpl_id, picksConst.picks);
                    picksConst.picks.forEach(ele => {
                        if (ele.is_captain) {
                            this.playerCaptainMap.set(name, this.fplPlayerMap.get(ele.element).web_name);
                        }
                        else if (ele.is_vice_captain) {
                            this.playerViceCaptainMap.set(name, this.fplPlayerMap.get(ele.element).web_name);
                        }
                    });
                    this.playerRankMap.set(name, picksConst.entry_history);
                    resolve(true);
                });
            });
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
                        });
                    }
                    resolve(true);
                });
            });
        }
        fetchFplChipCounts() {
            return new Promise((accept) => {
                let promise = commonutils_1.default.fetchAoeTeams();
                const promises = [];
                promise.then((res) => {
                    let aoeTeams = res;
                    aoeTeams.forEach(team => {
                        let wcUsed = 0;
                        let fhUsed = 0;
                        let bbUsed = 0;
                        let tcUsed = 0;
                        team.players.forEach(player => {
                            this.aoePlayerMap.set(player.first_name + " " + player.last_name + " (" + commonutils_1.default.fetchTeamName(team.id) + " )", player.fpl_id);
                            let promiseCh = commonutils_1.default.fetchFplMgrHistory(player.fpl_id);
                            promises.push(promiseCh);
                            promiseCh.then((res) => {
                                let respHist = res;
                                let chips = respHist.chips;
                                if (chips.length > 0) {
                                    chips.forEach(chip => {
                                        if (chip.name === 'wildcard') {
                                            wcUsed = wcUsed + 1;
                                        }
                                        else if (chip.name === '3xc') {
                                            tcUsed = tcUsed + 1;
                                        }
                                        else if (chip.name === 'freehit') {
                                            fhUsed = fhUsed + 1;
                                        }
                                        else if (chip.name === 'bboost') {
                                            bbUsed = bbUsed + 1;
                                        }
                                    });
                                }
                            });
                        });
                        Promise.all(promises).then(resolve => {
                            let info = "WCs Used :: " + wcUsed + ", TCs Used :: " + tcUsed + ", FHs Used :: " + fhUsed + " BBs Used :: " + bbUsed;
                            let ele = { "team": commonutils_1.default.fetchTeamName(team.id), "info": info };
                            this.chipTableList.push(ele);
                            accept(true);
                        });
                    });
                });
            });
        }
        fetchFplHits() {
            let promise = commonutils_1.default.fetchAoeTeams();
            const promises = [];
            let hitsEles = [];
            promise.then((res) => {
                let aoeTeams = res;
                aoeTeams.forEach(team => {
                    team.players.forEach(player => {
                        let promiseCh = commonutils_1.default.fetchFplMgrHistory(player.fpl_id);
                        promises.push(promiseCh);
                        promiseCh.then((res) => {
                            let respHist = res;
                            let current = respHist.current;
                            if (current.length > 0) {
                                let totalCost = 0;
                                current.forEach(week => {
                                    totalCost = totalCost + week.event_transfers_cost;
                                });
                                let ele = { "player": player.first_name + " " + player.last_name, "cost": totalCost, "team": commonutils_1.default.fetchTeamName(team.id) };
                                this.hitTableList.push(ele);
                            }
                        });
                    });
                });
                Promise.all(promises).then(resolve => {
                    this.hitTableList.sort((a, b) => {
                        if (a.cost > b.cost) {
                            return -1;
                        }
                        if (a.cost < b.cost) {
                            return 1;
                        }
                        return 0;
                    });
                    this.hitDataProvider(new ArrayDataProvider(this.hitTableList));
                });
            });
        }
        fetchAoeScores() {
            fetch('http://fopfpl.in/aoe/api/game_week/scores').
                then(res => res.json())
                .then(res => {
                let teamMap = new Map();
                res.forEach(element => {
                    element.forEach(teamgw => {
                        let detailsRes = JSON.parse(teamgw.details);
                        detailsRes.forEach(teamsgwscore => {
                            if (!this.aoeLiveScoreMap.has(teamsgwscore.fpl_id))
                                this.aoeLiveScoreMap.set(teamsgwscore.fpl_id, teamsgwscore.score);
                        });
                    });
                });
            });
        }
    }
    //         var ele = {"team": team, "teamName": teamName, "playersPlayed" : playersPlayed, "playersRemaining" : playersRemaining, "totalPlayers" : totalPlayers, "remainingPlayerData" : remStr};
    //         var chartEle = {"id": team, "group" : "Players Played", "value" : playersPlayed,
    //         "series": teamName};
    //         var chartEle2 = {"id": team, "group" : "Players Remaining", "value" : playersRemaining,
    //         "series": teamName};
    //         this.chartObservableArray.push(chartEle); 
    //         this.chartObservableArray.push(chartEle2);
    //         this.playersPlayedObservableArray.push(ele);
    //         this.playersPlayedObservableArray.sort((a,b) => {
    //           if(a.playersRemaining > b.playersRemaining){
    //             return -1;
    //           }
    //           if(a.playersRemaining < b.playersRemaining){
    //             return 1;
    //           }
    //           return 0;
    //         })
    //         this.vegTallyDataProvider(new ArrayDataProvider(this.vegTallyTableList));
    //         this.playersPlayedObservable(new ArrayDataProvider(this.playersPlayedObservableArray));
    //         this.chartObservable(new ArrayDataProvider(this.chartObservableArray));
    //       })
    // }}
    exports.default = DashboardViewModel;
});
//# sourceMappingURL=players.js.map