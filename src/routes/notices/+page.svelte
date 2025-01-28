<script lang="ts">
    import { onMount } from 'svelte';
    import Content from '$lib/components/content.svelte';
    import { getNotices } from '$lib/api/request';
    import { parseNotices } from '$lib/utils/parseNotices';
    import type { Notice } from '$lib/types/notices';
    import { noticeIcons } from '$lib/utils/noticeIcons';
    import { invoke } from '@tauri-apps/api/core';
    import { auth } from '$lib/stores/auth';
    
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
    
    onMount(async () => {
        await invoke('update_discord_presence', {
            details: `Playing as ${$auth.nation}`,
            state: `Reading notices`
        });
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
                <div class="notice-card-top {notice.icon}">
                    <div class="notice-type">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24">
                                {@html noticeIcons[notice.icon || 'male']}
                            </svg>
                            <div class="notification-type lora-text">
                                {#if notice.icon == "award"}
                                    <p>Ranking</p>
                                {:else if notice.icon == "bell"}
                                    <p>Notification</p>
                                {:else if notice.icon == "male"}
                                    <p>New Issue</p>
                                {:else if notice.icon == "lock-open"}
                                    <p>Unlock!</p>
                                {:else if notice.icon == "mail-alt"}
                                    <p>Message</p>
                                {:else}
                                    <p>Notice</p>
                                {/if}
                            </div>
                            </div>
                    </div>
                    <div class="notice-card {notice.icon}">
                        <div>
                        <h2 class="lora-display">{notice.title}</h2>
                        <p class="lora-text">{@html notice.text}</p>
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
    
    
    .notice-card {
        padding: 1rem;
        border: 1px solid var(--background-secondary);
        border-radius: 0.5rem;
        transition: transform 0.2s;
    }
    

    .notices-container {
        padding-bottom: 150px;
        width: 100%;
    }
    .notice-type {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notice-card-top {
        background-color: var(--theme-green);
        border-radius: 4px 4px 0 0;
        padding: 4px 16px;
        display: inline-flex;
        align-items: center;
        border: 1px solid var(--gray-mixed);
        border-bottom: none;
        position: relative;
        z-index: 1;
        margin-left: 1rem;
        &.bell {
            background-color: var(--theme-yellow);
        }
    }

    .notice-card {
        background-color: var(--background-secondary);
        border-radius: 0 0 4px 4px;
        padding: 16px;
        display: flex;
        border: 1px solid var(--gray-mixed);
        border-top: 2px solid var(--theme-green);
        position: relative;
        margin-bottom: 16px;
        &.bell {
            border-top-color: var(--theme-yellow);
        }
    }

    .notice-type {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .notification-type p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--text);
    }
</style>
