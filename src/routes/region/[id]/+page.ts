export const ssr = false;

import type { PageLoad } from './$types';
import { getRegionDetails } from '$lib/api/request';
import { parseRegionDetails } from '$lib/utils/parseRegionDetails';

export const load: PageLoad = async ({ params }) => {
    try {
        const response = await getRegionDetails(params.id);
        const regionData = parseRegionDetails(response);
        console.log('Region data:', regionData); // Debug
        return {
            region: regionData
        };
    } catch (error) {
        console.error('Failed to load region:', error);
        return {
            region: null
        };
    }
};