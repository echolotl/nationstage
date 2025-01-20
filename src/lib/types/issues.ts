export interface Option {
    id: string;
    text: string;
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