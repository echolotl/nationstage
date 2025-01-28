<script lang="ts">
    import { page } from '$app/stores';
    import Content from '$lib/components/content.svelte';
    import type { IssueResult } from '$lib/types/issues';

    export let data: { result: IssueResult };
    const result = data.result;

    $: console.log('Result data:', result); // Debug log
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
                <div class="section">
                    <h3 class="section-title">Rankings Changes</h3>
                    <div class="rankings">
                        {#each result.rankings as rank}
                            <div class="ranking-item">
                                <span class="ranking-name">{rank.name}</span>
                                <span class="ranking-change" class:positive={rank.change > 0} class:negative={rank.change < 0}>
                                    {rank.change > 0 ? '+' : ''}{rank.change.toFixed(2)}%
                                </span>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            {#if result.unlocks && result.unlocks.length > 0}
                <div class="section">
                    <h3 class="section-title">Unlocked</h3>
                    <ul class="unlocks">
                        {#each result.unlocks as unlock}
                            <li>{unlock}</li>
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
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }

    .results-title {
        color: var(--theme-accent);
        margin-bottom: 2rem;
        font-size: 2rem;
    }

    .section {
        margin: 2rem 0;
        padding: 1rem;
        background: var(--background-secondary);
        border-radius: 0.5rem;
    }

    .section-title {
        color: var(--theme-yellow);
        letter-spacing: 2px;
        text-transform: uppercase;
        font-size: 1rem;
        margin-bottom: 1rem;
    }

    .ranking-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        border-bottom: 1px solid var(--background);
    }

    .ranking-change {
        font-weight: bold;
    }

    .positive {
        color: var(--theme-green);
    }

    .negative {
        color: var(--theme-red);
    }

    .button {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: var(--theme-accent);
        color: white;
        text-decoration: none;
        border-radius: 0.25rem;
        margin-top: 2rem;
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
