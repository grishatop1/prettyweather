<script lang="ts">
  import { goto } from "$app/navigation";
  import { onDestroy, onMount, tick } from "svelte";
  import { slide, fly } from 'svelte/transition';

  import Papa from 'papaparse';
  import worldcities from '$lib/worldcities.csv?raw';

  import searchWorker from '$lib/search_worker.js?worker';
  import Enter from '$lib/icons/Enter.svelte';
  import Spinner from '$lib/icons/Spinner.svelte';
  import { entryState } from '$lib/state.svelte';

  let input_value = $state("");
  let data: CityDataArray;
  let cities: CityDataArray = $state([]);
  let worker: Worker;
  let searching = $state(false);
  let selected_result = $state(0);

  onMount(async () => {
    const parsed = Papa.parse(worldcities);
    const headers = parsed.data[0];
    data = parsed.data.slice(1).map(row => {
      // @ts-ignore
      return row.reduce((acc, value, index) => {
        // @ts-ignore
        acc[headers[index]] = value;
        return acc;
      }, {});
    });
    worker = new searchWorker();
    worker.postMessage(data);
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

<div class="page" transition:fly={{x:200}}>
  <main>
    <h1>PrettyWeather</h1>
    <form onsubmit={(e) => {e.preventDefault(); submit();}}>
      <input type="text" placeholder="Enter name of the city..." onkeyup={search} onkeydown={select} bind:value={input_value} class:border-fix={cities.length}>
      {#if cities.length}
        <div class="results" transition:slide>
          {#each cities as entry, i (entry.id)}
            <p class:selected={i === selected_result}><span>{entry.city}, {entry.country}</span> {#if i === selected_result}<Enter />{/if}</p>
          {/each}
        </div>
      {/if}
      {#if searching}
        <div class="spinner">
          <Spinner />
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
    justify-content: space-between;
  }

  .selected {
    border: 1px solid var(--accent);
    font-weight: bold;
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
</style>