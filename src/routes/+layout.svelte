<script lang="ts">
    import Window from '$lib/components/ui/window.svelte';
    import Navbar from '$lib/components/ui/navbar.svelte';
    import { theme } from '$lib/stores/theme';
    import { auth, isAuthenticated, currentNation } from '$lib/stores/auth';

    let { children } = $props();

    import { onMount, onDestroy } from 'svelte';
    import { invoke } from '@tauri-apps/api/core';

    let scrolled = $state(false);

    function handleScroll() {
        scrolled = window.scrollY > 0;
    }

    onMount(async () => {
        try {
            const authData = await invoke<{ nation: string, region: string | null } | null>('get_auth');
            if (authData) {
                // Set all auth state at once to prevent multiple updates
                const newState = {
                    isAuthenticated: true,
                    nation: authData.nation,
                    region: authData.region
                };
                auth.set(newState);
                isAuthenticated.set(true);
                currentNation.set(authData.nation);
            }
        } catch (error) {
            console.error('Failed to load auth state:', error);
            auth.set({
                isAuthenticated: false,
                nation: '',
                region: null
            });
            isAuthenticated.set(false);
            currentNation.set('');
        }

        window.addEventListener('scroll', handleScroll);
        
        if ($theme) {
            document.documentElement.setAttribute('data-theme', $theme);
        }
    });

    onDestroy(() => {
        window.removeEventListener('scroll', handleScroll);
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