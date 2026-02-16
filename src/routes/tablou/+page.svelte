<script>

import { source } from 'sveltekit-sse'

/** @type {{ data: import('./$types').PageData }} */
let { data } = $props();

const echipa1 = data.echipe[0]
const echipa2 = data.echipe[1]


const intrebari = data.intrebari

const event = source('/eveniment')
const nr_intrebare = event.select('counter')
const raspuns = event.select("raspuns")
const apasat = event.select("apasat")
const echipa1_puncte = event.select("puncte1")
const echipa2_puncte = event.select("puncte2")
console.log(event)


let raspunde_echipa1 = $derived($apasat === "1")

</script>


<div class="flex flex-row justify-between text-4xl">


    <div 
        class="px-10 py-6 w-full flex flex-row" 
        class:text-stone-400={$apasat !== "1"} 
        class:bg-stone-100={$apasat !== "1"} 
        class:bg-emerald-300={$apasat === "1"}
    >
        <div>{echipa1.denumirea}</div>
        <div class="pl-12">{$echipa1_puncte ?? 0}</div>
    </div>

    <div 
        class="px-10 py-6 w-full flex flex-row justify-end" 
        class:text-stone-400={$apasat !== "2"} 
        class:bg-stone-100={$apasat !== "2"} 
        class:bg-emerald-300={$apasat === "2"}>
        <div class="pr-12">{$echipa2_puncte ?? 0}</div>
        <div>{echipa2.denumirea}</div>
    </div>

</div>

{#if false}
<div>


    Răspunde: 

    {#if $apasat === "1"}
        {echipa1.denumirea}
    {:else if $apasat === "2"}
        {echipa2.denumirea}
    {:else}
        Nimeni
    {/if}

</div>

{/if}

<div class="text-6xl pt-[20vh] text-center w-full">
    {intrebari[($nr_intrebare??0)%intrebari.length].titlu}
</div>


{#if $raspuns !== ""}
<div>
    Raspuns: {$raspuns}
</div>
{/if}


