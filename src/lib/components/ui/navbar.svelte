<script>
    import { page } from '$app/stores';
    
    // Active route tracking
    $: currentPath = $page.url.pathname;
    
    const navItems = [
      { label: 'Home', path: '/'},
      { label: 'Notices', path: '/notices' },
      { label: 'Issues', path: '/issues' },
      { label: 'Telegrams', path: '/telegrams' },
      {
        label: 'World',
        path: '/world',
        subItems: [
          { label: 'Dossier', path: '/world/dossier' },
          { label: 'World Assembly', path: '/world/wa' },
          { label: 'Forum', path: '/world/forum' },
          { label: 'Activity', path: '/world/activity' }
        ]
      },
      { label: 'Settings', path: '/settings' }
    ];
  </script>
  
  <nav class="nav-container">
    <ul class="nav-list">
      {#each navItems as item}
        <li class="nav-item lora-text">
          {#if item.subItems}
            <div class="dropdown">
              <button 
                class="dropdown-trigger"
                class:active={currentPath.startsWith(item.path)}
              >
                {item.label}
              </button>
              <ul class="dropdown-content">
                {#each item.subItems as subItem}
                  <li class="">
                    <a 
                      href={subItem.path}
                      class:active={currentPath === subItem.path}
                    >
                      {subItem.label}
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          {:else}
            <a 
              href={item.path}
              class:active={currentPath === item.path}
            >
              {item.label}
            </a>
          {/if}
        </li>
      {/each}
    </ul>
  </nav>
  
  <style>
    .nav-container {
      padding-top: 0.5rem;
      padding-left: 0.5rem;
      background: var(--dark-darker, #2c3e50);
      width: 100%;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-bottom: 2px solid var(--theme-green);
    }
  
    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      gap: 1rem;
      align-items: center;
    }
  
    .nav-item {
      position: relative;
    }
  
    a, .dropdown-trigger {
      color: var(--light, #ecf0f1);
      text-decoration: none;
      padding: 0.25rem 1rem;
      padding-bottom: 0.5rem;
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
  
    a:hover, .dropdown-trigger:hover {
      background: var(--theme-dark-green, #214e38);
    }
  
    .active {
      background: var(--theme-green);
      font-weight: bold;
    }
    .active:hover {
      background-color: var(--theme-dark-green, #214e38);
    }
  
    .dropdown {
      position: relative;
      margin: 0;
    }
  
    .dropdown-content {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 200px;
      background: var(--dark-darker, #2c3e50);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      padding: 0 0;
      list-style: none;
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 4px;
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
  </style>