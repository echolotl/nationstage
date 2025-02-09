interface CensusScale {
    name: string;
    unit: string;
    prefix?: string;
    descriptor?: string;
}

export const censusScales: { [key: number]: CensusScale } = {
    0: { name: "Civil Rights", descriptor: "Most Extensive Civil Rights", unit: "Martin Luther King, Jr. Units"},
    1: { name: "Economy", descriptor: "Most Efficient Economies", unit: "Krugman-Greenspan Business Outlook Index", prefix:"in the" },
    2: { name: "Political Freedom", descriptor: "Most Politically Free", unit: "Diebold Election Inking Scale", prefix:"on the"},
    3: { name: "Population", descriptor: "Largest Populations", unit: "Capita" },
    4: { name: "Wealth Gaps", descriptor: "Greatest Rich-Poor Divides", unit: "Rich to Poor Income Ratio" },
    5: { name: "Death Rate", descriptor: "Highest Unexpected Death Rate", unit: "Bus Suprisal Index", prefix:"on the"},
    6: { name: "Compassion", descriptor: "Most Compassionate Citizens", unit: "Kitten Softness Rating"},
    7: { name: "Eco-Friendliness", descriptor: "Most Eco-Friendly Governments", unit: "Dolphin Recycling Awareness Index", prefix:"in the" },
    8: { name: "Social Conservatism", descriptor: "Most Conservative", unit: "Bush-Santorum Dawning Terror Index", prefix:"in the" },
    9: { name: "Nudity", descriptor: "Nudest", unit: "Cheeks Per Square Mile" },
    10: { name: "Industry: Automobile Manufacturing", descriptor: "Largest Automobile Manufacturing Sector", unit: "Henry Ford Productivity Index", prefix:"in the" },
    11: { name: "Industry: Cheese Exports", descriptor: "Largest Cheese Export Sector", unit: "Mozzarella Productivity Index", prefix:"in the" },
    12: { name: "Industry: Basket Weaving", descriptor: "Largest Basket Weaving Sector", unit: "Basketry Productivity Index", prefix:"in the" },
    13: { name: "Industry: Information Technology", descriptor: "Largest Information Technology Sector", unit: "Fann-Boi Productivity Index", prefix:"in the" },
    14: { name: "Industry: Pizza Delivery", descriptor: "Largest Pizza Delivery Sector", unit: "Pepperoni Propultion Productivity Index", prefix:"in the" },
    15: { name: "Industry: Trout Fishing", descriptor: "Largest Trout Fishing Sector",  unit: "Nemo Depletion Productivity Index", prefix:"on the"},
    16: { name: "Industry: Arms Manufacturing", descriptor: "Largest Arms Manufacturing Sector", unit: "Charon Productivity Index", prefix:"in the" },
    17: { name: "Sector: Agriculture", descriptor: "Largest Agricultural Sector", unit: "Mu-Bah-Daggs Productivity Index", prefix:"in the" },
    18: { name: "Industry: Beverage Sales", descriptor: "Largest Soda Pop Sector", unit: "Addison-Fukk Productivity Index", prefix:"in the" },
    19: { name: "Industry: Timber Woodchipping", descriptor: "Largest Timber Woodchipping Industry", unit: "Tasmanian Pulp Environmental Export Index", prefix:"in the" },
    20: { name: "Industry: Mining", descriptor: "Largest Mining Sector", unit: "Blue Sky Asbestos Index", prefix:"in the" },
    21: { name: "Industry: Insurance", descriptor: "Largest Insurance Industry", unit: "Risk Expulsion Productivity Index", prefix:"in the" },
    22: { name: "Industry: Furniture Restoration", descriptor: "Largest Furniture Restoration Industry", unit: "Spitz-Pollish Productivity Index", prefix:"in the" },
    23: { name: "Industry: Retail", descriptor: "Largest Retail Industry", unit: "Shrinkwrap Consignment Productivity Index", prefix:"in the" },
    24: { name: "Industry: Book Publishing", descriptor: "Largest Publishing Industry", unit: "Bella Potter Productivity e-Index", prefix:"in the" },
    25: { name: "Industry: Gambling", descriptor: "Largest Gambling Industry", unit: "Kelly Criterion Productivity Index", prefix:"in the" },
    26: { name: "Sector: Manufacturing", descriptor: "Largest Manufacturing Sector", unit: "Gooback-Jerbs Productivity Index", prefix:"in the" },
    27: { name: "Government Size", descriptor: "Largest Governments", unit: "Bureaucratic Comprehensiveness Rating Scale Index", prefix:"in the" },
    28: { name: "Welfare", descriptor: "Largest Welfare Programs", unit: "Safety Net Mesh Density Rating" },
    29: { name: "Public Healthcare", descriptor: "Most Extensive Public Healthcare", unit: "Theresa-Nightingale Rating" },
    30: { name: "Law Enforcement", descriptor: "Most Advanced Law Enforcement", unit: "Orwell Orderliness Index", prefix:"in the"},
    31: { name: "Business Subsidization", descriptor: "Most Subsidized Industry", unit: "Gilded Widget Scale", prefix:"on the" },
    32: { name: "Religiousness", descriptor: "Most Devout", unit: "Prayers Per Hour" },
    33: { name: "Income Equality", descriptor: "Most Income Equality", unit: "Marx-Engels Emancipation Scale", prefix:"on the" },
    34: { name: "Niceness", descriptor: "Nicest Citizens", unit: "Average Smiles Per Day" },
    35: { name: "Rudeness", descriptor: "Rudest Citizens", unit: "Insults Per Minute" },
    36: { name: "Intelligence", descriptor: "Smartest Citizens", unit: "Quips Per Hour" },
    37: { name: "Ignorance", descriptor: "Most Ignorant Citizens", unit: "Missed References Per Hour" },
    38: { name: "Political Apathy", descriptor: "Most Politically Apathetic Citizens", unit: "Whatevers" },
    39: { name: "Health", descriptor: "Healthiest Citizens", unit: "Bananas Ingested Per Day" },
    40: { name: "Cheerfulness", descriptor: "Most Cheerful Citizens", unit: "Percentage Of Water Glasses Perceived Half-Full" },
    41: { name: "Weather", descriptor: "Best Weather", unit: "Meters Of Sunlight" },
    42: { name: "Compliance", descriptor: "Lowest Crime Rates", unit: "Law-abiding Acts Per Hour" },
    43: { name: "Safety", descriptor: "Safest", unit: "Bubble-Rapp Safety Rating" },
    44: { name: "Lifespan", descriptor: "Longest Average Lifespans", unit: "Years" },
    45: { name: "Ideological Radicality", descriptor: "Most Extreme", unit: "Paul-Nader Subjective Decentrality Index", prefix:"in the" },
    46: { name: "Defense Forces", descriptor: "Most Advanced Defense Forces", unit: "Total War Preparedness Rating" },
    47: { name: "Pacifism", descriptor: "Most Pacifist", unit: "Cheeks Turned Per Day" },
    48: { name: "Economic Freedom", descriptor: "Most Pro-Market", unit: "Rand Index", prefix:"in the" },
    49: { name: "Taxation", descriptor: "Highest Average Tax Rates", unit: "Effective Tax Rate" },
    50: { name: "Freedom from Taxation", descriptor: "Lowest Overall Tax Burden", unit: "Hayek Index", prefix:"in the" },
    51: { name: "Corruption", descriptor: "Most Corrupt Governments", unit: "Kickbacks Per Hour" },
    52: { name: "Integrity", descriptor: "Least Corrupt Governments", unit: "Percentage Of Bribes Refused" },
    53: { name: "Authoritarianism", descriptor: "Most Authoritarian", unit: "MilliStalins" },
    54: { name: "Youth Rebelliousness", descriptor:"Most Rebellious Youth", unit: "Stark-Dean Displacement Index", prefix:"in the" },
    55: { name: "Culture", descriptor: "Most Cultured", unit: "Snufflebottom-Wiggendum Pentatonic Scale", prefix:"on the" },
    56: { name: "Employment", descriptor: "Highest Workforce Participation Rate", unit: "Workforce Participation Rate" },
    57: { name: "Public Transport", descriptor: "Most Advanced Public Transport", unit: "Societal Mobility Rating" },
    58: { name: "Tourism", descriptor: "Most Popular Tourist Destinations", unit: "Tourists Per Hour" },
    59: { name: "Weaponization", descriptor: "Most Armed", unit: "Weapons Per Person" },
    60: { name: "Recreational Drug Use", descriptor: "Highest Drug Use", unit: "Pineapple Fondness Rating" },
    61: { name: "Obesity", descriptor: "Fattest Citizens", unit: "Obesity Rate" },
    62: { name: "Secularism", descriptor: "Most Secular", unit: "Atheism Rate" },
    63: { name: "Environmental Beauty", descriptor: "Most Beautiful Environments", unit: "Pounds Of Wildlife Per Square Mile" },
    64: { name: "Charmlessness", descriptor: "Most Avoided", unit: "Kardashian Reflex Score" },
    65: { name: "Influence", descriptor: "Most Influential", unit: "Soft Power Disbursement Rating" },
    66: { name: "World Assembly Endorsements", descriptor: "Most World Assembly Endorsements", unit: "Valid Endorsements" },
    67: { name: "Averageness", descriptor: "Most Average", unit: "Average Standardized Normality Scale", prefix:"on the" },
    68: { name: "Human Development Index", descriptor: "Most Developed", unit: "Human Development Index", prefix:"in the" },
    69: { name: "Primitiveness", descriptor: "Most Primitive", unit: "Scary Big Number Scale", prefix:"on the" },
    70: { name: "Scientific Advancement", descriptor: "Most Scientifically Advanced", unit: "Kurzweil Singularity Index", prefix:"in the" },
    71: { name: "Inclusiveness", descriptor: "Most Inclusive", unit: "Mandela-Wollstonecraft Non-Discrimination Index", prefix:"in the" },
    72: { name: "Average Income", descriptor: "Highest Average Incomes", unit: "[nation-currency]" },
    73: { name: "Average Income of Poor", descriptor: "Highest Poor Incomes", unit: "[nation-currency]" },
    74: { name: "Average Income of Rich", descriptor: "Highest Wealthy Incomes", unit: "[nation-currency]" },
    75: { name: "Public Education", descriptor: "Most Advanced Public Education", unit: "Edu-tellignce® Test Score" },
    76: { name: "Economic Output", descriptor: "Highest Economic Output", unit: "[nation-currency]" },
    77: { name: "Crime", descriptor: "Highest Crime Rates", unit: "Crimes Per Hour" },
    78: { name: "Foreign Aid", descriptor: "Highest Foreign Aid Spending", unit: "Clooney Contribution Index", prefix:"in the" },
    79: { name: "Black Market", descriptor: "Largest Black Market", unit: "[nation-currency]" },
    80: { name: "Residency", descriptor: "Most Stationary", unit: "Days" },
    81: { name: "Survivors", descriptor: "Most Survivors", unit: "Survivors" },
    82: { name: "Zombies", descriptor: "Most Zombies ", unit: "Zombies" },
    83: { name: "Dead", descriptor: "Most Dead", unit: "Bodies" },
    84: { name: "Percentage Zombified", descriptor: "Most Zombified", unit: "Romero-Brooks Index", prefix:"in the" },
    85: { name: "Average Disposable Income", descriptor: "Highest Disposable Incomes ", unit: "[nation-currency]" },
    86: { name: "International Artwork", descriptor: "Most Valuable International Artwork", unit: "Bank"},
    87: { name: "Patriotism", descriptor: "The Most Patriotic in the World", unit: "Flags Saluted Per Person Per Day"},
    88: { name: "Food Quality",  descriptor: "The Highest Food Quality in the World", unit: "Meeshlin-Starr Index", prefix:"in the"},
};