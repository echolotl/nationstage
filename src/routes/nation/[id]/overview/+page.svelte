<script lang="ts">
    import { getWorldCensusInfo } from '$lib/api/request';
    import { parseWorldCensusInfo } from '$lib/utils/parseWorldCensusInfo';
    import { onMount } from 'svelte';
    import { getOrdinalSuffix, formatCensusScore, formatHappeningText, getSizeAdjective, 
             getCategoryDescription, getFreedomClass, formatList, formatRelativeTime, 
             parseHappening } from '$lib/utils/nationUtils.js';
    import type { NationRanking } from '$lib/types/rankings';
    
    export let data;
    
    $: nationData = data?.nation;
    $: currentCensus = nationData?.census[0];

    $: censusRank = currentCensus ? getOrdinalSuffix(currentCensus.rank) : '';
    $: censusRegionalRank = currentCensus ? getOrdinalSuffix(currentCensus.relativeRank) : '';
    $: censusScore = currentCensus ? formatCensusScore(currentCensus.score) : '';

    let censusScales: { [key: number]: any } = {};
    
    onMount(async () => {
        const censusXML = await getWorldCensusInfo();
        censusScales = parseWorldCensusInfo(censusXML);
    });

    $: censusUnits = currentCensus && censusScales[currentCensus.id] 
        ? censusScales[currentCensus.id].unit 
        : '';

    function filterUniqueRankings(rankings: NationRanking[], existingRankings: NationRanking[][]): NationRanking[] {
        return rankings.filter(r => 
            !existingRankings.some(group => 
                group?.some(t => t.id === r.id)
            )
        );
    }
</script>

