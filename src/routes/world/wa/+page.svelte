<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Content from "$lib/components/content.svelte";
    import { setManualColors, resetThemeColor } from '$lib/utils/getDominantColor';
    import { invoke } from '@tauri-apps/api/core';
    import { auth } from '$lib/stores/auth';

    let mounted = false;

    function updateThemeColor() {
        setManualColors('#779bb9'); // Using GA blue as default WA color
    }

    $: if (mounted) {
        invoke('update_discord_presence', {
            details: `Playing as ${$auth.nation}`,
            state: `Viewing the World Assembly`
        });
    }

    onMount(() => {
        mounted = true;
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
    <div class="wa-links">
        <a href="/world/wa/ga" class="wa-link">General Assembly</a>
        <a href="/world/wa/sc" class="wa-link">Security Council</a>
    </div>
</Content>

<style>
    .banner-container {
        z-index: 1;
        position: relative;
        width: 100%;
        height: 40vh;
        overflow: hidden;
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
</style>