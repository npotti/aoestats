
    export interface Manager {
        id: number;
        first_name: string;
        last_name: string;
        fpl_id: number;
        live_gw_score: number;
    }

    export interface Player {
        id: number;
        first_name: string;
        last_name: string;
        fpl_id: number;
        live_gw_score: number;
    }

    export interface Chip {
        chip: number;
        team: number;
        is_used: boolean;
        used_gw?: number;
        info: string;
    }

    export interface Captain {
        id: number;
        first_name: string;
        last_name: string;
        fpl_id: number;
        live_gw_score: number;
    }

    export interface ViceCaptain {
        id: number;
        first_name: string;
        last_name: string;
        fpl_id: number;
        live_gw_score: number;
    }

    export interface Substitute {
        id: number;
        first_name: string;
        last_name: string;
        fpl_id: number;
        live_gw_score: number;
    }

    export interface GameWeek2 {
        gw: number;
        fpl_gw: number;
        is_dgw: boolean;
        is_bgw: boolean;
        average: number;
    }

    export interface Team {
        id: number;
        name: string;
        total_points: number;
        no_of_wins: number;
        no_of_bonus: number;
        total_bps: number;
        updated_at: Date;
        image_url?: any;
        total_score: number;
        final_points: number;
    }

    export interface GameWeek {
        captain: Captain;
        vice_captain: ViceCaptain;
        substitute: Substitute;
        game_week: GameWeek2;
        team: Team;
        final_points: number;
        total_score: number;
        bonus_gained: number;
        bps_gained: number;
        penalty_applied: boolean;
        rank: number;
        points: number;
        details: string;
    }

    export interface AoeTeam {
        id: number;
        name: string;
        total_points: number;
        no_of_wins: number;
        no_of_bonus: number;
        total_bps: number;
        updated_at: Date;
        image_url?: any;
        total_score: number;
        final_points: number;
        manager: Manager;
        players: Player[];
        chips: Chip[];
        game_week: GameWeek;
    }

