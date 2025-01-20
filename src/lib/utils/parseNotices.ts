import type { Notice } from "$lib/types/notices";

export function parseNotices(xmlString: string): Notice[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const noticeNodes = xmlDoc.getElementsByTagName("NOTICE");
    const unreadNodes = xmlDoc.getElementsByTagName("UNREAD");
    
    const unreadNotices = new Set(
        Array.from(unreadNodes).map(node => node.textContent || '')
    );
    
    return Array.from(noticeNodes).map(notice => ({
        title: notice.getElementsByTagName("TITLE")[0]?.textContent || "",
        text: notice.getElementsByTagName("TEXT")[0]?.textContent || "",
        icon: notice.getElementsByTagName("TYPE_ICON")[0]?.textContent as Notice["icon"],
        unread: unreadNotices.has(notice.getAttribute("id") || '')
    }));
}