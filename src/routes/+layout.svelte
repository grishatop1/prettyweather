<script>
  import "../app.css";
  import "$lib/types";
  import { dev } from "$app/environment";
  import { onMount } from "svelte";

  let { children } = $props();

  onMount(() => {
    if (!dev) {
      document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });
    }
  });
</script>

<div class="pages">
  {@render children()}
</div>

<style>
  .pages {
    height: 100%;
    display: grid;
  }
</style>
