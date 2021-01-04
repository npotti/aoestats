import {AoeTeam} from '../interfaces/aoeteams';
import {FplMgrHistory, Chip, Current} from '../interfaces/fplmgrhistory';
import {FPLBootStrap, Team, Element} from '../interfaces/bootstrap';

class CommonUtils{

  aoeTeamsUrl: string = 'https://fopfpl.in/aoe/api/teams';
  aoeTeams: AoeTeam[] = [];
  fplBaseUrl: string = 'https://fantasy.premierleague.com/api/';
  public fplPlayerMap = new Map<Number, Element>();
  public fplTeamsMap = new Map<Number, Team>();
  curr_gw: number = 1;
  finished: boolean = false;

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

      roundToTwo(num) {    
        return Math.round((num + Number.EPSILON) * 100) / 100;
      }

      fetchFPLPlayers(){
        return new Promise((resolve) => {
          let urlFinal: string = 'https://fantasy.premierleague.com/api/bootstrap-static/';
          fetch(urlFinal).
          then(res => res.json())
              .then(res => {
                const resResult: FPLBootStrap = <FPLBootStrap>res;
                if(resResult.teams){
                  resResult.teams.forEach(team => {
                    this.fplTeamsMap.set(team.id, team);
                  })
                }
                if(resResult.elements){
                  resResult.elements.forEach(element => {
                    this.fplPlayerMap.set(element.id, element);
                  });
                }
                if(resResult.events){
                  resResult.events.forEach(event =>{
                    if(event.is_current){
                      this.curr_gw = event.id;
                      this.finished = event.finished;
                    }
                  });
                }
                resolve(true);
              })
          })
      }

      fetchCurrGW(){
        return new Promise((resolve) => {
          let gw = 1;
          if(this.curr_gw !== 1){
            gw = this.curr_gw;
            resolve(gw);
          }
          else{
            this.fetchFPLPlayers().then(res =>{
                gw =this.curr_gw;
                resolve(gw);
            })
          }
        });
      }
}

export default new CommonUtils();