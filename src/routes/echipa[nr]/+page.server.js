import { x, echipe } from "$lib/db.js";

/** @type {import('../echipa/$types').PageServerLoad} */
export async function load(event) {
    return { echipa: echipe[parseInt(event.params.nr)-1] };
}

/** @satisfies {import('../echipa/$types').Actions} */
export const actions = {
    default: async (event) => { 
        console.log("form POST: " ,event.params)
        if (x.echipa_activa === 0) {
            x.echipa_activa = event.params.nr
            x.event_type = `apasat-${x.echipa_activa}`;
            x.emitter.dispatchEvent(new Event("control"));
        }
        return { success: true };
    },
}

