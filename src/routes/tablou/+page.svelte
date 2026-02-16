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


</script>

<div class="w-[300px] mx-auto mt-10 p-1 bg-stone-50 border rounded shadow">

    <h1 class="bg-yellow-100/50 rounded p-1 border border-yellow-300">Tablou</h1>

    <div class="p-1">
    <p>
    Echipa {echipa1.denumirea} : {$echipa1_puncte ?? 0}
    </p>

    <p>
    Echipa {echipa2.denumirea} : {$echipa2_puncte ?? 0}
    </p>

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

    <p>
        Întrebare: {intrebari[($nr_intrebare??0)%intrebari.length].titlu}
    </p>

    <div>
    Raspuns: {$raspuns}
    </div>

    </div>
</div>
