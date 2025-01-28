<script lang="ts">
    import { page } from '$app/stores';
    import Content from '$lib/components/content.svelte';
    import { getDominantColor, resetThemeColor } from '$lib/utils/getDominantColor';
    import { onDestroy, onMount } from 'svelte';
    import { invoke } from '@tauri-apps/api/core';
    import { auth } from '$lib/stores/auth';
    import { bookmarks } from '$lib/stores/bookmarks';
    import { getWorldCensusInfo } from '$lib/api/request';
    import { parseWorldCensusInfo } from '$lib/utils/parseWorldCensusInfo';
    import { getOrdinalSuffix, formatCensusScore, formatHappeningText, getSizeAdjective, getCategoryDescription, getFreedomClass, formatList, formatName, formatRelativeTime, parseHappening } from '$lib/utils/nationUtils.js';

    let { children, data } = $props();
    
    const nationId = $derived($page.params.id);
    const nationData = $derived(data?.nation);
    const currentPath = $derived($page.url.pathname.split('/').pop());

    let isBookmarked = $state(false);
    
    $effect(() => {
        if (nationData) {
            isBookmarked = $bookmarks.some(b => b.id === nationId);
        }
    });
    
    onMount(async () => {
        await bookmarks.init();
    });

    async function toggleBookmark() {
        if (isBookmarked) {
            await bookmarks.remove(nationId);
        } else if (nationData) {
            await bookmarks.add({
                id: nationId,
                name: nationData.name,
                type: 'nation',
                flag: nationData.flag,
                banner: `https://www.nationstates.net/images/banners/${nationData.banners?.[0]}.jpg`
            });
        }
    }

    async function updateThemeColor(flagUrl: string) {
        try {
            const color = await getDominantColor(flagUrl);
            document.documentElement.style.setProperty('--theme-accent', color);
        } catch (error) {
            console.error('Failed to update theme color:', error);
        }
    }
    
    $effect(() => {
        if (nationData?.flag) {
            updateThemeColor(nationData.flag);
        }
    });

    $effect(() => {
        if (nationData?.name) {
            invoke('update_discord_presence', {
                details: `Playing as ${$auth.nation}`,
                state: `Viewing nation: ${nationData.name}`
            });
        }
    });

    let currentBannerIndex = $state(0);
    let interval: NodeJS.Timeout;

    onMount(() => {
        interval = setInterval(() => {
            currentBannerIndex = (currentBannerIndex + 1) % (nationData?.banners?.length || 1);
        }, 5000);
    });

    onDestroy(() => {
        clearInterval(interval);
        resetThemeColor();
    });

    const starOutline = "M3.52,7.6c0,9.69-.03,33.99-.02,44.77,0,3.03,3.08,5.04,5.69,3.69,6.89-3.57,13.27-11.87,13.27-11.87,0,0,6.39,8.31,13.31,11.88,2.62,1.35,5.68-.67,5.68-3.7V7.61c0-2.27-1.77-4.11-3.96-4.11H7.48c-2.18,0-3.96,1.83-3.96,4.1Z";
    const starFilled = "M.02,4.75C.01,15.97,0,44.11,0,56.59c0,3.51,3.56,5.84,6.59,4.27,7.98-4.14,15.37-13.75,15.37-13.75,0,0,7.4,9.62,15.42,13.76,3.03,1.56,6.58-.77,6.58-4.29V4.76c0-2.63-2.05-4.76-4.58-4.76H4.61C2.08,0,.03,2.12.02,4.75Z";
</script>

