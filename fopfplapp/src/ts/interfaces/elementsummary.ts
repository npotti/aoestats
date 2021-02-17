

    export interface Fixture {
        id: number;
        code: number;
        team_h: number;
        team_h_score?: any;
        team_a: number;
        team_a_score?: any;
        event: number;
        finished: boolean;
        minutes: number;
        provisional_start_time: boolean;
        kickoff_time: Date;
        event_name: string;
        is_home: boolean;
        difficulty: number;
    }

    export interface History {
        element: number;
        fixture: number;
        opponent_team: number;
        total_points: number;
        was_home: boolean;
        kickoff_time: Date;
        team_h_score: number;
        team_a_score: number;
        round: number;
        minutes: number;
        goals_scored: number;
        assists: number;
        clean_sheets: number;
        goals_conceded: number;
        own_goals: number;
        penalties_saved: number;
        penalties_missed: number;
        yellow_cards: number;
        red_cards: number;
        saves: number;
        bonus: number;
        bps: number;
        influence: string;
        creativity: string;
        threat: string;
        ict_index: string;
        value: number;
        transfers_balance: number;
        selected: number;
        transfers_in: number;
        transfers_out: number;
    }

    export interface HistoryPast {
        season_name: string;
        element_code: number;
        start_cost: number;
        end_cost: number;
        total_points: number;
        minutes: number;
        goals_scored: number;
        assists: number;
        clean_sheets: number;
        goals_conceded: number;
        own_goals: number;
        penalties_saved: number;
        penalties_missed: number;
        yellow_cards: number;
        red_cards: number;
        saves: number;
        bonus: number;
        bps: number;
        influence: string;
        creativity: string;
        threat: string;
        ict_index: string;
    }

    export interface ElementSummary {
        fixtures: Fixture[];
        history: History[];
        history_past: HistoryPast[];
    }

