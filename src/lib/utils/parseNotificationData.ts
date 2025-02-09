interface NoticeData {
    unreadCount: number;
}

interface IssueData {
    issueCount: number;
}

interface UnreadData {
    issues: number;
    telegrams: number;
    notices: number;
    rmb: number;
    wa: number;
    news: number;
    region?: string;
}

export function parseNoticeData(xmlString: string): NoticeData {
    console.log('Parsing notices XML:', xmlString.substring(0, 200) + '...');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const unreadElement = xmlDoc.querySelector('NATION UNREAD');
    if (!unreadElement) {
        return { unreadCount: 0 };
    }

    return {
        unreadCount: Number(unreadElement.textContent || 0)
    };
}

export function parseIssueData(xmlString: string): IssueData {
    console.log('Parsing issues XML:', xmlString.substring(0, 200) + '...');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const issuesElement = xmlDoc.querySelector('NATION ISSUES');
    if (!issuesElement) {
        return { issueCount: 0 };
    }

    const issues = issuesElement.getElementsByTagName('ISSUE');
    return {
        issueCount: issues.length
    };
}

export function parseUnreadData(xmlString: string): UnreadData {
    console.log('Parsing unread XML:', xmlString);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Debug: Log the parsed XML structure
    console.log('Parsed XML structure:', {
        issues: xmlDoc.querySelector('UNREAD ISSUES')?.textContent,
        telegrams: xmlDoc.querySelector('UNREAD TELEGRAMS')?.textContent,
        notices: xmlDoc.querySelector('UNREAD NOTICES')?.textContent,
        rmb: xmlDoc.querySelector('UNREAD RMB')?.textContent,
        wa: xmlDoc.querySelector('UNREAD WA')?.textContent,
        news: xmlDoc.querySelector('UNREAD NEWS')?.textContent,
        region: xmlDoc.querySelector('UNREAD RMB')?.getAttribute('region')
    });

    const unreadElement = xmlDoc.querySelector('UNREAD');
    if (!unreadElement) {
        console.warn('No UNREAD element found in XML');
        return {
            issues: 0,
            telegrams: 0,
            notices: 0,
            rmb: 0,
            wa: 0,
            news: 0
        };
    }

    const rmbElement = unreadElement.querySelector('RMB');
    const region = rmbElement?.getAttribute('region') || undefined;

    // Create result object
    const result = {
        issues: Number(unreadElement.querySelector('ISSUES')?.textContent || 0),
        telegrams: Number(unreadElement.querySelector('TELEGRAMS')?.textContent || 0),
        notices: Number(unreadElement.querySelector('NOTICES')?.textContent || 0),
        rmb: Number(rmbElement?.textContent || 0),
        wa: Number(unreadElement.querySelector('WA')?.textContent || 0),
        news: Number(unreadElement.querySelector('NEWS')?.textContent || 0),
        region: region
    };

    // Debug: Log the final parsed data
    console.log('Parsed unread data:', result);

    return result;
}