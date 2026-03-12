import { x, echipe, intrebari } from "$lib/db.js";
// import { success } from "zod/v4";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return { nr_intrebare: x.nr_intrebare, echipe, intrebari };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
    gresit: async ({}) => {
        if (!x.asteapta || x.echipa_activa !== 0) {
            x.event_type = "gresit";
            x.timp = 0
            x.asteapta = true
            x.emitter.dispatchEvent(new Event("control"))
            return { success: true };
        }
        return { success: false, message: "niĉi o echipă activă"}
    },
    corect: async ({}) => {
        if (!x.asteapta || x.echipa_activa !== 0) {
            echipe[x.echipa_activa-1].puncte += intrebari[x.nr_intrebare].puncte
            x.timp = 0
            x.event_type = "corect";
            x.emitter.dispatchEvent(new Event("control"));
            return { success: true };
        }
        return { success: false, message: "niĉi o echipă activă"}
    },
    "reseteaza-joc": async ({}) => {
        x.echipa_activa = 0
        x.asteapta = true
        x.nr_intrebare = 0
        echipe[0].puncte = 0
        echipe[1].puncte = 0
        x.timp = 0
        x.event_type = "reseteaza-joc";
        x.emitter.dispatchEvent(new Event("control"))
        return { success: true };
    },
    "reseteaza-respondent": async ({}) => {
        x.echipa_activa = 0
        x.asteapta = true
        x.timp = 0
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
    },
    echipa1: async () => { 
        x.echipa_activa = 1
        x.timp = 10
        x.asteapta = false
        x.event_type = `apasat-${x.echipa_activa}`;
        x.emitter.dispatchEvent(new Event("control"));
        return { success: true };
    },
    echipa2: async () => { 
        x.echipa_activa = 2
        x.timp = 10
        x.asteapta = false
        x.event_type = `apasat-${x.echipa_activa}`;
        x.emitter.dispatchEvent(new Event("control"));
        return { success: true };
    },
}
