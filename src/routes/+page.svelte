<script lang="ts">
  import { goto } from "$app/navigation";
  import { onDestroy, onMount, tick } from "svelte";
  import { slide, fly } from 'svelte/transition';

  import searchWorker from '$lib/search_worker.js?worker';
  import Enter from '$lib/icons/Enter.svelte';
  import Spinner from '$lib/icons/Spinner.svelte';
  import Cloud from "$lib/icons/Cloud.svelte";
  import ColorPicker from "$lib/components/ColorPicker.svelte";
  import { entryState } from '$lib/state.svelte';

  let input_value = $state("");
  let cities: CityDataArray = $state([]);
  let worker: Worker;
  let searching = $state(false);
  let selected_result = $state(0);

  onMount(() => {
    worker = new searchWorker();
    worker.onmessage = (event) => {
      if (input_value) {
        cities = event.data;
      }
      searching = false;
    }
  })

  onDestroy(() => {
    worker.terminate();
  });
  
  let submit = () => {
    if (!cities.length) return;
    entryState.entry = cities[selected_result];
    goto("/weather");
  }

  let search = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
      return;
    }
    if (input_value == "") {
      cities = [];
      selected_result = 0;
      return;
    }
    searching = true;
    worker.postMessage(input_value.slice(0, 10));
  }

  let select = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      if (event.key === "ArrowUp") {
        if (selected_result !== 0) selected_result -= 1;
      } else if (event.key === "ArrowDown") {
        if (selected_result < cities.length - 1) selected_result += 1;
      }
    }
  }
</script>

<div class="page" transition:fly={{x:-200}}>
  <div class="colorpicker">
    <ColorPicker />
  </div>
  <main>
    <h1>PrettyWeather <Cloud /></h1>
    <form onsubmit={(e) => {e.preventDefault(); submit();}}>
      <input type="text" placeholder="Enter location..." onkeyup={search} onkeydown={select} bind:value={input_value} class:border-fix={cities.length}>
      {#if cities.length}
        <div class="results" transition:slide>
          {#each cities as entry, i (entry.id)}
            <p class:selected={i === selected_result}>
              <img src={`flags/${entry.iso2.toLowerCase()}.svg`} alt="Flag" height="16">
              <span class="entry-text">{entry.city}, {entry.country}</span>
              <span class="enter-icon">{#if i === selected_result}<Enter />{/if}</span>
            </p>
          {/each}
        </div>
      {/if}
      {#if searching}
        <div class="spinner">
          <Spinner fast />
        </div>
      {/if}
    </form>
  </main>
</div>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  h1 {
    margin-bottom: 15px;
  }

  form {
    width: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 80px;
    position: relative;
  }

  input {
    width: 100%;
    height: 40px;
    padding: 0px 10px;
    border: none;
    border-radius: 6px;
    background-color: var(--primary);
    color: var(--accent);
    transition: border-radius 0.5s;
  }

  .results {
    position: absolute;
    top: 40px;
    left: 0px;
    width: 100%;
  }

  .results p {
    text-align: left;
    background-color: var(--primary);
    width: 100%;
    height: 40px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: left;
  }

  .results p img {
    border-radius: 4px;
  }

  .entry-text {
    margin-left: 10px;
  }

  .enter-icon {
    margin-left: auto;
  }

  .selected {
    border: 1px solid var(--accent);
    font-weight: 600;
    letter-spacing: 1px;
  }

  .results p:last-child {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  .spinner {
    position: absolute;
    right: -30px;
    top: 10px;
  }

  .border-fix {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
  }

  .colorpicker {
    position: absolute;
    top: 10px;
    left: 10px;
  }
</style>