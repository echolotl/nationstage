<script>
    import Window from '$lib/components/ui/window.svelte';
    import Navbar from '$lib/components/ui/navbar.svelte';
    let data; 
    export { data as data};

    let { children } = $props();
  </script>
  
  <div class="layout">
    <Window />
    <Navbar />
  </div>

  <style>
    .layout {
      display: flex;
      flex-direction: column;
      max-height: 100vh;
    }
  </style>  
  {@render children()}