import type { IssueResult } from '$lib/types/issues';
import { CENSUS_NAMES } from './parseNationRankings';


export function parseIssueResults(xmlString: string): IssueResult {
    console.log('Raw XML response:', xmlString); // Debug: Log raw XML
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const result: IssueResult = {
        ok: xmlDoc.querySelector('OK') !== null,
        description: xmlDoc.querySelector('DESC')?.textContent || '',
    };

    if (xmlDoc.querySelector('ERROR')) {
        result.error = xmlDoc.querySelector('ERROR')?.textContent || '';
    }

    // Parse rankings with census names and percentage changes
    const rankings = xmlDoc.querySelector('RANKINGS');
    if (rankings) {
        result.rankings = Array.from(rankings.children)
            .filter(rank => rank.tagName === 'RANK') // Filter only RANK elements
            .map(rank => {
                const id = parseInt(rank.getAttribute('id') || '0');
                const pchange = parseFloat(rank.querySelector('PCHANGE')?.textContent || '0');
                return {
                    id,
                    name: CENSUS_NAMES[id] || `Census ${id}`,
                    change: pchange
                };
            })
            .filter(ranking => !isNaN(ranking.change)); // Filter out invalid changes
    }

    // Parse headlines if present
    const headlines = xmlDoc.querySelector('HEADLINES');
    if (headlines) {
        result.headlines = Array.from(headlines.children)
            .map(h => h.textContent?.replace(/[\u201C\u201D]/g, '"') || '');
    }

    const unlocks = xmlDoc.querySelector('UNLOCKS');
    if (unlocks) {
        result.unlocks = Array.from(unlocks.children).map(u => u.textContent || '');
    }

    const reclassifications = xmlDoc.querySelector('RECLASSIFICATIONS');
    if (reclassifications) {
        result.reclassifications = Array.from(reclassifications.children).map(r => r.textContent || '');
    }

    const newPolicies = xmlDoc.querySelector('NEW_POLICIES');
    if (newPolicies) {
        result.newPolicies = Array.from(newPolicies.children).map(policy => ({
            name: policy.querySelector('NAME')?.textContent || '',
            pictureId: policy.querySelector('PIC')?.textContent || '',
            category: policy.querySelector('CAT')?.textContent || '',
            description: policy.querySelector('DESC')?.textContent || ''
        }));
    }

    const removedPolicies = xmlDoc.querySelector('REMOVED_POLICIES');
    if (removedPolicies) {
        result.removedPolicies = Array.from(removedPolicies.children).map(policy => ({
            name: policy.querySelector('NAME')?.textContent || '',
            pictureId: policy.querySelector('PIC')?.textContent || '',
            category: policy.querySelector('CAT')?.textContent || '',
            description: policy.querySelector('DESC')?.textContent || ''
        }));
    }

    return result;
}
