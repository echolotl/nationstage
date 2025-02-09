<script lang="ts">
    import Content from '$lib/components/content.svelte';
    import NSScraper from '$lib/api/NSScraper';
    import { getBannersByFilter, filterMetadata } from '$lib/utils/bannerData';
    import type { FilterType, BannerData } from '$lib/utils/bannerData';
    import { onMount } from 'svelte';
    import { invoke } from '@tauri-apps/api/core';
    import { auth } from '$lib/stores/auth';

    let bannerInventory: string[] = [];
    let activeFilters = new Set<FilterType>(['all']);
    let searchQuery = '';
    let mounted = false;
    let userNation: string;

    // Subscribe to auth store to get user's nation
    $: userNation = $auth?.nation || '';

    async function getBanners() {
        bannerInventory = await NSScraper.getBannerInventory('taelboa');
        console.log('Banners:', bannerInventory);
    }

    function replacePlaceholder(text: string): string {
        return text.replace('[nation-name]', userNation);
    }

    function searchBanners(banners: BannerData[], query: string): BannerData[] {
        const normalizedQuery = query.toLowerCase();
        return banners.filter(banner => {
            const title = replacePlaceholder(banner.title).toLowerCase();
            const description = replacePlaceholder(banner.description).toLowerCase();
            return title.includes(normalizedQuery) || 
                   description.includes(normalizedQuery);
        });
    }

    function toggleFilter(filter: FilterType) {
        if (filter === 'all') {
            activeFilters = new Set(['all']);
        } else {
            activeFilters.delete('all');
            if (activeFilters.has(filter)) {
                activeFilters.delete(filter);
                if (activeFilters.size === 0) {
                    activeFilters.add('all');
                }
            } else {
                activeFilters.add(filter);
            }
        }
        activeFilters = new Set(activeFilters); // Trigger reactivity
    }

    $: filteredBanners = Array.from(activeFilters)
        .flatMap(filter => getBannersByFilter(filter))
        // Remove duplicates if multiple filters are active
        .filter((banner, index, self) => 
            index === self.findIndex(b => b.id === banner.id)
        );

    $: searchResults = searchQuery 
        ? searchBanners(filteredBanners, searchQuery)
        : filteredBanners;

    onMount(() => {
        mounted = true;
    });

    $: if (mounted) {
        invoke('update_discord_presence', {
            details: `Playing as ${$auth.nation}`,
            state: 'Browsing banners'
        });
        getBanners();
    }
</script>

<Content>
    <div class="banners">
        <h1 class="lora-text">Banners</h1>
        <hr />
        <div class="controls">
            <div class="filters">
                {#each filterMetadata as filter}
                    <button 
                        class:active={activeFilters.has(filter.id)}
                        on:click={() => toggleFilter(filter.id)}
                    >
                        {filter.displayName}
                    </button>
                {/each}
            </div>
            <input 
                type="text" 
                placeholder="Search banners..." 
                bind:value={searchQuery}
                class="search-input lora-text"
            />
        </div>

        <div class="banners-grid">
            {#each searchResults as banner}
                <div class="banner-card">
                    <div class="banner-container">
                        <img 
                            src="https://www.nationstates.net/images/banners/samples/{banner.id}.jpg" 
                            alt={banner.title} 
                            class="banner-image"
                        />
                    </div>
                    <div class="banner-content lora-text">
                        <div class="banner-info">
                            <span class="banner-title">{banner.title}</span>
                            <span class="banner-id">{banner.description}</span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        {#if searchResults.length === 0}
            <div class="empty-state">
                {searchQuery ? 'No matching banners found' : 'No banners available'}
            </div>
        {/if}
    </div>
</Content>

<style>
    .banners {
        margin-top: 2rem;
    }

    .controls {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .filters button {
        padding: 0.5rem 1rem;
        border: none;
        background: var(--background-secondary);
        color: var(--text-secondary);
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;
        text-transform: capitalize;
    }

    .filters button.active {
        background: var(--theme-accent);
        color: white;
    }

    .search-input {
        padding: 0.5rem 1rem;
        border: 1px solid var(--gray-mixed);
        border-radius: 4px;
        background: var(--background-secondary);
        color: var(--text);
        width: 250px;
    }

    .banners-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }

    .banner-card {
        position: relative;
        display: flex;
        flex-direction: column;
        background: var(--background-secondary);
        border: 1px solid var(--gray-mixed);
        border-radius: 4px;
        overflow: hidden;
    }

    .banner-container {
        width: 100%;
        height: 80px;
        overflow: hidden;
    }

    .banner-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        animation: fadeIn 0.5s ease-in-out forwards;
    }

    .banner-content {
        padding: 1rem;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .banner-info {
        flex: 1;
    }

    .banner-title {
        display: block;
        font-weight: bold;
        margin-bottom: 0.25rem;
    }

    .banner-id {
        display: block;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
        background: var(--background-secondary);
        border-radius: 4px;
        margin-top: 2rem;
    }
</style>