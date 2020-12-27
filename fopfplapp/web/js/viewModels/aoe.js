define(["require", "exports", "../utils/commonutils", "ojs/ojarraydataprovider", "knockout", "ojs/ojtable", "ojs/ojchart"], function (require, exports, commonutils_1, ArrayDataProvider, ko) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CustomersViewModel {
        constructor() {
            this.capQuotaObservableArray = ko.observableArray([]);
            this.capQuotaObservable = ko.observable();
            this.playersPlayedObservableArray = ko.observableArray([]);
            this.playersPlayedObservable = ko.observable();
            this.vegTallyTableList = ko.observableArray([]);
            this.chartObservableArray = ko.observableArray([]);
            this.chartObservable = ko.observable();
            this.tallyUrl = 'https://fopfpl.in/aoe/api/veg_tally';
            this.curr_gw = 15;
            this.eoTableList = ko.observableArray([]);
            this.eoDataProvider = ko.observable();
            this.aoePlayerMap = new Map();
            this.chipTableList = ko.observableArray([]);
            this.chipDataProvider = ko.observable();
            const promise2 = this.fetchFplChipCounts();
            promise2.then(res => {
                this.chipDataProvider(new ArrayDataProvider(this.chipTableList));
            });
            this.fetchAoeEO(this.curr_gw);
            this.vegTallyDataProvider = ko.observable(new ArrayDataProvider(this.vegTallyTableList));
            let i = 1;
            for (i; i <= 10; i++) {
                this.fetchTeamVegTally(this.curr_gw, i);
            }
            this.fetchCapQuota();
        }
        roundToTwo(num) {
            return Math.round((num + Number.EPSILON) * 100) / 100;
        }
        fetcheo(urlFinal, playerMap) {
            return new Promise((resolve) => {
                fetch(urlFinal).
                    then(res => res.json())
                    .then(res => {
                    const resResult = res;
                    resResult.forEach(row => {
                        if (!playerMap.get(row.name)) {
                            playerMap.set(row.name, row.count);
                        }
                        else {
                            let count = playerMap.get(row.name);
                            count = count + row.count;
                            playerMap.set(row.name, count);
                        }
                    });
                    resolve(res);
                });
            });
        }
        fetchCapQuota() {
            fetch('https://fopfpl.in/aoe/api/game_week/scores/').
                then(res => res.json())
                .then(res => {
                const resResult = res;
                let teamCapMap = new Map();
                let teamSubMap = new Map();
                let teamVcMap = new Map();
                resResult.forEach(row => {
                    let i = 0;
                    for (i; i < 10; i++) {
                        let capMap = teamCapMap.get(i);
                        let subMap = teamSubMap.get(i);
                        let vcMap = teamVcMap.get(i);
                        if (!capMap) {
                            capMap = new Map();
                        }
                        if (!subMap) {
                            subMap = new Map();
                        }
                        if (!vcMap) {
                            vcMap = new Map();
                        }
                        if (capMap.has(row[i].captain.first_name)) {
                            let cnt = capMap.get(row[i].captain.first_name);
                            cnt = cnt + 1;
                            capMap.set(row[i].captain.first_name, cnt);
                        }
                        else {
                            capMap.set(row[i].captain.first_name, 1);
                        }
                        if (subMap.has(row[i].substitute.first_name)) {
                            let cnt = subMap.get(row[i].substitute.first_name);
                            cnt = cnt + 1;
                            subMap.set(row[i].substitute.first_name, cnt);
                        }
                        else {
                            subMap.set(row[i].substitute.first_name, 1);
                        }
                        if (vcMap.has(row[i].vice_captain.first_name)) {
                            let cnt = vcMap.get(row[i].vice_captain.first_name);
                            cnt = cnt + 1;
                            vcMap.set(row[i].vice_captain.first_name, cnt);
                        }
                        else {
                            vcMap.set(row[i].vice_captain.first_name, 1);
                        }
                        teamCapMap.set(i, capMap);
                        teamSubMap.set(i, subMap);
                        teamVcMap.set(i, vcMap);
                    }
                });
                let i = 0;
                for (i; i < 10; i++) {
                    let capStr = "";
                    for (let entry of Array.from(teamCapMap.get(i).entries())) {
                        let name = entry[0];
                        let count = entry[1];
                        capStr = capStr + name + ":" + count + ",";
                    }
                    let subStr = "";
                    for (let entry of Array.from(teamSubMap.get(i).entries())) {
                        let name = entry[0];
                        let count = entry[1];
                        subStr = subStr + name + ":" + count + ",";
                    }
                    let vcStr = "";
                    for (let entry of Array.from(teamVcMap.get(i).entries())) {
                        let name = entry[0];
                        let count = entry[1];
                        vcStr = vcStr + name + ":" + count + ",";
                    }
                    if (capStr.endsWith(",")) {
                        capStr = capStr.substring(0, capStr.length - 1);
                    }
                    if (subStr.endsWith(",")) {
                        subStr = subStr.substring(0, subStr.length - 1);
                    }
                    if (vcStr.endsWith(",")) {
                        vcStr = vcStr.substring(0, vcStr.length - 1);
                    }
                    var ele = { "teamName": commonutils_1.default.fetchTeamName(i + 1), "capQuota": capStr, "subQuota": subStr, "vcCount": vcStr };
                    this.capQuotaObservableArray.push(ele);
                }
                this.capQuotaObservable(new ArrayDataProvider(this.capQuotaObservableArray));
            });
        }
        fetchTeamVegTally(gameweek, team) {
            let urlFinal = this.tallyUrl + '/' + gameweek + '/' + team;
            fetch(urlFinal).
                then(res => res.json())
                .then(res => {
                const resResult = res;
                let playersPlayed = 0;
                let playersRemaining = 0;
                let totalPlayers = 0;
                let remMap = new Map();
                resResult.forEach(row => {
                    if (row.score !== 0 || row.name === 'Dias') { //players with 0
                        playersPlayed += row.count;
                    }
                    else {
                        playersRemaining += row.count;
                        remMap.set(row.name, row.count);
                    }
                    totalPlayers += row.count;
                    this.vegTallyTableList().push(row);
                });
                let remStr = "";
                for (let entry of Array.from(remMap.entries())) {
                    let name = entry[0];
                    let count = entry[1];
                    remStr = remStr + name + ":" + count + ",";
                }
                if (remStr.endsWith(",")) {
                    remStr = remStr.substring(0, remStr.length - 1);
                }
                let teamName = commonutils_1.default.fetchTeamName(team);
                var ele = { "team": team, "teamName": teamName, "playersPlayed": playersPlayed, "playersRemaining": playersRemaining, "totalPlayers": totalPlayers, "remainingPlayerData": remStr };
                var chartEle = { "id": team, "group": "Players Played", "value": playersPlayed,
                    "series": teamName };
                var chartEle2 = { "id": team, "group": "Players Remaining", "value": playersRemaining,
                    "series": teamName };
                this.chartObservableArray.push(chartEle);
                this.chartObservableArray.push(chartEle2);
                this.playersPlayedObservableArray.push(ele);
                this.playersPlayedObservableArray.sort((a, b) => {
                    if (a.playersRemaining > b.playersRemaining) {
                        return -1;
                    }
                    if (a.playersRemaining < b.playersRemaining) {
                        return 1;
                    }
                    return 0;
                });
                this.vegTallyDataProvider(new ArrayDataProvider(this.vegTallyTableList));
                this.playersPlayedObservable(new ArrayDataProvider(this.playersPlayedObservableArray));
                this.chartObservable(new ArrayDataProvider(this.chartObservableArray));
            });
        }
        fetchAoeEO(gameweek) {
            let playerMap = new Map();
            const promises = [];
            for (let i = 1; i <= 10; i++) {
                let urlFinal = this.tallyUrl + '/' + gameweek + '/' + i;
                promises.push(this.fetcheo(urlFinal, playerMap));
            }
            Promise.all(promises).then(resolve => {
                for (let entry of Array.from(playerMap.entries())) {
                    let name = entry[0];
                    let count = entry[1];
                    let percent = ((count / 60) * 100);
                    let ele = { "player": name, "count": count, "percent": this.roundToTwo(percent) };
                    this.eoTableList.push(ele);
                }
                this.eoTableList.sort((a, b) => {
                    if (a.percent > b.percent) {
                        return -1;
                    }
                    if (a.percent < b.percent) {
                        return 1;
                    }
                    return 0;
                });
                this.eoDataProvider(new ArrayDataProvider(this.eoTableList));
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
    }
    exports.default = CustomersViewModel;
});
//# sourceMappingURL=aoe.js.map