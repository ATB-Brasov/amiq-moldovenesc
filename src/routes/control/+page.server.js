import { fail } from '@sveltejs/kit';
import { x, ekipe, probe } from '$lib/db.js';
// import { success } from "zod/v4";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {
        nr_intrebare: x.joc.proba,
        ekipa_activa: x.joc.ekipa,
        ekipe,
        probe,
    };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
    "arata-raspuns": async () => {
        x.event_type = 'arata-raspuns';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },

    gresit: async () => {
        const intrebarea = probe[x.joc.proba];
        if (intrebarea.ekipa === undefined && (!x.joc.așteptare || x.joc.ekipa !== 0)) {

            x.joc.timp      = 0;
            x.joc.așteptare = true;

            x.event_type = 'gresit';
            x.emitter.dispatchEvent(new Event('control'));
            return { success: true };
        }
        return { success: false, message: 'niĉi o ekipă activă' };
    },

    corect: async () => {
        const intrebarea = probe[x.joc.proba];
        if (intrebarea.ekipa === undefined && (!x.joc.așteptare || x.joc.ekipa !== 0)) {
            x.joc.timp = 0;

            ekipe[x.joc.ekipa - 1].puncte +=
                probe[x.joc.proba].puncte;
            intrebarea.ekipa = x.joc.ekipa;

            x.event_type = 'corect';
            x.emitter.dispatchEvent(new Event('control'));
            return { success: true };
        }
        return { success: false, message: 'niĉi o ekipă activă' };
    },

    'reseteaza-joc': async () => {
        x.resetează_joc(x.joc)

        ekipe[0].puncte = 0;
        ekipe[1].puncte = 0;
        for (let intrebare of probe) {
            intrebare.ekipa = undefined;
        }
        x.event_type = 'reseteaza-joc';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },

    'reseteaza-respondent': async () => {
        x.resetează_ekipa(x.joc)
        x.event_type = 'reseteaza-respondent';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },

    decrement: async () => {
        x.skimbă_proba(x.joc, "anterioară")

        x.event_type = 'nr_intrebare';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },

    increment: async () => {
        x.skimbă_proba(x.joc)

        x.event_type = 'nr_intrebare';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },

    'incr-ekipa1': async () => {
        ekipe[0].puncte += 10;
        return { success: true };
    },

    'decr-ekipa1': async () => {
        ekipe[0].puncte = Math.max(ekipe[0].puncte - 10, 0);
        return { success: true };
    },

    'incr-ekipa2': async () => {
        ekipe[1].puncte += 10;
        return { success: true };
    },

    'decr-ekipa2': async () => {
        ekipe[1].puncte = Math.max(ekipe[1].puncte - 10, 0);
        return { success: true };
    },

    ekipa1: async () => {
        x.skimbă_ekipa(x.joc, 1)

        x.event_type = `apasat-${x.joc.ekipa}`;
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },

    ekipa2: async () => {
        x.skimbă_ekipa(x.joc, 2)
        x.event_type = `apasat-${x.joc.ekipa}`;
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },

    'scena-intro': async () => { 
        x.scena = "introducere"
        x.event_type = 'scena';
        x.emitter.dispatchEvent(new Event("control"));
        return { success: true };
    },

    'scena-joc': async () => { 
        x.scena = "joc"
        x.event_type = 'scena';
        x.emitter.dispatchEvent(new Event("control"));
        return { success: true };
    },

    'scena-tranzitie': async () => { 
        x.scena = "tranzitie"
        x.event_type = 'scena';
        x.emitter.dispatchEvent(new Event("control"));
        return { success: true };
    },

    'intrebarea': async ({request}) => { 
        const data = await request.formData()
        const nr_intrebare = data.get("intrebarea")
        if (nr_intrebare === null){
            return fail(400)
        }
        console.log("Radio::nr_intrebare =", nr_intrebare)

        x.skimbă_proba(x.joc, "fix", parseInt(nr_intrebare.toString()))

        x.event_type = 'nr_intrebare';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },

    "inc10": async () => {
        probe[x.joc.proba].puncte += 10;
        x.event_type = 'puncte';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },

    "dec10": async () => {
        probe[x.joc.proba].puncte -= 10;
        x.event_type = 'puncte';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },
 }
