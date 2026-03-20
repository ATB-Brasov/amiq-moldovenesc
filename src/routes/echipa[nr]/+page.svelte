<script>
    import { enhance } from '$app/forms';

    /** @type {import('./$types').PageProps} */
    const { data } = $props()
</script>

<form method=POST use:enhance>
    <button>
    Echipa: {data.ekipa.denumirea}
    </button>
</form>

<style>
    button {
        background: yellow;
        width: 96%;
        height: 96%;
        margin: auto;
    }
    form {
        width: 100vw;
        height: 100vh;
        display: flex;
    }
</style>
