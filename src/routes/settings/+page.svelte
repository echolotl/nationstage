<script lang="ts">
    import { theme } from '$lib/stores/theme';
    import { auth, logout, savedAccounts, switchAccount } from '$lib/stores/auth';
    import Content from '$lib/components/content.svelte';
    import { themeIcons } from '$lib/utils/themeIcons';
    import { goto } from '$app/navigation';

    function toggleTheme() {
        $theme = $theme === 'light' ? 'dark' : 'light';
    }

    let nationInput = '';
    let regionInput = '';

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
</script>

<Content>
    <div class="settings">
        <h1 class="center-text lora-text">NationStage Settings</h1>
        <hr>
        
        <div class="setting-group">
            <h2>Account</h2>
            {#if $auth.isAuthenticated}
                <div class="setting-item">
                    <span>Current Nation</span>
                    <span class="current-nation">{$auth.nation}</span>
                </div>
                <div class="setting-item">
                    <span>Region</span>
                    <span>{$auth.region || 'No Region'}</span>
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
                            class="secondary-button"
                            on:click={() => goto('/login')}
                        >
                            Add Account
                        </button>
                    </div>
                </div>
                {#if $savedAccounts.length > 1}
                    <div class="setting-item">
                        <span>Saved Accounts</span>
                        <div class="accounts-list">
                            {#each $savedAccounts.filter(acc => acc.nation !== $auth.nation) as account}
                                <button 
                                    class="account-button" 
                                    on:click={() => handleAccountSwitch(account.nation)}
                                >
                                    Switch to {account.nation}
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}
            {:else}
                <div class="setting-item">
                    <span>Not logged in</span>
                    <button on:click={() => goto('/login')}>Login</button>
                </div>
            {/if}
        </div>

        <div class="setting-group">
            <h2>Appearance</h2>
            <div class="setting-item">
                <span>Theme</span>
                <button 
                    class="theme-toggle" 
                    on:click={toggleTheme}
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" viewBox="0 0 78 78">
                    {@html themeIcons[$theme as 'light' | 'dark']}
                </svg>
                    {$theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
            </div>
        </div>

        <div class="setting-group">
            <h2>Debug Navigation</h2>
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
    </div>
</Content>

<style>
    .settings {
        margin: 0 auto;
        padding: 1rem;
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
</style>