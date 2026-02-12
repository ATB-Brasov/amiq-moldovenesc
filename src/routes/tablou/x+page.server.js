import { redirect, fail } from '@sveltejs/kit';

import { x } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    // const query = db.query("select 'Hello World' as counter;");
    // return query.get();
    return x;
}
