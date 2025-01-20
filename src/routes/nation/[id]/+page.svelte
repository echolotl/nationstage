<script lang="ts">
    import { page } from '$app/stores';
    import Content from '$lib/components/content.svelte';
    import { getDominantColor, resetThemeColor } from '$lib/utils/getDominantColor';
    import { onDestroy, onMount } from 'svelte';
    
    export let data;
    console.log('Page data:', data); // Debug
    
    $: nationId = $page.params.id;
    $: nationData = data?.nation;
    $: nationRanking = data?.rankings;
    $: console.log('Nation data:', { nation: nationData, rankings: nationRanking }); // Debug

    async function updateThemeColor(flagUrl: string) {
        try {
            const color = await getDominantColor(flagUrl);
            document.documentElement.style.setProperty('--theme-accent', color);
        } catch (error) {
            console.error('Failed to update theme color:', error);
        }
    }
    
    $: if (nationData?.flag) {
        updateThemeColor(nationData.flag);
    }

    let currentBannerIndex = 0;
    let interval: NodeJS.Timeout;

    onMount(() => {
        interval = setInterval(() => {
            currentBannerIndex = (currentBannerIndex + 1) % (nationData?.banners?.length || 1);
        }, 5000); // Change banner every 5 seconds
    });

    onDestroy(() => {
        clearInterval(interval);
        resetThemeColor();
    });

    function getSizeAdjective(population: number): string {
        if (population < 1) return "tiny";
        if (population < 10) return "small";
        if (population < 50) return "moderately sized";
        if (population < 100) return "large";
        if (population < 500) return "very large";
        return "massive";
    }

    function formatList(items: string[]): string {
        if (items.length === 0) return "";
        if (items.length === 1) return items[0];
        return items.slice(0, -1).join(", ") + ", and " + items.slice(-1);
    }

    function getCategoryDescription(category: string): string {
        const descriptions: { [key: string]: string } = {
            "Anarchy": "live in a state of perpetual chaos and disorder",
            "Authoritarian Democracy": "enjoy carefully controlled freedoms within a framework of draconian laws",
            "Capitalist Paradise": "enjoy frequent shopping sprees at the nation's many malls and department stores",
            "Civil Rights Lovefest": "enjoy extensive civil freedoms and rights",
            "Conservative Democracy": "hold traditional values in high regard",
            "Corporate Police State": "are kept in line by a powerful corporate security force",
            "Corrupt Dictatorship": "are ruled with an iron fist by the corrupt government",
            "Democratic Socialists": "enjoy a high standard of living and extensive social welfare programs",
            "Father Knows Best State": "are fiercely patriotic and devoted to their leader",
            "Free-Market Paradise": "are free to succeed or fail in the nation's highly competitive economy",
            "Inoffensive Centrist Democracy": "enjoy a standard package of civil rights and freedoms",
            "Iron Fist Consumerists": "enjoy great economic freedoms while being closely monitored by an invasive government",
            "Left-Leaning College State": "are well-educated and enjoy academic freedom",
            "Left-wing Utopia": "enjoy a high standard of living and extensive social freedoms",
            "Liberal Democratic Socialists": "enjoy extensive civil rights and social welfare programs",
            "Moralistic Democracy": "are guided by strong moral principles and traditional values",
            "New York Times Democracy": "are free to live their lives as they choose while enjoying a high standard of living",
            "Psychotic Dictatorship": "live in fear of the ruthless, authoritarian government",
            "Right-wing Utopia": "enjoy economic freedom and traditional social values",
            // Add more as needed
        };
        return descriptions[category] || "live their lives according to their own unique customs and traditions";
    }
</script>

