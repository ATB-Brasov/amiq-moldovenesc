import { x, echipe, intrebari } from "$lib/db.js";
import { success } from "zod/v4";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return { counter: x.counter, echipe, intrebari };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
    gresit: async ({}) => {
        if (x.echipa_activa !== 0) {
            x.event_type = "gresit";
            x.emitter.dispatchEvent(new Event("control"))
            return { success: true };
        }
        return { success: false, message: "niĉi o echipă activă"}
    },
    corect: async ({}) => {
        if (x.echipa_activa !== 0) {
            x.event_type = "corect";
            x.emitter.dispatchEvent(new Event("control"));
            return { success: true };
        }
        return { success: false, message: "niĉi o echipă activă"}
    },
    "reseteaza-respondent": async ({}) => {
        x.echipa_activa = 0
        x.event_type = "reseteaza-respondent";
        x.emitter.dispatchEvent(new Event("control"))
        return { success: true };
    },
    decrement: async ({}) => {
        x.echipa_activa = 0
        x.event_type = "contor";
        x.counter = (intrebari.length+x.counter-1)%intrebari.length;
        x.emitter.dispatchEvent(new Event("control"))
        return { success: true };
    },
    increment: async ({}) => {
        x.echipa_activa = 0
        x.event_type = "contor";
        x.counter = (x.counter+1)%intrebari.length;
        x.emitter.dispatchEvent(new Event("control"))
        return { success: true };
    }
}
