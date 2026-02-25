<script>

    import { enhance } from '$app/forms';

    /** @type {import('./$types').PageProps} */
    const { data, params } = $props()

</script>


<form method=POST use:enhance>
    <input value={params.nr} type="hidden" name="nr_echipa">
    <button>
    Echipa: {data.echipa.denumirea}
    </button>
</form>

<style>
    /* your styles go here */
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