{#if !nationData}
{:else}
<div class="nation-banner-container">
    <div class="nation-banner">
        {#each nationData.banners as banner, i}
            <img 
                class="banner" 
                class:active={i === currentBannerIndex}
                src="https://www.nationstates.net/images/banners/{banner}.jpg" 
                alt={nationData.name} 
            />
        {/each}
    </div>
</div>
{/if}
<div class="under-banner">
    <div class="left-underbanner">
        <div class="flag">
            <img src="{nationData?.flag}" alt="{nationData?.name} flag"/>

        </div>

    </div>
    <div class="right-underbanner">

        <div class="trophies">
            {#each data?.rankings?.all?.slice(0, 5) ?? [] as ranking}
                <div class="trophy top">
                    <img 
                        src="https://www.nationstates.net/images/trophies/{ranking.imageName}{ranking.trophyIcon}.png" 
                        alt="{ranking.name} trophy"
                        title="{ranking.name}: Ranked #{ranking.rank} (Top {(100 - ranking.percentile).toFixed(2)}%)"
                    />
                </div>
            {/each}
        </div>
        <div class="title">
            <span class="pretitle lora-text">The {nationData?.type} of</span><br>
            <span class="name lora-display">{nationData?.name}</span><br>
            <span class="category">{nationData?.category}</span>
        </div>
</div>
</div>

<div class="quote lora-text">
    <i>{nationData?.motto}</i>
</div>


<Content>
    <div class="nation">
        <div class="nation-container">
            {#if !nationData}
                <div class="loading">Loading nation data...</div>
            {:else}
            <p class="lora-text">
                {nationData.fullname} is a {getSizeAdjective(nationData.population)} {nationData.admirables[2]} nation, 
                notable for {formatList(nationData.notables)}. 
                The {nationData.sensibilities} population of {nationData.population} million {nationData.demonym2plural} 
                {getCategoryDescription(nationData.category)}.
            </p>
            <p class="lora-text">{nationData.govtdesc} The average income tax rate is {nationData.tax}%.</p>
            <p class="lora-text">{nationData.industrydesc}</p>
            <p class="lora-text">
                {formatList(nationData.legislation)}. {nationData.crime} 
                {nationData.name}'s national animal is the {nationData.animal}, 
                which {nationData.animaltrait}.
            </p>

                <!-- Nation Details -->
                <div class="nation-info">
                    <pre>{JSON.stringify(nationData, null, 2)}</pre>
                </div>

                <!-- All Rankings -->
                {#if data?.rankings}
                    <div class="all-rankings">
                        {#if (data.rankings.topTen?.length ?? 0) > 0}
                            <div class="ranking-section">
                                <div class="trophies-grid">
                                    {#each data.rankings.topTen ?? [] as ranking}
                                        <div class="trophy" title="{ranking.name}: Ranked #{ranking.rank} (Top {(100 - ranking.percentile).toFixed(2)}%)">
                                            <img src="https://www.nationstates.net/images/trophies/{ranking.imageName}{ranking.trophyIcon}.png" alt="{ranking.name} trophy"/>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</Content>

<style>
    .title {
        margin-top: 1rem;
    }
    .pretitle {
        
        font-size: 1.3rem;
    }
    .quote {
        display: block;
        font-size: 1.5rem;
        text-align: center;
        padding: 1rem;
        color: var(--text-secondary);
        width: 100%;
        
    }
    .name {
        font-size: 3rem;
        text-decoration: underline;
    }
    .category {
        text-transform: uppercase;
        font-size: 1rem;
        color: var(--theme-accent);
        letter-spacing: 2px;
    }
    .banner {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 1s ease-in-out;
    }
    .flag {
        min-width: 15vw;
        margin-top: -35%;
        display: inline-block;
        vertical-align: top;
        position: relative;
        z-index: 4;
        border: 4px solid var(--background);
        border-radius: 4px;
        img {
            max-width: 25vw;
            max-height: 30vh;
            min-width: 15vw;
        }
    }
    .under-banner {
        margin: 0 3.25rem;
        display: table;
        width: 100%;
    }
    .left-underbanner {
        display: table-cell;
        padding: 0 12px;
    }
    .right-underbanner {
        display: table-cell;
        width: 100%;
        vertical-align: top;
    }

    .banner.active {
        opacity: 1;
    }

    .nation-banner {
        position: relative;
        width: 100%;
        height: 40vh;
        overflow: hidden;
    }
    .nation-banner::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(in oklab 180deg, rgba(0, 0, 0, 0), var(--background));
    }
    .nation-banner-container {
        z-index: 1;
        position: relative;
        width: 100%;
        height: 40vh;
        overflow: hidden;
    }
    .nation-container {
        position: relative;
        z-index: 2;
        height: calc(100vh - 150px);
        width: 100%;
    }

    .nation-info {
        position: relative;
    }

    .loading {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }

    .trophies {
        position: absolute;
        right: 0;
        max-width: 30%;
        display: flex;
        flex-wrap: wrap;
        justify-content: right;
        padding: 1rem;
    }

    .trophy {
        width: 2.5rem;
        height: 2.5rem;
    }

    .trophy img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .all-rankings {
        margin-top: 2rem;
        padding: 1rem;
    }

    .ranking-section {
        margin: 1rem 0;
    }

    .trophies-grid {
        display: flex;
        flex-wrap: wrap;
    }

    .trophy {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
</style>