export interface NationDetails {
    admirables: string[];
    animal: string;
    animaltrait: string;
    answered: number;
    banners: string[];
    capital: string;
    category: string;
    crime: string;
    currency: string;
    customleader: string;
    customcapital: string;
    customreligion: string;
    demonym: string;
    demonym2: string;
    demonym2plural: string;
    dispatches: number;
    flag: string;
    founded: string;
    foundedtime: number;
    freedoms: Record<string, string>;
    fullname: string;
    gdp: number;
    govtdesc: string;
    govtpriority: string;
    happenings: string[];
    industrydesc: string;
    influence: string;
    lastactivity: string;
    lastlogin: number;
    legislation: string[];
    majorindustry: string;
    motto: string;
    name: string;
    notables: string[];
    policies: Record<string, number>;
    poorest: number;
    population: number;
    region: string;
    religion: string;
    richest: number;
    sensibilities: string;
    type: string;
    tax: string;
    wa: string;
}

export function parseNationDetails(xmlString: string): NationDetails {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    function getTextContent(tagName: string): string {
        return xmlDoc.querySelector(tagName)?.textContent || '';
    }

    function getNumberContent(tagName: string): number {
        return parseInt(getTextContent(tagName)) || 0;
    }

    function getArrayContent(tagName: string): string[] {
        const elements = xmlDoc.querySelectorAll(tagName);
        return Array.from(elements).map(el => el.textContent || '');
    }

    const freedomTags = xmlDoc.querySelector('FREEDOM');
    const freedoms = {
        civil: freedomTags?.querySelector('CIVILRIGHTS')?.textContent || '',
        economy: freedomTags?.querySelector('ECONOMY')?.textContent || '',
        political: freedomTags?.querySelector('POLITICALFREEDOM')?.textContent || ''
    };

    return {
        name: getTextContent('NAME'),
        fullname: getTextContent('FULLNAME'),
        motto: getTextContent('MOTTO'),
        flag: getTextContent('FLAG'),
        category: getTextContent('CATEGORY'),
        population: getNumberContent('POPULATION'),
        currency: getTextContent('CURRENCY'),
        animal: getTextContent('ANIMAL'),
        region: getTextContent('REGION'),
        influence: getTextContent('INFLUENCE'),
        freedoms,
        lastactivity: getTextContent('LASTACTIVITY'),
        admirables: getArrayContent('ADMIRABLE'),
        animaltrait: getTextContent('ANIMALTRAIT'),
        answered: getNumberContent('ANSWERED'),
        banners: getArrayContent('BANNER'),
        capital: getTextContent('CAPITAL'),
        crime: getTextContent('CRIME'),
        customleader: getTextContent('CUSTOMLEADER'),
        customcapital: getTextContent('CUSTOMCAPITAL'),
        customreligion: getTextContent('CUSTOMRELIGION'),
        demonym: getTextContent('DEMONYM'),
        demonym2: getTextContent('DEMONYM2'),
        demonym2plural: getTextContent('DEMONYM2PLURAL'),
        dispatches: getNumberContent('DISPATCHES'),
        founded: getTextContent('FOUNDED'),
        foundedtime: getNumberContent('FOUNDEDTIME'),
        gdp: getNumberContent('GDP'),
        govtdesc: getTextContent('GOVTDESC'),
        govtpriority: getTextContent('GOVTPRIORITY'),
        happenings: getArrayContent('EVENT'),
        industrydesc: getTextContent('INDUSTRYDESC'),
        lastlogin: getNumberContent('LASTLOGIN'),
        legislation: getArrayContent('LAW'),
        majorindustry: getTextContent('MAJORINDUSTRY'),
        notables: getArrayContent('NOTABLE'),
        policies: {},
        poorest: getNumberContent('POOREST'),
        richest: getNumberContent('RICHEST'),
        religion: getTextContent('RELIGION'),
        sensibilities: getTextContent('SENSIBILITIES'),
        type: getTextContent('TYPE'),
        tax: getTextContent('TAX'),
        wa: getTextContent('WA')
    };
}