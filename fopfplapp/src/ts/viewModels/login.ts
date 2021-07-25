import * as ko from "knockout";
import rootViewModel from "../appController";
import * as ModuleElementUtils from "ojs/ojmodule-element-utils";
import { ojModule } from "ojs/ojmodule-element";
import { ojButtonEventMap } from "ojs/ojbutton";
import CommonUtils from "../utils/commonutils";
import { Picks, Pick } from "../interfaces/picks";
import { ElementSummary } from "../interfaces/elementsummary";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";

import { FplMgrHistory, Chip, Current } from "../interfaces/fplmgrhistory";
import { FopUsers } from "../interfaces/ordsusers";
import * as service from "../utils/service";
import { ServiceName } from "../utils/serviceconfig";
import { HttpMethod } from "../utils/serviceutil";

import "ojs/ojtable";
import "ojs/ojchart";
import "ojs/ojlistview";
import "ojs/ojavatar";
import "ojs/ojinputtext";
import { ojValidationGroup } from "ojs/ojvalidationgroup";
import "ojs/ojvalidationgroup";
import * as Context from 'ojs/ojcontext';

class LoginViewModel {
  fplid: ko.Observable<number> = ko.observable(null);

  constructor() {
    CommonUtils.fplId = ko.observable(0);
    CommonUtils.team = ko.observable("");
    CommonUtils.name = ko.observable("");
  }

  private isLoginValid = (): boolean => {
    const idValid = document.getElementById(
      "idValidationGrp"
    ) as ojValidationGroup;
    if (idValid?.valid !== "valid") {
      idValid.showMessages();
      return false;
    }
    return true;
  };

  public loadUserData = () => {
    const context = document.querySelector("#fplid");
    const busyContext = Context.getContext(context).getBusyContext();
    const resolveContext = busyContext.addBusyState({ description: '' });
    if (this.isLoginValid()) {
      console.log(this);
      if (this.fplid()) {
        fetch(
          "https://jz4uwxx2v91zpxt-fopdb.adb.ap-hyderabad-1.oraclecloudapps.com/ords/fop/fop/fop_users/" +
            this.fplid()
        )
          .then((res) => res.json())
          .then((res) => {
            const resResult: FopUsers = <FopUsers>res;
            resResult.items.forEach((item) => {
              CommonUtils.fplId(item.fpl_id);
              CommonUtils.name(item.player_name);
              CommonUtils.team(item.fop_team);
              CommonUtils.isLMSVisible(item.is_lms_visible);
              CommonUtils.isCapPicksVisible(item.is_cap_picks_visible);
              CommonUtils.isCupVisible(item.is_aoe_cup_visible);
              CommonUtils.isFFFVisible(item.is_fff_visible);
              CommonUtils.isFOPVisible(item.is_fop_visible);
              CommonUtils.isInjuriesVisible(item.is_injuries_visible);
              CommonUtils.isPStatsVisible(item.is_p_stats_visible);
              CommonUtils.isPodcastVisible(item.is_podcasts_visible);
              CommonUtils.isRRVisible(item.is_rr_visible);
              CommonUtils.isSetpieceVisible(item.is_setpiece_visible);
              CommonUtils.isStatsVisible(item.is_stats_visible);
              CommonUtils.isTStatsVisible(item.is_t_stats_visible);
              CommonUtils.isTransferVisible(item.is_transfer_visible);
              CommonUtils.isYCVisible(item.is_yc_visible);
              console.log(CommonUtils.fplId());
            //   setTimeout(() => { 
                window.location.href = "?root=dashboard&fplid="+CommonUtils.fplId();
                // resolveContext();
            //   }, 2000); 
            });
          });
      }
    }
  };
}

export default LoginViewModel;
