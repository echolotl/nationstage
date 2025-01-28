<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { getWAInfo, getWAVotes } from '$lib/api/request';
    import { XMLParser } from 'fast-xml-parser';
    import { resetThemeColor, setManualColors } from '$lib/utils/getDominantColor';
    import Content from '$lib/components/content.svelte';
    import { invoke } from '@tauri-apps/api/core';
    import { auth } from '$lib/stores/auth';

    let mounted = false;

    interface WAResolution {
        id: string;
        name: string;
        description: string;
        category: string;
        industry: string;
        proposedBy: string;
        created: number;
        promoted: number;
        totalNations: {
            for: number;
            against: number;
        };
        totalVotes: {
            for: number;
            against: number;
        };
        voteTrack: {
            for: number[];
            against: number[];
        };
    }

    let currentResolution: WAResolution | null = null;
    let lastResolutionHtml: string | null = null;
    let forVotes: string[] = [];
    let againstVotes: string[] = [];
    let loading = true;
    let error: string | null = null;

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_"
    });

    async function loadWAData() {
        try {
            const waResponse = await getWAInfo(2);
            const votesResponse = await getWAVotes(2); // Set to SC (2)
            const waData = parser.parse(waResponse);
            const waAssembly = waData.WA;

            if (waAssembly.RESOLUTION) {
                const description = waAssembly.RESOLUTION.DESC || '';
                const parsedDescription = await invoke<string>('parse_bbcode', { 
                    input: description 
                });

                currentResolution = {
                    id: waAssembly.RESOLUTION.ID,
                    name: waAssembly.RESOLUTION.NAME,
                    description: parsedDescription,
                    category: waAssembly.RESOLUTION.CATEGORY,
                    industry: waAssembly.RESOLUTION.OPTION,
                    proposedBy: waAssembly.RESOLUTION.PROPOSED_BY,
                    created: parseInt(waAssembly.RESOLUTION.CREATED),
                    promoted: parseInt(waAssembly.RESOLUTION.PROMOTED),
                    totalNations: {
                        for: parseInt(waAssembly.RESOLUTION.TOTAL_NATIONS_FOR),
                        against: parseInt(waAssembly.RESOLUTION.TOTAL_NATIONS_AGAINST)
                    },
                    totalVotes: {
                        for: parseInt(waAssembly.RESOLUTION.TOTAL_VOTES_FOR),
                        against: parseInt(waAssembly.RESOLUTION.TOTAL_VOTES_AGAINST)
                    },
                    voteTrack: {
                        for: waAssembly.RESOLUTION.VOTE_TRACK_FOR.N,
                        against: waAssembly.RESOLUTION.VOTE_TRACK_AGAINST.N
                    }
                };

                const votesData = parser.parse(votesResponse);
                if (votesData.WA.VOTERS) {
                    forVotes = votesData.WA.VOTERS.FOR?.split(',') || [];
                    againstVotes = votesData.WA.VOTERS.AGAINST?.split(',') || [];
                }
            }

            if (waAssembly.LASTRESOLUTION) {
                lastResolutionHtml = waAssembly.LASTRESOLUTION;
            }
        } catch (e) {
            error = 'Failed to load Security Council data';
            console.error(e);
        } finally {
            loading = false;
        }
    }

    function updateThemeColor() {
        setManualColors('#c19b87');
    }

    $: if (mounted) {
        invoke('update_discord_presence', {
            details: `Playing as ${$auth.nation}`,
            state: `Viewing the Security Council`
        });
    }

    onMount(() => {
        mounted = true;
        loadWAData();
        updateThemeColor();
    });
    onDestroy(() => {
        resetThemeColor();
    });
