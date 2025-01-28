<script lang="ts">
    import { page } from '$app/stores';
    import Content from '$lib/components/content.svelte';
    import { getDominantColor, resetThemeColor } from '$lib/utils/getDominantColor';
    import { onDestroy, onMount } from 'svelte';
    import { getNationFlag } from '$lib/api/request';
    import { invoke } from '@tauri-apps/api/core';
    import { auth } from '$lib/stores/auth';
    import { bookmarks } from '$lib/stores/bookmarks';
    
    export let data;
    console.log('Page data:', data); // Debug
    
    $: regionId = $page.params.id;
    $: regionData = data?.region;
    $: console.log('Region data:', regionData); 

    async function updateThemeColor(flagUrl: string) {
        try {
            const color = await getDominantColor(flagUrl);
            document.documentElement.style.setProperty('--theme-accent', color);
        } catch (error) {
            console.error('Failed to update theme color:', error);
        }
    }
    
    async function getFlagUrl(nation: string) {
        try {
            const flagXml = await getNationFlag(nation);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(flagXml, "text/xml");
            const flag = xmlDoc.querySelector('FLAG')?.textContent || '';
            const fullname = xmlDoc.querySelector('FULLNAME')?.textContent || '';
            return {
                flagUrl: flag,
                fullname: fullname
            };
        } catch (error) {
            console.error('Failed to fetch flag:', error);
            return { flagUrl: '', fullname: nation };
        }
    }

    function formatFlagUrl(url: string): string {
        if (url.includes('.svg')) {
            return url.replace('.svg', 't1.png');
        } else if (url.includes('.png')) {
            return url.replace('.png', 't1.png');
        }
        return url;
    }

    let flagsLoaded = false;
    let officersWithFlags: Array<any> = [];

    $: officersWithGovernor = regionData?.officers ? [
        ...(regionData.governor ? [{
            nation: regionData.governor,
            office: "Governor",
            authority: "X",
            flagUrl: "",  // Will be populated by getFlagUrl
            fullname: "", // Will be populated by getFlagUrl
            time: Number(regionData.founded),
            by: regionData.founder,
            order: 0
        }] : []),
        ...regionData.officers.map(officer => ({
            ...officer,
            time: Number(officer.time)
        }))
    ] : [];

    async function loadOfficerFlags() {
        if (!flagsLoaded && regionData?.officers) {
            flagsLoaded = true;
            officersWithFlags = await Promise.all(
                officersWithGovernor.map(async (officer) => {
                    const { flagUrl, fullname } = await getFlagUrl(officer.nation);
                    return { ...officer, flagUrl, fullname };
                })
            );
        }
    }

    $: if (regionData?.flag) {
        updateThemeColor(regionData.flag);
    }

    $: if (regionData && !flagsLoaded) {
        loadOfficerFlags();
    }

    $: if (regionData?.name) {
        invoke('update_discord_presence', {
            details: `Playing as ${$auth.nation}`,
            state: `Viewing region: ${regionData.name}`
        });
    }

    onDestroy(() => {
        resetThemeColor();
    });

    let isBookmarked = false;
    
    $: if (regionData) {
        isBookmarked = $bookmarks.some(b => b.id === regionId);
    }

    onMount(async () => {
        await bookmarks.init();
    });

    async function toggleBookmark() {
        if (isBookmarked) {
            await bookmarks.remove(regionId);
        } else if (regionData) {
            // Use a default flag if region doesn't have one
            const flag = regionData.flag || 'https://www.nationstates.net/images/flags/Default.svg';
            await bookmarks.add({
                id: regionId,
                name: regionData.name,
                type: 'region',
                flag: flag,
                banner: `https://www.nationstates.net/images/rbanners/uploads/${regionData.name.toLowerCase().replace(/\s+/g, '_')}__${regionData.banner}.jpg`
            });
        }
    }

    // Add star icon SVG paths
    const starOutline = "M3.52,7.6c0,9.69-.03,33.99-.02,44.77,0,3.03,3.08,5.04,5.69,3.69,6.89-3.57,13.27-11.87,13.27-11.87,0,0,6.39,8.31,13.31,11.88,2.62,1.35,5.68-.67,5.68-3.7V7.61c0-2.27-1.77-4.11-3.96-4.11H7.48c-2.18,0-3.96,1.83-3.96,4.1Z";
    const starFilled = "M.02,4.75C.01,15.97,0,44.11,0,56.59c0,3.51,3.56,5.84,6.59,4.27,7.98-4.14,15.37-13.75,15.37-13.75,0,0,7.4,9.62,15.42,13.76,3.03,1.56,6.58-.77,6.58-4.29V4.76c0-2.63-2.05-4.76-4.58-4.76H4.61C2.08,0,.03,2.12.02,4.75Z";
</script>

