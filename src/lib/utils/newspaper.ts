const suffixMap: { [key: number]: string } = {
    2: 'Sentinel', 10: 'Sentinel', 18: 'Sentinel', 26: 'Sentinel', 34: 'Sentinel',
    3: 'Post', 11: 'Post', 19: 'Post', 27: 'Post', 35: 'Post',
    4: 'Herald', 12: 'Herald', 20: 'Herald', 28: 'Herald', 36: 'Herald',
    5: 'Mail', 13: 'Mail', 21: 'Mail', 29: 'Mail', 37: 'Mail',
    6: 'Chronicle', 14: 'Chronicle', 22: 'Chronicle', 30: 'Chronicle', 38: 'Chronicle',
    7: 'Journal', 15: 'Journal', 23: 'Journal', 31: 'Journal', 39: 'Journal',
    8: 'Times', 16: 'Times', 24: 'Times', 32: 'Times', 40: 'Times',
    9: 'Leader', 17: 'Leader', 25: 'Leader', 33: 'Leader'
};

export function getNewspaperName(placeName: string): string {
    const length = placeName.length;
    const normalizedLength = length > 40 ? length % 40 + 1 : length;
    const suffix = suffixMap[normalizedLength] || 'Times';
    return `The ${placeName} ${suffix}`;
}