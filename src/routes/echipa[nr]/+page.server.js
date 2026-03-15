import { x, echipe } from "$lib/db.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    return { echipa: echipe[parseInt(params.nr)-1] };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
    default: async ({ params }) => { 
        // console.log("form POST: " , params)
        if (x.joc.așteptare) {
            const nr = parseInt(params.nr);
            if (nr !== 1 && nr !== 2) {
                return { success: false }
            }
            if (x.joc.ekipa != nr) {
                x.skimbă_ekipa(x.joc, nr)
                x.event_type = `apasat-${nr}`;
                x.emitter.dispatchEvent(new Event("control"));
            }
        }
        return { success: true };
    },
}

