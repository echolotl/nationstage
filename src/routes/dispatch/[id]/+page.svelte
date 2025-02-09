<script lang="ts">
    import { getDispatch, getNationFlag } from "$lib/api/request";
    import { parseDispatch } from "$lib/utils/parseDispatch";
    import type { Dispatch } from "$lib/types/factbook";
    import Content from "$lib/components/content.svelte";
    import { onMount, afterUpdate } from "svelte";
    import { formatRelativeTime } from "$lib/utils/nationUtils";
    import { openUrl } from "@tauri-apps/plugin-opener";
    import { invoke } from "@tauri-apps/api/core";  // Add this import
    import { parseBBCode } from "$lib/utils/parseBBCode";

    let dispatch: Dispatch | null = null;
    let authorFlag: string = '';
    let authorName: string = '';
    let content: HTMLDivElement;
    let error: string | null = null;
    let loading = true;
    let parsedContent = '';

    async function loadDispatch(id: string) {
        try {
            const xml = await getDispatch(id);
            dispatch = parseDispatch(xml);
            if (dispatch) {
                console.log(dispatch.text);
                parsedContent = await parseBBCode(dispatch.text);
                // Get author's flag
                const flagXml = await getNationFlag(dispatch.author);
                const parser = new DOMParser();
                const doc = parser.parseFromString(flagXml, "text/xml");
                authorFlag = doc.querySelector("FLAG")?.textContent || '';
                authorName = doc.querySelector("FULLNAME")?.textContent || '';
            }
        } catch (e) {
            error = "Failed to load dispatch";
            console.error('Dispatch loading error:', e);
        } finally {
            loading = false;
        }
    }

    afterUpdate(() => {
        if (content && parsedContent) {
            content.innerHTML = parsedContent;
        }
    });

    onMount(async () => {
        const id = window.location.pathname.split("/")[2];
        await loadDispatch(id);
    });
</script>

<Content>
    {#if loading}
        <div class="loading">Loading dispatch...</div>
    {:else if error}
        <div class="error">{error}</div>
    {:else if dispatch}
        <div class="dispatch">
            <header>
                <p class="subtitle">Dispatch &rarr; {dispatch.category} &rarr; {dispatch.subcategory}</p>
                <h1 class="lora-display">{dispatch.title}</h1>

            </header>
            <hr />
            <div class="dispatch-content inter-text clearfix" bind:this={content}></div>
        </div>
        <hr />
        <div class="meta lora-text">
            <div class="author-info">
                {#if authorFlag}
                    <img src={authorFlag} alt="{dispatch.author}'s flag" class="author-flag" />
                {/if}
                <a href="/nation/{dispatch.author}" class="nation-link">
                    {authorName}
                </a>
            </div>
            <span class="created-date">
                {formatRelativeTime(dispatch.created)}
            </span>
        </div>
        <div class="open-in-nationstates lora-text">
            Sorry, you can't vote on NationStage, but you can still read the dispatch.
            <a href="" on:click|preventDefault={() => dispatch && openUrl(`https://www.nationstates.net/page=dispatch/id=${dispatch.id}`)} class="external-link">Open in NationStates</a>
        </div>
    {:else}
        <div class="error">No dispatch found</div>
    {/if}
</Content>

<style>
    .subtitle {
    margin-top: 1.5rem;
    text-transform: uppercase;
    font-size: 1rem;
    color: var(--text);
    letter-spacing: 2px;
    }
    .dispatch-content {
        max-width: 100%;
        overflow: hidden;  /* Contain floats */
        position: relative; /* Create new stacking context */
        line-height: 1.6;
    }

    .dispatch-content :global(img) {
        max-width: 100%;
        height: auto;
    }

    .dispatch-content :global(table) {
        max-width: 100%;
        overflow-x: auto;
        display: block;
    }

    .dispatch-content :global(.bb-box) {
        border: 1px solid var(--border);
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 4px;
    }

    .dispatch-content :global(blockquote) {
        border-left: 3px solid var(--border);
        margin: 1rem 0;
        padding-left: 1rem;
    }

    header {
        margin-bottom: 2rem;
    }

    .meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--text-secondary);
        font-size: 0.9rem;
        padding: 0.5rem 0;
    }

    .author-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .author-flag {
        max-width: 48px;
        height: 24px;
        object-fit: contain;
    }

    .error {
        color: var(--error);
        text-align: center;
        padding: 2rem;
    }

    .loading {
        text-align: center;
        padding: 2rem;
    }
    .open-in-nationstates {
        font-size: 1rem;
        padding: 1rem;
        text-align: right;
    }
</style>