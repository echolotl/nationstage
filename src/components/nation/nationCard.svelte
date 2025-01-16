<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchNationData, type NationData } from '../../utils/api/nationstates';
    
    export let nationName = '';
    
    let nationData: NationData;
    let loading:boolean = true;
    let error:any = null;
    
    onMount(async () => {
        try {
            nationData = await fetchNationData(nationName);
            loading = false;
        } catch (e:any) {
            error = e.message;
            loading = false;
        }
    });
</script>

<div class="nation-card">
    {#if loading}
        <div class="loading">Loading nation data...</div>
    {:else if error}
        <div class="error">{error}</div>
    {:else}
        <h2>{nationData.name}</h2>
        <div class="flag">
            <img src={nationData.flag} alt="Flag of {nationData.name}" />
        </div>
        <div class="details">
            <p>Population: {nationData.population.toLocaleString()} million</p>
            <p>Region: {nationData.region}</p>
            <p>Founded: {nationData.founded}</p>
            <p>Category: {nationData.category}</p>
        </div>
        <div class="actions">
            <button on:click={() => window.open(`https://www.nationstates.net/nation=${nationName}`)}>
                Visit on NationStates
            </button>
        </div>
    {/if}
</div>

<style>
    .nation-card {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 1rem;
        max-width: 400px;
        margin: 1rem;
    }

    .flag img {
        width: 100%;
        height: auto;
        border: 1px solid #eee;
    }

    .details {
        margin: 1rem 0;
    }

    .loading, .error {
        padding: 1rem;
        text-align: center;
    }

    .error {
        color: red;
    }

    .actions {
        margin-top: 1rem;
    }

    button {
        width: 100%;
        padding: 0.5rem;
        background: #4a4a4a;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background: #363636;
    }
</style>