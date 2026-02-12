<script>

import { source } from 'sveltekit-sse'
const event = source('/eveniment')

console.log(event)

const counter = event.select('counter')

/** @type {{ data: import('./$types').PageData }} */
// let { data } = $props();

</script>

<h1>Tablou</h1>

Contor: { $counter }
