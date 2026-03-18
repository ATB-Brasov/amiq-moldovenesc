<script>
    import {fly, slide} from 'svelte/transition';
    import { source } from 'sveltekit-sse';
    import { intrebari } from '$lib/db.js';

    /** @type {{ data: import('./$types').PageData }} */
    const { data } = $props();

    const echipa1 = $derived(data.echipa1);
    const echipa2 = $derived(data.echipa2);

    const event = source('/eveniment');
    const nr_intrebare = event.select('nr_intrebare');
    const raspuns = event.select('raspuns');

    const apasat = event.select('apasat');
    const echipa_activa = $derived(
        $apasat ? $apasat : data.echipa_activa.toString(),
    );

    const echipa1_puncte = event.select('puncte1');
    const echipa2_puncte = event.select('puncte2');

    const idx_intrebare_activa = $derived(
        ($nr_intrebare ? parseInt($nr_intrebare) : data.nr_intrebare) %
            intrebari.length,
    );
    const intrebarea_activa = $derived(intrebari[idx_intrebare_activa]);

    let timp = event.select('timp');

    let secunde = $derived(Math.max(0, parseInt($timp ?? 0) % 60));
    let minute = $derived(Math.max(0, Math.floor(parseInt($timp ?? 0) / 60)));

    const scena_event = event.select('scena')
    /** @type {'introducere'|'tranzitie'|'joc'} */
    const scena = $derived($scena_event ? $scena_event : data.scena);

    /**
     * @param {string} text
     * @return {string}
     */
    function pad_left(text) {
        if (text.length < 2) return '0' + text;
        return text;
    }
</script>

{#if scena === 'introducere'}
    <div class="w-screen h-screen flex justify-center items-center">
        <div class="text-6xl font-bold text-stone-600">
            AMIQ Moldovenesc
        </div>
    </div>
{:else}

    {#if intrebarea_activa.tip === "tranziție"}
        <div transition:slide class="w-screen h-screen bg-white flex justify-center items-center absolute z-100">
            <div class="text-6xl font-bold text-stone-600">
                Nume Joc
            </div>
        </div>
    {/if}


    <div class="bg-[url(/baza-90.jpg)] bg-cover text-yellow-900">
        <div
            class="fixed flex w-full flex-row justify-between bg-amber-100/80 text-5xl font-bold"
        >
            <div
                class="flex w-full flex-row px-15 py-10"
                class:bg-orange-300={$apasat === '1'}
            >
                <div>{echipa1.denumirea}</div>
                <div class="pl-12">
                    {$echipa1_puncte ? $echipa1_puncte : echipa1.puncte}
                </div>
            </div>

            <div class="w-150 text-center text-stone-400">
                <div class="relative py-10">
                    <span
                    >{pad_left(minute.toString())}:{pad_left(
                        secunde.toString(),
                    )}</span
                    >

                    <div class="absolute -bottom-4 w-full">
                        <span
                            class="mx-auto w-fit rounded-xl border-2 border-emerald-100 bg-emerald-50 px-2 py-1 text-center text-3xl font-bold text-emerald-500"
                        >+{intrebarea_activa.puncte}pt</span
                        >
                    </div>
                </div>
            </div>

            <div
                class="flex w-full flex-row justify-end px-15 py-10"
                class:bg-orange-300={$apasat === '2'}
            >
                <div class="pr-12">
                    {$echipa2_puncte ? $echipa2_puncte : echipa2.puncte}
                </div>
                <div>{echipa2.denumirea}</div>
            </div>
        </div>

        <div
            class="flex h-screen w-full flex-col justify-center text-center font-mono text-6xl font-bold"
        >
            <div class="relative">
                {#if intrebarea_activa.tip === 'emoji' || intrebarea_activa.tip === 'text'}
                    <span class:text-9xl={intrebarea_activa.tip === 'emoji'}
                    >{intrebarea_activa.titlu}</span
                    >
                {:else if intrebarea_activa.tip === 'cîntec'}
                    <div class="flex flex-row items-center justify-center gap-10">
                        <img
                            height="400px"
                            class="animate-bounce"
                            src="/img/apu_listen_muzik.webp"
                            alt="Apu listens to music"
                        />
                    </div>
                {:else if intrebarea_activa.tip === 'imagine'}
                    <div class="flex flex-row items-center justify-center gap-10">
                        {@html intrebarea_activa.html}
                    </div>
                {:else}
                    <span>{intrebarea_activa.titlu}</span>
                {/if}
            </div>
        </div>

        {#if $raspuns !== ''}
            <div
                class="fixed bottom-0 w-full"
                class:bg-red-50={$raspuns === 'gresit'}
                class:bg-green-50={$raspuns === 'corect'}
            >
                <div
                    class:text-red-500={$raspuns === 'gresit'}
                    class:text-green-500={$raspuns === 'corect'}
                    class="m-auto w-300 py-[2.5vh] text-center text-4xl font-bold"
                >
                    Raspuns {$raspuns}
                    {#if $raspuns === 'corect'}
                        : {intrebarea_activa.raspuns}
                    {/if}
                </div>
            </div>
        {/if}
    </div>

    <style>
    </style>
{/if}
