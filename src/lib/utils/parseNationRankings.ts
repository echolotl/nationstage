export interface CensusRanking {
    id: number;
    name: string;
    rank: number;
    percentile: number;
    score: number;
    totalNations: number;
    trophyIcon?: string;  // Add trophy icon field
    imageName: string;  // Add this field
}

export enum TopPercentileType {
    TOP_ONE = 1,
    TOP_FIVE = 5,
    TOP_TEN = 10
}

export const TROPHY_IMAGE_NAMES: Record<number, string> = {
    0: "liberal",
    1: "economy",
    2: "polifree",
    3: "population",
    4: "wealthgaps",
    5: "death",
    6: "compassionate",
    7: "eco-govt",
    8: "conservative",
    9: "nude",
    10: "auto",
    11: "cheese",
    12: "basket",
    13: "tech",
    14: "pizza",
    15: "fish",
    16: "arms",
    17: "agriculture",
    18: "soda",
    19: "timber",
    20: "mining",
    21: "insurance",
    22: "furniture",
    23: "retail",
    24: "publishing",
    25: "gambling",
    26: "manufacturing",
    27: "govt",
    28: "welfare",
    29: "healthcare",
    30: "police",
    31: "business",
    32: "devout",
    33: "equality",
    34: "nice",
    35: "rude",
    36: "smart",
    37: "stupid",
    38: "apathetic",
    39: "healthy",
    40: "happy",
    41: "weather",
    42: "lowcrime",
    43: "safe",
    44: "life",
    45: "extreme",
    46: "defense",
    47: "peace",
    48: "pro-market",
    49: "hightax",
    50: "lowtax",
    51: "corrupt",
    52: "leastcorrupt",
    53: "authoritarian",
    54: "rebelyouth",
    55: "culture",
    56: "employed",
    57: "publictransport",
    58: "tourism",
    59: "armed",
    60: "drugs",
    61: "fat",
    62: "godforsaken",
    63: "environment",
    64: "avoided",
    65: "influence",
    66: "endorsed",
    67: "average",
    68: "hdi",
    69: "primitive",
    70: "advanced",
    71: "inclusive",
    72: "income",
    73: "poorincome",
    74: "richincome",
    75: "educated",
    76: "gdp",
    77: "crime",
    78: "aid",
    79: "blackmarket",
    80: "stationary",
    81: "survivors",
    82: "zombies",
    83: "dead",
    84: "zratio",
    85: "dispincome",
    86: "deck",
    87: "patriotism",
    88: "foodquality"
};

function getTrophyIcon(rank: number, percentile: number): string | undefined {
    if (rank === 1) return '-1t';
    if (percentile >= 99) return '-1';
    if (percentile >= 95) return '-5';
    if (percentile >= 90) return '-10';
    return undefined;
}

export function parseNationRankings(xmlString: string, topPercentile?: TopPercentileType): CensusRanking[] {
    if (!xmlString) {
        console.warn('Empty XML string received');
        return [];
    }

    console.log('Parsing rankings XML:', xmlString.substring(0, 200) + '...'); // Debug XML input
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Check for XML parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
        console.error('XML parsing error:', parseError.textContent);
        return [];
    }
    
    // If NUMNATIONS is missing, try to get the number from NATIONS tag or default to world size
    let totalNations = parseInt(xmlDoc.querySelector('NUMNATIONS')?.textContent || '0');
    if (totalNations <= 0) {
        totalNations = 30000; // Approximate world size as fallback
        console.warn('Using fallback world size:', totalNations);
    }

    const scales = xmlDoc.querySelectorAll('SCALE');
    console.log('Number of scales found:', scales.length); // Debug scales count

    if (scales.length === 0) {
        console.warn('No census scales found in XML');
        return [];
    }

    const rankings: CensusRanking[] = [];

    scales.forEach((scale, index) => {
        const id = parseInt(scale.getAttribute('id') || '0');
        const rank = parseInt(scale.querySelector('RANK')?.textContent || '0');
        const score = parseFloat(scale.querySelector('SCORE')?.textContent || '0');
        
        // Debug individual scale data
        console.log(`Scale ${index}:`, { id, rank, score });
        
        const percentile = ((totalNations + 1 - rank) / (totalNations + 1)) * 100;
        console.log(`Calculated percentile for scale ${id}:`, percentile); // Debug percentile

        if (!topPercentile || percentile >= (100 - topPercentile)) {
            rankings.push({
                id,
                name: CENSUS_NAMES[id] || `Census ${id}`,
                rank,
                percentile: Math.round(percentile * 100) / 100, // Round to 2 decimal places
                score,
                totalNations,
                trophyIcon: getTrophyIcon(rank, percentile),
                imageName: TROPHY_IMAGE_NAMES[id] || `census${id}`
            });
        }
    });

    console.log('Final rankings count:', rankings.length); // Debug final count
    return rankings.sort((a, b) => b.percentile - a.percentile);
}

