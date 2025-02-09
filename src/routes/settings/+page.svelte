<script lang="ts">
    import { theme } from '$lib/stores/theme';
    import { auth, logout, savedAccounts, switchAccount } from '$lib/stores/auth';
    import Content from '$lib/components/content.svelte';
    import { themeIcons } from '$lib/utils/themeIcons';
    import { goto } from '$app/navigation';
    import { invoke } from '@tauri-apps/api/core';
    import { onMount } from 'svelte';

    function toggleTheme() {
        $theme = $theme === 'light' ? 'dark' : 'light';
        invoke('change_mica_theme', { dark: $theme === 'dark' }).catch(console.error);
    }

    let nationInput = '';
    let regionInput = '';
    let discordEnabled = false;
    let showDropdown = false;

    function goToNation() {
        if (nationInput) goto(`/nation/${nationInput.toLowerCase()}`);
    }

    function goToRegion() {
        if (regionInput) goto(`/region/${regionInput.toLowerCase()}`);
    }

    async function handleLogout() {
        await logout();
        goto('/login');
    }

    async function handleAccountSwitch(nation: string) {
        const success = await switchAccount(nation);
        if (!success) {
            // TODO: Show error notification
            console.error('Failed to switch account');
        }
    }

    async function toggleDiscordRPC() {
        try {
            await invoke('toggle_discord_rpc', { enabled: !discordEnabled });
            discordEnabled = !discordEnabled;
        } catch (error) {
            console.error('Failed to toggle Discord RPC:', error);
        }
    }

    // Load initial state
    onMount(async () => {
        try {
            discordEnabled = await invoke('get_discord_setting');
            await invoke('update_discord_presence', {
                details: `Playing as ${$auth.nation}`,
                state: "In the settings"
            });
        } catch (error) {
            console.error('Failed to load Discord RPC setting:', error);
        }
    });
</script>

<Content>
    <div class="settings lora-text">
        <h1 class="center-text lora-display">Settings</h1>
        
        <div class="setting-group">
            <h2 class="lora-display">Account</h2>
            {#if $auth.isAuthenticated}
                <div class="setting-item">
                    <span>Current Nation</span>
                    <span class="current-nation">{$auth.nation}</span>
                </div>
                <div class="setting-item">
                    <span>Region</span>
                    <a class="region-link" href="/region/{$auth.region}">{$auth.region}</a>
                </div>
                <div class="setting-item">
                    <span>Account Actions</span>
                    <div class="button-group">
                        <button 
                            class="danger-button" 
                            on:click={handleLogout}
                        >
                            Logout
                        </button>
                        <button 
                            on:click={() => goto('/login')}
                        >
                            Add Account
                        </button>
                        <div class="dropdown">
                            <button 
                                class="dropdown-button" 
                                on:click={() => showDropdown = !showDropdown}
                            >
                                Switch Account
                            </button>
                            {#if showDropdown}
                                <div class="dropdown-content">
                                    {#each $savedAccounts.filter(acc => acc.nation !== $auth.nation) as account}
                                        <button 
                                            class="account-button" 
                                            on:click={() => handleAccountSwitch(account.nation)}
                                        >
                                            {account.nation}
                                        </button>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {:else}
                <div class="setting-item">
                    <span>Not logged in</span>
                    <button on:click={() => goto('/login')}>Login</button>
                </div>
            {/if}
        </div>

        <div class="setting-group">
            <h2 class="lora-display" >Appearance</h2>
            <div class="setting-item">
                <span>Theme</span>
                <button 
                    class="theme-toggle" 
                    on:click={toggleTheme}
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" viewBox="0 0 78 78">
                    {@html themeIcons[$theme as 'light' | 'dark']}
                </svg>
                    {$theme === 'light' ? 'Light' : 'Dark'}
                </button>
            </div>
        </div>

        <div class="setting-group">
            <h2 class="lora-display" >Debug Navigation</h2>
            <div class="setting-item">
                <span>Go to Nation</span>
                <div class="input-group">
                    <input 
                        type="text" 
                        bind:value={nationInput} 
                        placeholder="Enter nation name"
                    >
                    <button on:click={goToNation}>Go</button>
                </div>
            </div>
            <div class="setting-item">
                <span>Go to Region</span>
                <div class="input-group">
                    <input 
                        type="text" 
                        bind:value={regionInput} 
                        placeholder="Enter region name"
                    >
                    <button on:click={goToRegion}>Go</button>
                </div>
            </div>
        </div>

        <div class="setting-group">
            <h2 class="lora-display" >Integrations</h2>
            <div class="setting-item">
                <span class="discord-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 127.14 96.36"><path fill="currentColor" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>
                    Discord Rich Presence
                </span>
                <button 
                    class="toggle-button discord" 
                    class:enabled={discordEnabled}
                    on:click={toggleDiscordRPC}
                >
                    {discordEnabled ? 'Enabled' : 'Disabled'}
                </button>
            </div>
        </div>
    </div>
</Content>

<style>
    .center-text {
        text-align: center;
    }
    .settings {
        margin: 0 auto;
    }

    .setting-group {
        margin: 2rem 0;
    }

    .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--background-secondary);
        border: 1px solid var(--gray-mixed);
        border-radius: 0.5rem;
        margin: 1rem 0;
    }

    .theme-toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.25rem;
        background: var(--background);
        color: var(--text);
        cursor: pointer;
        font-size: 1rem;
    }

    .theme-toggle:hover {
        opacity: 0.8;
    }

    .input-group {
        display: flex;
        gap: 0.5rem;
    }

    input {
        padding: 0.5rem;
        border: none;
        border-radius: 0.25rem;
        background: var(--background);
        color: var(--text);
    }

    button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.25rem;
        background: var(--background);
        color: var(--text);
        cursor: pointer;
    }

    button:hover {
        opacity: 0.8;
    }

    .button-group {
        display: flex;
        gap: 0.5rem;
    }

    .danger-button {
        background: var(--theme-red) !important;
        color: white !important;
    }

    .secondary-button {
        background: var(--background-light) !important;
    }

    .current-nation {
        font-weight: bold;
        color: var(--theme-accent);
    }

    .accounts-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .account-button {
        background: var(--background) !important;
        width: 100%;
        text-align: left;
        padding: 0.75rem;
        transition: background-color 0.2s;
    }

    .account-button:hover {
        background: var(--background-light) !important;
    }

    .toggle-button {
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .toggle-button.enabled {
        background: var(--theme-accent);
        color: white;
    }
    .toggle-button.enabled.discord {
        background: #5865F2;
        color: white;
    }

    .discord-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .discord-label svg {
        color: var(--text);
    }

    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: block;
        position: absolute;
        background-color: var(--background-secondary);
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
    }

    .dropdown-content .account-button {
        color: var(--text);
        padding: 12px 16px;
        text-decoration: none;
        display: block;
    }

    .dropdown-content .account-button:hover {
        background-color: var(--background-light);
    }

    .dropdown-button {
        background: var(--background) !important;
    }
</style>