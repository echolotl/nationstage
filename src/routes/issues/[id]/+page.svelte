<script lang="ts">
    import { page } from '$app/stores';
    import { getIssues, answerIssue, getNewspaperInfo } from '$lib/api/request';
    import { parseIssues } from '$lib/utils/parseIssues';
    import { getNewspaperName } from '$lib/utils/newspaper';
    import { goto } from '$app/navigation';
    import type { Issue } from '$lib/types/issues';
    import Content from '$lib/components/content.svelte';
    import NewspaperCard from '$lib/components/NewspaperCard.svelte';
    import { parseIssueResults } from '$lib/utils/parseIssueResults';
    import { invoke } from '@tauri-apps/api/core';
    import { auth } from '$lib/stores/auth';
    
    const issueId = $page.params.id;
    let issue: Issue | undefined;
    let loading = false;
    let error = '';
    let newspaperName = '';

    async function loadData() {
        try {
            const [issuesResponse, newspaperResponse] = await Promise.all([
                getIssues(),
                getNewspaperInfo()
            ]);
            
            const issues = parseIssues(issuesResponse);
            issue = issues.find(i => i.id === issueId);
            
            if (!issue) {
                error = 'Issue not found';
                return;
            }

            const newspaperData = new DOMParser()
                .parseFromString(newspaperResponse, 'text/xml');
            const customCapital = newspaperData.querySelector('CAPITAL')?.textContent;
            const nationName = newspaperData.querySelector('NAME')?.textContent;
            
            newspaperName = getNewspaperName(customCapital || nationName || '');

            // Update Discord presence
            await invoke('update_discord_presence', {
                details: `Playing as ${$auth.nation}`,
                state: `Reading Issue: ${issue?.title || 'Unknown Issue'}`
            });
        } catch (err) {
            error = 'Failed to load data';
            console.error(err);
        }
    }

    async function handleAnswer(optionId: string) {
        loading = true;
        try {
            const response = await answerIssue(issueId, optionId);
            console.log('Raw API response:', response); // Debug: Log raw response
            const result = parseIssueResults(response);
            const encodedData = encodeURIComponent(JSON.stringify(result));
            await goto(`/issues/results?data=${encodedData}`);
        } catch (err) {
            error = 'Failed to submit answer';
            console.error(err);
        } finally {
            loading = false;
        }
    }

    loadData();
</script>
<Content>
    {#if error}
        <div class="error">
            {error}
        </div>
    {:else if !issue}
        <div class="loading">Loading...</div>
    {:else}
    <div class="issue">        
        <NewspaperCard
            title={issue.title}
            newspaperName={newspaperName}
            articleId={issue.id}
            text={issue.text}
            pic1={issue.pic1}
            pic2={issue.pic2}
            href="#"
            scale={0.7}
        /></div>

        <div class="description">
            <h3 class="section-title">The Issue</h3>
            <p class="lora-text">{@html issue.text}</p>
        </div>

        
        <div class="options">
            <div class="options-header">
                <h3 class="section-title">The Debate</h3>
                <button 
                    class="lora-text danger-button option-button"
                    on:click={() => handleAnswer("-1")}
                    disabled={loading}
                    aria-label="Dismiss issue"
                >
                    Dismiss issue
                </button>
            </div>
            <ol class="lora-text options-list">
            {#each issue.options as option}
            <li class="option-item">
                <div class="option-content">
                    <p>{@html option.text}</p>

                    <button
                        class="option-button lora-text"
                        on:click={() => handleAnswer(option.id)}
                        disabled={loading}
                        aria-label="Answer issue #{option.id}"
                    >
                    Accept
                    </button>
                </div>
            </li>
            {/each}
            </ol>
        </div>

        <div class="credits lora-text">
            Issue by <a href="/nation/{issue.author.toLowerCase()}">{issue.author}</a>
            <br>Edited by <a href="/nation/{issue.editor.toLowerCase()}">{issue.editor}</a>
        </div>
    {/if}
</Content>

<style>
    .issue {
        padding-top: 3rem;
        padding-bottom: 3rem;
    }
    .section-title {
        color: var(--theme-yellow);
        letter-spacing: 2px;
        text-transform: uppercase;
        font-size: 1rem;
        margin-bottom: .25rem;
    }
    button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.25rem;
        background: var(--theme-green);
        color: var(--text);
        cursor: pointer;
    }
    .danger-button {
        background: var(--theme-red) !important;
        color: white !important;
        margin-right: 1rem;
    }
    .danger-button:hover {
        background: var(--theme-red-hover) !important;
    }
    .credits {
        color: var(--text);
    }
    .option-button {
        float: right;
        margin-left: 2rem;
    }
    .options-list {
        list-style-position: inside;
        padding: 0;
    }

    .option-item {
        margin-bottom: 1rem;
        background: var(--background-secondary);
        padding: 1rem;
        border-radius: 0.5rem;
    }

    .option-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
    }

    .option-content p {
        flex: 1;
        margin: 0;
    }

    .option-button {
        flex-shrink: 0;
        padding: 0.5rem 1rem;
        background: var(--theme-green);
        border: none;
        border-radius: 0.25rem;
        color: var(--text);
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .option-button:hover:not(:disabled) {
        background: var(--theme-green-hover);
    }

    .option-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .options-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .credits a {
        color: var(--theme-blue);
        text-decoration: none;
    }

    .credits a:hover {
        text-decoration: underline;
    }

</style>