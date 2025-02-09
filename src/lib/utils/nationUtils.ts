// Functions to export
export function getSizeAdjective(population: number): string {
    switch (true) {
        case population < 6 && population >= 5: return "fledgling";
        case population < 19 && population >= 7: return "tiny";
        case population < 49 && population >= 20: return "small";
        case population < 99 && population >= 50: return "large";
        case population < 199 && population >= 100: return "very large";
        case population < 999 && population >= 200: return "huge";
        case population < 4999 && population >= 1000: return "massive";
        case population < 9999 && population >= 5000: return "large";
        case population >= 10000: return "gargantuan";
        default: return "";
    }
}

export function formatList(items: string[]): string {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    return items.slice(0, -1).join(", ") + ", and " + items.slice(-1);
}

export function getCategoryDescription(category: string): string {
    const descriptions: { [key: string]: string } = {
        "Anarchy": "live in a state of perpetual chaos and disorder",
        "Authoritarian Democracy": "enjoy carefully controlled freedoms within a framework of draconian laws",
        "Capitalist Paradise": "enjoy frequent shopping sprees at the nation's many malls and department stores",
        "Civil Rights Lovefest": "enjoy extensive civil freedoms and rights",
        "Conservative Democracy": "hold traditional values in high regard",
        "Corporate Police State": "are kept in line by a powerful corporate security force",
        "Corrupt Dictatorship": "are ruled with an iron fist by the corrupt government",
        "Democratic Socialists": "enjoy a high standard of living and extensive social welfare programs",
        "Father Knows Best State": "are fiercely patriotic and devoted to their leader",
        "Free-Market Paradise": "are free to succeed or fail in the nation's highly competitive economy",
        "Inoffensive Centrist Democracy": "enjoy a standard package of civil rights and freedoms",
        "Iron Fist Consumerists": "enjoy great economic freedoms while being closely monitored by an invasive government",
        "Left-Leaning College State": "are well-educated and enjoy academic freedom",
        "Left-wing Utopia": "enjoy a high standard of living and extensive social freedoms",
        "Liberal Democratic Socialists": "enjoy extensive civil rights and social welfare programs",
        "Moralistic Democracy": "are guided by strong moral principles and traditional values",
        "New York Times Democracy": "are free to live their lives as they choose while enjoying a high standard of living",
        "Psychotic Dictatorship": "live in fear of the ruthless, authoritarian government",
        "Right-wing Utopia": "enjoy economic freedom and traditional social values",
        // Add more as needed
    };
    return descriptions[category] || "live their lives according to their own unique customs and traditions";
}

export function getFreedomClass(value: string, type: 'civil' | 'economy' | 'political'): string {
    const rankings = {
        civil: [
            'Widely Abused', 'Frightening', 'Excessive', 'World Benchmark', 'Superb',
            'Excellent', 'Very Good', 'Good', 'Average', 'Below Average',
            'Some', 'Few', 'Rare', 'Unheard Of', 'Outlawed'
        ],
        economy: [
            'Frightening', 'All Consuming', 'Powerhouse', 'Thriving', 'Very Strong',
            'Strong', 'Good', 'Fair', 'Reasonable', 'Developing',
            'Struggling', 'Weak', 'Fragile', 'Basket Case', 'Imploded'
        ],
        political: [
            'Corrupted', 'Widely Abused', 'Excessive', 'World Benchmark', 'Superb',
            'Excellent', 'Very Good', 'Good', 'Average', 'Below Average',
            'Some', 'Few', 'Rare', 'Unheard Of', 'Outlawed'
        ]
    };

    const index = rankings[type].findIndex(r => r === value);
    return `freedom-${15 - index}`; // Invert index so 15 is best, 1 is worst
}

export function getOrdinalSuffix(n: number | undefined): string {
    if (!n) return 'N/A';
    
    const s = n.toLocaleString();
    const lastDigit = n % 10;
    const lastTwoDigits = n % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return s + 'th';
    }

    switch (lastDigit) {
        case 1: return s + 'st';
        case 2: return s + 'nd';
        case 3: return s + 'rd';
        default: return s + 'th';
    }
}

export function formatCensusScore(score: number): string {
    switch (true) {
        case score >= 1e12: return (score / 1e12).toFixed(0) + " trillion";
        case score >= 1e9: return (score / 1e9).toFixed(0) + " billion";
        case score >= 1e6: return (score / 1e6).toFixed(0) + " million";
        case score >= 1e3: return (score / 1e3).toFixed(0) + " thousand";
        default: return score.toLocaleString();
    }
}


export function formatRelativeTime(unixTime: number): string {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - unixTime;
    
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now:';
}


export function parseHappening(happening: string): { time: number; text: string } {
    const [_, timeStr, text] = happening.split('\n');
    return {
        time: parseInt(timeStr),
        text: text
    };
}

export function formatName(name: string): string {
    return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export function formatHappeningText(text: string): string {
    return text
        .replace(/@@([^@]+)@@/g, (_, name) => `<a href="/nation/${name}" class="nation-link">${formatName(name)}</a>`)
        .replace(/%%([^#]+)%%/g, (_, name) => `<a href="/region/${name}" class="region-link">${formatName(name)}</a>`);
}
