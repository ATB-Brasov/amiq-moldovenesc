import { fail } from '@sveltejs/kit';
import { x, ekipe, probe } from '$lib/db.js';

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
    "arata-raspuns": async () => anunta_evt('arata-raspuns'),

    gresit: async () => {
        const proba = probe[x.joc.proba];
        if (proba.ekipa === undefined && (!x.joc.așteptare || x.joc.ekipa !== 0)) {
            x.joc.timp      = 0;
            x.joc.așteptare = true;
            anunta_evt('gresit')
            return;
        }
        return fail(400, { msg: 'niĉi o ekipă activă' });
    },

    corect: async () => {
        const proba = probe[x.joc.proba];
        if (proba.ekipa === undefined && (!x.joc.așteptare || x.joc.ekipa !== 0)) {
            x.joc.timp = 0;
            const ekipa = ekipe[x.joc.ekipa - 1]
            ekipa.puncte += probe[x.joc.proba].puncte;
            proba.ekipa = x.joc.ekipa;
            anunta_evt('corect')
            return;
        }
        return fail(400, { msg: 'niĉi o ekipă activă' });
    },

    'reseteaza-joc': async () => {
        x.resetează_joc(x.joc)
        ekipe.forEach(ekipa => ekipa.puncte = 0)
        probe.forEach(proba => proba.ekipa = undefined);
        anunta_evt('reseteaza-joc')
    },

    'reseteaza-respondent': async () => {
        x.resetează_ekipa(x.joc)
        anunta_evt('reseteaza-respondent')
    },

    decrement: async () => {
        x.skimbă_proba(x.joc, "anterioară")
        anunta_evt("nr_intrebare")
    },

    increment: async () => {
        x.skimbă_proba(x.joc)
        anunta_evt("nr_intrebare")
    },

    'intrebarea': async ({request}) => { 
        const data = await request.formData()
        const nr_intrebare = data.get("intrebarea")
        if (nr_intrebare === null) return fail(400)
        x.skimbă_proba(x.joc, "fix", parseInt(nr_intrebare.toString()))
        anunta_evt("nr_intrebare")
    },

    'decr-ekipa1': async () => {
        ekipe[0].puncte = Math.max(ekipe[0].puncte - 10, 0);
    },

    'decr-ekipa2': async () => {
        ekipe[1].puncte = Math.max(ekipe[1].puncte - 10, 0);
    },
    'incr-ekipa1': async () => ekipe[0].puncte += 10,
    'incr-ekipa2': async () => ekipe[1].puncte += 10,
    ekipa1: async () => skimba_ekipa(1),
    ekipa2: async () => skimba_ekipa(2),
    "inc10": async () => inc_puncte( 10),
    "dec10": async () => inc_puncte(-10),
 }

function inc_puncte(/**@type{number}*/ cant) {
    probe[x.joc.proba].puncte += cant;
    anunta_evt("puncte")
}

function skimba_ekipa(/**@type{1|2}*/ nr) {
    x.skimbă_ekipa(x.joc, nr)
    anunta_evt("apasat", nr.toString())
}

/**
 * @param {string} tip
 * @param {string} [data]
 */
function anunta_evt(tip, data) {
    x.event_type = tip;
    x.event_data = data ?? null;
    x.emitter.dispatchEvent(new Event('control'));
}

