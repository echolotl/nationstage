<script lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window';

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

  document.addEventListener('contextmenu', event => event.preventDefault());
</script>

<div data-tauri-drag-region class="titlebar">
  <div class="small-logo-icon">
  <div class="titlebar-logo">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 120 120">
      <path fill="currentColor" d="M71.53,108l-1.03-60.65s-20.44-23.07-16.16-19.62C119.7,80.3,92.53,5.82,92.53,5.82,92.53,5.82,0-20.47,0,38.68c0,38.54,1.13,49.62,1.91,52.67.59,14.67,69.62,16.65,69.62,16.65ZM74.14,13.29c3.96-2.03,8.84-.49,10.88,3.45,3.13,6.04,3.36,15.21.48,16.69-3.96,2.03-14.72-4.88-14.83-9.32-.03-1.35-.62-8.72,3.47-10.82Z"/>
    </svg>
  </div>
  <div class="unbounded-display" id="logomark">NationStage</div>
  </div>
  <button class="titlebar-button" on:click={minimize} aria-label="Minimize">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
      <path fill="currentColor" d="M20 14H4v-2h16v2z"/>
    </svg>
  </button>
  <button class="titlebar-button" on:click={toggleMaximize} aria-label="Maximize">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
      <path fill="currentColor" d="M4 4h16v16H4V4m2 2v12h12V6H6z"/>
    </svg>
  </button>
  <button class="titlebar-button" id="close-button" on:click={close} aria-label="Close">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/>
    </svg>
  </button>
</div>
<div class="titlebar-spacer"></div>
<style>
    .titlebar {
  height: 20px;
  background: var(--dark-darker);
  user-select: none;
  display: flex;
  justify-content: flex-end;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 101;
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
  color: var(--light);
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
  color: var(--gray-mix);
}
#logomark {
  color: var(--gray-mix);
  font-size: .75rem;
}
.titlebar-button:hover {
  background: var(--gray-mix);
}
#close-button:hover {
  background: var(--theme-red);
}
</style>