define(["require", "exports", "../utils/commonutils", "ojs/ojarraydataprovider", "knockout", "ojs/ojconverter-number", "ojs/ojtable", "ojs/ojchart", "ojs/ojgauge", "ojs/ojavatar"], function (require, exports, commonutils_1, ArrayDataProvider, ko, ojconverter_number_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DashboardViewModel {
        constructor() {
            this.numberConverter = new ojconverter_number_1.IntlNumberConverter({
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
            });
            this.tallyUrl = 'https://fopfpl.in/aoe/api/veg_tally';
            this.fplBaseUrl = 'https://fantasy.premierleague.com/api/';
            this.bonusCandidateUrl = 'https://fopfpl.in/aoe/api/bonus_candidate/';
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
            this.mostAoeCaptained = ko.observable();
            this.mostAoeCaptainedNo = ko.observable(0);
            this.mostAOETransferredOut = ko.observable();
            this.mostAOETransferredOutPic = ko.observable();
            this.mostAOETransferredInPic = ko.observable();
            this.aoePlayerMap = new Map();
            this.aoeTeams = [];
            this.curr_gw = 1;
            this.gwTransInMap = new Map();
            this.gwTransOutMap = new Map();
            this.gwCapsMap = new Map();
            this.gwCapInfo = ko.observable();
            this.captainMap = new Map();
            this.aoeGwPlayerTransfers = new Map();
            this.loadTransTable = ko.observable(false);
            this.playerChipMap = new Map();
            this.codeMap = new Map();
            this.playerCaptainMap = new Map();
            this.playerViceCaptainMap = new Map();
            this.playerRankMap = new Map();
            this.playerPicksMap = new Map();
            this.aoeFplTeamAvgMap = new Map();
            this.aoeLiveScoreMap = new Map();
            this.bonusPlayerMap = new Map();
            this.bonusTeamMap = new Map();
            this.bonusTeamTableList = ko.observableArray([]);
            this.bonusTeamDataProvider = ko.observable();
            this.bonusPlayerTableList = ko.observableArray([]);
            this.bonusPlayerDataProvider = ko.observable();
            this.thresholdValues = [{ max: 10 }, { max: 30 }, {}];
            this.mostAoeCappedList = ko.observableArray([]);
            this.mostAoeCappedDataProvider = ko.observable();
            this.onLoadTransferTable = (event) => {
                this.transferTableList.removeAll();
                for (let entry of Array.from(this.aoeGwPlayerTransfers.entries())) {
                    let currPoints = this.playerRankMap.get(entry[0]).total_points;
                    let livePoints = this.aoeLiveScoreMap.get(this.aoePlayerMap.get(entry[0]));
                    // let livePoints = 0;
                    let totalPoints = currPoints.valueOf();
                    if (!commonutils_1.default.finished) {
                        if (livePoints)
                            totalPoints = totalPoints + livePoints.valueOf();
                    }
                    let ele = { "player": entry[0], "info": entry[1], "chip": this.playerChipMap.get(entry[0]), "captain": this.playerCaptainMap.get(entry[0]), "vicecaptain": this.playerViceCaptainMap.get(entry[0]), "rank": this.playerRankMap.get(entry[0]).overall_rank, "hits": ((this.playerRankMap.get(entry[0]).event_transfers_cost) / 4), "tv": ((this.playerRankMap.get(entry[0]).value) / 10), "points": currPoints, "livepoints": livePoints };
                    this.transferTableList.push(ele);
                }
                this.transferTableList.sort((a, b) => {
                    if (a.rank < b.rank) {
                        return -1;
                    }
                    if (a.rank > b.rank) {
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
                var mapCapGw = new Map([...this.gwCapsMap.entries()].sort(function (a, b) {
                    if (a[1] > b[1])
                        return -1;
                    if (a[1] < b[1])
                        return 1;
                    /* else */ return 0;
                }));
                let info = '';
                let i = 0;
                for (let entry of Array.from(mapCapGw.entries())) {
                    i = i + 1;
                    if (i === 1) {
                        this.mostAoeCaptained = entry[0];
                        this.mostAoeCaptainedNo = entry[1];
                    }
                    let name = entry[0];
                    let count = entry[1];
                    info = info + name + ":" + count + ",";
                    let ele = { name: name, count: count, group: 'Captain' };
                    this.mostAoeCappedList.push(ele);
                }
                this.gwCapInfo(info.substring(0, info.length - 1));
                let fplPlayerPicUrl = "https://resources.premierleague.com/premierleague/photos/players/110x140/p";
                let code = this.codeMap.get(this.mostAOETransferredOut());
                let playerPic = fplPlayerPicUrl + '' + code + ".png";
                this.mostAOETransferredOutPic(playerPic);
                code = this.codeMap.get(this.mostAOETransferredIn());
                playerPic = fplPlayerPicUrl + '' + code + ".png";
                this.mostAOETransferredInPic(playerPic);
                this.loadTransTable(true);
                this.mostAoeCappedDataProvider(new ArrayDataProvider(this.mostAoeCappedList));
            };
            const promises = [];
            const promise = commonutils_1.default.fetchFPLPlayers();
            const promise2 = this.fetchFplChipCounts();
            const promise3 = commonutils_1.default.fetchAoeTeams();
            const promise4 = this.fetchAoeScores();
            const promise5 = commonutils_1.default.fetchCurrGW();
            this.fetchFplHits();
            promises.push(promise);
            promises.push(promise2);
            promises.push(promise3);
            promises.push(promise4);
            promises.push(promise5);
            Promise.all(promises).then(resolve => {
                this.curr_gw = commonutils_1.default.curr_gw;
                this.fetchBonusTable();
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
                            this.codeMap.set(commonutils_1.default.fplPlayerMap.get(ele.element_in).web_name, commonutils_1.default.fplPlayerMap.get(ele.element_in).code);
                            this.codeMap.set(commonutils_1.default.fplPlayerMap.get(ele.element_out).web_name, commonutils_1.default.fplPlayerMap.get(ele.element_out).code);
                            transfersMap.set(commonutils_1.default.fplPlayerMap.get(ele.element_in).web_name, commonutils_1.default.fplPlayerMap.get(ele.element_out).web_name);
                        }
                        console.log("this " + this.codeMap);
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
                            let capName = commonutils_1.default.fplPlayerMap.get(ele.element).web_name;
                            this.playerCaptainMap.set(name, capName);
                            if (this.gwCapsMap.has(capName)) {
                                let count = this.gwCapsMap.get(capName);
                                this.gwCapsMap.set(capName, count + 1);
                            }
                            else {
                                this.gwCapsMap.set(capName, 1);
                            }
                        }
                        else if (ele.is_vice_captain) {
                            this.playerViceCaptainMap.set(name, commonutils_1.default.fplPlayerMap.get(ele.element).web_name);
                        }
                    });
                    this.playerRankMap.set(name, picksConst.entry_history);
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
        fetchBonusTable() {
            let promises = [];
            let i = 0;
            for (i = 1; i <= this.curr_gw; i++) {
                const promise = this.fetchBonusPerWeek(i);
                promises.push(promise);
                promise.then(res => {
                    let bonusArr = res;
                    bonusArr.forEach(bonusgw => {
                        if (this.bonusPlayerMap.has(bonusgw.name)) {
                            let count = this.bonusPlayerMap.get(bonusgw.name);
                            this.bonusPlayerMap.set(bonusgw.name, count + 1);
                        }
                        else {
                            this.bonusPlayerMap.set(bonusgw.name, 1);
                        }
                        if (this.bonusTeamMap.has(bonusgw.team)) {
                            let count = this.bonusTeamMap.get(bonusgw.team);
                            this.bonusTeamMap.set(bonusgw.team, count + 1);
                        }
                        else {
                            this.bonusTeamMap.set(bonusgw.team, 1);
                        }
                    });
                });
            }
            Promise.all(promises).then(res => {
                var bonusTeamSortMap = new Map([...this.bonusTeamMap.entries()].sort(function (a, b) {
                    if (a[1] > b[1])
                        return -1;
                    if (a[1] < b[1])
                        return 1;
                    /* else */ return 0;
                }));
                var bonusPlayerSortMap = new Map([...this.bonusPlayerMap.entries()].sort(function (a, b) {
                    if (a[1] > b[1])
                        return -1;
                    if (a[1] < b[1])
                        return 1;
                    /* else */ return 0;
                }));
                for (let entry of Array.from(bonusPlayerSortMap.entries())) {
                    let ele = { "player": entry[0], "count": entry[1] };
                    this.bonusPlayerTableList.push(ele);
                }
                for (let entry of Array.from(bonusTeamSortMap.entries())) {
                    let ele = { "team": entry[0], "count": entry[1] };
                    this.bonusTeamTableList.push(ele);
                }
                this.bonusPlayerDataProvider(new ArrayDataProvider(this.bonusPlayerTableList));
                this.bonusTeamDataProvider(new ArrayDataProvider(this.bonusTeamTableList));
            });
        }
        fetchBonusPerWeek(gameweek) {
            return new Promise((resolve) => {
                fetch(this.bonusCandidateUrl + gameweek).
                    then(res => res.json())
                    .then(res => {
                    let bonusArr = res;
                    resolve(bonusArr);
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