export interface WAResolution {
    id: string;
    name: string;
    description: string;
    category: string;
    industry: string;
    proposedBy: string;
    created: number;
    promoted: number;
    totalNations: {
        for: number;
        against: number;
    };
    totalVotes: {
        for: number;
        against: number;
    };
    voteTrack: {
        for: number[];
        against: number[];
    };
}