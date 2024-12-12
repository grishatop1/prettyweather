<script>
    import { fly } from "svelte/transition";
    import { entryState } from '$lib/state.svelte';
</script>

<div class="page" transition:fly={{x:200}}>
    <p>weather data in {entryState.entry?.city} in {entryState.entry?.country}</p>
</div>