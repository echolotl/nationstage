<script lang="ts">
    import { getNationAllCensus, getNationCurrency } from '$lib/api/request';
    import { parseNationCurrency } from '$lib/utils/parseNationDetails';
    import { parseCensusData } from '$lib/utils/parseWorldCensusInfo';
    import { censusScales } from '$lib/utils/censusData';
    import { onMount } from 'svelte';
    import { getOrdinalSuffix, formatCensusScore } from '$lib/utils/nationUtils';
    import { TROPHY_IMAGE_NAMES } from '$lib/utils/parseNationRankings';
    
    let sortMode: 'rank' | 'score' = 'rank';
    let sortField: 'rank' | 'regionalRank' | 'name' = 'rank';
    let sortDirection: 'asc' | 'desc' = 'asc';
    let allCensusData: any[] = [];
    
    function getTrophyIcon(rank: number, percentile: number): string {
        if (rank === 1) return '-1t';
        if (percentile >= 99) return '-1';
        if (percentile >= 95) return '-5';
        if (percentile >= 90) return '-10';
        return '-100';
    }
    
    function toggleSort(field: 'rank' | 'regionalRank' | 'name') {
        if (sortField === field) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortField = field;
            sortDirection = 'asc';
        }
    }
    
    onMount(async () => {
        const nationId = window.location.pathname.split('/')[2];
        const [censusData, currencyData] = await Promise.all([
            getNationAllCensus(nationId),
            getNationCurrency(nationId)
        ]);
        
        const censusEntries = parseCensusData(censusData);
        
        allCensusData = censusEntries.map(entry => ({
            ...entry,
            name: censusScales[entry.id]?.name || `Census #${entry.id}`,
            unit: censusScales[entry.id]?.unit || '',
            prefix: censusScales[entry.id]?.prefix || '',
            percentile: entry.percentileRank,
            imageName: TROPHY_IMAGE_NAMES[entry.id] || `census${entry.id}`,
            trophyIcon: getTrophyIcon(entry.rank, 100 - entry.percentileRank)
        }));

        // Replace [nation-currency] with actual currency
        allCensusData = allCensusData.map(entry => ({
            ...entry,
            unit: entry.unit === '[nation-currency]' ? parseNationCurrency(currencyData) + "s" : entry.unit
        }));
    });

    $: allRankings = allCensusData.sort((a, b) => {
        
        const modifier = sortDirection === 'asc' ? 1 : -1;
        
        if (sortField === 'name') {
            return modifier * a.name.localeCompare(b.name);
        }
        return modifier * (a[sortField] - b[sortField]);
    });
</script>

<div class="rankings-container">
    <table class="rankings-table">
        <thead class="lora-text">
            <tr>
                <th></th>
                <th>
                    <button class="sort-button" on:click={() => toggleSort('name')}>
                        Category
                        {#if sortField === 'name'}
                            {sortDirection === 'asc' ? '▲' : '▼'}
                        {/if}
                    </button>
                </th>
                <th>
                    <button class="sort-button" on:click={() => toggleSort('rank')}>
                        World Rank
                        {#if sortField === 'rank'}
                            {sortDirection === 'asc' ? '▲' : '▼'}
                        {/if}
                    </button>
                </th>
                <th>
                    <button class="sort-button" on:click={() => toggleSort('regionalRank')}>
                        Regional Rank
                        {#if sortField === 'regionalRank'}
                            {sortDirection === 'asc' ? '▲' : '▼'}
                        {/if}
                    </button>
                </th>
                <th>Percentile</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody class="lora-text">
            {#each allRankings as ranking}
                <tr>
                    <td class="trophy-cell">
                        <img 
                            src="https://www.nationstates.net/images/trophies/{ranking.imageName}{ranking.trophyIcon}.png" 
                            alt="{ranking.name} trophy"
                            class="trophy-icon"
                        />
                    </td>
                    <td>{ranking.name}</td>
                    <td>{@html getOrdinalSuffix(ranking?.rank)}</td>
                    <td>{@html getOrdinalSuffix(ranking?.regionalRank)}</td>
                    <td>Top {ranking?.percentile ? (100 - ranking.percentile).toFixed(2) : 'N/A'}%</td>
                    <td>
                        {ranking?.score ? ranking.score : 'N/A'} {ranking.prefix || ''} {ranking.unit}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .rankings-container {
        padding: 1rem;
    }

    .rankings-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
        background: var(--background-secondary);
        border-radius: 10px;
        border: 1px solid var(--gray-mixed);
    }

    .rankings-table th,
    .rankings-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid var(--gray-mixed);
    }

    .rankings-table th {
        background: var(--theme-accent);
        color: white;
        font-weight: bold;
    }

    .rankings-table th:first-child {
        border-top-left-radius: 10px;
    }

    .rankings-table th:last-child {
        border-top-right-radius: 10px;
    }

    .trophy-cell {
        width: 32px;
    }

    .trophy-icon {
        width: 45px;
        height: 40px;
        vertical-align: middle;
    }

    tr:hover {
        background: var(--background-primary);
    }

    .sort-button {
        background: none;
        border: none;
        color: inherit;
        font: inherit;
        cursor: pointer;
        padding: 0;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
    }
</style>