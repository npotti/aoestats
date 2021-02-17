
    export interface Squad {
        color: number;
        name: string;
    }

    export interface Bonus {
        team: string;
        name: string;
        is_captain: boolean;
        is_vice_captain: boolean;
        is_sub: boolean;
        is_star: boolean;
        star: number;
        fpl_id: number;
        score: number;
        squad: Squad[];
    }

