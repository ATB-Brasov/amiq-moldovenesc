import { fail } from '@sveltejs/kit';
import { x, ekipe, skimba_ekipa } from "$lib/db.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    return { ekipa: ekipe[parseInt(params.nr)-1] };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
    default: async ({ params }) => { 
        if (!x.joc.așteptare) return { success: true };
        const nr = parseInt(params.nr);
        if (nr !== 1 && nr !== 2) return fail(400)
        if (x.joc.ekipa != nr) skimba_ekipa(nr)
    },
}
