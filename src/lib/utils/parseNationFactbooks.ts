import type { FactbookDetails } from "$lib/types/factbook";

export function parseNationFactbook(xml: string): FactbookDetails[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    const factbooks = doc.getElementsByTagName("FACTBOOK");
    
    return Array.from(factbooks).map(factbook => ({
        id: factbook.getAttribute("id") || "",
        title: factbook.querySelector("TITLE")?.textContent?.trim() || "",
        category: factbook.querySelector("CATEGORY")?.textContent || "",
        subcategory: factbook.querySelector("SUBCATEGORY")?.textContent || "",
        author: factbook.querySelector("AUTHOR")?.textContent || "",
        created: parseInt(factbook.querySelector("CREATED")?.textContent || "0", 10),
        edited: parseInt(factbook.querySelector("EDITED")?.textContent || "0", 10),
        views: parseInt(factbook.querySelector("VIEWS")?.textContent || "0", 10),
        score: parseInt(factbook.querySelector("SCORE")?.textContent || "0", 10)
    }));
}

export function groupFactbooksBySubcategory(factbooks: FactbookDetails[]): Record<string, FactbookDetails[]> {
    return factbooks.reduce((groups, factbook) => {
        const subcategory = factbook.subcategory;
        if (!groups[subcategory]) {
            groups[subcategory] = [];
        }
        groups[subcategory].push(factbook);
        return groups;
    }, {} as Record<string, FactbookDetails[]>);
}
