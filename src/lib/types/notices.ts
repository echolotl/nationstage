export interface Notice {
    title: string;
    text: string;
    icon?: "male" | "bell" | "lock-open" | "award" | "mail-alt";
    unread: boolean;
}