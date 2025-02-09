interface CensusScale {
    id: number;
    name: string;
    unit: string;
    title: string;
}

interface CensusEntry {
    id: number;
    score: number;
    rank: number;
    percentileRank: number;
    regionalRank: number;
}

const ID_TO_NAME: Record<number, string> = {

    0: 'Civil Rights',
    1: 'Economy',
    2: 'Political Freedom',
    3: 'Population',
    4: 'Wealth Gaps',
    5: 'Death Rate',
    6: 'Compassion',
    7: 'Eco-Friendliness',
    8: 'Social Conservatism',
    9: 'Nudity',
    10: 'Industry: Automobile Manufacturing',
    11: 'Industry: Cheese Exports',
    12: 'Industry: Basket Weaving',
    13: 'Industry: Informtion Technology',
    14: 'Industry: Pizza Delivery',
    15: 'Industry: Trout Fishing',
    16: 'Industry: Arms Manufacturing',
    17: 'Sector: Agriculture',
    18: 'Industry: Beverage Sales',
    19: 'Industry: Timber Woodchipping',
20: 'Industry: Mining',
21: 'Industry: Insurance',
22: 'Industry: Furniture Restoration',
23: 'Industry: Retail',
24: 'Industry: Book Publishing',
25: 'Industry: Gambling',
26: 'Sector: Manufacturing',
27: 'Government Size',
28: 'Welfare',
29: 'Public Healthcare',
30: 'Law Enforcement',
31: 'Business Subsidization',
32: 'Religiousness',
33: 'Income Equality',
34: 'Niceness',
35: 'Rudeness',
36: 'Intelligence',
37: 'Ignorance',
38: 'Political Apathy',
39: 'Health',
40: 'Cheerfulness',
41: 'Weather',
42: 'Compliance',
43: 'Safety',
44: 'Lifespan',
45: 'Ideological Radicality',
46: 'Defense Forces',
47: 'Pacifism',
48: 'Economic Freedom',
49: 'Taxation',
50: 'Freedom from Taxation',
51: 'Corruption',
52: 'Integrity',
53: 'Authoritarianism',
54: 'Youth Rebelliousness',
55: 'Culture',
56: 'Employment',
57: 'Public Transport',
58: 'Tourism',
59: 'Weaponization',
60: 'Recreational Drug Use',
61: 'Obesity',
62: 'Secularism',
63: 'Environmental Beauty',
64: 'Charmlessness',
65: 'Influence',
66: 'World Assembly Endorsements',
67: 'Averageness',
68: 'Human Development Index',
69: 'Primitiveness',
70: 'Scientific Advancement',
71: 'Inclusiveness',
72: 'Average Income',
73: 'Average Income of Poor',
74: 'Average Income of Rich',
75: 'Public Education',
76: 'Economic Output',
77: 'Crime',
78: 'Foreign Aid',
79: 'Black Market',
80: 'Residency',
81: 'Survivors',
82: 'Zombies',
83: 'Dead',
84: 'Percentage Dead',
85: 'Average Disposable Income',
86: 'International Artwork',

};

export function parseWorldCensusInfo(xmlString: string): { [key: number]: CensusScale } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');
    console.log('Parsing world census info:', xmlString.substring(0, 300) + '...');
    const scales: { [key: number]: CensusScale } = {};

    // Use the ID_TO_NAME mapping instead of trying to read text content from <CENSUS>.
    doc.querySelectorAll('CENSUS').forEach(census => {
        const id = parseInt(census.getAttribute('id') || '0');
        scales[id] = {
            id,
            name: ID_TO_NAME[id] || '',
            unit: doc.querySelector(`CENSUSSCALE[id="${id}"]`)?.textContent || '',
            title: doc.querySelector(`CENSUSTITLE[id="${id}"]`)?.textContent || ''
        };
    });

    return scales;
}

export function parseCensusData(xmlString: string): CensusEntry[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');
    console.log('Parsing census data:', xmlString.substring(0, 200) + '...');
    const entries: CensusEntry[] = [];

    doc.querySelectorAll('SCALE').forEach(scale => {
        const id = parseInt(scale.getAttribute('id') || '0');
        entries.push({
            id,
            score: parseFloat(scale.querySelector('SCORE')?.textContent || '0'),
            rank: parseInt(scale.querySelector('RANK')?.textContent || '0'),
            percentileRank: parseFloat(scale.querySelector('PRANK')?.textContent || '0'),
            regionalRank: parseInt(scale.querySelector('RRANK')?.textContent || '0')
        });
    });

    return entries;
}

