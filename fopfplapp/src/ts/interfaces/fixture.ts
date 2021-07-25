export interface Fixture {
    code: number;
    event?: number;
    finished: boolean;
    finished_provisional: boolean;
    id: number;
    kickoff_time?: Date;
    minutes: number;
    provisional_start_time: boolean;
    started?: boolean;
    team_a: number;
    team_a_score?: number;
    team_h: number;
    team_h_score?: number;
    team_h_difficulty: number;
    team_a_difficulty: number;
    pulse_id: number;
}