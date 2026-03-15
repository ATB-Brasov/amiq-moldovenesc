import { x, echipe, intrebari } from '$lib/db.js';
// import { success } from "zod/v4";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {
        nr_intrebare: x.joc.întrebarea,
        echipe,
        intrebari,
        echipa_activa: x.joc.ekipa,
    };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
    gresit: async ({}) => {
        const intrebarea = intrebari[x.joc.întrebarea];
        if (intrebarea.echipa === undefined && (!x.joc.așteptare || x.joc.ekipa !== 0)) {

            x.joc.timp      = 0;
            x.joc.așteptare = true;

            x.event_type = 'gresit';
            x.emitter.dispatchEvent(new Event('control'));
            return { success: true };
        }
        return { success: false, message: 'niĉi o echipă activă' };
    },
    corect: async ({}) => {
        const intrebarea = intrebari[x.joc.întrebarea];
        if (intrebarea.echipa === undefined && (!x.joc.așteptare || x.joc.ekipa !== 0)) {
            x.joc.timp = 0;

            echipe[x.joc.ekipa - 1].puncte +=
                intrebari[x.joc.întrebarea].puncte;
            intrebarea.echipa = x.joc.ekipa;

            x.event_type = 'corect';
            x.emitter.dispatchEvent(new Event('control'));
            return { success: true };
        }
        return { success: false, message: 'niĉi o echipă activă' };
    },
    'reseteaza-joc': async ({}) => {
        x.resetează_ekipa(x.joc)

        echipe[0].puncte = 0;
        echipe[1].puncte = 0;
        for (let intrebare of intrebari) {
            intrebare.echipa = undefined;
        }
        x.event_type = 'reseteaza-joc';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },
    'reseteaza-respondent': async ({}) => {
        x.resetează_ekipa(x.joc)
        x.event_type = 'reseteaza-respondent';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },
    decrement: async ({}) => {
        x.skimbă_întrebarea(x.joc, "anterioară")

        x.event_type = 'nr_intrebare';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },
    increment: async ({}) => {
        x.skimbă_întrebarea(x.joc)

        x.event_type = 'nr_intrebare';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },
    'incr-echipa1': async ({}) => {
        echipe[0].puncte += intrebari[x.joc.întrebarea].puncte;
        x.event_type = 'corect';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },
    'decr-echipa1': async ({}) => {
        echipe[0].puncte = Math.max(
            echipe[0].puncte - intrebari[x.joc.întrebarea].puncte,
            0,
        );
        x.event_type = 'corect';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },
    'incr-echipa2': async ({}) => {
        echipe[1].puncte += intrebari[x.joc.întrebarea].puncte;
        x.event_type = 'corect';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },
    'decr-echipa2': async ({}) => {
        echipe[1].puncte = Math.max(
            echipe[1].puncte - intrebari[x.joc.întrebarea].puncte,
            0,
        );
        x.event_type = 'corect';
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },
    echipa1: async () => {
        x.skimbă_ekipa(x.joc, 1)

        x.event_type = `apasat-${x.joc.ekipa}`;
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },
    echipa2: async () => {
        x.skimbă_ekipa(x.joc, 2)
        x.event_type = `apasat-${x.joc.ekipa}`;
        x.emitter.dispatchEvent(new Event('control'));
        return { success: true };
    },
};
