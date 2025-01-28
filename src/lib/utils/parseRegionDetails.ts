import { XMLParser } from 'fast-xml-parser';

export interface Officer {
    nation: string;
    office: string;
    authority: string;
    time: number;
    by: string;
    order: number;
    flagUrl?: string; // Added for storing the flag URL
    fullname?: string;
}

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
    officers: Officer[];
    governor: string;
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
    const parser = new XMLParser({
        ignoreAttributes: false,
        parseTagValue: true
    });
    
    const result = parser.parse(xmlString);
    const region = result.REGION;
    
    console.log('Parsed XML:', result); // Debug

    // Handle officers array properly
    const officers = region.OFFICERS?.OFFICER || [];
    // Ensure officers is always treated as an array
    const officersArray = Array.isArray(officers) ? officers : [officers];

    return {
        name: region.NAME || '',
        factbook: region.FACTBOOK || '',
        banner: region.BANNER || '',
        flag: region.FLAG || '',
        founder: region.FOUNDER || '',
        founded: region.FOUNDED || '',
        power: region.POWER || '',
        delegate: region.DELEGATE || '',
        delegatevotes: parseInt(region.DELEGATEVOTES) || 0,
        delegateauth: region.DELEGATEAUTH || '',
        officers: officersArray.map(officer => ({
            nation: officer.NATION || '',
            office: officer.OFFICE || '',
            authority: officer.AUTHORITY || '',
            time: parseInt(officer.TIME) || 0,
            by: officer.BY || '',
            order: parseInt(officer.ORDER) || 0,
            flagUrl: officer.FLAGURL || '' // Added for storing the flag URL
        })),
        governor: region.GOVERNOR || '',
        embassies: Array.isArray(region.EMBASSY) ? region.EMBASSY : [region.EMBASSY].filter(Boolean),
        tags: Array.isArray(region.TAG) ? region.TAG : [region.TAG].filter(Boolean),
        nations: (region.NATIONS || '').split(':').filter(Boolean),
        numunions: parseInt(region.NUMUNIONS) || 0,
        numnations: parseInt(region.NUMNATIONS) || 0,
        majorindustry: region.MAJORINDUSTRY || '',
        govern: region.GOVERN || '',
        income: parseInt(region.INCOME) || 0,
        tax: parseInt(region.TAX) || 0,
        publicsector: parseInt(region.PUBLICSECTOR) || 0
    };
}