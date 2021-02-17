

    export interface Item {
        manager_id: number;
        rival_id: number;
        rival_name: string;
    }

    export interface Link {
        rel: string;
        href: string;
    }

    export interface Rivals {
        items: Item[];
        hasMore: boolean;
        limit: number;
        offset: number;
        count: number;
        links: Link[];
    }


