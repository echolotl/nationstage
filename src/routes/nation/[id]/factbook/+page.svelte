<script lang="ts">
    import { getNationFactbooks } from "$lib/api/request";
    import { parseNationFactbook, groupFactbooksBySubcategory } from "$lib/utils/parseNationFactbooks";
    import type { FactbookDetails } from "$lib/types/factbook";
    import { onMount } from "svelte";
  import { formatRelativeTime } from "$lib/utils/nationUtils";
    
    let factbookGroups: Record<string, FactbookDetails[]> = {};
    
    async function loadFactbooks(nationId: string) {
        const xml = await getNationFactbooks(nationId);
        const factbooks = parseNationFactbook(xml);
        factbookGroups = groupFactbooksBySubcategory(factbooks);
    }

    onMount(async () => {
        const nationId = window.location.pathname.split('/')[2];
        loadFactbooks(nationId);
    });
</script>

{#if Object.keys(factbookGroups).length > 0}
    <div class="factbook-groups">
        {#each Object.entries(factbookGroups) as [subcategory, factbooks]}
            <div class="factbook-group">
                <h2 class="subtitle">{subcategory}</h2>
                <hr />
                <div class="factbook-list">
                    {#each factbooks as factbook}
                        <div class="factbook-item">
                            <h3 class="lora-display"><a href="/dispatch/{factbook.id}">{factbook.title}</a></h3>
                            <p class="lora-text">Created {formatRelativeTime(factbook.created)}, {factbook.views} reads.</p>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
{:else}
    <p>No factbooks found.</p>
{/if}

<style>
    .subtitle {
        margin-top: 1.5rem;
    text-transform: uppercase;
    font-size: 1rem;
    color: var(--text);
    letter-spacing: 2px;
    text-align: center;
    }
    .factbook-groups {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .factbook-list {
        display: grid;
        gap: 1rem;
    }

    .factbook-item {
        background: var(--background-secondary);
        padding: 1rem;
        border-radius: 10px;
    }
</style>