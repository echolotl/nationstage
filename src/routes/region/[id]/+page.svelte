<script lang="ts">
    import { page } from '$app/stores';
    import Content from '$lib/components/content.svelte';
    import { getDominantColor, resetThemeColor } from '$lib/utils/getDominantColor';
    import { onDestroy } from 'svelte';
    
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
    
    $: if (regionData?.flag) {
        updateThemeColor(regionData.flag);
    }

    onDestroy(() => {
        resetThemeColor();
    });
</script>

{#if !regionData}
{:else}
<div class="region-banner-container">
    <div class="region-title">
        <div class="subtitle">Welcome to</div>
        <div class="title lora-display">{regionData.name}</div>
    </div>
    <div class="region-banner">
        <img class="banner" src="https://www.nationstates.net/images/rbanners/uploads/{regionData.name.toLowerCase()}__{regionData.banner}.jpg" alt={regionData.name} />
    </div>
</div>
{/if}

<Content>
    <div class="region">
        <div class="region-container">
                {#if !regionData}
                    <div class="loading">Loading region data...</div>
                {:else}
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
    .subtitle {
        text-transform: uppercase;
        font-size: 2rem;
        color: var(--text);
        letter-spacing: 2px;
    }
    .region-title {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 4;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
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
        height: 40vh;
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
        height: 40vh;
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
</style>
