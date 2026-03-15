<script>
    import { source } from 'sveltekit-sse';
    import { enhance } from '$app/forms';

    import DataTable from '$lib/components/data-table-questions.svelte';
    import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
    import { Button } from '$lib/components/ui/button';

    // import { intrebari } from '$lib/db.js';

    /** @type {import('./$types').PageProps} */
    let { data } = $props();
    const event = source('/eveniment');

    const apasat = event.select('apasat');
    const echipa_activa = $derived(
        $apasat ? $apasat : data.echipa_activa.toString(),
    );

    const intrebari = $derived(data.intrebari);
    const echipe = $derived(data.echipe);
    const nr_intr = $derived(data.nr_intrebare);
    const intrebare = $derived(data.intrebari[nr_intr % intrebari.length]);
</script>

<div class="@container/main flex flex-1 flex-col gap-2">
    <form class="flex flex-col gap-4 p-4" method="POST" use:enhance>
        <h1 class="text-3xl">Control echipe</h1>
        <div class="flex w-full flex-row justify-between bg-green-100">
            <div class="flex w-full flex-row">
                <div class="flex flex-row">
                    <button
                        class="w-full min-w-20 bg-yellow-100 py-10 text-5xl"
                        formaction="?/decr-echipa1"
                        type="submit"
                    >
                        -
                    </button>
                    <button
                        class="w-full min-w-20 bg-yellow-200 py-10 text-5xl"
                        formaction="?/incr-echipa1"
                        type="submit"
                    >
                        +
                    </button>
                </div>
                <button
                    class="w-full p-10 text-left text-5xl"
                    formaction="?/echipa1"
                    class:bg-emerald-100={echipa_activa !== '1'}
                    class:bg-amber-100={echipa_activa === '1'}
                    type="submit"
                >
                    {echipe[0].puncte}
                    {echipe[0].denumirea}
                </button>
            </div>

            <button
                class="bg-red-100/50 p-10 text-right text-5xl"
                formaction="?/reseteaza-respondent"
                type="submit"
            >
                Deselect
            </button>

            <div class="flex w-full flex-row">
                <button
                    class="w-full p-10 text-right text-5xl"
                    formaction="?/echipa2"
                    type="submit"
                    class:bg-emerald-100={echipa_activa !== '2'}
                    class:bg-amber-100={echipa_activa === '2'}
                >
                    {echipe[1].denumirea}
                    {echipe[1].puncte}
                </button>

                <div class="flex flex-row">
                    <button
                        class="w-full min-w-20 bg-yellow-100 py-10 text-5xl"
                        formaction="?/decr-echipa2"
                        type="submit"
                    >
                        -
                    </button>
                    <button
                        class="w-full min-w-20 bg-yellow-200 py-10 text-5xl"
                        formaction="?/incr-echipa2"
                        type="submit"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>

        <h1 class="text-3xl">Control joc</h1>
        <ButtonGroup.Root>
            <Button
                variant="destructive"
                size="sm"
                formaction="?/reseteaza-joc"
                type="submit"
            >
                Resezeatză Jioc
            </Button>
        </ButtonGroup.Root>

        <h1 class="text-3xl">Control Întrebări</h1>
        <ButtonGroup.Root>
            <Button
                formaction="?/decrement"
                class="bg-lime-200"
                variant="outline"
                size="sm"
                type="submit"
            >
                Anteriorul
            </Button>
            <Button
                formaction="?/increment"
                class="bg-lime-200"
                variant="outline"
                size="sm"
                type="submit"
            >
                Următorul
            </Button>
            <Button
                variant="outline"
                size="sm"
                formaction="?/gresit"
                type="submit"
                disabled={echipa_activa === '0' ||
                    intrebare.echipa !== undefined}
            >
                Răspuns gresit
            </Button>
            <Button
                variant="outline"
                size="sm"
                formaction="?/corect"
                type="submit"
                disabled={echipa_activa === '0' ||
                    intrebare.echipa !== undefined}
            >
                Răspuns corect
            </Button>
        </ButtonGroup.Root>

        <div
            class="overflow-hidden rounded-md border border-stone-200 shadow shadow-stone-200/50"
        >
            <table class="table-auto w-full">
                <thead class="bg-stone-50"
                    ><tr
                        class="divide-x-3 divide-dashed divide-stone-100 text-left"
                        ><th>intrebare</th><th>răspuns</th><th
                            >răspunse</th
                        ><th>timp</th><th>audio</th></tr
                    ></thead
                >
                <tbody class="divide-y divide-solid divide-stone-200">
                    {#each intrebari as rind, i}
                        <tr class="divide-x-3 divide-dashed divide-stone-100"
                            class:bg-amber-100={i ===
                                data.nr_intrebare % intrebari.length}
                            ><td>{rind.titlu}</td><td>{rind.raspuns}</td><td class="text-center"
                                >{rind.echipa === 1 ? echipe[0].denumirea
                                : rind.echipa === 2 ? echipe[1].denumirea
                                : '-'}</td
                            ><td class="text-center">{rind.timp}s</td><td class="w-[400px]" style="padding: 0 0.5rem;">
                                {#if rind.tip === 'cîntec'}
                                    <audio controls={i ===
                                data.nr_intrebare % intrebari.length} src={rind.audio}></audio>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        {#if false}
            <DataTable
                data={intrebari.map((el, i) => ({
                    ...el,
                    id: i,
                    selectat: i === data.nr_intrebare % intrebari.length,
                    echipa:
                        el.echipa === 1 ? echipe[1].denumirea
                        : el.echipa === 2 ? echipe[0].denumirea
                        : '-',
                }))}
            />
        {/if}
    </form>
</div>

<style>
td, th {
    padding: 0.5rem;
}
</style>
