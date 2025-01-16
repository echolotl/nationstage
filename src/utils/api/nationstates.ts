// src/utils/api/nationstates.ts
const BASE_URL = 'https://www.nationstates.net/cgi-bin/api.cgi';
const USER_AGENT = 'NationStage/0.1.0 (by Taelboa)';
import { XMLParser } from 'fast-xml-parser';


export interface NationData {
    name: string;
    flag: string;
    population: number;
    region: string;
    founded: string;
    category: string;

}

export async function fetchNationData(nationName: string): Promise<NationData> {
    const params = new URLSearchParams({
        nation: nationName,
        q: 'name+flag+population+region+founded+category'
    });

    const response = await fetch(`${BASE_URL}?${params}`, {
        headers: {
            'User-Agent': USER_AGENT
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch nation data');
    }

    const text = await response.text();
    console.log(text);
    const parser = new XMLParser();
    const data = parser.parse(text);
    console.log(data);
    return {
        name: nationName,
        flag: data.NATION.FLAG,
        population: data.NATION.POPULATION,
        region: data.NATION.REGION,
        founded: data.NATION.FOUNDED,
        category: data.NATION.CATEGORY
    };
}