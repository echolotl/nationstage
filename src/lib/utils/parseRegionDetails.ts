export interface RegionDetails {
    name: string;
    factbook: string;
    banner: string;
    flag: string;
    founder: string;
    founded: string;
    power: string;
    delegate: string;
    delegatevotes: number;
    delegateauth: string;
    officers: string[];
    embassies: string[];
    tags: string[];
    nations: string[];
    numunions: number;
    numnations: number;
    majorindustry: string;
    govern: string;
    income: number;
    tax: number;
    publicsector: number;
}

export function parseRegionDetails(xmlString: string): RegionDetails {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    function getTextContent(tagName: string): string {
        return xmlDoc.querySelector(tagName)?.textContent || '';
    }

    function getNumberContent(tagName: string): number {
        return parseInt(getTextContent(tagName)) || 0;
    }

    function getArrayContent(tagName: string): string[] {
        const elements = xmlDoc.querySelectorAll(tagName);
        return Array.from(elements).map(el => el.textContent || '');
    }

    return {
        name: getTextContent('NAME'),
        factbook: getTextContent('FACTBOOK'),
        banner: getTextContent('BANNER'),
        flag: getTextContent('FLAG'),
        founder: getTextContent('FOUNDER'),
        founded: getTextContent('FOUNDED'),
        power: getTextContent('POWER'),
        delegate: getTextContent('DELEGATE'),
        delegatevotes: getNumberContent('DELEGATEVOTES'),
        delegateauth: getTextContent('DELEGATEAUTH'),
        officers: getArrayContent('OFFICER'),
        embassies: getArrayContent('EMBASSY'),
        tags: getArrayContent('TAG'),
        nations: getArrayContent('NATION'),
        numunions: getNumberContent('NUMUNIONS'),
        numnations: getNumberContent('NUMNATIONS'),
        majorindustry: getTextContent('MAJORINDUSTRY'),
        govern: getTextContent('GOVERN'),
        income: getNumberContent('INCOME'),
        tax: getNumberContent('TAX'),
        publicsector: getNumberContent('PUBLICSECTOR')
    };
}