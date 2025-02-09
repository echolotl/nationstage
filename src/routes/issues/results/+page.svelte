<script lang="ts">
    import { page } from '$app/stores';
    import Content from '$lib/components/content.svelte';
    import type { IssueResult } from '$lib/types/issues';
    import { getBannerById } from '$lib/utils/bannerData';
    import { refreshNotifications } from '$lib/stores/notifications';
    import { onMount } from 'svelte';
    import { TROPHY_IMAGE_NAMES } from '$lib/utils/parseNationRankings';
    import { getNationAllCensus } from '$lib/api/request';
    import { parseCensusData } from '$lib/utils/parseWorldCensusInfo';
    import { auth } from '$lib/stores/auth';
    import { writable } from 'svelte/store';

    export let data: { result: IssueResult };
    const result = data.result;
    let currentRankings: Record<number, { rank: number, percentile: number }> = {};

    let showAllRankings = writable(false);

    onMount(async () => {
        refreshNotifications();
        
        // Fetch current rankings
        if ($auth.nation && result.rankings && result.rankings.length > 0) {
            const censusData = await getNationAllCensus($auth.nation);
            const censusEntries = parseCensusData(censusData);
            
            // Create a map of census ID to current rank/percentile
            currentRankings = censusEntries.reduce((acc, entry) => ({
                ...acc,
                [entry.id]: {
                    rank: entry.rank,
                    percentile: entry.percentileRank
                }
            }), {});
        }
    });

    function getTrophyIcon(censusId: number): string {
        const currentRanking = currentRankings[censusId];
        if (!currentRanking) return '-100';

        const { rank, percentile } = currentRanking;
        if (rank === 1) return '-1t';
        if (percentile >= 99) return '-1';
        if (percentile >= 95) return '-5';
        if (percentile >= 90) return '-10';
        return '-100';
    }

    function toggleShowAllRankings() {
        showAllRankings.update(value => !value);
    }
</script>

