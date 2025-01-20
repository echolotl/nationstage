<script lang="ts">
    import { onMount } from 'svelte';
    import Content from '$lib/components/content.svelte';
    import { getNotices } from '$lib/api/request';
    import { parseNotices } from '$lib/utils/parseNotices';
    import type { Notice } from '$lib/types/notices';
    import { noticeIcons } from '$lib/utils/noticeIcons';
    
    let notices: Notice[] = [];
    let loading = true;
    let error: string | null = null;
    
    async function loadNotices() {
        loading = true;
        error = null;
        try {
            const response = await getNotices();
            notices = parseNotices(response);
            console.log(notices);
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to load notices';
        } finally {
            loading = false;
        }
    }
    
    onMount(() => {
        loadNotices();
    });
</script>

<Content>
    
    <div class="notices">
        <h1 class="center-text lora-text">Notices</h1>
        <hr>
        <div class="notices-container">
            {#if loading}
                <div class="loading">Loading notices...</div>
            {:else if error}
                <div class="error">{error}</div>
            {:else}
                {#each notices as notice}
                    <div class="notice-card">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2.5rem" height="2.5rem" viewBox="0 0 24 24">
                            {@html noticeIcons[notice.icon || 'male']}
                        </svg>
                        <div>
                        <h2>{notice.title}</h2>
                        <p>{@html notice.text}</p>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>

</Content>

<style>
    .loading {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }
    
    .error {
        text-align: center;
        padding: 2rem;
        color: var(--theme-red);
    }
    
    .error button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: var(--theme-red);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .notice-card {
        margin: 1rem 0;
        padding: 1rem;
        border: 1px solid var(--background-secondary);
        border-radius: 0.5rem;
        transition: transform 0.2s;
    }
    
    .notice-card:hover {
        transform: translateY(-2px);
    }

    .notices-container {
        padding-bottom: 150px;
        width: 100%;
    }
</style>
