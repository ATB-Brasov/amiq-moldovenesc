import { echipe, x } from '$lib/db.js'

/** @type {import('./$types').PageServerLoad} */
export function load({ }) {
    return { 
        echipa1: echipe[0],
        echipa2: echipe[1],
        echipa_activa: x.echipa_activa,
        nr_intrebare: x.nr_intrebare,
    };
}
