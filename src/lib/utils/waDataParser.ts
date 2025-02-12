import { XMLParser } from 'fast-xml-parser';
import { getWAInfo, getWAVotes } from '$lib/api/request';
import { parseBBCode } from '$lib/utils/parseBBCode';

interface WAResolution {
    id: string;
    name: string;
    description: string;
    category: string;
    smallDescription: string;
    industry: string;
    proposedBy: string;
    created: number;
    promoted: number;
    totalNations: {
        for: number;
        against: number;
    };
    totalVotes: {
        for: number;
        against: number;
    };
    voteTrack: {
        for: number[];
        against: number[];
    };
}

const CATEGORY_DESC_MAP: Record<string, string> = {
    repeal: 'A resolution to repeal previously passed legislation.',
}

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
});

export async function loadWAData(assemblyId: 1 | 2) {
    let currentResolution: WAResolution | null = null;
    let lastResolutionHtml: string | null = null;
    let forVotes: string[] = [];
    let againstVotes: string[] = [];
    let error: string | null = null;
    let loading = true;

    try {
        const waResponse = await getWAInfo(assemblyId);
        const votesResponse = await getWAVotes(assemblyId);
        const waData = parser.parse(waResponse);
        const waAssembly = waData.WA;

        if (waAssembly.RESOLUTION) {
            const description = waAssembly.RESOLUTION.DESC || '';
            const parsedDescription = await parseBBCode(description);

            currentResolution = {
                id: waAssembly.RESOLUTION.ID,
                name: waAssembly.RESOLUTION.NAME,
                description: parsedDescription,
                category: waAssembly.RESOLUTION.CATEGORY,
                smallDescription: CATEGORY_DESC_MAP[waAssembly.RESOLUTION.CATEGORY] || 'Something',
                industry: waAssembly.RESOLUTION.OPTION,
                proposedBy: waAssembly.RESOLUTION.PROPOSED_BY,
                created: parseInt(waAssembly.RESOLUTION.CREATED),
                promoted: parseInt(waAssembly.RESOLUTION.PROMOTED),
                totalNations: {
                    for: parseInt(waAssembly.RESOLUTION.TOTAL_NATIONS_FOR),
                    against: parseInt(waAssembly.RESOLUTION.TOTAL_NATIONS_AGAINST)
                },
                totalVotes: {
                    for: parseInt(waAssembly.RESOLUTION.TOTAL_VOTES_FOR),
                    against: parseInt(waAssembly.RESOLUTION.TOTAL_VOTES_AGAINST)
                },
                voteTrack: {
                    for: waAssembly.RESOLUTION.VOTE_TRACK_FOR.N,
                    against: waAssembly.RESOLUTION.VOTE_TRACK_AGAINST.N
                }
            };

            const votesData = parser.parse(votesResponse);
            if (votesData.WA.VOTERS) {
                forVotes = votesData.WA.VOTERS.FOR?.split(',') || [];
                againstVotes = votesData.WA.VOTERS.AGAINST?.split(',') || [];
            }
        }

        if (waAssembly.LASTRESOLUTION) {
            lastResolutionHtml = waAssembly.LASTRESOLUTION;
        }
    } catch (e) {
        error = 'Failed to load World Assembly data';
        console.error(e);
    } finally {
        loading = false;
    }

    return { currentResolution, lastResolutionHtml, forVotes, againstVotes, error, loading };
}