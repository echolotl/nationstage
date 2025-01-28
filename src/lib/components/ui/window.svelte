<script lang="ts">
  import { getCurrentWindow } from "@tauri-apps/api/window";

  // when using `"withGlobalTauri": true`, you may use
  // const { getCurrentWindow } = window.__TAURI__.window;

  const appWindow = getCurrentWindow();

  async function minimize() {
    await appWindow.minimize();
  }

  async function toggleMaximize() {
    await appWindow.toggleMaximize();
  }

  async function close() {
    await appWindow.close();
  }

  document.addEventListener("contextmenu", (event) => event.preventDefault());
</script>

<div data-tauri-drag-region class="titlebar">
  <div class="small-logo-icon">
    <div class="titlebar-logo">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 120 120"
      >
        <path
          fill="currentColor"
          d="M71.53,108l-1.03-60.65s-20.44-23.07-16.16-19.62C119.7,80.3,92.53,5.82,92.53,5.82,92.53,5.82,0-20.47,0,38.68c0,38.54,1.13,49.62,1.91,52.67.59,14.67,69.62,16.65,69.62,16.65ZM74.14,13.29c3.96-2.03,8.84-.49,10.88,3.45,3.13,6.04,3.36,15.21.48,16.69-3.96,2.03-14.72-4.88-14.83-9.32-.03-1.35-.62-8.72,3.47-10.82Z"
        />
      </svg>
    </div>
    <div id="logomark">
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="100%"
        height="18"
        viewBox="100 -10 1000 150"
        fill="currentColor"
      >
        <g>
          <path
            d="M138.84,47.41v65.41h-22.32V5.23h17.14l44.35,64.95V5.23h22.32v107.74h-16.99l-44.5-65.57Z"
          />
          <path
            d="M296.66,34.01v78.96h-21.46v-11.54c-5.33,8.16-12.38,13.24-23.18,13.24-22.46,0-36-18.47-36-41.56s12.53-40.79,35.57-40.79c9.94,0,18.58,5.23,23.62,12.47v-10.77h21.46ZM256.48,96.04c10.51,0,19.3-7.23,19.3-21.55s-8.21-23.55-19.87-23.55-18.43,10.16-18.43,22.32,7.2,22.78,19.01,22.78Z"
          />
          <path
            d="M341.59,34.01h20.45v18.01h-20.45v36.94c0,3.39,1.3,6.93,5.47,6.93s5.62-3.69,5.62-7.39c0-2.31-.58-5.54-1.01-6.77l10.37-18.33c1.3,2.92,8.35,24.95,8.35,27.72,0,11.7-7.2,23.55-24.62,23.55-12.96,0-25.63-4.93-25.63-27.86v-34.78h-11.09v-18.01h12.67l3.31-19.39h16.56v19.39Z"
          />
          <path
            d="M392.27,0c7.63,0,13.68,5.39,13.68,13.08s-6.05,12.77-13.68,12.77-13.54-5.23-13.54-12.77,5.76-13.08,13.54-13.08ZM381.33,112.97V34.01h21.46v78.96h-21.46Z"
          />
          <path
            d="M457.5,32.32c21.6,0,40.61,16.62,40.61,41.1s-19.01,41.25-40.61,41.25-40.61-16.47-40.61-41.25,19.15-41.1,40.61-41.1ZM457.5,94.97c10.66,0,19.73-9.23,19.73-21.55s-9.07-21.39-19.73-21.39-19.73,9.08-19.73,21.39,9.22,21.55,19.73,21.55Z"
          />
          <path
            d="M511.93,34.01h21.46v10.77c6.19-9.24,13.97-12.47,22.9-12.47,20.74,0,26.35,17.7,26.35,37.71v42.94h-21.46v-42.48c0-10.93-3.74-19.24-13.68-19.24s-14.11,8.46-14.11,19.39v42.33h-21.46V34.01Z"
          />
          <path
            d="M610,85.11c2.16,9.08,9.65,11.85,15.55,11.85,4.75,0,9.65-2,9.65-6,0-2.62-1.44-4.46-5.47-6l-12.96-5.85c-17.57-6.62-18.43-19.09-18.43-22.63,0-15.85,13.1-24.16,28.94-24.16,8.5,0,19.73,2.46,26.64,16.62l-16.56,8.16c-1.87-6.31-7.2-7.54-10.51-7.54-4.03,0-8.21,2.46-8.21,6.46,0,3.39,3.17,5.23,6.91,6.77l11.09,4.62c17.42,5.39,19.01,17.55,19.01,22.78,0,16.16-13.97,24.46-30.24,24.47-18.87.01-30.87-12.81-30.87-29.55h15.47Z"
          />
          <path
            d="M695.39,34.01h20.45v18.01h-20.45v36.94c0,3.39,1.3,6.93,5.47,6.93s5.62-3.69,5.62-7.39c0-2.31-.58-5.54-1.01-6.77l10.37-18.76c1.3,2.92,8.35,25.38,8.35,28.15,0,11.7-7.2,23.55-24.62,23.55-12.96,0-25.63-4.93-25.63-27.86v-34.78h-11.09v-18.01h12.67l3.31-19.39h16.56v19.39Z"
          />
          <path
            d="M811.16,34.01v78.96h-21.46v-11.54c-5.33,8.16-12.38,13.24-23.18,13.24-22.46,0-36-18.47-36-41.56s12.53-40.79,35.57-40.79c9.94,0,18.58,5.23,23.62,12.47v-10.77h21.46ZM770.99,96.04c10.51,0,19.29-7.23,19.29-21.55s-8.21-23.55-19.87-23.55-18.43,10.16-18.43,22.32,7.2,22.78,19.01,22.78Z"
          />
          <path
            d="M905.91,107.43c0,31.09-19.01,43.25-40.03,43.25-16.42,0-27.5-4.46-34.99-10.93v-22.94c4.32,4,22.46,14.01,30.67,14.01,11.09,0,22.9-3.54,22.9-20.78v-8.62c-5.33,8.16-12.38,13.24-23.18,13.24-22.46,0-36-18.47-36-41.56s12.53-40.79,35.57-40.79c9.94,0,18.58,5.23,23.62,12.47v-10.77h21.46v73.42ZM865.74,96.04c10.51,0,19.29-7.23,19.29-21.55s-8.21-23.55-19.87-23.55-18.43,10.16-18.43,22.32,7.2,22.78,19.01,22.78Z"
          />
          <path
            d="M996.63,99.12c-10.51,12.31-24.48,15.55-34.42,15.55-27.36,0-42.34-18.32-42.34-40.79s16.99-41.56,40.75-41.56c20.45,0,40.03,15.08,40.03,46.48h-59.47c.43,9.85,8.93,17.08,22.61,17.08,7.63,0,15.26-4.16,20.45-9.39l12.38,12.62ZM941.62,64.95h37.01c-1.44-10.16-11.09-14.01-18.29-14.01s-16.13,3.39-18.72,14.01Z"
          />
        </g>
      </svg>
    </div>
  </div>
  <button class="titlebar-button" on:click={minimize} aria-label="Minimize">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
    >
      <path fill="currentColor" d="M20 14H4v-2h16v2z" />
    </svg>
  </button>
  <button
    class="titlebar-button"
    on:click={toggleMaximize}
    aria-label="Maximize"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
    >
      <path fill="currentColor" d="M4 4h16v16H4V4m2 2v12h12V6H6z" />
    </svg>
  </button>
  <button
    class="titlebar-button"
    id="close-button"
    on:click={close}
    aria-label="Close"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
      />
    </svg>
  </button>
</div>
<div class="titlebar-spacer"></div>

<style>
  .titlebar {
    height: 20px;
    background: var(--background-secondary);
    user-select: none;
    display: flex;
    justify-content: flex-end;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
  }
  .titlebar-spacer {
    top: 0;
    height: 20px;
    padding: 0;
  }
  .titlebar-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 20px;
    user-select: none;
    -webkit-user-select: none;
    background: transparent;
    border: none;
    color: var(--text);
  }
  .titlebar-logo {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
    width: 1rem;
    height: 1rem;
    user-select: none;
    -webkit-user-select: none;
    background: transparent;
    border: none;
    color: inherit;
  }
  .small-logo-icon {
    display: flex;
    margin-right: auto;
    margin-left: 10px;
    align-items: center;
    width: auto;
    height: 20px;
    color: var(--theme-accent);
  }
  #logomark {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
    width: auto;
    height: 1rem;
    user-select: none;
    -webkit-user-select: none;
    background: transparent;
    border: none;
    color: inherit;
  }
  .titlebar-button:hover {
    background: var(--background);
  }
  #close-button:hover {
    background: var(--theme-red);
  }
</style>
