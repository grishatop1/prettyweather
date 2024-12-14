<script>
    const { number, selected = false, select } = $props();

    const data = [
        "Today",
        "Tomorrow",
        "In 3 days",
        "In 4 days",
        "In 5 days",
        "In 6 days",
        "In 7 days"
    ]
</script>

<button class:selected onclick={select}>
    <p>{data[number]}</p>
</button>

<style>
    button {
        width: 80px;
        height: 100px;
        cursor: pointer;
        background-color: var(--primary);
        color: var(--accent);
        border: none;
        border-radius: 10px;
        display: flex;
        align-items: center;
        flex-direction: column;
        transition: border 0.2s;
        padding: 6px;
        margin: 5px;
    }

    .selected {
        border: 2px solid var(--accent);
    }
</style>