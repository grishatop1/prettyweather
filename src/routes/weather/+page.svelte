<script lang="ts">
    import Chart from "chart.js/auto";

    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    import { entryState } from "$lib/state.svelte";
    import Spinner from "$lib/icons/Spinner.svelte";
    import DayButton from "$lib/components/DayButton.svelte";
    

    let chart: HTMLCanvasElement;
    const data = [
        { year: 2010, count: 10 },
        { year: 2011, count: 20 },
        { year: 2012, count: 15 },
        { year: 2013, count: 25 },
        { year: 2014, count: 22 },
        { year: 2015, count: 15 },
        { year: 2016, count: 28 },
    ];

    onMount(() => {
        const style = getComputedStyle(document.body);
        const accent_color = style.getPropertyValue("--accent");
        const primary_color = style.getPropertyValue("--primary");
        const background_color = style.getPropertyValue("--bg");
        Chart.defaults.color = accent_color;
        Chart.defaults.borderColor = primary_color;
        Chart.defaults.backgroundColor = background_color;
        new Chart(chart, {
            type: "line",
            data: {
                labels: data.map((row) => row.year),
                datasets: [
                    {
                        data: data.map((row) => row.count),
                        borderColor: accent_color,
                        tension: 0.3
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                events: [],
                scales: {
                    y: {
                        ticks: {
                            display: false
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    });
</script>

<div class="page" transition:fly={{ x: 200 }}>
    <button class="back" onclick={() => {goto("/")}}>Back</button>
    <section class="temperature">
        <h1>{entryState.entry?.city}</h1>
        <h2><Spinner /></h2>
    </section>
    <section>
        <canvas id="chart" bind:this={chart}></canvas>
    </section>
    <section class="days">
        {#each {length: 7} as _, i}
            <DayButton number={i} />
        {/each}
    </section>
</div>

<style>
    .page {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
    .back {
        position: absolute;
        top: 10px;
        left: 10px;
        padding: 10px;
        background-color: var(--bg);
    }
    .temperature {
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    canvas {
        height: 150px !important;
    }
    .days {
        display: flex;
        justify-content: space-between;
    }
</style>
