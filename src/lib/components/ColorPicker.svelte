<script lang="ts">
    import Palette from "$lib/icons/Palette.svelte";

    const colors = [
        "#efd2ff",
        "#b8ff8f",
        "#b0c2ff",
        "#fff"
    ]
    let current = $state(0);
    let onclick = () => {
        if (current === colors.length - 1) {
            current = 0;
        } else {
            current++;
        }
        document.documentElement.style.setProperty('--accent', colors[current]);
    }
</script>

<div class="main">
    <button aria-label="color" onclick={onclick}><Palette /></button>
</div>

<style>
    button {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: var(--accent);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
</style>