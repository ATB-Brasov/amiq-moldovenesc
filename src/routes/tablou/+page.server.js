import { echipe, x } from '$lib/db.js'

/** @type {import('./$types').PageServerLoad} */
export function load({ }) {
    return { 
        echipa1: echipe[0],
        echipa2: echipe[1],
        echipa_activa: x.joc.ekipa,
        nr_intrebare: x.joc.întrebarea,
    };
}
