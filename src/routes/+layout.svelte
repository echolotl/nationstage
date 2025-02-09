<script lang="ts">
    import Window from '$lib/components/ui/window.svelte';
    import Navbar from '$lib/components/ui/navbar.svelte';
    import { theme } from '$lib/stores/theme';

    let { children } = $props();

    import { onMount } from 'svelte';
    import { isAuthenticated, currentNation } from '$lib/stores/auth';
    import { invoke } from '@tauri-apps/api/core';

    let scrolled = $state(false);

    onMount(async () => {
        try {
            const auth = await invoke<{ nation: string } | null>('get_auth');
            if (auth) {
                isAuthenticated.set(true);
                currentNation.set(auth.nation);
            } else {
                isAuthenticated.set(false);
                currentNation.set('');
            }
        } catch {
            isAuthenticated.set(false);
            currentNation.set('');
        }

        window.addEventListener('scroll', handleScroll);
    });

    function handleScroll() {
        scrolled = window.scrollY > 0;
    }

    onMount(() => {
        if ($theme) {
            document.documentElement.setAttribute('data-theme', $theme);
        }
    });
</script>
  
<div class="layout">
    <Window {scrolled} />
    <Navbar {scrolled} />
</div>

<style>
    .layout {
        display: flex;
        flex-direction: column;
        max-height: 100vh;
    }
</style>  
{@render children()}