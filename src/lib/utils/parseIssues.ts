import type { Issue } from "$lib/types/issues";

export function parseIssues(xmlString: string): Issue[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const issueNodes = xmlDoc.getElementsByTagName("ISSUE");
    
    return Array.from(issueNodes).map(issueNode => {
        const options = Array.from(issueNode.getElementsByTagName("OPTION"))
            .map(option => ({
                id: option.getAttribute("id") || "",
                text: option.textContent || ""
            }));

        return {
            id: issueNode.getAttribute("id") || "",
            title: issueNode.getElementsByTagName("TITLE")[0]?.textContent || "",
            text: issueNode.getElementsByTagName("TEXT")[0]?.textContent || "",
            author: issueNode.getElementsByTagName("AUTHOR")[0]?.textContent || "",
            editor: issueNode.getElementsByTagName("EDITOR")[0]?.textContent || "",
            pic1: issueNode.getElementsByTagName("PIC1")[0]?.textContent || "",
            pic2: issueNode.getElementsByTagName("PIC2")[0]?.textContent || "",
            options
        };
    });
}