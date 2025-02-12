<script lang="ts">
    import Content from '$lib/components/content.svelte';
    import { bookmarks } from '$lib/stores/bookmarks';
    import { onMount } from 'svelte';
    import { invoke } from '@tauri-apps/api/core';
    import { auth } from '$lib/stores/auth';

    let activeFilter: 'all' | 'nation' | 'region' = 'all';
    let searchQuery = '';
    let mounted = false;

    $: filteredBookmarks = $bookmarks
        .filter(bookmark => 
            (activeFilter === 'all' || bookmark.type === activeFilter) &&
            (searchQuery === '' || bookmark.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    onMount(async () => {
        mounted = true;
        await bookmarks.init();
    });

    async function removeBookmark(id: string) {
        await bookmarks.remove(id);
    }

    $: if (mounted) {
        invoke('update_discord_presence', {
            details: `Playing as ${$auth.nation}`,
            state: `Viewing bookmarks`
        });
    }
</script>

<Content>
    <div class="favorites">
        <h1 class="lora-text">Bookmarks</h1>
        <hr />
        <div class="bookmarks">
        <div class="controls">
            <div class="filters ">
                <button 
                    class:active={activeFilter === 'all'} 
                    on:click={() => activeFilter = 'all'}
                >
                    All
                </button>
                <button 
                    class:active={activeFilter === 'nation'} 
                    on:click={() => activeFilter = 'nation'}
                >
                    Nations
                </button>
                <button 
                    class:active={activeFilter === 'region'} 
                    on:click={() => activeFilter = 'region'}
                >
                    Regions
                </button>
            </div>
            <input 
                type="text" 
                placeholder="Search favorites..." 
                bind:value={searchQuery}
                class="search-input lora-text"
            />
        </div>

        <div class="bookmarks-grid">
            {#each filteredBookmarks as bookmark}
                <a href="/{bookmark.type}/{bookmark.id}" class="bookmark-card">
                    <div class="banner-container">
                        <img 
                            src={bookmark.banner} 
                            alt={`${bookmark.name} banner`} 
                            class="bookmark-banner"
                        />
                    </div>
                    <div class="bookmark-content lora-text">
                        <img src={bookmark.flag} alt={`${bookmark.name} flag`} class="bookmark-flag"/>
                        <div class="bookmark-info">
                            <span class="bookmark-name">{bookmark.name}</span>
                            <span class="bookmark-type">{bookmark.type}</span>
                        </div>
                        <button 
                            class="remove-button" 
                            on:click|preventDefault={() => removeBookmark(bookmark.id)}
                            title="Remove from favorites"
                        >
                            ×
                        </button>
                    </div>
                </a>
            {/each}
        </div>

        {#if filteredBookmarks.length === 0}
            <div class="empty-state">
                {searchQuery ? 'No matching favorites found' : 'No favorites yet'}
            </div>
        {/if}
    </div>
    </div>
</Content>

<style>
    .page-title {
        font-size: 2rem;
        margin-bottom: 2rem;
        color: var(--text);
    }
    .bookmarks {
        margin-top: 2rem;
    }

    .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        gap: 1rem;
    }

    .filters {
        display: flex;
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

    .bookmarks-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }

    .bookmark-card {
        position: relative;
        display: flex;
        flex-direction: column;
        background: var(--background-secondary);
        border: 1px solid var(--gray-mixed);
        border-radius: 4px;
        text-decoration: none;
        color: var(--text);
        transition: all 0.2s;
        overflow: hidden;
    }

    .banner-container {
        width: 100%;
        height: 80px;
        overflow: hidden;
        position: relative;
    }

    .bookmark-banner {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        animation: fadeIn 0.5s ease-in-out forwards;
        mask-image: linear-gradient(to top, transparent, black);
    }

    .bookmark-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .bookmark-flag {
        max-width: 48px;
        height: 32px;
        object-fit: cover;
    }

    .bookmark-info {
        flex: 1;
    }

    .bookmark-name {
        display: block;
        font-weight: bold;
        margin-bottom: 0.25rem;
    }

    .bookmark-type {
        display: block;
        font-size: 0.875rem;
        color: var(--text-secondary);
        text-transform: capitalize;
    }

    .remove-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        transition: all 0.2s;
    }

    .remove-button:hover {
        color: var(--theme-red);
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
