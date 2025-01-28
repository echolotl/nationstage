<script lang="ts">
    import Content from '$lib/components/content.svelte';
    import NewspaperCard from '$lib/components/NewspaperCard.svelte';
    import { getIssues, getNewspaperInfo, getNextIssueTime } from '$lib/api/request';
    import { parseIssues } from '$lib/utils/parseIssues';
    import { getNewspaperName } from '$lib/utils/newspaper';
    import type { Issue } from '$lib/types/issues';
    import { onDestroy } from 'svelte';
    import { invoke } from '@tauri-apps/api/core';
    import { auth } from '$lib/stores/auth';
    
    let issues: Issue[] = [];
    let newspaperName = '';
    let nation = '';
    let nextIssueTime: Date | null = null;
    let timeRemaining: string = '';
    let countdownInterval: NodeJS.Timer;
    let timeRemainingMs = 0;

    function formatTimeRemaining(milliseconds: number): string {
        if (milliseconds <= 0) return "Any moment now...";
        
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    }

    async function loadNextIssueTime() {
        try {
            const response = await getNextIssueTime();
            console.log('Next issue response:', response); // Debug log
            
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response, "text/xml");
            
            const nextIssueElement = xmlDoc.querySelector('NEXTISSUETIME');
            console.log('Next issue element:', nextIssueElement); // Debug log
            
            if (nextIssueElement && nextIssueElement.textContent) {
                const timestamp = parseInt(nextIssueElement.textContent) * 1000; // Convert to milliseconds
                console.log('Parsed timestamp:', timestamp); // Debug log
                
                nextIssueTime = new Date(timestamp);
                console.log('Next issue time:', nextIssueTime); // Debug log
                
                // Clear existing interval if any
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                }
                
                // Start countdown
                countdownInterval = setInterval(() => {
                    const now = new Date();
                    const remaining = nextIssueTime!.getTime() - now.getTime();
                    
                    if (remaining <= 0) {
                        timeRemaining = "Any moment now...";
                        // Reload data to check for new issues
                        loadData();
                    } else {
                        timeRemaining = formatTimeRemaining(remaining);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Failed to load next issue time:', error);
            timeRemaining = "Unable to fetch next issue time";
        }
    }

    async function loadData() {
        try {
            const [issuesResponse, newspaperResponse] = await Promise.all([
                getIssues(),
                getNewspaperInfo()
            ]);
            
            issues = parseIssues(issuesResponse);
            console.log(issues);
            
            const newspaperData = new DOMParser()
                .parseFromString(newspaperResponse, 'text/xml');
            const customCapital = newspaperData.querySelector('CAPITAL')?.textContent;
            const nationName = newspaperData.querySelector('NAME')?.textContent;
            
            newspaperName = getNewspaperName(customCapital || nationName || '');
            nation = nationName || '';

            // Always load next issue time
            await loadNextIssueTime();

            await invoke('update_discord_presence', {
                details: `Playing as ${$auth.nation}`,
                state: `Browsing issues (${issues.length} available)`
            });
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    }

    function updateTimeRemaining() {
        if (nextIssueTime) {
            timeRemainingMs = nextIssueTime.getTime() - new Date().getTime();
        }
    }

    function startCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);
        updateTimeRemaining();
        countdownInterval = setInterval(updateTimeRemaining, 1000);
    }

    $: {
        if (nextIssueTime) {
            startCountdown();
        }
    }

    onDestroy(() => {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    });

    const getCurrentDate = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };
    
    function getRandomRotation() {
        return Math.random() * 6 - 3; // Random angle between -3 and 3 degrees
    }

    loadData();
</script>

<Content>
    <h1 class="newsroom-title lora-display">{nation} Decides</h1>
    <h2 class="newsroom-subtitle lora-text">
        {#if issues.length > 0}
            The following issues confront {nation}:
        {:else if nextIssueTime}
            Next issue in: <span class="countdown">{formatTimeRemaining(timeRemainingMs)}</span>
        {:else}
            Loading...
        {/if}
    </h2>
    <div class="issues">    
        {#each issues as issue}
            <NewspaperCard
                title={issue.title}
                newspaperName={newspaperName}
                articleId={issue.id}
                text={issue.text}
                pic1={issue.pic1}
                pic2={issue.pic2}
                href={`/issues/${issue.id}`}
                rotation={getRandomRotation()}
                scale={0.7}
                hoverScale={1}
            />
        {/each}
    </div>
    {#if issues.length > 0}
    {#if nextIssueTime}
    <div class="next-issue-time">
        Next issue in: {formatTimeRemaining(timeRemainingMs)}
    </div>
    {/if}
    {/if}
</Content>

<style>
    .issues {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 4rem;
        padding: 2rem;
        margin-top: 8rem;
    }
    .newsroom-subtitle {
        font-size: 1.5rem;
        margin-top: 1rem;
    }
    .newsroom-title {
        font-size: 3rem;
        margin-top: 2rem;
    }
    .countdown {
        color: var(--theme-accent);
        font-weight: bold;
        font-size: 1.2em;
    }
    .next-issue-time {
        font-size: 0.8em;
        color: #666;
        margin-top: 0.5em;
        text-align: center;
    }
</style>