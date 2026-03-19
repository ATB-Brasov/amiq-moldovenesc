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

<div class="@container/main flex flex-1 flex-col gap-2 font-mono">
    <form method="POST" use:enhance>
        <div
            class="sticky top-0 left-0 z-100 flex w-full flex-col gap-4 border-b-1 bg-white px-6 py-3"
        >
            <div class="flex w-full flex-row gap-8 text-3xl">
                <div
                    class="flex w-full max-w-100 flex-col overflow-hidden rounded-lg border border-stone-100"
                >
                    <button
                        class="w-full p-6 text-left"
                        formaction="?/echipa1"
                        class:bg-emerald-100={echipa_activa !== '1'}
                        class:bg-amber-100={echipa_activa === '1'}
                        type="submit"
                    >
                        {echipe[0].denumirea}
                        {echipe[0].puncte}
                    </button>

                    <div class="flex flex-row text-xl">
                        <button
                            class="w-full min-w-20 bg-yellow-100 py-2"
                            formaction="?/decr-echipa1"
                            type="submit"
                        >
                            -{intrebare.puncte}pct
                        </button>
                        <button
                            class="w-full min-w-20 bg-yellow-200 py-2"
                            formaction="?/incr-echipa1"
                            type="submit"
                        >
                            +{intrebare.puncte}pct
                        </button>
                    </div>
                </div>

                <div
                    class="flex w-full max-w-100 flex-col overflow-hidden rounded-lg border border-stone-100"
                >
                    <button
                        class="w-full p-6 text-right"
                        formaction="?/echipa2"
                        type="submit"
                        class:bg-emerald-100={echipa_activa !== '2'}
                        class:bg-amber-100={echipa_activa === '2'}
                    >
                        {echipe[1].denumirea}
                        {echipe[1].puncte}
                    </button>

                    <div class="flex flex-row text-xl">
                        <button
                            class="w-full min-w-20 bg-yellow-100 py-2"
                            formaction="?/decr-echipa2"
                            type="submit"
                        >
                            -{intrebare.puncte}pct
                        </button>
                        <button
                            class="w-full min-w-20 bg-yellow-200 py-2"
                            formaction="?/incr-echipa2"
                            type="submit"
                        >
                            +{intrebare.puncte}pct
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex flex-row justify-between">
                <div class="flex flex-col gap-y-4">
                    <div class="flex flex-row flex-wrap gap-x-8 gap-y-4">
                        <ButtonGroup.Root>
                            <Button
                                formaction="?/decrement"
                                variant="outline"
                                size="lg"
                                type="submit"
                            >
                                Anteriorul
                            </Button>
                            <Button
                                formaction="?/increment"
                                variant="outline"
                                size="lg"
                                type="submit"
                            >
                                Următorul
                            </Button>
                        </ButtonGroup.Root>

                        <ButtonGroup.Root>
                            <Button
                                variant="outline"
                                size="lg"
                                formaction="?/gresit"
                                class="bg-orange-100"
                                type="submit"
                                disabled={echipa_activa === '0' ||
                                    intrebare.echipa !== undefined}
                            >
                                Greșit
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                class="bg-green-100"
                                formaction="?/corect"
                                type="submit"
                                disabled={echipa_activa === '0' ||
                                    intrebare.echipa !== undefined}
                            >
                                Corect
                            </Button>
                        </ButtonGroup.Root>

                        <Button
                            variant="outline"
                            size="lg"
                            formaction="?/intrebarea"
                            type="submit"
                        >
                            Alege întrebarea
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            formaction="?/reseteaza-respondent"
                            type="submit"
                        >
                            Deselectează Echipa
                        </Button>

                    </div>

                    <div class="flex flex-row gap-x-6">
                        <ButtonGroup.Root>
                            <Button
                                formaction="?/dec10"
                                variant="outline"
                                size="lg"
                                type="submit"
                            >
                                -10pct
                            </Button>
                            <Button
                                formaction="?/inc10"
                                variant="outline"
                                size="lg"
                                type="submit"
                            >
                                +10pct
                            </Button>
                        </ButtonGroup.Root>
                        <ButtonGroup.Root>
                            <Button
                                formaction="?/inc-timp-10"
                                variant="outline"
                                size="lg"
                                type="submit"
                            >
                                +10sec
                            </Button>
                            <Button
                                formaction="?/inc-timp-20"
                                variant="outline"
                                size="lg"
                                type="submit"
                            >
                                +20sec
                            </Button>
                        </ButtonGroup.Root>
                    </div>
                </div>

                <Button
                    variant="destructive"
                    size="lg"
                    formaction="?/reseteaza-joc"
                    type="submit"
                >
                    Resezeatză Joc
                </Button>
            </div>
        </div>

        <div
            class="m-6 overflow-hidden rounded-md border border-stone-200 shadow shadow-stone-200/50"
        >
            <table class="w-full table-auto">
                <thead class="bg-stone-50"
                    ><tr
                        class="divide-x-3 divide-dashed divide-stone-100 text-left"
                        ><th class="text-center">*</th><th>intrebare</th><th
                            >răspuns</th
                        ><th>răspunse</th><th>puncte</th><th>timp</th><th>audio</th></tr
                    ></thead
                >
                <tbody class="divide-y divide-solid divide-stone-200">
                    {#each intrebari as rind, i}
                        <tr
                            class="divide-x-3 divide-dashed divide-stone-100"
                            class:bg-amber-100={i ===
                                nr_intr % intrebari.length}
                            ><td class="radio-cel"
                                ><label class="hover:bg-green-50"
                                    ><input
                                        checked={i === nr_intr}
                                        type="radio"
                                        name="intrebarea"
                                        value={i}
                                    /></label
                                ></td
                            ><td>{rind.titlu}</td><td>{rind.raspuns}</td><td
                                class="text-center"
                                >{rind.echipa === 1 ? echipe[0].denumirea
                                : rind.echipa === 2 ? echipe[1].denumirea
                                : '-'}</td
                            ><td class="text-center">{rind.puncte}pct</td><td class="text-center">{rind.timp}s</td><td
                                class="w-[400px]"
                                style="padding: 0 0.5rem;"
                            >
                                {#if rind.tip === 'cîntec'}
                                    <audio
                                        controls={i ===
                                            nr_intr % intrebari.length}
                                        src={rind.audio}
                                    ></audio>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <div class="h-8"></div>

        {#if false}
            <DataTable
                data={intrebari.map((el, i) => ({
                    ...el,
                    id: i,
                    selectat: i === nr_intr % intrebari.length,
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
    td,
    th {
        padding: 0.5rem;
    }

    td.radio-cel {
        padding: 0;
        line-height: 2.5;
    }

    td.radio-cel label {
        display: flex;
        height: 2.5rem;
        align-items: center;
        justify-content: center;
    }
</style>
