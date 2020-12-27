define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CommonUtils {
        constructor() {
            this.aoeTeamsUrl = 'https://fopfpl.in/aoe/api/teams';
            this.aoeTeams = [];
            this.fplBaseUrl = 'https://fantasy.premierleague.com/api/';
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
    }
    exports.default = new CommonUtils();
});
//# sourceMappingURL=commonutils.js.map