{#if !regionData}
{:else}
<div class="region-banner-container">
    {#if !regionData.flag}
    <div class="region-content"> 
    <div class="region-title">
        <div class="subtitle lora-text">Welcome to</div>
        <div class="title lora-display">{regionData.name}</div>
    </div>
    </div>
    {:else}
    <div class="region-content"> 
    <div class="region-flag">
        <img class="flag" src={regionData.flag} alt={regionData.name} />
    </div>
    <div class="region-title" style="align-items: flex-start; position:relative; ">
        <div class="subtitle lora-text">Welcome to</div>
        <div class="title lora-display">{regionData.name}</div>
    </div>
</div>
    {/if}
    <div class="region-banner">
        <img class="banner" src="https://www.nationstates.net/images/rbanners/uploads/{regionData.name.toLowerCase().replace(/\s+/g, '_')}__{regionData.banner}.jpg" alt={regionData.name} />
        <button 
            class="bookmark-button {isBookmarked ? 'active' : ''}" 
            on:click={toggleBookmark}
            title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            aria-label="Bookmark this region"
        >
            <svg viewBox="0 0 50 60" width="24" height="24">
                <path 
                    fill={isBookmarked ? "currentColor" : "none"} 
                    stroke={isBookmarked ? "none" : "currentColor"}
                    d={isBookmarked ? starFilled : starOutline}
                    stroke-width={isBookmarked ? "0" : "7"}
                    stroke-miterlimit={isBookmarked ? "" : "10"}
                />
            </svg>
        </button>
    </div>
</div>
{/if}

<Content>
    <div class="region">
        <div class="region-container">
                {#if !regionData}
                    <div class="loading">Loading region data...</div>
                {:else}
                <div class="worldfactbook-container">
                <legend class="subtitle">World Factbook Entry</legend>
                <hr />
                    <div class="worldfactbook">      
                        {#await invoke('parse_bbcode', { input: regionData.factbook })}
                            <p>Loading...</p>
                        {:then parsed}
                            <p class="lora-text">{@html parsed}</p>
                        {:catch error}
                            <p class="error">Error parsing BBCode</p>
                        {/await}
                        <div class="region-officers">
                            <hr />
                            <div class="officers">
                                {#if officersWithFlags.length == 0}
                                    <div class="loading">Loading officers...</div>
                                {:else}
                                {#each officersWithFlags as officer}
                                    <div class="officer lora-text">
                                        <div class="officer-header">
                                            {#if officer.flagUrl}
                                                <img 
                                                    class="officer-flag" 
                                                    src={formatFlagUrl(officer.flagUrl)} 
                                                    alt={`${officer.fullname} flag`}
                                                />
                                            {/if}
                                            <a href="/nation/{officer.nation}"class="officer-name nation-link">{officer.fullname}</a>
                                        </div>
                                        <div class="officer-role">
                                            {#if officer.office === "Governor"}
                                                <span class="governor">Governor</span>
                                            {:else if officer.nation === regionData.delegate}
                                                WA Delegate / {officer.office}
                                            {:else}
                                                {officer.office}
                                            {/if}
                                        </div>
                                        <div class="officer-auth">{officer.authority}</div>
                                    </div>
                                {/each}
                                {/if}
                            </div>
                        </div>
                        <hr />
                    </div>
                </div>
                    <div class="region-info">
                        <pre>{JSON.stringify(regionData, null, 2)}</pre>
                    </div>
                {/if}
        </div>
    </div>
</Content>

<style>
    .title {
        font-size: 5rem;
        color: var(--text);
    }
    .worldfactbook {
        padding: 1rem 1rem;
        color: var(--text);
        background-color: var(--background-secondary);
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
    }
    .worldfactbook-container legend {
        position: absolute;
        background-color: var(--theme-accent);
        width: fit-content;
        margin-left: 2rem;
        padding: .25rem 1rem;
        top: -1.6rem;
        font-size: 1rem;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom: none;
        font-weight: bold;
        text-align: center;
    }
    .worldfactbook-container hr {
        margin: 0;
        border: 0;
        border-top: 2px solid var(--theme-accent);
    }
    .region-officers hr {
        margin: 1rem 0;
        border: 0;
        border-top: 2px solid var(--theme-accent);
    }
    .worldfactbook-container {
        position: relative;
        margin: 5rem 0;
    }
    .subtitle {
        text-transform: uppercase;
        font-size: 2rem;
        color: var(--text);
        letter-spacing: 2px;
    }
    .region-title {
        position: absolute;
        z-index: 4;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    }
    .region-content {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 4;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .region-flag img {
        height: 10rem;
        width: auto;
        margin-right: 2rem;
    }
    .banner {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .region-banner {
        position: relative;
        width: 100%;
        height: 30vh;
    }
    .region-banner::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(in oklab 180deg, rgba(0, 0, 0, 0), var(--background));
    }
    .region-banner-container {
        z-index: 1;
        position: relative;
        width: 100%;
        height: 30vh;
        overflow: hidden;
    }
    .region-container {
        position: relative;
        z-index: 2;
        height: calc(100vh - 150px);
        width: 100%;
    }
    .region-info {
        position: relative;
    }
    .loading {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }
    .officers {
        text-align: center;
        margin: 2rem auto;
        width: 100%;
    }

    .officer {
        display: inline-block;
        width: fit-content;
        margin: 1rem;
        vertical-align: top;
        padding: 1rem;
        background-color: var(--background-tertiary);
        border-radius: 4px;
    }

    .officer-header {
        display: flex;
        align-items: top;
        gap: 0.5rem;
    }

    .officer-flag {
        width: auto;
        height: 100%;
        object-fit: cover;
    }

    .officer-name {
        font-weight: bold;
        color: var(--theme-accent);
        font-size: 1rem;
    }

    .officer-role {
        color: var(--text);
        font-size: 1rem;
    }

    .officer-auth {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .governor {
        color: var(--theme-yellow);
        font-weight: bold;
    }

    .bookmark-button {
        position: absolute;
        bottom: 1rem;
        right: 2.75rem;
        z-index: 5;
        background: transparent;
        border: none;
        color: var(--text);
        cursor: pointer;
        transition: transform 0.2s;
    }

    .bookmark-button.active {
        color: var(--theme-accent);
    }

    .bookmark-button:hover {
        transform: scale(1.1);
    }
</style>
