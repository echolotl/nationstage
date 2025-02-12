<script lang="ts">
  import { page } from "$app/stores";
  import { isAuthenticated, currentNation } from '$lib/stores/auth';
  import { invoke } from '@tauri-apps/api/core';
  import { notices } from '$lib/stores/notices';
  import { goto } from '$app/navigation';
  import { navigating } from '$app/stores';
  import { notifications, initializeNotificationPolling } from '$lib/stores/notifications';
  import { onMount } from 'svelte';

  export let scrolled: boolean;

  interface AuthData {
    nation: string;
    pin: string;
    autologin: string;
    region: string | null;
  }

  onMount(() => {
        console.log('Initializing notification polling...');
        const cleanup = initializeNotificationPolling();
        return cleanup;
    });

  // Active route tracking

  let currentPath: string = "";
  $: currentPath = $page.url.pathname;
  let regionName: string | null = null;

  async function loadRegionInfo() {
    if (!$currentNation) return;
    try {
      const auth = await invoke<AuthData>('get_auth');
      regionName = auth.region;
    } catch (error) {
      console.error('Failed to load region:', error);
    }
  }
  $: if ($isAuthenticated && $currentNation) {
    loadRegionInfo();
  }

  type SvgElement = {
    type: string;
    attributes: string;
  };

  interface Icon {
    viewBox: string;
    elements: SvgElement[];
  }

  interface NavSubItem {
    label: string;
    path: string;
    icon?: Icon;
  }

  interface NavItem {
    label: string;
    path: string;
    icon?: Icon;
    subItems?: NavSubItem[];
    highlight?: boolean;
  }

  function renderSvgElement(element: SvgElement) {
    switch (element.type) {
      case "path":
        return `<path fill="currentColor" ${element.attributes} />`;
      case "ellipse":
        return `<ellipse fill="none" ${element.attributes} />`;
      case "circle":
        return `<circle fill="currentColor" ${element.attributes} />`;
      case "rect":
        return `<rect fill="currentColor" ${element.attributes} />`;
    }
  }

  const baseNavItems: NavItem[] = [
    {
      label: "Home",
      path: "/",
      icon: {
        viewBox: "0 0 85 85",
        elements: [
          {
            type: "path",
            attributes:
              'd="M41.83.58L.58,27.82c-1.25,1.25-.36,3.38,1.4,3.38h6.21c1.09,0,1.98.89,1.98,1.98v41.34c0,1.09.89,1.98,1.98,1.98h17.77c1.09,0,1.98-.89,1.98-1.98v-26.24c0-1.09.89-1.98,1.98-1.98h18.6c1.09,0,1.98.89,1.98,1.98v26.24c0,1.09.89,1.98,1.98,1.98h17.65c1.09,0,1.98-.89,1.98-1.98v-41.08c0-1.09.89-1.98,1.98-1.98h6.69c1.76,0,2.64-2.13,1.4-3.38L44.62.58c-.77-.77-2.02-.77-2.8,0Z"',
          },
        ],
      },
    },
    {
      label: "Notices",
      path: "/notices",
      icon: {
        viewBox: "0 0 24 24",
        elements: [{
          type: "path",
          attributes: 'd="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"'
        }]
      }
    },
    {
      label: "Issues",
      path: "/issues",
      icon: {
        viewBox: "-19 0 85 85",
        elements: [
          {
            type: "circle",
            attributes: 'cx="25.03" cy="12.44" r="12.44"',
          },
          {
            type: "path",
            attributes:
              "d=M47.6,30.04c-1.7-1.55-8.73-.25-9.84-.03H12.92s-8.16-1.69-10,0c-5.64,5.17-2.63,35.64,5,36.2,3.95.29,4.84-21.1,4.84-21.1v15.2s1.47,29.92,5.48,30.1c4.17.19,7.09-30.1,7.09-30.1,0,0,2.92,30.3,7.09,30.1,4-.2,5.34-30.1,5.34-30.1v-15.16s.89,21.39,4.84,21.1c7.63-.56,10.65-31.03,5-36.2Z",
          },
        ],
      }
    },
    {
      label: "Telegrams",
      path: "/telegrams",
      icon: {
        viewBox: "0 -12 85 85",
        elements: [
          {
            type: "path",
            attributes:
              'd="M38.9,39.95l38.9-28V3.98c0-2.2-1.78-3.98-3.98-3.98H3.98C1.78,0,0,1.78,0,3.98v8.12l38.9,27.86Z"',
          },
          {
            type: "path",
            attributes:
            'd="M38.9,46.95L0,21.05v35.36c0,2.2,1.78,3.98,3.98,3.98h69.85c2.2,0,3.98-1.78,3.98-3.98V21.09l-38.9,25.87Z"'
          }
        ],
      },
    },
    {
      label: "World",
      path: "/world",
      icon: {
        viewBox: "0 -4 85 85",
        elements: [
          {
            type: "ellipse",
            attributes:
              'stroke="currentColor"; stroke-width="10px" fill="none" stroke-miterlimit="10";" cx="37.75" cy="38.38" rx="34.25" ry="34.25"',
          },
          {
            type: "path",
            attributes:
              'd="M43.54,4s-28.41,8.89-16.78,14.52c11.63,5.63-3.62,13.41,13.05,19.86,16.67,6.45,32.15-1.58,32.15-1.58,0,0-.01-25.81-28.42-32.8Z"',
          },
          {
            type: "path",
            attributes:
              'd="M4.38,46.26s5.84-13.12,13.98-8.54c8.14,4.59,0,5.17,7.75,10.34s5.17,2.58,19.39,9.05c14.22,6.46,12.22,9.61,12.22,9.61,0,0-38.89,21.68-53.34-20.46Z"',
          },
        ],
      },
      subItems: [
        {
          label: "Dossier",
          path: "/world/dossier",
          icon: {
            viewBox: "0 0 85 85",
            elements: [
              {
                type: "path",
                attributes:
                  'd="M41.83.58L.58,27.82c-1.25,1.25-.36,3.38,1.4,3.38h6.21c1.09,0,1.98.89,1.98,1.98v41.34c0,1.09.89,1.98,1.98,1.98h17.77c1.09,0,1.98-.89,1.98-1.98v-26.24c0-1.09.89-1.98,1.98-1.98h18.6c1.09,0,1.98.89,1.98,1.98v26.24c0,1.09.89,1.98,1.98,1.98h17.65c1.09,0,1.98-.89,1.98-1.98v-41.08c0-1.09.89-1.98,1.98-1.98h6.69c1.76,0,2.64-2.13,1.4-3.38L44.62.58c-.77-.77-2.02-.77-2.8,0Z"',
              },
            ],
          },
        },
        {
          label: "World Assembly",
          path: "/world/wa",
          icon: {
            viewBox: "0 0 90 75",
            elements: [{
              type: "path",
              attributes: 'd="M80.8,44.2c0-1.11.9-2,2-2h6.45c.02-1.88-.07-3.8-.29-5.73h-5.19c-1.11,0-2-.9-2-2s.9-2,2-2h4.5c-.44-1.89-1.05-3.73-1.89-5.46-.04-.09-.09-.17-.13-.26h-5.52c-1.11,0-2-.9-2-2s.9-2,2-2h3.4c-1.21-2.09-2.47-4-3.77-5.73h-3.68c-1.11,0-2-.9-2-2s.9-2,2-2h.34C66.13,1.19,54.38,0,54.38,0c0,0,17,11,17,26,0,13.57-24.85,31.41-26.86,32.83-3.15-2.25-26.65-19.48-26.65-32.68C17.87,11.15,34.87.15,34.87.15c0,0-11.75,1.19-22.65,13h.34c1.11,0,2,.9,2,2s-.9,2-2,2h-3.68c-1.3,1.73-2.56,3.63-3.77,5.73h3.4c1.11,0,2,.9,2,2s-.9,2-2,2H3.01c-.04.09-.09.17-.13.26-.83,1.73-1.44,3.57-1.89,5.46h4.5c1.11,0,2,.9,2,2s-.9,2-2,2H.29C.07,38.54-.01,40.47,0,42.34h6.45c1.11,0,2,.9,2,2s-.9,2-2,2H.18c.16,2.08.42,4.02.7,5.73h8.53c1.11,0,2,.9,2,2s-.9,2-2,2H1.65c.42,1.88.76,3,.76,3h32.9l-15.44,15.07,15.44.37,9.21-15.11,9.42,14.96,15.44-.37-15.44-15.07h32.9s.34-1.12.76-3h-7.75c-1.11,0-2-.9-2-2s.9-2,2-2h8.53c.28-1.71.54-3.65.7-5.73h-6.27c-1.11,0-2-.9-2-2Z"'
            }]
          }
        },
        { label: "Forum", path: "/world/forum" },
        { label: "Activity", path: "/world/activity" },
      ],
    },
    { label: "Settings", path: "/settings", icon: {
      viewBox: "0 0 85 85",
      elements: [
        {
          type: "path",
          attributes: 'd="M75.06,47.75l-6.41-5.75c.09-.96.14-1.94.14-2.93,0-.67-.03-1.34-.07-2l6.34-5.75c1.6-1.45,1.97-3.81.89-5.68l-6.81-11.77c-1.08-1.87-3.32-2.73-5.38-2.05l-7.9,2.58c-1.43-.99-2.95-1.86-4.55-2.6l-1.77-8.2C49.07,1.5,47.21,0,45.05,0h-13.6c-2.16.02-4.02,1.53-4.47,3.64l-1.83,8.71c-1.31.67-2.56,1.43-3.75,2.28l-8.64-2.78c-2.05-.66-4.28.2-5.36,2.07L.61,25.71c-1.08,1.87-.7,4.24.91,5.68l7.3,6.55c-.01.38-.03.75-.03,1.13,0,.7.03,1.4.08,2.09l-7.35,6.66c-1.6,1.45-1.97,3.81-.89,5.68l6.81,11.77c1.08,1.87,3.32,2.73,5.38,2.05l9.58-3.13c.81.53,1.65,1.02,2.52,1.48l2.13,9.87c.45,2.11,2.32,3.61,4.47,3.61h13.6c2.16-.02,4.02-1.53,4.47-3.64l1.95-9.28c1.14-.54,2.24-1.15,3.3-1.82l8.97,2.88c2.05.66,4.28-.2,5.36-2.07l6.79-11.79c1.08-1.87.7-4.24-.91-5.68ZM38.32,51.18c-6.87,0-12.44-5.57-12.44-12.44s5.57-12.44,12.44-12.44,12.44,5.57,12.44,12.44-5.57,12.44-12.44,12.44Z"'
        }
      ]
    } },
  ];

  $: authNavItems = $isAuthenticated ? [
    {
      label: $currentNation,
      path: `/nation/${$currentNation}/overview`,
      icon: {
        viewBox: "0 0 85 85",
        elements: [{
          type: "path",
          attributes: 'd="M41.74,1.07l8.79,27.06h28.45c1.5,0,2.13,1.92.91,2.8l-23.02,16.72,8.79,27.06c.46,1.43-1.17,2.61-2.38,1.73l-23.02-16.72-23.02,16.72c-1.21.88-2.85-.3-2.38-1.73l8.79-27.06L.64,30.93c-1.21-.88-.59-2.8.91-2.8h28.45S38.79,1.07,38.79,1.07c.46-1.43,2.48-1.43,2.95,0Z"'
        }]
      },
      subItems: undefined,
      highlight: false
    },
    {
      label: regionName || "Loading Region...",
      path: regionName ? `/region/${regionName}` : '#',
      icon: {
        viewBox: "0 0 46 59",
        elements: [{
          type: "path",
          attributes: 'd="M23.1,59.28c2.45,0,23.1-19.38,23.1-34.18C46.19,8,37.19,0,23.1,0,10.34,0,0,9,0,25.1c0,14.8,20.45,34.18,23.1,34.18ZM23.3,36.63c-7.72,0-13.97-6.25-13.97-13.97s6.25-13.97,13.97-13.97,13.97,6.25,13.97,13.97-6.25,13.97-13.97,13.97Z"'
        }]
      }
    }
  ] : [];

  $: navItems = [...authNavItems, ...baseNavItems];

  function goBack() {
    window.history.back();
  }

  function goForward() {
    window.history.forward();
  }

  function refresh() {
    window.location.reload();
  }
