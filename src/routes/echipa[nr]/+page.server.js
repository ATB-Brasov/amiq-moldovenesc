import { x, echipe } from "$lib/db.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    return { echipa: echipe[parseInt(params.nr)-1] };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
    default: async ({ params }) => { 
        // console.log("form POST: " , params)
        if (x.echipa_activa === 0) {
            x.echipa_activa = parseInt(params.nr);
            x.event_type = `apasat-${x.echipa_activa}`;
            x.emitter.dispatchEvent(new Event("control"));
        }
        return { success: true };
    },
}