<div class="nation">
    <div class="info-blurbs-container">
        <div class="info-blurb lora-text" id="region">
            <div class="infoblurb-title lora-text">Region</div>
            <a href="/region/{nationData.region}">
                <div class="infoblurb-content region-link">{nationData.region}</div>
            </a>
        </div>
        <div class="info-blurb lora-text">
            <div class="infoblurb-title lora-text freedom-top">Civil Rights</div>
            <div class="infoblurb-content freedom {getFreedomClass(nationData.freedoms.civil, 'civil')}">
                {nationData.freedoms.civil}
            </div>
        </div>
        <div class="info-blurb lora-text">
            <div class="infoblurb-title lora-text freedom-top">Economy</div>
            <div class="infoblurb-content freedom {getFreedomClass(nationData.freedoms.economy, 'economy')}">
                {nationData.freedoms.economy}
            </div>
        </div>
        <div class="info-blurb lora-text">
            <div class="infoblurb-title lora-text freedom-top">Political Freedom</div>
            <div class="infoblurb-content freedom {getFreedomClass(nationData.freedoms.political, 'political')}">
                {nationData.freedoms.political}
            </div>
        </div>
        <div class="info-blurb lora-text" id="influence">
            <div class="infoblurb-title lora-text">Influence</div>
            <div class="infoblurb-content">{nationData.influence}</div>
        </div>
    </div>

    <section class="paragraph">
        <div class="main-paragraph lora-text">
            <p>
                {nationData.fullname} is a {getSizeAdjective(nationData.population)}, {nationData.admirables[0]} nation, 
                notable for its {formatList(nationData.notables)}. 
                The {nationData.sensibilities} population of {nationData.population} million {nationData.demonym2plural} 
                {getCategoryDescription(nationData.category)}.
            </p>
            <p>{nationData.govtdesc} The average income tax rate is {nationData.tax}%.</p>
            <p>{nationData.industrydesc}</p>
            <p>
                {@html formatList(nationData.legislation)}. {nationData.crime} 
                {nationData.name}'s national animal is the {nationData.animal}, 
                which {nationData.animaltrait}.
            </p>
            {#if currentCensus}
                <p>
                    {nationData.name} is ranked {@html censusRank} in the world 
                    and {@html censusRegionalRank} in <a href="/region/{nationData.region}" class="region-link">{nationData.region}</a>
                    with {censusScore} {censusUnits}.
                </p>
            {/if}
        </div>

        <div class="infobox lora-text">
            <span class="infobox-title">{nationData.name}</span>
            <span class="flag-container">
                <img class="infobox-flag" src="{nationData.flag}" alt="{nationData.name} flag"/>
            </span>
            <table class="nationsummary-table">
                <tbody>
                    <tr>
                        <td>Population</td>
                        <td>{nationData.population} million</td>
                    </tr>
                    <tr><td colspan="2"><hr /></td></tr>
                    {#if nationData.capital}
                        <tr>
                            <td>Capital</td>
                            <td>{nationData.capital}</td>
                        </tr>
                    {/if}
                    {#if nationData.customleader}
                        <tr>
                            <td>Leader</td>
                            <td>{nationData.customleader}</td>
                        </tr>
                    {/if}
                    {#if nationData.customreligion}
                        <tr>
                            <td>Religion</td>
                            <td>{nationData.customreligion}</td>
                        </tr>
                    {/if}
                    {#if nationData.capital || nationData.customleader || nationData.customreligion}
                        <tr><td colspan="2"><hr /></td></tr>
                    {/if}
                    <tr>
                        <td>Currency</td>
                        <td>{nationData.currency}</td>
                    </tr>
                    <tr>
                        <td>Animal</td>
                        <td>{nationData.animal}</td>
                    </tr>
                </tbody>
            </table>
            <span class="founded-date">Established {nationData.founded}</span>
        </div>
    </section>

    <section class="happenings">
        <h3 class="lora-text">National Happenings</h3>
        <ul class="happenings-list">
            {#each nationData.happenings as happening}
                {@const parsed = parseHappening(happening)}
                <li class="happening-item lora-text">
                    <span class="happening-time">{formatRelativeTime(parsed.time)}</span>
                    {@html formatHappeningText(parsed.text)}
                </li>
            {/each}
        </ul>
    </section>

    {#if data?.rankings}
        <div class="all-rankings">
            <div class="ranking-section">
                {#if data.rankings.topOne?.length > 0}
                    <div class="trophy-category">
                        <div class="trophies-grid">
                            {#each data.rankings.topOne as ranking (ranking.id)}
                                <div class="trophy world-leader" title="{ranking.name}: Top {(100 - ranking.percentile).toFixed(2)}% (#{ranking.rank})">
                                    <img src="https://www.nationstates.net/images/trophies/{ranking.imageName}{ranking.trophyIcon}.png" alt="{ranking.name} trophy"/>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

                {#if data.rankings.topFive?.length > 0}
                    <div class="trophy-category">
                        <div class="trophies-grid">
                            {#each filterUniqueRankings(data.rankings.topFive, [data.rankings.topOne]) as ranking (ranking.id)}
                                <div class="trophy top-five" title="{ranking.name}: Top {(100 - ranking.percentile).toFixed(2)}% (#{ranking.rank})">
                                    <img src="https://www.nationstates.net/images/trophies/{ranking.imageName}{ranking.trophyIcon}.png" alt="{ranking.name} trophy"/>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

                {#if data.rankings.topTen?.length > 0}
                    <div class="trophy-category">
                        <div class="trophies-grid">
                            {#each filterUniqueRankings(data.rankings.topTen, [data.rankings.topOne, data.rankings.topFive]) as ranking (ranking.id)}
                                <div class="trophy" title="{ranking.name}: Top {(100 - ranking.percentile).toFixed(2)}% (#{ranking.rank})">
                                    <img src="https://www.nationstates.net/images/trophies/{ranking.imageName}{ranking.trophyIcon}.png" alt="{ranking.name} trophy"/>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    /* Info blurbs */
    .info-blurbs-container {
        width: 100%;
        display: inline-block;
        text-align: center;
    }

    .info-blurb {
        display: inline-block;
        min-width: 150px;
        width: fit-content;
        margin-left: 1rem;
        border-radius: 10px;
    }

    .info-blurb:first-child {
        margin-left: 0;
    }

    #region, #influence {
        .infoblurb-content {
            font-size: 1.25rem;
        }
    }

    #region {
        float: left;
    }

    #influence {
        float: right;
    }

    .infoblurb-title {
        font-size: 1rem;
        font-weight: bold;
        background: var(--theme-accent);
        color: white;
        width: calc(100% - 2px);
        text-align: center;
        line-height: 1em;
        padding: 0.25rem 0;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    .infoblurb-content {
        background: var(--background-secondary);
        color: var(--text-secondary);
        padding: 0.5rem;
        text-align: center;
        font-size: 1.25rem;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        border: 1px solid var(--gray-mixed);
        border-top: none;
    }

    /* Freedom indicators */
    .freedom-top {
        background: var(--background-secondary) !important;
        color: var(--text-secondary) !important;
        padding-bottom: .4rem;
        border: 1px solid var(--gray-mixed);
        border-bottom: none;
        width: calc(100% - 2px);
    }

    .infoblurb-content.freedom {
        border: none;
    }

    :root {
        --freedom-color-15: #4d85ce; 
        --freedom-color-14: #339b90;
        --freedom-color-13: #00b884;
        --freedom-color-12: #1bad69;
        --freedom-color-11: #3ca54f;
        --freedom-color-10: #55993a;
        --freedom-color-9: #6c9726;
        --freedom-color-8: #818b13;
        --freedom-color-7: #9e8900;
        --freedom-color-6: #b9770b;
        --freedom-color-5: #da5f12;
        --freedom-color-4: #FC351F;
        --freedom-color-3: #FF0029;
        --freedom-color-2: #BF0A1C;
        --freedom-color-1: #8E1212;
    }

    .freedom-1 { background: var(--freedom-color-1) !important; color: white !important; }
    .freedom-2 { background: var(--freedom-color-2) !important; color: white !important; }
    .freedom-3 { background: var(--freedom-color-3) !important; color: white !important; }
    .freedom-4 { background: var(--freedom-color-4) !important; color: white !important; }
    .freedom-5 { background: var(--freedom-color-5) !important; color: white !important; }
    .freedom-6 { background: var(--freedom-color-6) !important; color: white !important; }
    .freedom-7 { background: var(--freedom-color-7) !important; color: white !important; }
    .freedom-8 { background: var(--freedom-color-8) !important; color: white !important; }
    .freedom-9 { background: var(--freedom-color-9) !important; color: white !important; }
    .freedom-10 { background: var(--freedom-color-10) !important; color: white !important; }
    .freedom-11 { background: var(--freedom-color-11) !important; color: white !important; }
    .freedom-12 { background: var(--freedom-color-12) !important; color: white !important; }
    .freedom-13 { background: var(--freedom-color-13) !important; color: white !important; }
    .freedom-14 { background: var(--freedom-color-14) !important; color: white !important; }
    .freedom-15 { background: var(--freedom-color-15) !important; color: white !important; }

    /* Main content layout */
    .paragraph {
        display: flex;
        justify-content: space-between;
        gap: 2rem;
        margin: 2rem 0;
    }

    .main-paragraph {
        flex: 1;
        max-width: 85%;
    }

    /* Infobox styles */
    .infobox {
        width: 15%;
        min-width: 250px;
        background: var(--background-secondary);
        padding: 1rem;
        border-radius: 10px;
        align-self: flex-start;
        border: 1px solid var(--gray-mixed);
    }

    .infobox-title {
        display: block;
        width: 100%;
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1rem;
        text-align: center;
        color: var(--theme-accent);
    }

    .infobox-flag {
        max-width: 225px;
        height: auto;
    }

    .flag-container {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .nationsummary-table {
        width: 100%;
        margin-top: 1rem;
    }

    .nationsummary-table td:first-child {
        color: var(--theme-accent);
        opacity: 50%;
    }

    .nationsummary-table td:nth-child(2) {
        text-align: right;
    }

    .nationsummary-table hr {
        border: 1px dashed var(--theme-accent);
        opacity: 30%;
        margin-left: 10%;
        width: 80%;
    }

    .founded-date {
        display: block;
        width: 100%;
        margin-top: 1rem;
        color: var(--theme-accent);
        opacity: 0.7;
        text-align: center;
    }

    /* Happenings section */
    .happenings-list {
        list-style: none;
        padding: 0;
        margin: 1rem 0;
    }

    .happening-item {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--gray-mixed);
        opacity: 0.9;
    }

    .happening-item:hover {
        opacity: 1;
    }

    .happening-time {
        color: var(--theme-accent);
        margin-right: 0.5rem;
        opacity: 0.8;
    }

    /* Rankings section */
    .all-rankings {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
    }

    .trophies-grid {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: fit-content;
        padding: 0.5rem 0.5rem;
        background: var(--background-secondary);
        border-radius: 15px;
    }

    .trophies-grid img {
        transform: translateY(5%);
    }

    .trophy-category {
        display: inline-block;
        width: fit-content;
    }

    .trophy-category sub {
        color: var(--theme-accent);
        opacity: 0.7;
        text-decoration: underline;
        margin-bottom: 0.5rem;
    }
</style>
