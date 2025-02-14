<script lang="ts">
    import Window from '$lib/components/ui/window.svelte';
    import Navbar from '$lib/components/ui/navbar.svelte';
    import { theme } from '$lib/stores/theme';
    import { auth, isAuthenticated, currentNation } from '$lib/stores/auth';
    import { page } from '$app/stores';

    let { children } = $props();

    import { onMount, onDestroy } from 'svelte';
    import { invoke } from '@tauri-apps/api/core';

    let scrolled = $state(false);

    function handleScroll() {
        scrolled = window.scrollY > 0;
    }

    // Skip auth check and layout for splash screen
    $effect(() => {
        if ($page.route.id === '/splash') {
            return;
        }
    });

    onMount(async () => {
        // Skip auth check for splash screen
        if ($page.route.id === '/splash') {
            return;
        }

        try {
            const authData = await invoke<{ nation: string, region: string | null } | null>('get_auth');
            if (authData) {
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

{#if $page.route.id === '/splash'}
    {@render children()}
{:else}
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
{/if}
