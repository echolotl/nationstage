export const ssr = false;

import type { PageLoad } from './$types';
import { getNationDetails, getNationRankings } from '$lib/api/request';
import { parseNationDetails } from '$lib/utils/parseNationDetails';
import { parseNationRankings } from '$lib/utils/parseNationRankings';
import { TopPercentileType } from '$lib/utils/parseNationRankings';

export const load: PageLoad = async ({ params }) => {
    try {
        console.log('Loading data for nation:', params.id); // Debug

        const [detailsResponse, rankingsResponse] = await Promise.all([
            getNationDetails(params.id),
            getNationRankings(params.id)
        ]);

        console.log('Raw rankings response:', rankingsResponse); // Debug
        console.log('Raw details response:', detailsResponse); // Debug

        const allRankings = parseNationRankings(rankingsResponse);
        console.log('Parsed rankings:', allRankings); // Debug
        
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