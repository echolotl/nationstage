<script lang="ts">
    import { onMount } from 'svelte';
    
    let container: HTMLElement;
    let content: HTMLElement;
    let thumb: HTMLElement;
    let track: HTMLElement;
    let isDragging = false;
    let startY = 0;
    let currentAnimation: number | null = null;

    function easeOutCubic(t: number): number {
        return 1 - Math.pow(1 - t, 3);
    }

    // linear interpolation
    function lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    function smoothScroll(target: number, duration = 300) {
        const start = content.scrollTop;
        const distance = target - start;
        const startTime = performance.now();

        if (currentAnimation) {
            cancelAnimationFrame(currentAnimation);
        }

        function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            content.scrollTop = start + (distance * lerp(0, 0.9, easeOutCubic(progress)));
            updateThumb();

            if (progress < 1) {
                currentAnimation = requestAnimationFrame(animate);
            } else {
                currentAnimation = null;
            }
        }

        currentAnimation = requestAnimationFrame(animate);
    }

    function updateThumb() {
        if (!content || !thumb || !track) return;
        const contentHeight = content.scrollHeight;
        const viewportHeight = content.clientHeight;
        const scrollPercent = content.scrollTop / (contentHeight - viewportHeight);
        const thumbHeight = Math.max(30, (viewportHeight / contentHeight) * track.clientHeight);
        const maxTop = track.clientHeight - thumbHeight;
        
        thumb.style.height = `${thumbHeight}px`;
        thumb.style.top = `${scrollPercent * maxTop}px`;
    }
    
    function onWheel(e: WheelEvent) {
        e.preventDefault();
        const target = content.scrollTop + e.deltaY;
        smoothScroll(target, 50);
    }
    
    function startDragging(e: MouseEvent) {
        isDragging = true;
        startY = e.clientY - parseInt(thumb.style.top || '0');
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDragging);
    }
    
    function onDrag(e: MouseEvent) {
        if (!isDragging) return;
        
        const deltaY = e.clientY - startY;
        const maxTop = track.clientHeight - thumb.clientHeight;
        const boundedTop = Math.max(0, Math.min(deltaY, maxTop));
        const scrollPercent = boundedTop / maxTop;
        const target = scrollPercent * (content.scrollHeight - content.clientHeight);
        
        smoothScroll(target, 100);
    }
    
    function stopDragging() {
        isDragging = false;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDragging);
    }
    
    onMount(() => {
        updateThumb();
        window.addEventListener('resize', updateThumb);
        content.addEventListener('scroll', updateThumb);
        content.addEventListener('wheel', onWheel, { passive: false });
        
        return () => {
            window.removeEventListener('resize', updateThumb);
            content.removeEventListener('scroll', updateThumb);
            content.removeEventListener('wheel', onWheel);
        };
    });
</script>

<div class="scroll-container" bind:this={container}>
    <div class="scroll-content" bind:this={content}>
        <slot />
    </div>
    <div class="scroll-track" bind:this={track}>
        <div 
            class="scroll-thumb"
            bind:this={thumb}
            on:mousedown={startDragging}
        />
    </div>
</div>

<style>
    .scroll-container {
        position: relative;
        height: inherit;
        min-height: 0;
        width: 100%;
        overflow: hidden;
    }
    
    .scroll-content {
        height: 100%;
        width: calc(100% - 8px);
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    
    .scroll-content::-webkit-scrollbar {
        display: none;
    }
    
    .scroll-track {
        position: absolute;
        top: 0;
        right: 0;
        width: 8px;
        height: 100%;
        background: var(--background-secondary);
        border-radius: 4px;
    }
    
    .scroll-thumb {
        position: absolute;
        width: 100%;
        min-height: 30px;
        background: var(--gray-mix);
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    
    .scroll-thumb:hover {
        background: var(--dark-bright);
    }
</style>