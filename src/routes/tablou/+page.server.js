import { ekipe, x, probe } from '$lib/db.js'

/** @type {import('./$types').PageServerLoad} */
export function load({ }) {
    return { 
        ekipa1: ekipe[0],
        ekipa2: ekipe[1],
        ekipa_activa: x.joc.ekipa,
        nr_proba: x.joc.proba,
        probe,
    };
}