// Complete census names mapping
export const CENSUS_NAMES: Record<number, string> = {
    0: "Civil Rights",
    1: "Economy",
    2: "Political Freedoms",
    3: "Population",
    4: "Wealth Gaps",
    5: "Death Rate",
    6: "Compassion",
    7: "Eco-Friendliness",
    8: "Social Conservatism",
    9: "Nudity",
    10: "Industry: Automobile Manufacturing",
    11: "Industry: Cheese Exports",
    12: "Industry: Basket Weaving",
    13: "Industry: Information Technology",
    14: "Industry: Pizza Delivery",
    15: "Industry: Trout Fishing",
    16: "Industry: Arms Manufacturing",
    17: "Sector: Agriculture",
    18: "Industry: Beverage Sales",
    19: "Industry: Timber Woodchipping",
    20: "Industry: Mining",
    21: "Industry: Insurance",
    22: "Industry: Furniture Restoration",
    23: "Industry: Retail",
    24: "Industry: Book Publishing",
    25: "Industry: Gambling",
    26: "Sector: Manufacturing",
    27: "Government Size",
    28: "Welfare",
    29: "Public Healthcare",
    30: "Law Enforcement",
    31: "Business Subsidization",
    32: "Religiousness",
    33: "Income Equality",
    34: "Niceness",
    35: "Rudeness",
    36: "Intelligence",
    37: "Ignorance",
    38: "Political Apathy",
    39: "Health",
    40: "Cheerfulness",
    41: "Weather",
    42: "Compliance",
    43: "Safety",
    44: "Lifespan",
    45: "Ideological Radicality",
    46: "Defense Forces",
    47: "Pacifism",
    48: "Economic Freedom",
    49: "Taxation",
    50: "Freedom from Taxation",
    51: "Corruption",
    52: "Integrity",
    53: "Authoritarianism",
    54: "Youth Rebelliousness",
    55: "Culture",
    56: "Employment",
    57: "Public Transport",
    58: "Tourism",
    59: "Weaponization",
    60: "Recreational Drug Use",
    61: "Obesity",
    62: "Secularism",
    63: "Environmental Beauty",
    64: "Charmlessness",
    65: "Influence",
    66: "World Assembly Endorsements",
    67: "Averageness",
    68: "Human Development Index",
    69: "Primitiveness",
    70: "Scientific Advancement",
    71: "Inclusiveness",
    72: "Average Income",
    73: "Average Income of Poor",
    74: "Average Income of Rich",
    75: "Public Education",
    76: "Economic Output",
    77: "Crime",
    78: "Foreign Aid",
    79: "Black Market",
    80: "Residency",
    81: "Survivors",
    82: "Zombies",
    83: "Dead",
    84: "Percentage Zombies",
    85: "Average Disposable Income",
    86: "International Artwork",
    87: "Patriotism",
    88: "Food Quality"
};
