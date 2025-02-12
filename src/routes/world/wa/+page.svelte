<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Content from "$lib/components/content.svelte";
    import { setManualColors, resetThemeColor } from '$lib/utils/getDominantColor';
    import { invoke } from '@tauri-apps/api/core';
    import { auth } from '$lib/stores/auth';
    import { getWAInfo } from '$lib/api/request';
    import { parseWAData } from '$lib/utils/parseWAData';
    import { get } from 'svelte/store';

    let mounted = false;
    let gaData: any = null;
    let scData: any = null;
    let loading = true;

    function updateThemeColor() {
        setManualColors('#779bb9'); // Using GA blue as default WA color
    }

    $: if (mounted) {
        invoke('update_discord_presence', {
            details: `Playing as ${$auth.nation}`,
            state: `Viewing the World Assembly`
        });
    }

    async function waInfo() {
        const data1 = await getWAInfo(1);
        gaData = parseWAData(data1);
        console.log(gaData);
        const data2 = await getWAInfo(2);
        scData = parseWAData(data2);
        console.log(scData);
        loading = false;
    }

    $: gaForPercentage = gaData ? (gaData.totalVotes.for / (gaData.totalVotes.for + gaData.totalVotes.against)) * 100 : 0;
    $: gaAgainstPercentage = gaData ? (gaData.totalVotes.against / (gaData.totalVotes.for + gaData.totalVotes.against)) * 100 : 0;

    $: scForPercentage = scData ? (scData.totalVotes.for / (scData.totalVotes.for + scData.totalVotes.against)) * 100 : 0;
    $: scAgainstPercentage = scData ? (scData.totalVotes.against / (scData.totalVotes.for + scData.totalVotes.against)) * 100 : 0;

    onMount(() => {
        mounted = true;
        updateThemeColor();
        waInfo();
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
                    <path fill="currentColor" d="M80.8,44.2c0-1.11.9-2,2-2h6.45c.02-1.88-.07-3.8-.29-5.73h-5.19c-1.11,0-2-.9-2-2s.9-2,2-2h4.5c-.44-1.89-1.05-3.73-1.89-5.46-.04-.09-.09-.17-.13-.26h-5.52c-1.11,0-2-.9-2-2s.9-2,2-2h3.4c-1.21-2.09-2.47-4-3.77-5.73h-3.68c-1.11,0-2-.9-2-2s.9-2,2-2h.34C66.13,1.19,54.38,0,54.38,0c0,0,17,11,17,26,0,13.57-24.85,31.41-26.86,32.83-3.15-2.25-26.65-19.48-26.65-32.68C17.87,11.15,34.87.15,34.87.15c0,0-11.75,1.19-22.65,13h.34c1.11,0,2,.9,2,2s-.9,2-2,2h-3.68c-1.3,1.73-2.56,3.63-3.77,5.73h3.4c1.11,0,2,.9,2,2s-.9,2-2,2H3.01c-.04.09-.09.17-.13.26-.83,1.73-1.44,3.57-1.89,5.46h4.5c1.11,0,2,.9,2,2s-.9,2-2,2H.29C.07,38.54-.01,40.47,0,42.34h6.45c1.11,0,2,.9,2,2s-.9,2-2,2H.18c.16,2.08.42,4.02.7,5.73h8.53c1.11,0,2,.9,2,2s-.9,2-2,2H1.65c.42,1.88.76,3,.76,3h32.9l-15.44,15.07,15.44.37,9.21-15.11,9.42,14.96,15.44-.37-15.44-15.07h32.9s.34-1.12.76-3h-7.75c-1.11,0-2-.9-2-2s.9-2,2-2h8.53c.28-1.71.54-3.65.7-5.73h-6.27c-1.11,0-2-.9-2-2Z"></path>
                </svg>
                <div class="heading lora-display">World Assembly</div>
            </div>
            <div class="subtitle lora-text">One nation. One vote. Some exceptions apply.</div>
        </div>
    </div>
    <div class="banner">
        <img src="https://www.nationstates.net/images/banners/wa1.jpg" alt="World Assembly" />
    </div>
</div>

<Content>
    {#if (loading)}
    <div class="loading">Loading World Assembly data...</div>
    {:else}
    <div class="wa-container">
        <p class="lora-text">The WA is the world's governing body. Membership is voluntary, but all member nations must abide by legislation it passes.</p>
        <div class="section-container">
        <div class="section lora-text">
            <span class="section-header">
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
                <h2>General Assembly</h2>
            </span>
            {#if (gaData.id !== "")}
            <div class="resolution-container">
            <h3 class="resolution-title"><a href="wa/ga">{gaData.name}</a></h3>
            <div class="resolution-desc">{gaData.smallDescription}</div>
            <div class="voting-bar-container">
                <div class="voting-bar-text voting-bar-subtitle">For</div>
                <div class="voting-bar">
                    <div class="voting-bar-for" style="width: {gaForPercentage}%">
                        <span class="vote-count">{gaData.totalVotes.for}</span>
                    </div>
                    <div class="voting-bar-against" style="width: {gaAgainstPercentage}%">
                        <span class="vote-count">{gaData.totalVotes.against}</span>
                    </div>
                </div>
                <div class="voting-bar-text voting-bar-subtitle">Against</div>
            </div>
        </div>
        <div class="resolution-info">
            <table>
                <tbody class="resolution-info-table">
                <tr>
                    <td><b>Recent:</b></td>
                    <td>{@html gaData.lastResolution}</td>
                </tr>
            </tbody>
            </table>
        </div>
        {:else}
        <div class="resolution-desc">No resolution at vote.</div>
        {/if}
        </div>

        <div class="section lora-text">
            <span class="section-header">
                <svg viewBox="0 0 90 75" class="wa-icon">
                    <path fill="currentColor" d="M82.8,47.24c-1.75,0-2.97-2.24-.96-4h7.41c.02-1.88-.07-3.8-.29-5.73h-6.16c-2.01-1.77-.78-4,.96-4h4.5c-.47-1.99-1.12-3.92-2.01-5.73h-6.49c-2.01-1.77-.79-4,.96-4h3.4c-1.21-2.09-2.47-4-3.77-5.73h-4.64c-2.01-1.77-.79-4,.96-4h.34C66.13,2.23,54.38,1.04,54.38,1.04c0,0,17,11,17,26,0,9.26-11.58,20.51-19.56,27.17v-25.54h13.13l-5-7h-11.57V3.6c0-1.99-1.61-3.6-3.6-3.6h0c-1.99,0-3.6,1.61-3.6,3.6v18.06h-11.57l-5,7h13.13v25.94c-8-6.63-19.86-18.04-19.86-27.41C17.87,12.19,34.87,1.19,34.87,1.19c0,0-11.75,1.19-22.65,13h1.31c2.01,1.77.79,4-.96,4h-3.68c-1.3,1.73-2.56,3.63-3.77,5.73h4.37c2.01,1.77.78,4-.96,4H3c-.9,1.81-1.55,3.74-2.01,5.73h5.46c2.01,1.77.79,4-.96,4H.29C.07,39.58-.01,41.51,0,43.38h7.41c2.01,1.77.79,4-.96,4H.18c.16,2.08.42,4.02.7,5.73h9.49c2.01,1.77.78,4-.96,4H1.65c.42,1.88.76,3,.76,3h32.9l-15.44,15.07,15.44.37,9.07-14.89h.28l9.28,14.74,15.44-.37-15.44-15.07h32.9s.34-1.12.76-3h-8.72c-2.01-1.77-.79-4,.96-4h8.53c.28-1.71.54-3.65.7-5.73h-6.27Z"></path>
                </svg>
                <h2>Security Council</h2>
            </span>
            {#if (scData.id !== "")}
            <div class="resolution-container">
                <h3 class="resolution-title">{scData.name}</h3>
                <div class="resolution-desc">{scData.smallDescription}</div>
                <div class="voting-bar-container">
                    <div class="voting-bar-text voting-bar-subtitle">For</div>
                    <div class="voting-bar">
                        <div class="voting-bar-for" style="width: {scForPercentage}%">
                            <span class="vote-count">{scData.totalVotes.for}</span>
                        </div>
                        <div class="voting-bar-against" style="width: {scAgainstPercentage}%">
                            <span class="vote-count">{scData.totalVotes.against}</span>
                        </div>
                    </div>
                    <div class="voting-bar-text voting-bar-subtitle">Against</div>
                </div>
            </div>

            {:else}
            <div class="resolution-desc">No resolution at vote.</div>
            {/if}
            <table>
                <tbody class="resolution-info-table">
                <tr>
                    <td><b>Recent:</b></td>
                    <td>{@html scData.lastResolution}</td>
                </tr>
            </tbody>
            </table>

        </div>
    </div>
    </div>
    {/if}
</Content>

<style>
    .banner-container {
        z-index: 1;
        position: relative;
        width: 100%;
        height: 40vh;
        overflow: hidden;
    }

    .resolution-title {
        font-size: 2rem;
        color: var(--text);
        text-align: center;
    }
    .resolution-container {
        border: 1px solid var(--gray-mixed);
        border-radius: 4px;
        padding: .5rem;
    }
    .resolution-info {
        padding: 1rem;
    }
    .resolution-info-table {
        font-size: 1rem;
        color: var(--text);
    }
    .resolution-info-table td {
        padding: .5rem;
    }
    .resolution-desc {
        font-size: 1rem;
        color: var(--text);
        text-align: center;
        margin-bottom: 1rem;
    }

    .banner {
        position: relative;
        width: 100%;
        height: 40vh;
    }

    .banner img {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        mask-image: linear-gradient(to top, transparent, black);
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
    .section {
        background: var(--background);
        padding: 1rem;
        border: 1px solid var(--gray-mixed);
        border-radius: 4px;
        width: 100%;
    }
    .section-container {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-content: center;
        justify-content: center;
    }
    .section-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        svg {
            height: 3rem;
            width: 3rem;
            color: var(--text);
        }
    }

    .title {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    }

    .title-container {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .wa-icon {
        height: 5rem;
        width: 5rem;
        color: var(--text);
    }

    .subtitle {
        margin-top: 1.5rem;
        text-transform: uppercase;
        font-size: .75rem;
        color: var(--text);
        letter-spacing: 2px;
    }
    .voting-bar-subtitle {
        text-transform: uppercase;
        font-size: .75rem;
        color: var(--text);
        letter-spacing: 2px;
    }
    .voting-bar-container {
        margin-bottom: 1rem;
    }

    .heading {
        font-size: 5rem;
        color: var(--text);
    }

    .wa-links {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 2rem;
    }

    .wa-link {
        color: var(--theme-accent);
        text-decoration: none;
        font-size: 1.5rem;
        transition: color 0.2s;
    }

    .wa-link:hover {
        color: var(--theme-accent-hover);
    }

    .voting-bar-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .voting-bar-text {
        width: 10%;
        text-align: center;
        color: var(--text);
    }

    .voting-bar {
        display: flex;
        height: 2rem;
        width: 80%;
        background-color: var(--gray-mixed);
        border-radius: 4px;
        overflow: hidden;
        position: relative;
    }

    .voting-bar-for, .voting-bar-against {
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1rem;
        position: relative;
    }

    .voting-bar-for .vote-count {
        padding-left: 1rem;
        text-align: left;
    }
    .voting-bar-against .vote-count {
        padding-right: 1rem;
        text-align: right;
    }

    .vote-count {
        position: absolute;
        width: 100%;
    }

    .voting-bar-for {
        background-color: var(--theme-blue);
    }

    .voting-bar-against {
        background-color: var(--theme-red);
    }
</style>