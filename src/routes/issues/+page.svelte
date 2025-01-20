<script lang="ts">
    import Content from '$lib/components/content.svelte';
    import NewspaperCard from '$lib/components/NewspaperCard.svelte';
    import { getIssues, getNewspaperInfo } from '$lib/api/request';
    import { parseIssues } from '$lib/utils/parseIssues';
    import { getNewspaperName } from '$lib/utils/newspaper';
    import type { Issue } from '$lib/types/issues';
    
    let issues: Issue[] = [];
    let newspaperName = '';
    
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
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    }
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
    <h1 class="center-text lora-text">Issues</h1>
    <hr>
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
</style>