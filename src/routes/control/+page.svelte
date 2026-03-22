<script>
    import { source } from 'sveltekit-sse';
    import { enhance } from '$app/forms';

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

    let top = $state(-100);
    let left = $state(-100);

    const timp_evt = event.select('timp');
    const timp = (function (/**@type{string}*/ t) {
        const //
            timp = parseInt(t),
            sec = fmt_timp(Math.max(0, timp % 60).toString()),
            min = fmt_timp(Math.max(0, Math.floor(timp / 60)).toString());
        return `${min}:${sec}`;
    });
    function fmt_timp(/**@type {string}*/ text) {
        return text.length < 2 ? '0' + text : text;
    }

    /** @param {import('$lib/db.js').Proba} proba */
    function nume_ekipa(proba) {
        return (
            proba.ekipa === 1 ? ekipe[0].denumirea
            : proba.ekipa === 2 ? ekipe[1].denumirea
            : '-'
        );
    }

    /** @type {HTMLButtonElement}*/
    let flotant;

    /** @param {MouseEvent} e  */
    function ascunde_flotant(e) {
        if (e.target instanceof HTMLInputElement && e.target.type === "radio") {
            return
        }
        const rect = flotant.getBoundingClientRect()
        const x = e.clientX, y = e.clientY;
        if (top > 0 && left > 0 && !(rect.left < x && x < rect.right && rect.top < y && y < rect.bottom)) {
            top = -100; left = -100;
        }
    }
</script>

<svelte:window onclick={ascunde_flotant} />

