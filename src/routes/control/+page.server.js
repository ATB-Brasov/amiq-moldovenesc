import { fail } from '@sveltejs/kit';
import { x, ekipe, probe, skimba_ekipa, anunta_evt } from '$lib/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {
        nr_proba: x.joc.proba,
        ekipa_activa: x.joc.ekipa,
        ekipe,
        probe,
    };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
    'arata-raspuns': async () => anunta_evt(['raspuns', 'arata-raspuns']),

    gresit: async () => {
        const proba = probe[x.joc.proba];
        if (
            proba.ekipa === undefined &&
            (!x.joc.așteptare || x.joc.ekipa !== 0)
        ) {
            x.joc.timp = 0;
            x.joc.așteptare = true;
            anunta_evt(['raspuns', 'gresit']);
            return;
        }
        return fail(400, { msg: 'niĉi o ekipă activă' });
    },

    corect: async () => {
        const proba = probe[x.joc.proba];
        if (
            proba.ekipa === undefined &&
            (!x.joc.așteptare || x.joc.ekipa !== 0)
        ) {
            x.joc.timp = 0;
            const ekipa = ekipe[x.joc.ekipa - 1];
            ekipa.puncte += probe[x.joc.proba].puncte;
            proba.ekipa = x.joc.ekipa;
            anunta_evt(['raspuns', 'corect']);
            return;
        }
        return fail(400, { msg: 'niĉi o ekipă activă' });
    },

    'reseteaza-joc': async () => {
        x.resetează_joc(x.joc);
        ekipe.forEach((ekipa) => (ekipa.puncte = 0));
        probe.forEach((proba) => (proba.ekipa = undefined));
        anunta_toate_evte()
    },

    'reseteaza-respondent': async () => {
        x.resetează_ekipa(x.joc);
        anunta_evt(['apasat', '0'], ['raspuns', '']);
    },

    decrement: async () => {
        x.skimbă_proba(x.joc, 'anterioară');
        anunta_toate_evte()
    },

    increment: async () => {
        x.skimbă_proba(x.joc);
        anunta_toate_evte()
    },

    intrebarea: async ({ request }) => {
        const data = await request.formData();
        const nr_proba = data.get('intrebarea');
        if (nr_proba === null) return fail(400);
        x.skimbă_proba(x.joc, 'fix', parseInt(nr_proba.toString()));
        anunta_toate_evte()
    },

    'decr-ekipa1': async () => {
        ekipe[0].puncte = Math.max(ekipe[0].puncte - 10, 0);
    },

    'decr-ekipa2': async () => {
        ekipe[1].puncte = Math.max(ekipe[1].puncte - 10, 0);
    },
    'incr-ekipa1': async () => (ekipe[0].puncte += 10),
    'incr-ekipa2': async () => (ekipe[1].puncte += 10),
    'start-timp': async () => { x.joc.timp = probe[x.joc.proba].timp;
        anunta_evt(['timp', '']) },
    'decr-timp-5': async () => (probe[x.joc.proba].timp -= 5),
    'incr-timp-5': async () => (probe[x.joc.proba].timp += 5),
    'decr-timp-10': async () => (probe[x.joc.proba].timp -= 10),
    'incr-timp-10': async () => (probe[x.joc.proba].timp += 10),
    ekipa1: async () => skimba_ekipa(1),
    ekipa2: async () => skimba_ekipa(2),
    inc10: async () => inc_puncte(10),
    dec10: async () => inc_puncte(-10),
};

function anunta_toate_evte() {
    anunta_evt(
        ['raspuns', ''],
        ['apasat', '0'],
        ['nr_proba', x.joc.proba],
        ['puncte', probe[x.joc.proba].puncte],
    );
}

function inc_puncte(/**@type{number}*/ cant) {
    probe[x.joc.proba].puncte += cant;
    anunta_evt(['puncte', probe[x.joc.proba].puncte]);
}
