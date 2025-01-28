interface CensusScale {
    id: number;
    name: string;
    unit: string;
    title: string;
}

export function parseWorldCensusInfo(xmlString: string): { [key: number]: CensusScale } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');
    const scales: { [key: number]: CensusScale } = {};

    doc.querySelectorAll('CENSUS').forEach(census => {
        const id = parseInt(census.getAttribute('id') || '0');
        scales[id] = {
            id,
            name: census.textContent || '',
            unit: doc.querySelector(`CENSUSSCALE[id="${id}"]`)?.textContent || '',
            title: doc.querySelector(`CENSUSTITLE[id="${id}"]`)?.textContent || ''
        };
    });

    return scales;
}