<Content>
    <div class="results">
        {#if !result}
            <div class="loading">Loading results...</div>
        {:else if result.error}
            <div class="error">
                <h2>Error</h2>
                <p>{result.error}</p>
                <a href="/issues" class="button">Return to Issues</a>
            </div>
        {:else}
            <div class="description lora-text">
                {@html result.description}
            </div>

            {#if result.rankings && result.rankings.length > 0}
                    <h3 class="section-title">Ranking Changes</h3>
                    <div class="rankings">
                        {#each result.rankings as rank}
                            {#if rank.change >= 0.5 || rank.change <= -0.5}
                                <div class="ranking-item">
                                    <div class="trophy-cell">
                                        <img 
                                            src="https://www.nationstates.net/images/trophies/{TROPHY_IMAGE_NAMES[rank.id] || `census${rank.id}`}{getTrophyIcon(rank.id)}.png" 
                                            alt="{rank.name} trophy"
                                            class="trophy-icon"
                                        />
                                    </div>
                                    <div class="ranking-details lora-text">
                                        <span class="ranking-name">{rank.name}</span>
                                        <span class="ranking-change" class:positive={rank.change > 0} class:negative={rank.change < 0}>
                                            {rank.change > 0 ? '+' : ''}{rank.change.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                            {/if}
                        {/each}
                        {#if $showAllRankings}
                            {#each result.rankings as rank}
                                {#if rank.change < 0.5 && rank.change > -0.5}
                                    <div class="ranking-item">
                                        <div class="trophy-cell">
                                            <img 
                                                src="https://www.nationstates.net/images/trophies/{TROPHY_IMAGE_NAMES[rank.id] || `census${rank.id}`}{getTrophyIcon(rank.id)}.png" 
                                                alt="{rank.name} trophy"
                                                class="trophy-icon"
                                            />
                                        </div>
                                        <div class="ranking-details lora-text">
                                            <span class="ranking-name">{rank.name}</span>
                                            <span class="ranking-change" class:positive={rank.change > 0} class:negative={rank.change < 0}>
                                                {rank.change > 0 ? '+' : ''}{rank.change.toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                        {/if}
                    </div>
                    <button on:click={toggleShowAllRankings} class="button">
                        {#if $showAllRankings}Show Less{/if}
                        {#if !$showAllRankings}Show All{/if}
                    </button>
            {/if}

            {#if result.unlocks && result.unlocks.length > 0}
                <div class="section">
                    <h3 class="section-title">Unlocked</h3>
                    <ul class="unlocks">
                        {#each result.unlocks as unlock}
                            <li><div class="unlock lora-text">
                                <span class="unlock-title">{getBannerById(unlock)?.title}</span>
                                <span class="unlock-desc">{getBannerById(unlock)?.description}</span>
                                <div class="unlock-image-overlay"></div>
                                <img class="unlock-image" src="https://www.nationstates.net/images/banners/samples/{unlock}.jpg" alt={getBannerById(unlock)?.title} />
                            </div></li>
                        {/each}
                    </ul>
                </div>
            {/if}

            {#if result.reclassifications && result.reclassifications.length > 0}
                <div class="section">
                    <h3 class="section-title">Nation Reclassified</h3>
                    <ul class="reclassifications">
                        {#each result.reclassifications as reclass}
                            <li>{reclass}</li>
                        {/each}
                    </ul>
                </div>
            {/if}

            {#if result.newPolicies && result.newPolicies.length > 0}
                <div class="section">
                    <h3 class="section-title">New Policies</h3>
                    <ul class="policies">
                        {#each result.newPolicies as policy}
                            <li>{policy}</li>
                        {/each}
                    </ul>
                </div>
            {/if}

            {#if result.removedPolicies && result.removedPolicies.length > 0}
                <div class="section">
                    <h3 class="section-title">Removed Policies</h3>
                    <ul class="policies">
                        {#each result.removedPolicies as policy}
                            <li>{policy}</li>
                        {/each}
                    </ul>
                </div>
            {/if}

            {#if result.headlines && result.headlines.length > 0}
                <div class="section">
                    <h3 class="section-title">Headlines</h3>
                    <ul class="headlines">
                        {#each result.headlines as headline}
                            <li>{headline}</li>
                        {/each}
                    </ul>
                </div>
            {/if}

            <div class="actions">
                <a href="/issues" class="button">Return to Issues</a>
            </div>
        {/if}
    </div>
</Content>

<style>
    .results {
        
        margin: 0 auto;
        margin-top: 4rem;
    }

    .section {
        margin: 2rem 0;
        padding: 1rem;
        background: var(--background-secondary);
        border-radius: 0.5rem;
        border: 1px solid var(--gray-mixed);
    }

    .section-title {
        color: var(--theme-yellow);
        letter-spacing: 2px;
        text-transform: uppercase;
        font-size: 1rem;
        margin-bottom: 1rem;
    }

    .ranking-item {
        display: inline-block;
        width: fit-content;
        text-align: center;
    }

    .trophy-cell {
        display: flex;
        justify-content: center;
        margin-bottom: 0.5rem;
    }

    .trophy-icon {
        width: 45px;
        height: 40px;
        vertical-align: middle;
    }

    .ranking-details {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
    }

    .ranking-name {
        font-weight: bold;
        color: var(--text-primary);
    }

    .ranking-change {
        font-weight: bold;
        font-size: 1.1rem;
    }

    .positive {
        color: var(--theme-green);
    }

    .negative {
        color: var(--theme-red);
    }

    .rankings {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
    }

    .unlock {
        position: relative;
        width: 100%;
        height: 80px;
        border-radius: 4px;
    }
    .unlock-image {
        width: auto;
        height: 80px;
        position: absolute;
        left: 0;
        z-index: 1;
        border-radius: 4px 0 0 4px;
    }
    .unlock-title {
        position: absolute;
        font-size: 1.5rem;
        z-index: 2;
        left: 340px;
        top: 9px;
    }
    .unlock-desc {
        position: absolute;
        font-size: 1rem;
        z-index: 2;
        left: 340px;
        top: 49px;
    }
    .unlock-image-overlay {
        position: absolute;
        width: 320px;
        height: 80px;
        background: linear-gradient(90deg, rgba(0,0,0,0) 0%, var(--background-secondary) 100%);
        z-index: 2;
    }

    .button {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: var(--theme-accent);
        color: white;
        text-decoration: none;
        border-radius: 0.25rem;
        margin-top: 2rem;
        border: none;
    }

    .button:hover {
        opacity: 0.9;
    }

    .error {
        color: var(--theme-red);
        padding: 1rem;
        background: var(--background-secondary);
        border-radius: 0.5rem;
        margin-bottom: 2rem;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        padding: 0.5rem;
        border-bottom: 1px solid var(--background);
    }

    li:last-child {
        border-bottom: none;
    }

    .loading {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }

    .headlines {
        font-style: italic;
        color: var(--text-secondary);
    }
</style>
