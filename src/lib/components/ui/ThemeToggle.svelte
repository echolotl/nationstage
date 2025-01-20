<script lang="ts">
    import { theme } from '$lib/stores/theme';
    
    function toggleTheme() {
        $theme = $theme === 'light' ? 'dark' : 'light';
    }
</script>

<button on:click={toggleTheme} class="theme-toggle">
    {#if $theme === 'light'}
        🌙
    {:else}
        ☀️
    {/if}
</button>

<style>
    .theme-toggle {
        padding: 0.5rem;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        color: var(--text);
    }
</style>