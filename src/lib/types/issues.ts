export interface Option {
    id: string;
    text: string;
}

export interface Policy {
    name: string;
    pictureId: string;
    category: string;
    description: string;
}

export interface Issue {
    id: string;
    title: string;
    text: string;
    author: string;
    editor: string;
    pic1: string;
    pic2: string;
    options: {
        id: string;
        text: string;
    }[];
}

export interface IssueResult {
    ok: boolean;
    error?: string;
    description: string;
    rankings?: {
        id: number;
        name: string;
        change: number;
    }[];
    headlines?: string[];
    unlocks?: string[];
    reclassifications?: string[];
    newPolicies?: Policy[];
    removedPolicies?: Policy[];
}