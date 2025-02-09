import type { WAResolution } from "$lib/types/wa";

export function parseWAData(xmlString: string): WAResolution {
    console.log('Parsing WA resolution XML:', xmlString.substring(0, 200) + '...');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const resolutionElement = xmlDoc.querySelector('RESOLUTION');
    if (!resolutionElement) {
        throw new Error('No RESOLUTION element found in XML');
    }

    return {
        id: resolutionElement.querySelector('ID')?.textContent || '',
        name: resolutionElement.querySelector('NAME')?.textContent || '',
        description: resolutionElement.querySelector('DESC')?.textContent || '',
        category: resolutionElement.querySelector('CATEGORY')?.textContent || '',
        industry: resolutionElement.querySelector('OPTION')?.textContent || '',
        proposedBy: resolutionElement.querySelector('PROPOSED_BY')?.textContent || '',
        created: parseInt(resolutionElement.querySelector('CREATED')?.textContent || '0'),
        promoted: parseInt(resolutionElement.querySelector('PROMOTED')?.textContent || '0'),
        totalNations: {
            for: parseInt(resolutionElement.querySelector('TOTAL_NATIONS_FOR')?.textContent || '0'),
            against: parseInt(resolutionElement.querySelector('TOTAL_NATIONS_AGAINST')?.textContent || '0')
        },
        totalVotes: {
            for: parseInt(resolutionElement.querySelector('TOTAL_VOTES_FOR')?.textContent || '0'),
            against: parseInt(resolutionElement.querySelector('TOTAL_VOTES_AGAINST')?.textContent || '0')
        },
        voteTrack: {
            for: resolutionElement.querySelector('VOTE_TRACK_FOR')?.textContent?.split(',').map(vote => parseInt(vote)) ?? [],
            against: resolutionElement.querySelector('VOTE_TRACK_AGAINST')?.textContent?.split(',').map(vote => parseInt(vote)) ?? []
        }
    };
}