<div class="@container/main font-mono">
    <form method="POST" use:enhance class="flex flex-col lg:flex-row">

        <button bind:this={flotant} formaction="?/intrebarea" type="submit" class="absolute z-100 p-1 border border-zinc-200 rounded-lg shadow shadow-zinc-200/50 hover:bg-zinc-200 bg-white" style="top: {top}px; left: {left}px;"
        onclick={()=> {
            top = -100;
            left = -100;
        }}>
            alege
        </button>

        <!-- INFO: Punctul de control -->
        <div
            class="flex w-124 min-w-124 flex-col justify-between gap-4 border-r-1 bg-white p-4 lg:h-screen"
        >
            <div class="flex flex-col gap-2">
                <!-- INFO: Datele echipelor -->
                <div class="flex w-full flex-row gap-2 text-3xl">
                    <div
                        class="relative flex w-full max-w-100 flex-col overflow-hidden rounded-lg border border-zinc-200"
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            formaction="?/reseteaza-respondent"
                            class={[
                                'absolute top-0 right-0 m-1',
                                ekipa_activa !== '1' && 'hidden',
                            ]}
                            type="submit"
                        >
                            uită
                        </Button>

                        <button
                            formaction="?/ekipa1"
                            class={[
                                'w-full px-2 py-6 text-left',
                                ekipa_activa === '1' ?
                                    'bg-amber-100 hover:bg-amber-200'
                                :   'bg-zinc-100 hover:bg-zinc-200',
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
                        class="relative flex w-full max-w-100 flex-col rounded-lg border border-zinc-200"
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            formaction="?/reseteaza-respondent"
                            class={[
                                'absolute top-0 right-0 m-1',
                                ekipa_activa !== '2' && 'hidden',
                            ]}
                            type="submit"
                        >
                            uită
                        </Button>
                        <button
                            formaction="?/ekipa2"
                            type="submit"
                            class={[
                                'w-full px-2 py-6 text-left',
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

                <div
                    class="flex w-fit w-full max-w-120 min-w-80 flex-col rounded-md border-2 border-purple-500/70 shadow-sm shadow-purple-500/30"
                >
                    <div class="border-b-1 p-2 text-center">
                        Întrebarea activă
                    </div>

                    <div class="px-2 pt-2">
                        <div class="truncate">
                            <span class="truncate"
                                >{proba.titlu !== '' ? proba.titlu : '??'}
                            </span>
                        </div>
                        <div class="flex w-full truncate  flex-row gap-3 justify-between">
                            <div>
                                <span>răspuns: </span>
                                <span class="pr-4">{proba.raspuns}</span>
                            </div>
                        </div>
                        <div class="relative activator-indiciu px-1 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-200">tăt raspunsul<div class="absolute left-full top-full hidden indiciu min-w-80 max-w-112 p-2 bg-white border border-zinc-200 shadow-md shadow-zinc-200/70">{proba.raspuns}</div></div>

                        <div class="pb-2">
                            {#if proba.ekipa !== undefined}
                                <span class="text-red-700"
                                    >A răspuns {nume_ekipa(proba)}</span
                                >
                            {:else if ekipa_activa === '0'}
                                <span class="text-red-700"
                                    >Niĉi o echipă nu-i activă</span
                                >
                            {:else}
                                .
                            {/if}
                        </div>
                    </div>

                    <div
                        class="flex w-full flex-row divide-x border-t-1 border-b-1 *:w-full *:px-4 *:py-2 *:hover:bg-zinc-50"
                    >
                        <button
                            formaction="?/gresit"
                            class="bg-orange-100 disabled:bg-stone-50 disabled:text-stone-200"
                            type="submit"
                            disabled={ekipa_activa === '0' ||
                                proba.ekipa !== undefined}
                        >
                            Greșit
                        </button>
                        <button
                            formaction="?/arata-raspuns"
                            class="bg-amber-100"
                            type="submit"
                        >
                            Arată
                        </button>
                        <button
                            class="bg-green-100 disabled:bg-stone-50 disabled:text-stone-200"
                            formaction="?/corect"
                            type="submit"
                            disabled={ekipa_activa === '0' ||
                                proba.ekipa !== undefined}
                        >
                            Corect
                        </button>
                    </div>

                    <div class="flex flex-row items-center gap-3 p-2">
                        <span>punctaj:</span>
                        <div
                            class="flex flex-row divide-x rounded-lg border border-zinc-200 *:px-2 *:py-1"
                        >
                            <button
                                formaction="?/dec10"
                                class="hover:bg-zinc-50"
                                type="submit"
                            >
                                -10p
                            </button>
                            <div class="bg-zinc-50">
                                {proba.puncte}pte
                            </div>
                            <button
                                formaction="?/inc10"
                                class="hover:bg-zinc-50"
                                type="submit"
                            >
                                +10p
                            </button>
                        </div>
                    </div>

                    <div class="border-y-1 flex flex-row items-center justify-between">
                        <span class="pl-2">timp rezervat:</span>
                        <div
                        class="flex flex-row border-l divide-x *:w-full *:py-2 *:hover:bg-zinc-50"
                    >
                        <button
                            formaction="?/decr-timp-10"
                            class="px-3"
                            type="submit"
                        >
                            -10s
                        </button>
                        <button
                            formaction="?/decr-timp-5"
                            class="px-3"
                            type="submit"
                        >
                            -5s
                        </button>
                        <button
                            formaction="?/start-timp"
                            type="submit"
                                class="px-2"
                        >
                            {timp(`${proba.timp}`)}
                        </button>
                        <button
                            formaction="?/incr-timp-5"
                            class="px-3"
                            type="submit"
                        >
                            +5s
                        </button>
                        <button
                            formaction="?/incr-timp-10"
                            class="px-3"
                            type="submit"
                        >
                            +10s
                        </button>
                    </div></div>
                    <div class="flex flex-row justify-between items-center">

                        <span class="px-2 w-1/3 text-center">{timp($timp_evt)}</span>

                        <button
                        formaction="?/start-timp"
                        class="w-full p-2 hover:bg-zinc-50 border-l"
                        type="submit"
                    >
                        start cronometru
                    </button></div>

                    <div
                        class="flex w-full flex-row divide-x border-t-1 *:w-full *:px-4 *:py-2 *:hover:bg-zinc-50"
                    >
                        <button formaction="?/decrement" type="submit">
                            vekiu
                        </button>
                        <button formaction="?/increment" type="submit">
                            șanti
                        </button>
                    </div>

                    {#if proba.tip === 'cîntec'}
                        <audio
                            onplay={(e) => {
                                document
                                    .querySelectorAll('audio')
                                    .forEach(
                                        (a) =>
                                            a !== e.target &&
                                                a.pause(),
                                    );
                            }}
                            src={proba.audio}
                            controls
                        ></audio>
                    {/if}
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

        <div class="overflow-scroll p-4 lg:h-screen">
            <div
                class="rounded-md border border-stone-200 shadow shadow-stone-200/50"
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
                                class:bg-amber-100={i ===
                                    nr_proba % probe.length}
                            >
                                <td class="radio-cel">
                                    <label class="relative hover:bg-green-50">
                                        <input
                                            checked={i === nr_proba}
                                            onclick={(e) => {
                                                if (e.target === null) return
                                                let rect = e.currentTarget.getBoundingClientRect()
                                                top = rect.top - 10
                                                left = rect.right + 10
                                            }}
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

                                <td
                                    class="w-[400px]"
                                    style="padding: 0 0.5rem;"
                                >
                                    {#if proba.tip === 'cîntec'}
                                        <audio
                                            onplay={(e) => {
                                                document
                                                    .querySelectorAll('audio')
                                                    .forEach(
                                                        (a) =>
                                                            a !== e.target &&
                                                            a.pause(),
                                                    );
                                            }}
                                            controls={i ===
                                                nr_proba % probe.length}
                                            src={proba.audio}
                                        ></audio>
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
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
    .activator-indiciu:hover .indiciu {
        display: block;
    }
</style>
