import { XMLParser } from "fast-xml-parser";

export interface APIPolicy {
    NAME: string;
    PIC: string;
    CAT: string;
    DESC: string;
}

export interface Policy {
    name: string;
    pic: string;
    category: string;
    description: string;
}

export interface PolicyResponse {
    NATION: {
        POLICIES: {
            POLICY: APIPolicy[];
        };
    };
}

export function parseNationPolicies(xml: string): Policy[] {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '_'
    });

    const result = parser.parse(xml) as PolicyResponse;
    
    if (!result.NATION?.POLICIES?.POLICY) {
        return [];
    }

    const policies = Array.isArray(result.NATION.POLICIES.POLICY) 
        ? result.NATION.POLICIES.POLICY 
        : [result.NATION.POLICIES.POLICY];

    return policies.map(policy => ({
        name: policy.NAME,
        pic: policy.PIC,
        category: policy.CAT,
        description: policy.DESC
    }));
}