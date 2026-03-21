import { x } from '$lib/db.js';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
    return {
        nr_proba: x.joc.proba,
    };
}
