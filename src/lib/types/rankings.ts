export interface NationRanking {
    id: number;
    name: string;
    rank: number;
    percentile: number;
    score: number;
    imageName: string;
    trophyIcon: string;
}

export interface NationRankings {
    all: NationRanking[];
    topOne?: NationRanking[];
    topFive?: NationRanking[];
    topTen?: NationRanking[];
}
