<script lang="ts">
  import { page } from "$app/stores";

  // Active route tracking

  let currentPath: string = "";
  $: currentPath = $page.url.pathname;

  type SvgElement = {
    type: "path" | "ellipse" | "circle" | "rect";
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

  const navItems: NavItem[] = [
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
        viewBox: "-26 -5 85 85",
        elements: [
          {
            type: "path",
            attributes:
              'd="M25.02.44c3.21.46,6.4,2.77,7.1,4.91.65,1.93-.07,3.73-.55,5.69-.86,3.26-2.16,8.2-3.46,13.11-1.49,5.66-2.96,11.2-3.74,14.19-.59,2.22-.88,4.19-2.94,6.09-3.19,3.22-9.76,3.01-12.69-.38-2.16-2.42-1.98-4.31-2.81-7.69-1.5-7.12-3.11-14.75-4.6-21.82C.81,11.21-.45,8.77.17,5.66,1.85.61,8.84-.16,14.83.02c3.21.01,7.08-.09,10.01.38l.18.03Z"',
          },
          {
            type: "circle",
            attributes: 'cx="15.5" cy="65.44" r="12.44"',
          },
        ],
      },
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
      },
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
        { label: "World Assembly", path: "/world/wa" },
        { label: "Forum", path: "/world/forum" },
        { label: "Activity", path: "/world/activity" },
      ],
    },
    { label: "Settings", path: "/settings" },
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
            </button>
            <ul class="dropdown-content">
              {#each item.subItems as subItem}
                <li class="">
                  <a
                    href={subItem.path}
                    class:active={currentPath === subItem.path}
                  >
                    {#if subItem.icon}
                      <div class="tab-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1rem"
                          height="1rem"
                          viewBox={subItem.icon.viewBox}
                        >
                          {#each subItem.icon.elements as element}
                            {@html renderSvgElement(element)}
                          {/each}
                        </svg>
                      </div>
                    {/if}
                    <span>{subItem.label}</span>
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
            </a>
          </div>
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
    color: var(--light, #ecf0f1);
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
    background: var(--gray-mix);
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
    background: var(--dark-darker, #2c3e50);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    padding: 0 0;
    list-style: none;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
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
</style>
