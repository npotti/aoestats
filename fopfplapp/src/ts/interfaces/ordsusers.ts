    export interface Item {
        fpl_id: number;
        fop_team: string;
        player_name: string;
        is_fff_visible: string;
        is_rr_visible: string;
        is_fop_visible: string;
        is_aoe_cup_visible: string;
        is_podcasts_visible: string;
        is_lms_visible: string;
        is_yc_visible: string;
        is_injuries_visible: string;
        is_setpiece_visible: string;
        is_stats_visible: string;
        is_t_stats_visible: string;
        is_p_stats_visible: string;
        is_cap_picks_visible: string;
        is_transfer_visible: string;
    }

    export interface Link {
        rel: string;
        href: string;
    }

    export interface FopUsers {
        items: Item[];
        hasMore: boolean;
        limit: number;
        offset: number;
        count: number;
        links: Link[];
    }

