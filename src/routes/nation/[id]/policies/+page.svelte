<script lang="ts">
    import { onMount } from 'svelte';
    import { getNationData, getNationPolicies } from '$lib/api/request';
    import { parseNationPolicies, type Policy } from '$lib/utils/parseNationPolicies';

    let policies: Policy[] = [];
    let categories: string[] = [];
    let loading = true;
    let error: string | null = null;

    onMount(async () => {
        try {
            const nationId = window.location.pathname.split('/')[2];
            const response = await getNationPolicies(nationId);
            policies = parseNationPolicies(response);
            categories = [...new Set(policies.map(p => p.category))].sort();
        } catch (e) {
            error = e instanceof Error ? e.message : 'Failed to load policies';
        } finally {
            loading = false;
        }
    });
</script>
{#if loading}
    <div class="loading">Loading policies...</div>
{:else if error}
    <div class="error">{error}</div>
{:else}
    <div class="policies-container">
        {#each categories as category}
            <section class="category-section">
                <h2 class="category-title">{category}</h2>
                <div class="policy-list">
                    {#each policies.filter(p => p.category === category) as policy}
                        <div class="policy-card lora-text">
                            <div class="policy-image-overlay"></div>
                            <img class="policy-image" src="https://www.nationstates.net/images/banners/samples/{policy.pic}.jpg" alt={policy.name} />
                            
                            <div class="policy-text-wrapper">
                                <h3 class="policy-title">{policy.name}</h3>
                                <p class="policy-description">{policy.description}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
        {/each}
    </div>
{/if}


<style>
    .policy-card {
        background: var(--background-secondary);
        padding: .5rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        display: block;
        position: relative; /* Contain absolute child */
        height: 80px;
        border: 1px solid var(--gray-mixed)
    }

    .policies-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    .policy-image {
        position: absolute;
        top: 0;
        left: 0;
        width: auto;
        height: 100%;
        border-radius: 4px 0 0 4px;
        mask-image: linear-gradient(to left, transparent, black);
    }

    .category-title {
        margin-top: 1.5rem;
        text-transform: uppercase;
        font-size: 1rem;
        color: var(--text);
        letter-spacing: 2px;
        text-align: center;
    }

    .policy-text-wrapper {
        position: absolute;
        left: 400px; /* Width of image */
        top: 50%;
        transform: translateY(-50%);
        padding-right: 1rem;
        width: calc(100% - 80px);
        z-index: 3;
    }

    .policy-title {
        margin: 0;
        font-size: 1.5rem;
    }

    .policy-description {
        margin: 0.25rem 0 0 0;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
</style>