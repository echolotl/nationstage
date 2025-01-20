<script lang="ts">
    export let title: string;
    export let newspaperName: string;
    export let articleId: string;
    export let text: string;
    export let pic1: string;
    export let pic2: string;
    export let href: string;
    export let rotation: number = 0;
    export let scale: number = 0.7;
    export let hoverScale: number = 0.8;  // Add new prop for hover scale

    const getCurrentDate = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };
</script>

<div class="newspaper-container" style="transform: scale({scale});">
    <a {href} class="newspaper-link">
        <div class="newspaper-card" style="transform: rotate({rotation}deg);">
            <div class="newspapertop">
                <img src="/assets/images/newspapertop.png" alt="Newspaper Top">
            </div>
            <div class="newspapercontent">
                <div class="newspaper-header">
                    <div class="title-center">
                        <h1 class="text unifraktur-display">{newspaperName}</h1>
                    </div>
                    <hr>
                    <hr class="double">
                    <div class="newspaper-metadata">
                        <div class="text lora-text">
                            <p>CITY FINAL</p>
                            <p>{getCurrentDate().toUpperCase()}</p>
                            <p>NO. {articleId}</p>
                        </div>
                    </div>
                    <hr class="small">
                </div>
                <div class="issue-content text lora-text">
                    <h1 class="text lora-display">{title}</h1>
                    <div class="issue-images">
                        <img src="https://www.nationstates.net/images/newspaper/{pic1}-1" alt="Issue 1">
                        <div class="right-content">
                            <div class="issue-text">{@html text}</div>
                            <img src="https://www.nationstates.net/images/newspaper/{pic2}-2" alt="Issue 2">
                        </div>
                    </div>     
                </div> 
            </div>
            <div class="newspaperbottom">
                <img src="/assets/images/newspaperbottom.png" alt="Newspaper Bottom">
            </div>
        </div>
    </a>
</div>

<style>
    .newspaper-container {
        transform-origin: center;
        width: fit-content;
        margin: 0 auto;
        transition: transform 0.3s ease;
    }

    .newspaper-container:hover {
        transform: scale(var(--hover-scale));
    }

    .newspaper-card {
        transform-origin: center;
        opacity: 0.8;
        transition: all 0.3s ease;
        border: 1px solid var(--secondary);
        border-radius: 0.5rem;
        margin: -6rem;
    }

    .newspaper-card:hover {
        transform: rotate(0deg)  !important;
        opacity: 1;
    }

    .text {
        color: black;
    }

    .title-center {
        text-align: center;
    }

    .newspapertop {
        max-width: 1000px;
        max-height: 80px;
    }

    .issue-images {
        display: grid;
        grid-template-columns: 2fr 1fr;  
        gap: 1rem;
        height: calc(125px - 4rem);
    }
    
    .issue-images img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border: solid 4px var(--gray-mix);
        border-bottom: none;
    }
    
    .issue-images img:first-child {
        grid-column: 1;  
        grid-row: 1;
    }
    
    .right-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .issue-text {
        font-size: .75rem;
        overflow: hidden;
        text-overflow: ellipsis;
        line-break: anywhere;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        hyphens: auto;
        -webkit-hyphens: auto;
        -ms-hyphens: auto;
    }
    
    .issue-images img:last-child {
        grid-column: 2;  
        grid-row: 1;
    }

    .issue-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-left: 3rem;
        padding-top: 1rem;
        padding-right: 4.25rem;
        height: 250px;
    }

    .issue-content h1 {
        margin: 0;
    }

    .newspaper-header {
        padding-left: 3rem;
        padding-right: 4.25rem;
    }

    .newspaper-header hr {
        border-top: 4px solid black;
        margin: 0;
    }

    .newspaper-header hr.double {
        border-top: 8px double black;
    }

    .newspaper-header hr.small {
        border-top: 3px solid black;
    }

    .newspaper-metadata {
        display: flex;
        width: 100%;
        padding: .25rem 0;
    }

    .newspaper-metadata .text {
        display: flex;
        width: 100%;
        justify-content: space-between;
    }

    .newspaper-metadata .text p {
        margin: 0;
    }

    .newspapercontent {
        max-width: 1000px;
        background-image: url('/assets/images/newspaper.png');
        background-size: auto;
        background-repeat: round;
        min-height: 360px;
    }

    .newspaper-link {
        text-decoration: none;
        color: inherit;
    }

    h1.unifraktur-display {
        font-size: 3rem;
        margin: 0;
    }
</style>

<svelte:head>
    {@html `
        <style>
            :root {
                --hover-scale: ${hoverScale};
            }
        </style>
    `}
</svelte:head>
