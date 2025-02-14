<script lang="ts">
    import { onMount } from 'svelte';
    import { listen } from '@tauri-apps/api/event';

    interface DownloadProgress {
        message: string;
        progress: number;
        is_extracting: boolean;
    }

    let progress: DownloadProgress = {
        message: 'Initializing...',
        progress: 0,
        is_extracting: false
    };

    onMount(async () => {
        await listen<DownloadProgress>('download-progress', (event) => {
            progress = event.payload;
        });
    });
</script>

<div class="splash-container">
    <div class="logo">
        <img src="/assets/images/icon.ico" alt="NationStage" />
        <h1>NationStage</h1>
    </div>
    <div class="progress-container">
        <p>{progress.message}</p>
        <div class="progress-bar">
            <div class="progress-value" 
                 class:indeterminate={progress.is_extracting}
                 style:width={progress.progress + '%'}></div>
        </div>
    </div>
</div>

<style>
    .splash-container {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(30, 30, 30, 0.8);
        color: white;
        font-family: 'Inter', sans-serif;
    }

    .logo {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .logo img {
        width: 128px;
        height: 128px;
    }

    .logo h1 {
        font-size: 2rem;
        margin: 0;
    }

    .progress-container {
        width: 80%;
        max-width: 400px;
        text-align: center;
    }

    .progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
    }

    .progress-value {
        height: 100%;
        background: #646cff;
        transition: width 0.3s ease;
    }

    .progress-value.indeterminate {
        position: relative;
        animation: progress-indeterminate 1s linear infinite;
        background: linear-gradient(to right, transparent, #646cff, transparent);
    }

    @keyframes progress-indeterminate {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }

    p {
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        opacity: 0.8;
    }
</style>