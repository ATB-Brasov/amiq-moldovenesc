<script>

import { source } from 'sveltekit-sse'
const event = source('/eveniment')

console.log(event)

let echipa1 = {
    puncte: 0,
    denumirea: "BeRe"
}

let echipa2 = {
    puncte: 0,
    denumirea: "MeRe"
}

const intrebari = [
    { titlu: "Ĉine-i krasavĉik?", raspuns: "Vițăpredsedatel' Coordonator EduTI"},
    { titlu: "Ĉine e Costea?", raspuns: "Un om mare!"}
]

const nr_intrebare = event.select('counter')
const corect = event.select("raspuns")

/** @type {{ data: import('./$types').PageData }} */
// let { data } = $props();
console.log(corect)

</script>

<h1>Tablou</h1>

<p>
Echipa {echipa1.denumirea} : {echipa1.puncte}
</p>

<p>
Echipa {echipa2.denumirea} : {echipa2.puncte}
</p>

<p>
    Întrebare: {intrebari[($nr_intrebare??0)%intrebari.length].titlu}
</p>

<div>
Raspuns: {$corect}
</div>
