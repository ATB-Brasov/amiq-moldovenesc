<script>
    import { source } from 'sveltekit-sse';
    import { enhance } from '$app/forms';

    import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
    import { Button } from '$lib/components/ui/button';

    /** @type {import('./$types').PageProps} */
    let { data } = $props();
    const event = source('/eveniment');

    const ekipe = $derived(data.ekipe);
    const apasat = event.select('apasat');
    const ekipa_activa = $derived(
        $apasat ? $apasat : data.ekipa_activa.toString(),
    );

    const probe = $derived(data.probe);
    const nr_proba = $derived(data.nr_proba);
    const proba = $derived(data.probe[nr_proba % probe.length]);

    /** @param {import('$lib/db.js').Proba} proba */
    function nume_ekipa(proba) {
        return (
            proba.ekipa === 1 ? ekipe[0].denumirea
            : proba.ekipa === 2 ? ekipe[1].denumirea
            : '-'
        );
    }
</script>

<div class="@container/main flex flex-1 flex-col gap-2 font-mono">
    <form method="POST" use:enhance>
        <!-- INFO: Antetul cu datele echipelor și butoane de control -->
        <div
            class="sticky top-0 left-0 z-100 flex w-full flex-col gap-4 border-b-1 bg-white px-6 py-3"
        >
            <!-- INFO: Datele echipelor -->
            <div class="flex w-full flex-row gap-8 text-3xl">
                <div
                    class="flex w-full max-w-100 flex-col overflow-hidden rounded-lg border border-zinc-200"
                >
                    <button
                        formaction="?/ekipa1"
                        class={[
                            'w-full p-6 text-left',
                            ekipa_activa === '1' ?
                                'bg-amber-100 hover:bg-amber-200'
                            :   'hover:bg-zinc-20 bg-zinc-100',
                        ]}
                        type="submit"
                    >
                        {ekipe[0].denumirea}
                        {ekipe[0].puncte}
                    </button>

                    <div class="flex flex-row text-xl">
                        <button
                            class="w-full min-w-20 border-t-1 border-r-1 border-zinc-200 bg-zinc-50 py-2 hover:bg-zinc-200"
                            formaction="?/decr-ekipa1"
                            type="submit"
                        >
                            -10pct
                        </button>
                        <button
                            class="w-full min-w-20 border-t-1 border-zinc-200 bg-zinc-50 py-2 hover:bg-zinc-200"
                            formaction="?/incr-ekipa1"
                            type="submit"
                        >
                            +10pct
                        </button>
                    </div>
                </div>

                <div
                    class="flex w-full max-w-100 flex-col overflow-hidden rounded-lg border border-zinc-200"
                >
                    <button
                        formaction="?/ekipa2"
                        type="submit"
                        class={[
                            'w-full p-6 text-left',
                            ekipa_activa === '2' ?
                                'bg-amber-100 hover:bg-amber-200'
                            :   'hover:bg-zinc-20 bg-zinc-100',
                        ]}
                    >
                        {ekipe[1].denumirea}
                        {ekipe[1].puncte}
                    </button>
                    <div class="flex flex-row text-xl">
                        <button
                            class="w-full min-w-20 border-t-1 border-r-1 border-zinc-200 bg-zinc-50 py-2 hover:bg-zinc-200"
                            formaction="?/decr-ekipa2"
                            type="submit"
                        >
                            -10pct
                        </button>
                        <button
                            class="w-full min-w-20 border-t-1 border-zinc-200 bg-zinc-50 py-2 hover:bg-zinc-200"
                            formaction="?/incr-ekipa2"
                            type="submit"
                        >
                            +10pct
                        </button>
                    </div>
                </div>
            </div>

            <!-- INFO: Butoane de control -->
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
                                disabled={ekipa_activa === '0' ||
                                    proba.ekipa !== undefined}
                            >
                                Greșit
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                formaction="?/arata-raspuns"
                                class="bg-amber-100"
                                type="submit"
                            >
                                Arată răspuns
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                class="bg-green-100"
                                formaction="?/corect"
                                type="submit"
                                disabled={ekipa_activa === '0' ||
                                    proba.ekipa !== undefined}
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
                                formaction="?/decr-timp-10"
                                variant="outline"
                                size="lg"
                                type="submit"
                            >
                                -10sec
                            </Button>
                            <Button
                                formaction="?/start-timp"
                                variant="outline"
                                size="lg"
                                type="submit"
                            >
                                Start
                            </Button>
                            <Button
                                formaction="?/incr-timp-10"
                                variant="outline"
                                size="lg"
                                type="submit"
                            >
                                +10sec
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
                <thead class="bg-stone-50">
                    <tr
                        class="divide-x-3 divide-dashed divide-stone-100 text-left"
                    >
                        <th class="text-center">*</th>
                        <th>intrebare</th>
                        <th>răspuns</th>
                        <th>raspuns_de</th>
                        <th>puncte</th>
                        <th>timp</th>
                        <th>audio</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-solid divide-stone-200">
                    {#each probe as proba, i}
                        <tr
                            class="divide-x-3 divide-dashed divide-stone-100"
                            class:bg-amber-100={i === nr_proba % probe.length}
                        >
                            <td class="radio-cel">
                                <label class="hover:bg-green-50">
                                    <input
                                        checked={i === nr_proba}
                                        type="radio"
                                        name="intrebarea"
                                        value={i}
                                    />
                                </label>
                            </td>

                            <td>{proba.titlu}</td>
                            <td>{proba.raspuns}</td>
                            <td class="text-center">{nume_ekipa(proba)}</td>
                            <td class="text-center">{proba.puncte}pct</td>
                            <td class="text-center">{proba.timp}s</td>

                            <td class="w-[400px]" style="padding: 0 0.5rem;">
                                {#if proba.tip === 'cîntec'}
                                    <audio
                                        controls={i === nr_proba % probe.length}
                                        src={proba.audio}
                                    ></audio>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
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
