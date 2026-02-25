import { x, echipe, intrebari } from "$lib/db.js";
// import { success } from "zod/v4";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return { nr_intrebare: x.nr_intrebare, echipe, intrebari };
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
            echipe[x.echipa_activa-1].puncte += intrebari[x.nr_intrebare].puncte
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
        x.event_type = "nr_intrebare";
        x.nr_intrebare = (intrebari.length+x.nr_intrebare)%intrebari.length;
        x.emitter.dispatchEvent(new Event("control"))
        return { success: true };
    },
    increment: async ({}) => {
        x.echipa_activa = 0
        x.event_type = "nr_intrebare";
        x.nr_intrebare = (x.nr_intrebare+1)%intrebari.length;
        x.emitter.dispatchEvent(new Event("control"))
        return { success: true };
    }
}
