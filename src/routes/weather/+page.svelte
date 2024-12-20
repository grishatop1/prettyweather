<script lang="ts">
    import Chart from "chart.js/auto";

    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    import { entryState } from "$lib/state.svelte";
    import Spinner from "$lib/icons/Spinner.svelte";
    import DayButton from "$lib/components/DayButton.svelte";
    import { fetchWeatherApi } from "openmeteo";

    let chart: HTMLCanvasElement;
    let selected_day = $state(0);
    let temp = $state("");

    onMount(async () => {
        const style = getComputedStyle(document.body);
        const accent_color = style.getPropertyValue("--accent");
        const primary_color = style.getPropertyValue("--primary");
        const background_color = style.getPropertyValue("--bg");
        Chart.defaults.color = accent_color;
        Chart.defaults.borderColor = primary_color;
        Chart.defaults.backgroundColor = background_color;

        const params = {
            latitude: entryState.entry?.lat,
            longitude: entryState.entry?.lng,
            current: "temperature_2m",
            hourly: ["temperature_2m", "precipitation_probability"],
            forecast_days: 1,
        };

        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];
        const current = response.current()!;
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const range = (start: number, stop: number, step: number) =>
	        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

        let tempNumber = current.variables(0)!.value();
        temp = (Math.round(tempNumber * 10) / 10).toString();

        let now = new Date();

        const hourly = response.hourly()!;
        const weatherData = {
            hourly: {
                time: range(
                    Number(hourly.time()),
                    Number(hourly.timeEnd()),
                    hourly.interval(),
                ).map((t) => new Date((t + utcOffsetSeconds) * 1000)).slice(now.getHours(), now.getHours() + 7),
                // temperature2m: hourly.variables(0)!.valuesArray()!,
                precipitationProbability: hourly.variables(1)!.valuesArray()!.slice(0, 7),
            },
        };
        new Chart(chart, {
            type: "line",
            data: {
                labels: weatherData.hourly.time.map((t) => t.getHours().toString() + ":00"),
                datasets: [
                    {
                        data: weatherData.hourly.precipitationProbability.map((test) => test),
                        borderColor: accent_color,
                        tension: 0.3,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                events: [],
                scales: {
                    y: {
                        ticks: {
                            display: true,
                        },
                        grid: {
                            display: false,
                        },
                    },
                },
            },
        });
    });
</script>

<div class="page" transition:fly={{ x: 200 }}>
    <button
        class="back"
        onclick={() => {
            goto("/");
        }}>Back</button
    >
    <section class="temperature">
        <h1>{entryState.entry?.city}</h1>
        <h2>
            {#if temp}
                {temp}℃
            {:else}
                <Spinner />
            {/if}
        </h2>
    </section>
    <p class="perc">Percipation probability:</p>
    <section>
        <canvas bind:this={chart}></canvas>
    </section>
    <section class="days">
        {#each { length: 7 } as _, i}
            <DayButton
                number={i}
                selected={selected_day === i}
                select={() => {
                    selected_day = i;
                }}
            />
        {/each}
    </section>
</div>

<style>
    .page {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    section {
        margin: 20px 25px;
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
    .perc {
        text-align: center;
    }
    canvas {
        max-width: 100%;
        height: 100%;
        position: relative;
    }   
    .days {
        display: flex;
        justify-content: center;
        filter: grayscale(1);
        position: relative;
    }
    .days::after {
        content: "Unavailable for now...";
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(255, 0, 0, 0.295);
        border-radius: 8px;
    }
</style>
