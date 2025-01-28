import type { Dispatch } from "$lib/types/factbook";

export function parseDispatch(xml: string): Dispatch {
    console.log('Parsing dispatch XML:', xml);
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    const dispatch = doc.getElementsByTagName("DISPATCH")[0];
    
    if (!dispatch) {
        console.error('No DISPATCH element found in XML');
        throw new Error('Invalid dispatch XML');
    }

    const text = dispatch.querySelector("TEXT");
    console.log('Found TEXT element:', text);
    console.log('TEXT content:', text?.textContent);
    
    const result = {
        id: dispatch.getAttribute("id") || "",
        title: dispatch.querySelector("TITLE")?.firstChild?.nodeValue || "",
        category: dispatch.querySelector("CATEGORY")?.textContent || "",
        subcategory: dispatch.querySelector("SUBCATEGORY")?.textContent || "",
        author: dispatch.querySelector("AUTHOR")?.textContent || "",
        created: parseInt(dispatch.querySelector("CREATED")?.textContent || "0", 10),
        edited: parseInt(dispatch.querySelector("EDITED")?.textContent || "0", 10),
        views: parseInt(dispatch.querySelector("VIEWS")?.textContent || "0", 10),
        score: parseInt(dispatch.querySelector("SCORE")?.textContent || "0", 10),
        text: text?.firstChild?.nodeValue || ""
    };
    
    console.log('Parsed dispatch result:', result);
    return result;
}