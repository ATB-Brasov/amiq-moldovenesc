<script>
    import { source } from 'sveltekit-sse';
    import { intrebari } from '$lib/db.js';

    /** @type {{ data: import('./$types').PageData }} */
    const { data } = $props();

    const echipa1 = $derived(data.echipa1);
    const echipa2 = $derived(data.echipa2);

    const event = source('/eveniment');
    const nr_intrebare = event.select('nr_intrebare');
    const raspuns = event.select('raspuns');

    const apasat = (event.select('apasat'));
    const echipa_activa = $derived($apasat ? $apasat : data.echipa_activa.toString())

    const echipa1_puncte = event.select('puncte1');
    const echipa2_puncte = event.select('puncte2');

    const idx_intrebare_activa = $derived(
        ($nr_intrebare ? parseInt($nr_intrebare) : data.nr_intrebare) % intrebari.length,
    );
    const intrebarea_activa = $derived(intrebari[idx_intrebare_activa]);

    let timp = event.select('timp');

    let secunde = $derived(Math.max(0, parseInt($timp ?? 0)%60));
    let minute = $derived(Math.max(0, Math.floor(parseInt($timp ?? 0)/60)));

    /** 
     * @param {string} text
     * @return {string}
     */
    function pad_left(text) {
        if (text.length < 2) return '0'+text;
        return text;
    }
</script>
<div class="bg-[url(/baza-90.jpg)] bg-cover text-yellow-900">
    <div class="fixed w-full font-bold flex flex-row justify-between text-5xl bg-amber-100/80 ">
        <div
            class="flex w-full flex-row px-15 py-10"
            class:bg-orange-300={$apasat === '1'}
        >
            <div>{echipa1.denumirea}</div>
            <div class="pl-12">
                {$echipa1_puncte ? $echipa1_puncte : echipa1.puncte}
            </div>
        </div>

        <div
            class="w-[600px] text-center text-stone-400"
        >
            <div class="relative py-10">
                <span>{pad_left(minute.toString())}:{pad_left(secunde.toString())}</span>


                <div class="absolute w-full bottom-[-1rem]">

                    <span class="font-bold mx-auto text-emerald-500 w-fit text-center text-3xl bg-emerald-50 py-1 px-2 rounded-xl border-2 border-emerald-100">+{intrebarea_activa.puncte}pt</span>
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

    <div class="w-full h-[100vh] flex flex-col justify-center text-center text-6xl font-mono font-bold">
        <div class="relative">

            {#if intrebarea_activa.tip === 'emoji' || intrebarea_activa.tip === 'text' }
                <span 
                    class:text-9xl={intrebarea_activa.tip === 'emoji'}
                >{intrebarea_activa.titlu}</span>
            {:else if intrebarea_activa.tip === 'imagine'}
                <div class="flex flex-row justify-center gap-10 items-center">
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
                class="w-[1200px] m-auto py-[2.5vh] text-center text-4xl font-bold"
            >
                Raspuns {$raspuns}
                {#if $raspuns === "corect"}
                    : {intrebarea_activa.raspuns}
                {/if}
            </div>
        </div>
    {/if}

</div>

<style>
</style>