{#if !nationData}
    <div class="loading">Loading nation data...</div>
{:else}
<div class="nation-banner-container">
    <div class="nation-banner">
        {#each nationData.banners as banner, i}
            <img 
                class="banner" 
                class:active={i === currentBannerIndex}
                src="https://www.nationstates.net/images/banners/{banner}.jpg" 
                alt={nationData.name} 
            />
        {/each}
        <button 
            class="bookmark-button {isBookmarked ? 'active' : ''}" 
            onclick={toggleBookmark}
            title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            aria-label="Bookmark this nation"
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
<div class="under-banner">
    <div class="left-underbanner">
        <div class="flag">
            <img src="{nationData?.flag}" alt="{nationData?.name} flag"/>

        </div>

    </div>
    <div class="right-underbanner">

        <div class="trophies">
            {#each data?.rankings?.all?.slice(0, 5) ?? [] as ranking}
                <div class="trophy top">
                    <img 
                        src="https://www.nationstates.net/images/trophies/{ranking.imageName}{ranking.trophyIcon}.png" 
                        alt="{ranking.name} trophy"
                        title="{ranking.name}: Ranked #{ranking.rank} (Top {(100 - ranking.percentile).toFixed(2)}%)"
                    />
                </div>
            {/each}
        </div>
        <div class="title">
            <span class="pretitle lora-text">The {nationData?.type} of </span><br>
            <span class="name lora-display">{nationData?.name}</span><br>
            <span class="category">{nationData?.category}</span>
        </div>
</div>
</div>

<div class="quote lora-text">
    <div class="quote-text">
    <i>{@html nationData?.motto}</i>
</div>
</div>
<div class="subpage-nav lora-text">
    <a href="./overview" class:active={currentPath === 'overview'}>Overview</a>
    <a href="./government" class:active={currentPath === 'government'}>Government</a>
    <a href="./economy" class:active={currentPath === 'economy'}>Economy</a>
    <a href="./factbook" class:active={currentPath === 'factbook'}>Factbook</a>
    <a href="./people" class:active={currentPath === 'people'}>People</a>
    <a href="./policies" class:active={currentPath === 'policies'}>Policies</a>
    <a href="./rank" class:active={currentPath === 'rank'}>Rank</a>
    <a href="./cards" class:active={currentPath === 'cards'}>Cards</a>
</div>
{/if}

<Content>
    {@render children()}
</Content>

<style>
    .loading {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }

    /* Banner and header styles */
    .nation-banner-container {
        z-index: 1;
        position: relative;
        width: 100%;
        height: 40vh;
        overflow: hidden;
    }

    .nation-banner {
        position: relative;
        width: 100%;
        height: 40vh;
        overflow: hidden;
    }

    .nation-banner::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(in oklab 180deg, rgba(0, 0, 0, 0), var(--background));
    }

    .banner {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 1s ease-in-out;
    }

    .banner.active {
        opacity: 1;
    }

    /* Flag and underbanner layout */
    .under-banner {
        margin: 0 3.25rem;
        display: table;
        width: 100%;
    }

    .left-underbanner {
        display: table-cell;
        padding: 0 12px;
    }

    .right-underbanner {
        display: table-cell;
        width: 100%;
        vertical-align: top;
    }

    .flag {
        min-width: 15vw;
        margin-top: -35%;
        margin-right: 6px;
        display: inline-block;
        vertical-align: top;
        position: relative;
        z-index: 4;
        filter: drop-shadow( 6px  0px 0px var(--background)) 
        drop-shadow(-6px  0px 0px var(--background))
        drop-shadow( 0px  6px 0px var(--background)) 
        drop-shadow( 0px -6px 0px var(--background));
    }

    .flag img {
        max-width: 25vw;
        max-height: 30vh;
        min-width: 15vw;
    }

    /* Title and category */
    .title {
        margin-top: 1rem;
    }

    .pretitle {
        font-size: 1.3rem;
    }

    .name {
        font-size: 3rem;
        text-decoration: underline;
    }

    .category {
        display: block;
        text-transform: uppercase;
        font-size: 1rem;
        color: var(--theme-accent);
        letter-spacing: 2px;
        margin-top: .25rem;
    }

    /* Quote styles */
    .quote {
        padding-top: 2rem;
        padding-bottom: 2rem;
        display: flex;
        font-size: 1.5rem;
        text-align: center;
        justify-content: center;
        color: var(--text-secondary);
        width: 100%;
    }

    .quote-text {
        position: relative;
        width: fit-content;
        padding: 0 3rem;
        margin-right: 0.5rem;
    }

    .quote-text::before,
    .quote-text::after {
        position: absolute;
        font-size: 5rem;
        color: var(--theme-accent);
        opacity: 0.5;
    }

    .quote-text::before {
        content: '\201C';
        left: 0;
        top: -21px;
        padding-left: 12px;
    }

    .quote-text::after {
        content: '\201D';
        right: 0;
        bottom: -60px;
        padding-right: 10px;
    }

    /* Bookmark button */
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

    /* Trophy display in header */
    .trophies {
        position: absolute;
        right: 0;
        max-width: 30%;
        display: flex;
        flex-wrap: wrap;
        justify-content: right;
        padding: 1rem;
        margin-right: 2rem;
    }

    .trophy {
        width: 2.75rem;
        height: 2.75rem;
    }

    .trophy img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .subpage-nav {
        display: flex;
        justify-content: center;
        gap: 1rem;
        padding: 0.5rem;
        background: var(--background-secondary);
        border-top: 1px solid var(--gray-mixed);
        border-bottom: 1px solid var(--gray-mixed);
        margin-bottom: 1.5rem;
    }

    .subpage-nav a {
        color: var(--text-secondary);
        padding: 0.25rem 1rem;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .subpage-nav a:hover {
        color: var(--text);
        background: var(--background-tertiary);
    }

    .subpage-nav a.active {
        color: var(--theme-accent);
        font-weight: 500;
    }
</style>
