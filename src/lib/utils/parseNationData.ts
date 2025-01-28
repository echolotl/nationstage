import type { GovtPercentages } from "$lib/types/nation";

export function parseNationGovtPercentages(xmlString: string): GovtPercentages {
    console.log('Parsing government spendature XML:', xmlString.substring(0, 200) + '...');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const govtElement = xmlDoc.querySelector('GOVT');
    if (!govtElement) {
        throw new Error('No GOVT element found in XML');
    }

    return {
        admin: parseFloat(govtElement.querySelector('ADMINISTRATION')?.textContent || '0'),
        defense: parseFloat(govtElement.querySelector('DEFENCE')?.textContent || '0'),
        education: parseFloat(govtElement.querySelector('EDUCATION')?.textContent || '0'),
        environment: parseFloat(govtElement.querySelector('ENVIRONMENT')?.textContent || '0'),
        healthcare: parseFloat(govtElement.querySelector('HEALTHCARE')?.textContent || '0'),
        commerce: parseFloat(govtElement.querySelector('COMMERCE')?.textContent || '0'),
        foreignaid: parseFloat(govtElement.querySelector('INTERNATIONALAID')?.textContent || '0'),
        lawenforcement: parseFloat(govtElement.querySelector('LAWANDORDER')?.textContent || '0'),
        publictransport: parseFloat(govtElement.querySelector('PUBLICTRANSPORT')?.textContent || '0'),
        socialequity: parseFloat(govtElement.querySelector('SOCIALEQUALITY')?.textContent || '0'),
        spirituality: parseFloat(govtElement.querySelector('SPIRITUALITY')?.textContent || '0'),
        welfare: parseFloat(govtElement.querySelector('WELFARE')?.textContent || '0')
    };
}