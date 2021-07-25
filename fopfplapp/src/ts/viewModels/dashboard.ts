import * as ko from "knockout";
import { whenDocumentReady } from "ojs/ojbootstrap";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
import * as Translations from "ojs/ojtranslation";
import "ojs/ojknockout";
import "ojs/ojmasonrylayout";
import "ojs/ojmenu";
import { ojMasonryLayout } from "ojs/ojmasonrylayout";
import "ojs/ojbutton";
import "ojs/ojcollapsible";
import CommonUtils from "../utils/commonutils";
import * as Context from "ojs/ojcontext";
import { FopUsers } from "../interfaces/ordsusers";
import { toggle } from "@oracle/oraclejet/dist/types/ojoffcanvas";

//masonry reorder tiles

type DataType = {
  name: string;
  sizeClass: string;
  inserted: ko.Observable<boolean>;
  desc: string;
  link: string;
};

class DashboardViewModel {
  masonryLayout : ojMasonryLayout;
  params = new URL(window.location.href).searchParams;
  fplid = this.params.get("fplid");
  welcomeMsg: ko.Observable<string> = ko.observable("");
  chemicals: ko.Observable<DataType[]>;
  dataprovider: ArrayDataProvider<String, DataType>;
  constructor() {
    this.chemicals = ko.observable([
      {
        name: "TES",
        sizeClass: "oj-masonrylayout-tile-2x1",
        inserted: ko.observable(
          CommonUtils.isFOPVisible() === "Y" ? true : false
        ),
        desc: "The Emmy's Show",
        link: "?root=aoe",
      },
      {
        name: "FFF",
        sizeClass: "oj-masonrylayout-tile-1x2",
        inserted: ko.observable(
          CommonUtils.isFFFVisible() === "Y" ? true : false
        ),
        desc: "FOP Fantasy Federation",
        link: "?root=fff",
      },
      {
        name: "TES Cup",
        sizeClass: "oj-masonrylayout-tile-2x1",
        inserted: ko.observable(
          CommonUtils.isCupVisible() === "Y" ? true : false
        ),
        desc: "The Emmy's Cup",
        link: "?root=aoelive",
      },
      {
        name: "Podcasts",
        sizeClass: "oj-masonrylayout-tile-1x1",
        inserted: ko.observable(
          CommonUtils.isPodcastVisible() === "Y" ? true : false
        ),
        desc: "Your Favourite Expert Corner",
        link: "?root=aoe",
      },
      {
        name: "Royal Rumble",
        sizeClass: "oj-masonrylayout-tile-1x2",
        inserted: ko.observable(
          CommonUtils.isRRVisible() === "Y" ? true : false
        ),
        desc: "Two Member Show",
        link: "?root=royalrumble",
      },
      {
        name: "FOP LMS",
        sizeClass: "oj-masonrylayout-tile-1x1",
        inserted: ko.observable(
          CommonUtils.isLMSVisible() === "Y" ? true : false
        ),
        desc: "Two Member Show",
        link: "?root=foplms",
      },
      {
        name: "Yellow Cards",
        sizeClass: "oj-masonrylayout-tile-1x1",
        inserted: ko.observable(
          CommonUtils.isYCVisible() === "Y" ? true : false
        ),
        desc: "Live PL Player's Card Accumulation",
        link: "?root=yctracking",
      },
      {
        name: "Injuries",
        sizeClass: "oj-masonrylayout-tile-1x1",
        inserted: ko.observable(
          CommonUtils.isInjuriesVisible() === "Y" ? true : false
        ),
        desc: "Live PL Player's Injuries",
        link: "?root=injuries",
      },
      {
        name: "Set Piece Takers",
        sizeClass: "oj-masonrylayout-tile-1x1",
        inserted: ko.observable(
          CommonUtils.isSetpieceVisible() === "Y" ? true : false
        ),
        desc: "Live PL Team's Set Piece Takers",
        link: "?root=setpieces",
      },
      {
        name: "TES Stats",
        sizeClass: "oj-masonrylayout-tile-1x1",
        inserted: ko.observable(
          CommonUtils.isStatsVisible() === "Y" ? true : false
        ),
        desc: "One Stop Solution to Stats of TES",
        link: "?root=aoe",
      },
      {
        name: "Team Level Stats",
        sizeClass: "oj-masonrylayout-tile-1x1",
        inserted: ko.observable(
          CommonUtils.isTStatsVisible() === "Y" ? true : false
        ),
        desc: "One Stop Solution to Stats of TES Teams",
        link: "?root=teams",
      },
      {
        name: "Player Level Stats",
        sizeClass: "oj-masonrylayout-tile-1x1",
        inserted: ko.observable(
          CommonUtils.isPStatsVisible() === "Y" ? true : false
        ),
        desc: "One Stop Solution to Stats of TES Players",
        link: "?root=players",
      },
      {
        name: "Captain Picks",
        sizeClass: "oj-masonrylayout-tile-1x1",
        inserted: ko.observable(
          CommonUtils.isCapPicksVisible() === "Y" ? true : false
        ),
        desc: "Check Out how your Captain Picks Performed",
        link: "?root=captains",
      },
      {
        name: "Transfer Analysis",
        sizeClass: "oj-masonrylayout-tile-1x1",
        inserted: ko.observable(
          CommonUtils.isTransferVisible() === "Y" ? true : false
        ),
        desc: "Check Out how your Transfers faired",
        link: "?root=transferanalysis",
      },
    ]);

    this.dataprovider = new ArrayDataProvider(this.chemicals(), {
      keyAttributes: "name",
    });

    // const context = document.querySelector("masonryLayout");
    // const busyContext = Context.getContext(context).getBusyContext();
    // const resolveContext = busyContext.addBusyState({ description: '' });
    // setTimeout(() => { 
      this.loadUserData().then((res) => {
        console.log(12343);
        console.log(CommonUtils.fplId());
        let masonryLayout = document.querySelector(
          ".oj-masonrylayout"
        ) as ojMasonryLayout;
        this.chemicals().forEach(tile => {
          switch(tile.name){
            case "TES":
              console.log("Inside TES : "+CommonUtils.isFOPVisible());
              tile.inserted(CommonUtils.isFOPVisible() === 'Y' ? true : false);
              if(CommonUtils.isFOPVisible() === 'N'){
                masonryLayout.removeTile("#tile1");
              }
              break;
            case "FFF":
              console.log("Inside FFF : "+CommonUtils.isFFFVisible());
              tile.inserted(CommonUtils.isFFFVisible() === 'Y' ? true : false);
              if(CommonUtils.isFFFVisible() === 'N'){
                masonryLayout.removeTile("#tile2");
              }
              break;
            case "TES Cup":
              console.log("Inside TES Cup : "+CommonUtils.isCupVisible());
              tile.inserted(CommonUtils.isCupVisible() === 'Y' ? true : false);
              if(CommonUtils.isCupVisible() === 'N'){
                masonryLayout.removeTile("#tile3");
              }
              break;
            case "Podcasts":
              console.log("Inside Podcasts: "+CommonUtils.isPodcastVisible());
              tile.inserted(CommonUtils.isPodcastVisible() === 'Y' ? true : false);
              if(CommonUtils.isPodcastVisible() === 'N'){
                masonryLayout.removeTile("#tile4");
              }
              break;
            case "Royal Rumble":
              tile.inserted(CommonUtils.isRRVisible() === 'Y' ? true : false);
              if(CommonUtils.isRRVisible() === 'N'){
                masonryLayout.removeTile("#tile5");
              }
              break;
            case "FOP LMS":
              console.log(CommonUtils.isLMSVisible());
              tile.inserted(CommonUtils.isLMSVisible() === 'Y' ? true : false);
              if(CommonUtils.isLMSVisible() === 'N'){
                masonryLayout.removeTile("#tile6");
              }
              break;
            case "Yellow Cards":
              tile.inserted(CommonUtils.isYCVisible() === 'Y' ? true : false);
              if(CommonUtils.isYCVisible() === 'N'){
                masonryLayout.removeTile("#tile7");
              }
              break;
            case "Injuries":
              tile.inserted(CommonUtils.isInjuriesVisible() === 'Y' ? true : false);
              if(CommonUtils.isInjuriesVisible() === 'N'){
                masonryLayout.removeTile("#tile8");
              }
              break;
            case "Set Piece Takers":
              tile.inserted(CommonUtils.isSetpieceVisible() === 'Y' ? true : false);
              if(CommonUtils.isSetpieceVisible() === 'N'){
                masonryLayout.removeTile("#tile9");
              }
              break;
            case "TES Stats":
              tile.inserted(CommonUtils.isStatsVisible() === 'Y' ? true : false);
              if(CommonUtils.isStatsVisible() === 'N'){
                masonryLayout.removeTile("#tile10");
              }
              break;
            case "Team Level Stats":
              tile.inserted(CommonUtils.isTStatsVisible() === 'Y' ? true : false);
              if(CommonUtils.isTStatsVisible() === 'N'){
                masonryLayout.removeTile("#tile11");
              }
              break;
            case "Player Level Stats":
              tile.inserted(CommonUtils.isPStatsVisible() === 'Y' ? true : false);
              if(CommonUtils.isPStatsVisible() === 'N'){
                masonryLayout.removeTile("#tile12");
              }
              break;
            case "Captain Picks":
              tile.inserted(CommonUtils.isCapPicksVisible() === 'Y' ? true : false);
              if(CommonUtils.isCapPicksVisible() === 'N'){
                masonryLayout.removeTile("#tile13");
              }
              break;
            case "Transfer Analysis":
              console.log("Transfer :: "+CommonUtils.isTransferVisible())
              tile.inserted(CommonUtils.isTransferVisible() === 'Y' ? true : false);
              if(CommonUtils.isTransferVisible() === 'N'){
                masonryLayout.removeTile("#tile14");
              }
              break;
          }
        })
  
        if (CommonUtils.fplId() && CommonUtils.fplId() !== 0) {
          this.welcomeMsg(
            "Welcome " + CommonUtils.name() + ", " + CommonUtils.team()
          );
        } else {
          this.welcomeMsg("Welcome Guest");
        }
        this.dataprovider = new ArrayDataProvider(this.chemicals(), {
          keyAttributes: "name",
        });
        console.log(this.welcomeMsg());
      }).catch((res =>{  
   
          this.welcomeMsg("Welcome Guest");
        console.log("catch");
      }));
      // resolveContext();
    // }, 2000);
  }

