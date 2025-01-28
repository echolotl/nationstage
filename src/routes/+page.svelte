<script lang="ts">
  import Content from '$lib/components/content.svelte';
  import { invoke } from '@tauri-apps/api/core';
  import { auth } from '$lib/stores/auth';
  import { bookmarks } from '$lib/stores/bookmarks';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { getLeaderName, getIssues, getUnreadNotices } from '$lib/api/request';
  import { parseIssues } from '$lib/utils/parseIssues';
  import { parseNotices } from '$lib/utils/parseNotices';
  import { noticeIcons } from '$lib/utils/noticeIcons';
  import type { Notice } from '$lib/types/notices';
  import type { Issue } from '$lib/types/issues';
  
  let recentBookmarks: typeof $bookmarks = [];
  let mounted = false;
  let leaderName = '';
  let issues: Issue[] = [];
  let notices: Notice[] = [];
  
  async function initializeDashboard() {
    if (!mounted) return;
    
    try {
      await invoke('update_discord_presence', {
        details: `Playing as ${$auth.nation}`,
        state: "On the dashboard"
      }).catch(() => {}); // Ignore discord presence errors
      
      await bookmarks.init();
      recentBookmarks = $bookmarks.slice(0, 5);

      // Try to get saved leader name first
      const userData = await invoke<{ leader_name?: string }>('get_user_data');
      if (userData?.leader_name) {
        leaderName = userData.leader_name;
      } else {
        // If not saved, fetch from API and save
        const leaderXml = await getLeaderName($auth.nation);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(leaderXml, "text/xml");
        const customLeader = xmlDoc.querySelector('CUSTOMLEADER')?.textContent;
        const defaultLeader = xmlDoc.querySelector('LEADER')?.textContent;
        leaderName = customLeader || defaultLeader || $auth.nation;
        
        // Save the leader name
        await invoke('update_leader_name', { name: leaderName });
      }

      // Load issues and notices
      const [issuesResponse, noticesResponse] = await Promise.all([
        getIssues(),
        getUnreadNotices()
      ]);

      console.log(noticesResponse);
      
      issues = parseIssues(issuesResponse);
      notices = parseNotices(noticesResponse);
    } catch (error) {
      console.error('Failed to initialize dashboard:', error);
      leaderName = $auth.nation; // Fallback to nation name
    }
  }
  
  onMount(() => {
    mounted = true;
    initializeDashboard();
  });
  
  onDestroy(() => {
    mounted = false;
  });
</script>
  
<Content>
  <div class="dashboard">
    <h1 class="welcome-text lora-display">Welcome back, {leaderName}!</h1>

    <div class="dashboard-grid">
      <!-- Bookmarks Section -->
      <section class="dashboard-section">
        <div class="section-content">
        <div class="section-header">
          <h2 class="lora-text">Bookmarks</h2>
          <button class="view-all" on:click={() => goto('/favorites')}>
            View All
          </button>
        </div>
        <div class="favorites-grid">
          {#each recentBookmarks as bookmark}
            <a href="/{bookmark.type}/{bookmark.id}" class="favorite-card">
              <img src={bookmark.flag} alt={`${bookmark.name} flag`} class="favorite-flag"/>
              <div class="favorite-info lora-text">
                <span class="favorite-name">{bookmark.name}</span>
                <span class="favorite-type">{bookmark.type}</span>
              </div>
            </a>
          {/each}
        </div>
        </div>
      </section>

      <!-- Issues Section -->
      <section class="dashboard-section">
        <div class="section-content">
        <div class="section-header">
          <h2 class="lora-text">Unresolved Issues</h2>
          <button class="view-all" on:click={() => goto('/issues')}>
            View All
          </button>
        </div>
        <div class="issues-list lora-text">
          {#each issues as issue}
            <a href="/issues/{issue.id}" class="issue-card">
              <span class="issue-title">{issue.title}</span>
            </a>
          {/each}
        </div>
        </div>
      </section>

      <!-- Notices Section -->
      <section class="dashboard-section">
        <div class="section-content">
        <div class="section-header">
          <h2 class="lora-text">Unread Notices ({notices.length})</h2>
          <button class="view-all" on:click={() => goto('/notices')}>
            View All
          </button>
        </div>
        <div class="notices-list">
          {#if notices.length === 0}
            <div class="notice-card lora-text">
              <span class="notice-empty">No unread notices</span>
            </div>
          {:else}
            {#each notices as notice}
              <div class="notice-card lora-text">
                <div class="notice-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24">
                  {@html noticeIcons[notice.icon || 'male']}
                  </svg>
                </div>
                <div class="notice-content">
                  <span class="notice-title">{notice.title}</span>
                <span class="notice-type">
                  {#if notice.icon === "award"}
                    Ranking
                  {:else if notice.icon === "bell"}
                    Notification
                  {:else if notice.icon === "male"}
                    New Issue
                  {:else if notice.icon === "lock-open"}
                    Unlock!
                  {:else if notice.icon === "mail-alt"}
                    Message
                  {:else}
                    Notice
                  {/if}
                </span>
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>
      </section>
    </div>
  </div>
</Content>

<style>
  .welcome-text {
    text-align: center;
    font-size: 3rem;
    margin: 2rem 0;
    color: var(--text);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    h2 {
      margin: 0;
    }
  }

  .view-all {
    display: block;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background: var(--background);
    color: var(--text);
    cursor: pointer;
    font-size: 0.875rem;
    transition: opacity 0.2s;
    translate: 0 -4px;
  }

  .view-all:hover {
    opacity: 0.8;
  }

  .favorites-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    overflow-y: auto;
    max-height: 300px;
  }

  .favorite-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 4px;
    text-decoration: none;
    color: var(--text);
    transition: all 0.2s;
  }

  .favorite-card:hover {
    background: var(--theme-accent);
  }

  .favorite-flag {
    max-width: 36px;
    height: 24px;
    object-fit: cover;
    border: 2px solid var(--background-secondary);
    border-radius: 2px;
  }

  .favorite-info {
    flex: 1;
  }

  .favorite-name {
    display: block;
    font-size: 0.875rem;
    font-weight: bold;
  }

  .favorite-type {
    display: block;
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: capitalize;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 2rem;
  }

  .dashboard-section {
    background: var(--background-secondary);
    border-radius: 4px;
    border: 1px solid var(--gray-mixed);
    display: flex;
    flex-direction: column;
  }

  .issues-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
    overflow-y: auto;
    max-height: 400px;
  }

  .issue-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: var(--background-tertiary);
    border-radius: 4px;
    text-decoration: none;
    color: var(--text);
    transition: background-color 0.2s;
  }

  .issue-card:hover {
    background: var(--theme-accent);
  }

  .notices-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
    overflow-y: auto;
    max-height: 400px;
  }

  .notice-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: var(--background-tertiary);
    border-radius: 4px;
  }

  .notice-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--background-secondary);
    border-radius: 50%;
    color: var(--theme-accent);
  }

  .notice-content {
    flex: 1;
  }

  .notice-title {
    display: block;
    font-weight: bold;
  }
  .notice-type {
    display: block;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  .notice-empty {
    text-align: center;
    color: var(--text-secondary);
    width: 100%;
    padding: 1rem;
  }
  .section-content {
    padding: 1.5rem;
  }
</style>