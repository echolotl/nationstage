export const ssr = false;
export const prerender = true;

import type { PageLoad, PageLoadEvent } from './$types';
import { getNationDetails, getNationRankings } from '$lib/api/request';
import { parseNationDetails } from '$lib/utils/parseNationDetails';
import { parseNationRankings } from '$lib/utils/parseNationRankings';
import { TopPercentileType } from '$lib/utils/parseNationRankings';

export const load: PageLoad = async ({ params }: PageLoadEvent) => {
    try {
        console.log('Loading data for nation:', params.id); // Debug

        const [detailsResponse, rankingsResponse] = await Promise.all([
            getNationDetails(params.id),
            getNationRankings(params.id)
        ]);

        const allRankings = parseNationRankings(rankingsResponse);
        
        const result = {
            nation: parseNationDetails(detailsResponse),
            rankings: {
                all: allRankings,
                topOne: parseNationRankings(rankingsResponse, TopPercentileType.TOP_ONE),
                topFive: parseNationRankings(rankingsResponse, TopPercentileType.TOP_FIVE),
                topTen: parseNationRankings(rankingsResponse, TopPercentileType.TOP_TEN)
            }
        };

        console.log('Final data:', result); // Debug
        return result;
    } catch (error) {
        console.error('Failed to load nation:', error);
        return {
            nation: null,
            rankings: null
        };
    }
};