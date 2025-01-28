<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    
    onMount(() => {
        goto(`/nation/${$page.params.id}/overview`);
    });
</script>

<div class="loading">Redirecting to overview...</div>

<style>
    .loading {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }
</style>