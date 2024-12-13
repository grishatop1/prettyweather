<script lang="ts">
    import Chart from "chart.js/auto";

    import { fly } from "svelte/transition";

    import { entryState } from "$lib/state.svelte";
    import Spinner from "$lib/icons/Spinner.svelte";
    import { onMount } from "svelte";

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
    <section class="temperature">
        <h1>{entryState.entry?.city}</h1>
        <h2><Spinner /></h2>
    </section>
    <section>
        <canvas id="chart" bind:this={chart}></canvas>
    </section>
</div>

<style>
    .temperature {
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    canvas {
        height: 150px !important;
    }
</style>
