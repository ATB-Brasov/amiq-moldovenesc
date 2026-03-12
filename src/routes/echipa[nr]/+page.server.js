import { x, echipe } from "$lib/db.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    return { echipa: echipe[parseInt(params.nr)-1] };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
    default: async ({ params }) => { 
        // console.log("form POST: " , params)
        if (x.asteapta) {
            const nr = parseInt(params.nr);
            if (x.echipa_activa != nr) {
                x.echipa_activa = nr
                x.timp = 10
                x.asteapta = false;
                x.event_type = `apasat-${x.echipa_activa}`;
                x.emitter.dispatchEvent(new Event("control"));
            }
        }
        return { success: true };
    },
}

