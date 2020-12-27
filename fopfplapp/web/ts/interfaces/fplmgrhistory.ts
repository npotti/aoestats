export interface Current {
        event: number;
        points: number;
        total_points: number;
        rank: number;
        rank_sort: number;
        overall_rank: number;
        bank: number;
        value: number;
        event_transfers: number;
        event_transfers_cost: number;
        points_on_bench: number;
    }

    export interface Past {
        season_name: string;
        total_points: number;
        rank: number;
    }

    export interface Chip {
        name: string;
        time: Date;
        event: number;
    }

    export interface FplMgrHistory {
        current: Current[];
        past: Past[];
        chips: Chip[];
    }

