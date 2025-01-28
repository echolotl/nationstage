<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
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

    interface WAData {
        lastResolution: string;
        currentResolution: WAResolution | null;
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
            const waResponse = await getWAInfo(1);
            const waData = parser.parse(waResponse);
            const waAssembly = waData.WA;

            if (waAssembly.RESOLUTION) {
                const description = waAssembly.RESOLUTION.DESC || '';
                console.log('Raw BBCode input:', description);
                console.log('Input contains BBCode tags:', description.includes('['));

                const parsedDescription = await invoke<string>('parse_bbcode', { 
                    input: description 
                });
                console.log('Parsed HTML output:', parsedDescription);
                console.log('Output contains HTML tags:', parsedDescription.includes('<'));
                
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

                // Load votes if there's an active resolution
                const votesResponse = await getWAVotes(1); // 1 for General Assembly
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
            error = 'Failed to load World Assembly data';
            console.error(e);
        } finally {
            loading = false;
        }
    }

    function updateThemeColor() {
        setManualColors('#779bb9');
    }

    $: if (mounted) {
        invoke('update_discord_presence', {
            details: `Playing as ${$auth.nation}`,
            state: `Viewing the General Assembly`
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
                <svg fill="currentColor" viewBox="0 0 90 75" class="wa-icon">
                    <defs>
                        <style>
                          .cls-1 {
                            stroke-width: 5px;
                          }
                    
                          .cls-1, .cls-2, .cls-3, .cls-4 {
                            stroke: currentColor;
                            stroke-miterlimit: 10;
                          }
                    
                          .cls-2 {
                            stroke-width: 6px;
                          }
                    
                          .cls-3 {
                            fill: none;
                            stroke-width: 3px;
                          }
                    
                          .cls-4 {
                            stroke-width: 7px;
                          }
                        </style>
                      </defs>
                      <g id="Layer_3">
                        <path d="M80.91,45.52c-.44-1.38.58-2.65,1.9-2.65h6.45c.02-1.97-.07-3.99-.31-6h-5.1c-.88,0-1.72-.52-1.98-1.35-.44-1.38.58-2.65,1.9-2.65h4.55c-.49-2.08-1.17-4.1-2.11-6h0s-5.47,0-5.47,0c0,0-2-.45-2-1.56s2-1.44,2-1.44h3.49c-1.27-2.19-2.59-4.19-3.95-6h-3.59s-2-1.18-2-2.29,2-2.71,2-2.71h.34L54.38.58s17,11,17,26c0,13.57-24.85,31.41-26.86,32.83-3.15-2.25-26.65-19.48-26.65-32.68C17.88,11.73,34.88.73,34.88.73L12.24,13.87h.26c.88,0,1.72.52,1.98,1.35.44,1.38-.58,2.65-1.9,2.65h-3.59c-1.36,1.81-2.68,3.81-3.95,6h3.49s2,.49,2,1.59-2,1.41-2,1.41H3.06s0,0,0,0c-.94,1.89-1.62,3.92-2.11,6h4.46c.88,0,1.72.52,1.98,1.35.44,1.38-.58,2.65-1.9,2.65H.31C.07,38.88-.01,40.9,0,42.87h6.37c.88,0,1.72.52,1.98,1.35.44,1.38-.58,2.65-1.9,2.65H.17c.17,2.17.44,4.21.73,6h8.43c.88,0,1.72.52,1.98,1.35.44,1.38-.58,2.65-1.9,2.65H1.66l.76,2h32.9l-15.44,15.86,15.44.37,9.21-15.11,9.42,14.96,15.44-.37-15.44-14.71h32.9s.34-1.12.76-3h-7.67c-.88,0-1.72-.52-1.98-1.35-.44-1.38.58-2.65,1.9-2.65h8.51c.3-1.79.56-3.83.73-6h-6.2c-.88,0-1.72-.52-1.98-1.35Z"/>
                        <g>
                          <path d="M38.99,27.37c0,5.25-4.25,9.5-9.5,9.5s-9.5-4.25-9.5-9.5h19Z"/>
                          <path d="M69.05,27.37c0,5.25-4.25,9.5-9.5,9.5s-9.5-4.25-9.5-9.5h19Z"/>
                        </g>
                        <g>
                          <g>
                            <polygon class="cls-3" points="22.99 28.37 29.49 12.75 36.35 28.37 22.99 28.37"/>
                            <polygon class="cls-3" points="52.99 28.37 59.49 12.75 66.35 28.37 52.99 28.37"/>
                          </g>
                          <g>
                            <path class="cls-4" d="M44.6,5.37v54.04V5.37Z"/>
                            <line class="cls-2" x1="21.58" y1="11.37" x2="67.95" y2="11.37"/>
                            <path class="cls-1" d="M44.63,0v6.07V0Z"/>
                          </g>
                        </g>
                      </g>
                </svg>
                <div class="heading lora-display">General Assembly</div>
            </div>
            <div class="subtitle lora-text">Improving the world one resolution at a time.</div>
        </div>
    </div>
    <div class="banner">
        <img src="https://www.nationstates.net/images/banners/k5.jpg" alt="General Assembly" />
    </div>
</div>
<Content>
<div class="wa-container">
    {#if loading}
        <div class="loading">Loading World Assembly data...</div>
    {:else if error}
        <div class="error">{error}</div>
    {:else}
        {#if lastResolutionHtml}
            <h2>Last Resolution</h2>
            <pre class="resolution-data">{@html lastResolutionHtml}</pre>
        {/if}

        {#if currentResolution}
            <h2>Current Resolution</h2>
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
{@html currentResolution.description}
            </pre>
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

    .resolution-data {
        background: var(--background-secondary);
        padding: 1rem;
        border-radius: 4px;
        white-space: pre-wrap;
        font-family: monospace;
        margin: 1rem 0;
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