</script>

<nav class="nav-container {scrolled ? 'scrolled' : ''}" class:loading={$navigating}>
  <div class="nav-controls">
    <button class="nav-control-btn" on:click={goBack}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1rem" height="1rem">
        <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
      </svg>
    </button>
    <button class="nav-control-btn" on:click={goForward}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1rem" height="1rem">
        <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
      </svg>
    </button>
    <button class="nav-control-btn" on:click={refresh}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1rem" height="1rem">
        <path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
      </svg>
    </button>
  </div>
  <ul class="nav-list">
    {#each navItems as item}
      <li class="nav-item lora-text {item.highlight ? 'highlight' : ''}">
        {#if item.subItems}
          <div class="dropdown">
            <button
              class="dropdown-trigger"
              class:notification-dot={item.highlight}
              class:active={currentPath.startsWith(item.path)}
            >
              {#if item.icon}
                <div class="tab-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1rem"
                    height="1rem"
                    viewBox={item.icon.viewBox}
                  >
                    {#each item.icon.elements as element}
                      {@html renderSvgElement(element)}
                    {/each}
                  </svg>
                </div>
              {/if}
              <span>{item.label}</span>
              {#if item.label === "Notices" && $notifications.unreadNotices > 0}
                <span class="highlight">{$notifications.unreadNotices}</span>
                
              {:else if item.label === "Issues" && $notifications.unreadIssues > 0}
                <span class="highlight">{$notifications.unreadIssues}</span>
              {/if}
            </button>
            <ul class="dropdown-content">
              {#each item.subItems as subItems}
                <li class="">
                  <a
                    href={subItems.path}
                    class:active={currentPath === subItems.path}
                  >
                    {#if subItems.icon}
                      <div class="tab-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1rem"
                          height="1rem"
                          viewBox={subItems.icon.viewBox}
                        >
                          {#each subItems.icon.elements as element}
                            {@html renderSvgElement(element)}
                          {/each}
                        </svg>
                      </div>
                    {/if}
                    <span>{subItems.label}</span>
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {:else}
          <div class="tab-content">
            <a href={item.path} class:active={currentPath === item.path}>
              {#if item.icon}
                <div class="tab-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1rem"
                    height="1rem"
                    viewBox={item.icon.viewBox}
                  >
                    {#each item.icon.elements as element}
                      {@html renderSvgElement(element)}
                    {/each}
                  </svg>
                </div>
              {/if}
              <span>{item.label}</span>
              {#if item.label === "Notices" && $notifications.unreadNotices > 0}
                <span class="highlight">{$notifications.unreadNotices}</span>
              {:else if item.label === "Issues" && $notifications.unreadIssues > 0}
                <span class="highlight">{$notifications.unreadIssues}</span>
              {/if}
            </a>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
</nav>
<div id="navbar-spacer"></div>

<style>
  .nav-container {
    padding-top: 0.5rem;
    padding-left: 0.5rem;
    background: var(--background-secondary);
    width: 100%;
    position: fixed;
    top: 20px;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-bottom: 2px solid var(--theme-accent);
    display: flex;
    align-items: center;
    transition: background-color 0.2s;
  }
  .nav-container.scrolled {
    background: var(--solid);
  }
  .tab-icon {
    display: flex;
    align-items: center;
  }
  .tab-content a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    text-decoration: none;
  }
  #navbar-spacer {
    height: 38px;
  }

  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .nav-item {
    position: relative;
  }

  a,
  .dropdown-trigger {
    color: var(--text, #ecf0f1);
    text-decoration: none;
    padding: 0.25rem 1rem;
    display: block;
    cursor: pointer;
    transition: background-color 0.2s;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
  }

  .dropdown-trigger {
    background: none;
    border: none;
    font: inherit;
  }

  a:hover,
  .dropdown-trigger:hover {
    background: var(--background);
  }

  .active {
    background: var(--theme-accent);
    font-weight: bold;
    color: var(--light-solid);
  }
  .active:hover {
    background-color: var(--theme-accent-hover);
  }

  .dropdown {
    position: relative;
    margin: 0;
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      text-decoration: none;
    }
  }

  .dropdown-content {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 200px;
    background: var(--solid);
    padding: 0 0;
    list-style: none;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    border: 2px solid var(--theme-accent);
    border-top: none;
    a {
      display: flex;
      align-items: center;
      justify-content: left;
      gap: 0.25rem;
      text-decoration: none;
    }
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

  .dropdown-content a {
    padding: 0.5rem 1rem;
    border-radius: 0;
  }

  .dropdown-content li:last-child a {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .highlight {
    background: var(--theme-red);
    color: white;
    border-radius: 50%; /* Changed from 10px to 50% for perfect circle */
    padding: 0.125rem; /* Changed from 0.1rem 0.5rem to equal padding */
    font-size: 0.8rem;
    margin-left: 0.25rem;
    min-width: 1rem; /* Added to maintain circular shape */
    height: 1rem; /* Added to maintain circular shape */
    display: inline-flex; /* Added for centering content */
    align-items: center; /* Added for centering content */
    justify-content: center; /* Added for centering content */
    line-height: 1; /* Added to prevent vertical stretching */
  }

  .nav-controls {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-right: 0.5rem;
  }

  .nav-control-btn {
    background: none;
    border: none;
    color: var(--text);
    padding: 0.25rem;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-control-btn:hover {
    background: var(--background);
  }

  @keyframes gradientBorder {
    0% {
      border-image: linear-gradient(to right, var(--theme-accent) 0%, var(--theme-yellow) 50%, var(--theme-accent) 100%) 1;
    }
    100% {
      border-image: linear-gradient(to right, var(--theme-yellow) 0%, var(--theme-accent) 50%, var(--theme-yellow) 100%) 1;
    }
  }

  .nav-container.loading {
    border-image: linear-gradient(to right, var(--theme-accent) 0%, var(--theme-accent-hover) 50%, var(--theme-accent) 100%) 1;
    animation: gradientBorder 3s ease infinite alternate;
  }
</style>
