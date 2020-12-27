import {AoeTeam} from '../interfaces/aoeteams';
import {FplMgrHistory, Chip, Current} from '../interfaces/fplmgrhistory';

class CommonUtils{

  aoeTeamsUrl: string = 'https://fopfpl.in/aoe/api/teams';
  aoeTeams: AoeTeam[] = [];
  fplBaseUrl: string = 'https://fantasy.premierleague.com/api/';

  fetchFplMgrHistory(mgrId: number){
    return new Promise((resolve) => {
      let urlFinal: string = this.fplBaseUrl + "entry/" +mgrId+ "/history/";
      fetch(urlFinal).
      then(res => res.json())
          .then(res => {
            const resResult: FplMgrHistory = <FplMgrHistory>res;
            resolve(res);
          })
      });
  }

  fetchAoeTeams(){
    return new Promise((resolve) => {
      let urlFinal: string = this.aoeTeamsUrl;
      fetch(urlFinal).
      then(res => res.json())
          .then(res => {
            const resResult: AoeTeam[] = <AoeTeam[]>res;
            this.aoeTeams = resResult;  
            resolve((this.aoeTeams));
          })
    })
  }

    fetchTeamName(team: number): string{
        let teamName : string = "";
        switch(team){
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

export default new CommonUtils();