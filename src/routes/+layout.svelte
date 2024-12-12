<script>
    import '../app.css';
    import '$lib/types';
    let { children } = $props();
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