</script>
<div class="banner-container">
    <div class="banner-content">
        <div class="title">
            <div class="title-container">
                <svg viewBox="0 0 90 75" class="wa-icon">
                    <path fill="currentColor" d="M82.8,47.24c-1.75,0-2.97-2.24-.96-4h7.41c.02-1.88-.07-3.8-.29-5.73h-6.16c-2.01-1.77-.78-4,.96-4h4.5c-.47-1.99-1.12-3.92-2.01-5.73h-6.49c-2.01-1.77-.79-4,.96-4h3.4c-1.21-2.09-2.47-4-3.77-5.73h-4.64c-2.01-1.77-.79-4,.96-4h.34C66.13,2.23,54.38,1.04,54.38,1.04c0,0,17,11,17,26,0,9.26-11.58,20.51-19.56,27.17v-25.54h13.13l-5-7h-11.57V3.6c0-1.99-1.61-3.6-3.6-3.6h0c-1.99,0-3.6,1.61-3.6,3.6v18.06h-11.57l-5,7h13.13v25.94c-8-6.63-19.86-18.04-19.86-27.41C17.87,12.19,34.87,1.19,34.87,1.19c0,0-11.75,1.19-22.65,13h1.31c2.01,1.77.79,4-.96,4h-3.68c-1.3,1.73-2.56,3.63-3.77,5.73h4.37c2.01,1.77.78,4-.96,4H3c-.9,1.81-1.55,3.74-2.01,5.73h5.46c2.01,1.77.79,4-.96,4H.29C.07,39.58-.01,41.51,0,43.38h7.41c2.01,1.77.79,4-.96,4H.18c.16,2.08.42,4.02.7,5.73h9.49c2.01,1.77.78,4-.96,4H1.65c.42,1.88.76,3,.76,3h32.9l-15.44,15.07,15.44.37,9.07-14.89h.28l9.28,14.74,15.44-.37-15.44-15.07h32.9s.34-1.12.76-3h-8.72c-2.01-1.77-.79-4,.96-4h8.53c.28-1.71.54-3.65.7-5.73h-6.27Z"></path>
                </svg>
                <div class="heading lora-display">Security Council</div>
            </div>
            <div class="subtitle lora-text">Spreading interregional peace and goodwill, via force if necessary.</div>
        </div>
    </div>
    <div class="banner">
        <img src="https://www.nationstates.net/images/banners/y147.jpg" alt="Security Council" />
    </div>
</div>
<Content>
<div class="wa-container">
    {#if loading}
        <div class="loading">Loading Security Council data...</div>
    {:else if error}
        <div class="error">{error}</div>
    {:else}
        {#if currentResolution}
            <h2>Resolution at Vote:</h2>
            <pre class="resolution-data">
Name: {currentResolution.name}
Category: {currentResolution.category}
Industry: {currentResolution.industry}
Proposed by: {currentResolution.proposedBy}

Votes:
Nations For: {currentResolution.totalNations.for}
Nations Against: {currentResolution.totalNations.against}
Total Votes For: {currentResolution.totalVotes.for}
Total Votes Against: {currentResolution.totalVotes.against}

Description:
</pre>
<div class="resolution-desc lora-text">{@html currentResolution.description}</div>
            
        {/if}
        {#if lastResolutionHtml}
        <h2>Last Resolution</h2>
        <div class="resolution-data">{@html lastResolutionHtml}</div>
    {/if}
    {/if}
</div>
</Content>

<style>
        .wa-icon {
        height: 5rem;
        width: 5rem;
        color: var(--text);
    }
        .title-container {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .wa-container {
        padding: 1rem;
        margin: 0 auto;
    }
    .banner-container {
        z-index: 1;
        position: relative;
        width: 100%;
        height: 30vh;
        overflow: hidden;
    }

    .banner {
        position: relative;
        width: 100%;
        height: 30vh;
    }

    .banner img {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .banner::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(in oklab 180deg, rgba(0, 0, 0, 0), var(--background));
    }

    .banner-content {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 4;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .title {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    }

    .subtitle {
        margin-top: 1.5rem;
        text-transform: uppercase;
        font-size: .75rem;
        color: var(--text);
        letter-spacing: 2px;
    }

    .heading {
        font-size: 5rem;
        color: var(--text);
    }

    .loading {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }

    .error {
        color: var(--theme-red);
        text-align: center;
        padding: 2rem;
    }

    :global(.description ul), :global(.description ol) {
        margin-left: 2rem;
    }
</style>
