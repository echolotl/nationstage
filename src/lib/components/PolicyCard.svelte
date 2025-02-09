<script lang="ts">
    export let name: string;
    export let description: string;
    export let category: string;
    export let imageName: string;
</script>

<div class="policy-card">
    <div class="policy-header">
        <img src="/images/policies/{imageName}.png" alt="{name}" />
        <h3>{name}</h3>
    </div>
    <div class="policy-content">
        <span class="category">{category}</span>
        <p>{description}</p>
    </div>
</div>

<style>
    .policy-card {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 1rem;
        margin: 0.5rem;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .policy-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.5rem;
    }

    .policy-header img {
        width: 32px;
        height: 32px;
    }

    .category {
        color: #666;
        font-size: 0.9em;
        font-weight: 500;
    }

    .policy-content p {
        margin-top: 0.5rem;
    }
</style>