// To parse this data:
//
//   import { Convert } from "./file";
//
//   const capQuota = Convert.toCapQuota(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface CapQuota {
    captain:         Player;
    vice_captain:    Player;
    substitute:      Player;
    game_week:       GameWeek;
    team:            Team;
    total_score:     number;
    bonus_gained:    number;
    bps_gained:      number;
    penalty_applied: boolean;
    rank:            number;
    points:          number;
    details:         string;
}

export interface Player {
    id:            number;
    first_name:    string;
    last_name:     string;
    fpl_id:        number;
    live_gw_score: number;
}

export interface GameWeek {
    gw:      number;
    fpl_gw:  number;
    is_dgw:  boolean;
    is_bgw:  boolean;
    average: number;
}

export interface Team {
    id:           number;
    name:         string;
    total_points: number;
    no_of_wins:   number;
    no_of_bonus:  number;
    total_bps:    number;
    updated_at:   Date;
    image_url:    null;
    total_score:  number;
}