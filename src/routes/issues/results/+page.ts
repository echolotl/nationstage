import type { PageLoad } from './$types';
import type { IssueResult } from '$lib/types/issues';

export const ssr = false;

export const load: PageLoad = async ({ url }) => {
    const resultData = url.searchParams.get('data');
    if (!resultData) {
        return {
            result: {
                ok: false,
                error: 'No result data provided',
                description: ''
            }
        };
    }

    try {
        const result: IssueResult = JSON.parse(decodeURIComponent(resultData));
        return { result };
    } catch (error) {
        console.error('Failed to parse result data:', error);
        return {
            result: {
                ok: false,
                error: 'Invalid result data',
                description: ''
            }
        };
    }
};