  public loadUserData = () => {
    return new Promise((resolve) => {
      if (this.fplid) {
        fetch(
          "https://jz4uwxx2v91zpxt-fopdb.adb.ap-hyderabad-1.oraclecloudapps.com/ords/fop/fop/fop_users/" +
            this.fplid
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
              resolve(CommonUtils.fplId());
            });
          });
      }
    });
  };

  public getLabelId = (index: number) => {
    return "label" + (index + 1);
  };

  public getDragHandleTitle = () => {
    return Translations.getTranslatedString("oj-panel.tipDragToReorder");
  };

  public getDragHandleLabel = () => {
    return Translations.getTranslatedString("oj-panel.labelAccDragToReorder");
  };

  public getDragHandleLabelledBy = (index: number) => {
    return this.getDragHandleId(index) + " " + this.getLabelId(index);
  };

  public closestByClass = (el: any, className: string) => {
    while (!el.classList.contains(className)) {
      // Increment the loop to the parent node
      el = el.parentNode;
      if (!el) {
        return null;
      }
    }
    return el;
  };

  public demoRemoveTile = (event: Event) => {
    const target = event.target;
    const tile = this.closestByClass(target, "demo-tile");
    console.log(tile);
    let masonryLayout = this.closestByClass(tile, "oj-masonrylayout");
    console.log(masonryLayout);
    console.log(tile.getAttribute("id"));
    masonryLayout.removeTile("#" + tile.getAttribute("id"));
  };

  public getDragHandleId = (index: number) => {
    return "dragHandle" + (index + 1);
  };

  // This listener is called after the tile is removed from the
  // masonry layout.
  public demoHandleRemove = (event: any) => {
    const tile = event.detail.tile;
    // get the ko binding context for the tile DOM element
    const context = ko.contextFor(tile);
    // get the data for the tile, which will be an item in the
    // chemicals array defined above
    let data = context.$current.data;
    data.inserted(false);

    // Temporarily store the removed tile in a hidden holding area.
    let removedTilesHolder = document.getElementById("removedTilesHolder");
    removedTilesHolder.appendChild(tile);
  };

  public demoInsertTile = (event: Event, current: any) => {
    let masonryLayout = document.querySelector(
      ".oj-masonrylayout"
    ) as ojMasonryLayout;
    const tileId = this.getTileId(current.index);
    const name = current.data.name;
    let chemicals = this.chemicals;
    let insertIndex = 0;
    for (var i = 0; i < chemicals.length; i++) {
      if (chemicals[i].name === name) {
        break;
      } else if (chemicals[i].inserted()) {
        insertIndex += 1;
      }
    }
    masonryLayout.insertTile("#" + tileId, insertIndex);
  };

  public getTileId = (index: number) => {
    return "tile" + (index + 1);
  };

  // This listener is called after the tile is inserted into the
  // masonry layout.
  public demoHandleInsert = (event: any) => {
    const tile = event.detail.tile;
    // get the ko binding context for the tile DOM element
    const context = ko.contextFor(tile);
    // get the data for the tile, which will be an item in the
    // chemicals array defined above
    let data = context.$current.data;
    data.inserted(true);
  };

  public getAnchorId = (index: number) => {
    return "anchor" + (index + 1);
  };

  public getButtonId = (index: number) => {
    return "removeButton" + (index + 1);
  };

  public getButtonLabelledBy = (index: number) => {
    return this.getButtonId(index) + " " + this.getLabelId(index);
  };

  public getRemoveButtonLabel = () => {
    return Translations.getTranslatedString("oj-panel.labelAccButtonRemove");
  };
}

export default DashboardViewModel;
