<script lang="ts">
    import { onMount } from 'svelte';
    import { invoke } from '@tauri-apps/api/core';
    import { goto } from '$app/navigation';
    
    let nation = '';
    let password = '';
    let errorMessage = '';
    let loading = false;
    let checking = true; // New state for initial auth check
  
    onMount(async () => {
      try {
        // Check for stored autologin
        const stored:any = await invoke('get_stored_autologin');
        if (stored) {
          // Try to validate the stored login
          const success = await validateStoredLogin(stored);
          if (success) {
            // Save the credentials to memory state and redirect
            await invoke('save_credentials', {
              credentials: {
                nation: stored.nation,
                autologin: stored.autologin,
                pin: '' // Pin is only needed for initial login
              }
            });
            goto('/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Auto-login failed:', error);
      } finally {
        checking = false;
      }
    });
  
    async function validateStoredLogin(stored: { nation: string, autologin: string }) {
      try {
        const response = await fetch('https://www.nationstates.net/cgi-bin/api.cgi?q=nation', {
          headers: {
            'User-Agent': 'NationStage (developed by YOUR_NATION_NAME)',
            'X-Autologin': stored.autologin
          }
        });
        return response.ok;
      } catch {
        return false;
      }
    }
  
    async function handleLogin() {
      loading = true;
      errorMessage = '';
      
      try {
        const userAgent = 'NationStage (developed by YOUR_NATION_NAME)';
        const response = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=ping`, {
          headers: {
            'User-Agent': userAgent,
            'X-Password': password
          }
        });
        
        if (response.ok) {
          const autologin = response.headers.get('X-Autologin');
          const pin = response.headers.get('X-Pin');
          
          if (!autologin || !pin) {
            throw new Error('Login failed: Missing authentication headers');
          }
          
          // Save current session to memory
          await invoke('save_credentials', {
            credentials: {
              nation,
              autologin,
              pin
            }
          });
  
          // Store autologin for future sessions
          await invoke('store_autologin', {
            nationName: nation,
            autologin
          });
          
          // Redirect to dashboard
          goto('/dashboard');
        } else {
          throw new Error('Invalid credentials. Please check your nation name and password.');
        }
      } catch (error:any) {
        errorMessage = error.message;
      } finally {
        loading = false;
      }
    }
  </script>
  
  {#if checking}
    <div class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Checking login status...</p>
      </div>
    </div>
  {:else}
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to NationStage
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Sign in with your NationStates credentials
          </p>
        </div>
        
        <form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="nation" class="sr-only">Nation Name</label>
              <input
                id="nation"
                name="nation"
                type="text"
                required
                class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nation Name"
                bind:value={nation}
              />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                bind:value={password}
              />
            </div>
          </div>
  
          {#if errorMessage}
            <div class="rounded-md bg-red-50 p-4">
              <div class="text-sm text-red-700">
                {errorMessage}
              </div>
            </div>
          {/if}
  
          <div>
            <button
              type="submit"
              disabled={loading}
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {#if loading}
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <div class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    ⌛
                  </div>
                </span>
                Logging in...
              {:else}
                Sign in
              {/if}
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}