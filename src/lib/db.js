/**
 * @typedef {Object} StareJoc
 * @property {number}  proba
 * @property {number}  ekipa
 * @property {boolean} așteptare
 * @property {number}  timp
 */

/** @returns {StareJoc} */
function joc_nou() {
    return {
        proba: 0,
        ekipa: 0,
        timp: 0,
        așteptare: true,
    };
}

/** @param {StareJoc} joc */
function resetează_ekipa(joc) {
    joc.ekipa = 0;
    joc.așteptare = true;
    joc.timp = 0;
}

/** @param {StareJoc} joc */
function resetează_joc(joc) {
    resetează_ekipa(joc);
    joc.proba = 0;
    probe = probe2();
}

/**
 * @param {StareJoc} joc
 * @param {1|2} nr_ekipa
 * */
function skimbă_ekipa(joc, nr_ekipa) {
    joc.ekipa = nr_ekipa;
    joc.timp = probe[x.joc.proba].timp;
    joc.așteptare = false;
}

/**
 * @param {StareJoc} joc
 * @param {'următoare'|'anterioară'|'fix'} directie
 * @param {number} numar
 */
function skimbă_proba(joc, directie = 'următoare', numar = -1) {
    joc.ekipa = 0;
    joc.timp = 0;
    joc.așteptare = true;
    if (directie === 'următoare') {
        joc.proba = (joc.proba + 1) % probe.length;
    } else if (directie === 'anterioară') {
        joc.proba =
            (probe.length + joc.proba - 1) % probe.length;
    } else {
        if (numar <= -1)
            throw new Error('Numărul întrebării nu poate fi negativ');
        if (numar >= probe.length)
            throw new Error(
                'Numărul întrebării nu mai mare ca cantitatea întrebărilor',
            );
        joc.proba = numar;
    }
}

export const x = {
    scena: 'introducere',
    joc: joc_nou(),

    resetează_ekipa,
    resetează_joc,
    skimbă_proba,
    skimbă_ekipa,

    /**@type{[string,any][]}*/ evente: [],

    emitter: new EventTarget(),
    cronometrul: setInterval(() => {
        let timp_nou = x.joc.timp - 1;
        if (timp_nou < 0) return;
        x.joc.timp = timp_nou;
        x.evente.push(['timp', timp_nou])
        x.emitter.dispatchEvent(new Event('control'));
    }, 1000),
};

export const ekipe = [
    { puncte: 0, denumirea: 'BeRe' },
    { puncte: 0, denumirea: 'MeRe' },
];

/** @typedef {'text' | 'imagine' | 'emoji' | 'da-nu' | 'cîntec' | 'tranziție'} TipProba */

/**
 * @typedef {Object} Proba
 * @property {TipProba} tip - Tipul întrebării
 *
 * @property {string} titlu - proba propriu zisă
 * @property {string} raspuns - Răspunsul întrebării
 * @property {number} puncte - Punctele atribuite la răspuns corect
 * @property {number} timp - Timpul pentru a da răspuns
 *
 * @property {string} [html] - Html pentru a include imaginile
 * @property {string} [audio] - Audio pentru întrebare tip cîntec
 * @property {number} [ekipa] - Echipa care a răspuns
 */

/** @type {() => Proba[]} */
const probe2 = () => [
    {
        tip: 'tranziție',
        titlu: '',
        raspuns: 'Ghiciți proverbul din emoji',
        puncte: 0,
        timp: 0,
        html: '',
    },
    {
        tip: 'imagine',
        html: '<img src="/img/1f43a.png" class="emoji emoji-small w-40 h-40" alt="🐺"><img src="/img/1f487-1f3fc-200d-2640-fe0f.png" class="emoji emoji-small w-40 h-40" alt="💇🏼‍♀️"><img src="/img/274c.png" class="emoji emoji-small w-40 h-40" alt="❌">',
        raspuns: 'Lupul își schimbă părul, dar năravul ba.',
        puncte: 10,
        timp: 30,
        titlu: '🐺💇🏼‍♀️❌',
    },
    {
        tip: 'imagine',
        html: '<img src="/img/1f436.png" class="emoji emoji-small w-40 h-40" alt="🐶"><img src="/img/274c.png" class="emoji emoji-small w-40 h-40" alt="❌"><img src="/img/1fae6.png" class="emoji emoji-small w-40 h-40" alt="🫦">',
        raspuns: 'Câinele care latră nu mușcă.',
        puncte: 10,
        timp: 30,
        titlu: '🐶❌🫦',
    },
    {
        tip: 'imagine',
        html: '<img src="/img/1f30a.png" class="emoji emoji-small w-40 h-40" alt="🌊"><img src="/img/27a1.png" class="emoji emoji-small w-40 h-40" alt="➡️"><img src="/img/1faa8.png" class="emoji emoji-small w-40 h-40" alt="🪨">',
        raspuns: 'Apa trece, pietrele rămân.',
        puncte: 10,
        timp: 30,
        titlu: '🌊➡️🪨',
    },
    {
        tip: 'imagine',
        html: '<img src="/img/1f426-200d-2b1b.png" class="emoji emoji-small w-40 h-40" alt="🐦‍⬛"><img src="/img/1f445.png" class="emoji emoji-small w-40 h-40" alt="👅"><img src="/img/2620.png" class="emoji emoji-small w-40 h-40" alt="☠️">',
        raspuns: 'Pasărea pe limba ei piere.',
        puncte: 10,
        timp: 30,
        titlu: '🐦‍⬛👅☠️',
    },
    {
        tip: 'imagine',
        html: '<img src="/img/1f4b5.png" class="emoji emoji-small w-40 h-40" alt="💵"><img src="/img/274c.png" class="emoji emoji-small w-40 h-40" alt="❌"><img src="/img/1f389.png" class="emoji emoji-small w-40 h-40" alt="🎉">',
        raspuns: 'Banii nu aduc fericirea.',
        puncte: 10,
        timp: 30,
        titlu: '💵❌🎉',
    },
    {
        tip: 'imagine',
        html: '<img src="/img/2139.png" class="emoji emoji-small w-40 h-40" alt="ℹ️"><img src="/img/1f4d6.png" class="emoji emoji-small w-40 h-40" alt="📖"><img src="/img/2139.png" class="emoji emoji-small w-40 h-40" alt="ℹ️"><img src="/img/1f370.png" class="emoji emoji-small w-40 h-40" alt="🍰">',
        raspuns: 'Ai carte ai parte.',
        puncte: 10,
        timp: 30,
        titlu: 'ℹ️📖ℹ️🍰',
    },
    {
        tip: 'imagine',
        html: '<img src="/img/1f413.png" class="emoji emoji-small w-40 h-40" alt="🐓"><img src="/img/1f475-1f3fb.png" class="emoji emoji-small w-40 h-40" alt="👵🏻"><img src="/img/1f372.png" class="emoji emoji-small w-40 h-40" alt="🍲">',
        raspuns: 'Găina bătrână face zeamă bună.',
        puncte: 10,
        timp: 30,
        titlu: '🐓👵🏻🍲',
    },
    {
        tip: 'imagine',
        html: '<img src="/img/1f464.png" class="emoji emoji-small w-40 h-40" alt="👤"><img src="/img/2744.png" class="emoji emoji-small w-40 h-40" alt="❄️"><img src="/img/1f6f7.png" class="emoji emoji-small w-40 h-40" alt="🛷"><img src="/img/2600.png" class="emoji emoji-small w-40 h-40" alt="☀️"><img src="/img/1f40e.png" class="emoji emoji-small w-40 h-40" alt="🐎">',
        raspuns: 'Omul gospodar își face vara sanie și iarna car.',
        puncte: 10,
        timp: 30,
        titlu: '👤❄️🛷☀️🐎',
    },
    {
        tip: 'tranziție',
        titlu: '',
        raspuns: 'Ce? Unde? Cînd?',
        puncte: 0,
        timp: 0,
        html: '',
    },
    {
        tip: 'text',
        titlu: 'Valentin Guțan este cel mai longeviv primar din Republica Moldova, fiind la al nouălea mandat. Pentru prima data, a fost ales pe când avea 27 de ani, în 1987. Sunt mai multe versiuni despre originea numelui localității conduse de acesta. De exemplu, că numele ar veni de la crengile care erau puse peste râușorul din localitate, sau de la strigătele ciobanilor, sau de la un localnic de demult.',
        raspuns:
            'Cricova (Denumirea ar veni de la «cracă», «krik» (strigăt în slavonă) sau un vechi stăpân al satului pe nume Cricovan).',
        puncte: 20,
        timp: 30,
        html: '',
    },
    {
        tip: 'text',
        titlu: 'În chip profetic, ACEST serial a avut sloganul: «Istoria următorului președinte». Serialul a fost difuzat la televiziuni în Estonia, Rusia, Republica Moldova, Ucraina și Kazahstan, iar compania producătoare l-a încărcat gratuit pe internet.',
        raspuns:
            'Volodimir Zelenskii (Serialul este «Slujitorul poporului». În serial, Youtube-ul îl transformă pe un profesor obișnuit de istorie în președintele Ucrainei, iar ulterior Zelenskii, actorul, a ajuns președintele țării).',
        puncte: 20,
        timp: 30,
        html: '',
    },
    {
        tip: 'text',
        titlu: 'În una din versiunile neoficiale ale simbolului care ar desemna această mișcare alternativă, ciocanul e înlocuit cu o cruce.',
        raspuns: 'Comunism creștin',
        puncte: 40,
        timp: 60,
        html: '',
    },
    {
        tip: 'text',
        titlu: 'La alegerile din 2015 din Găgăuzia, pentru prima data guvernator al autonomiei a devenit o femeie, Irina Vlah. Acest fapt nu a rămas neobservat și de unele publicații străine. Astfel, jurnaliștii unei reviste au poreclit-o pe câștigătoare cu pseudonimul unei cântărețe celebre la care au adăugat 4 litere.',
        raspuns: 'Lady Găgăuzia',
        puncte: 40,
        timp: 60,
        html: '',
    },
    {
        tip: 'tranziție',
        titlu: '',
        raspuns: 'Continuă Melodia',
        puncte: 0,
        timp: 0,
        html: '',
    },
    { tip: 'cîntec', titlu: 'Simplu 1', raspuns: 'Dragstea din tei', puncte: 10, timp: 0, audio: '/audio/proba/us_1_dragstea_din_tei.mp3' },
    { tip: 'cîntec', titlu: 'Mediu 1', raspuns: 'Când aveam vreo 16 ani', puncte: 20, timp: 0, audio: '/audio/proba/md_1_cand_aveam_vreo_16_ani.mp3' },
    { tip: 'cîntec', titlu: 'Complicat 1', raspuns: 'Codrii mei bătrâni', puncte: 30, timp: 0, audio: '/audio/proba/gr_1_codrii_mei_batrani.mp3' },
    { tip: 'cîntec', titlu: 'Foarte Greu 1', raspuns: 'Sărut femeie mâna ta', puncte: 40, timp: 0, audio: '/audio/proba/fg_1_sarut_femeie_mana_ta.mp3' },
    { tip: 'cîntec', titlu: 'Simplu 2', raspuns: 'Dă-mă mama după Iura', puncte: 10, timp: 0, audio: '/audio/proba/us_2_da-ma_mama_dupa_iura.mp3' },
    { tip: 'cîntec', titlu: 'Mediu 2', raspuns: 'Zică lumea ce n-ar zice', puncte: 20, timp: 0, audio: '/audio/proba/md_2_zica_lumea_ce_n-ar_zice.mp3' },
    { tip: 'cîntec', titlu: 'Complicat 2', raspuns: 'Flori de liliac', puncte: 30, timp: 0, audio: '/audio/proba/gr_2_flori_de_liliac.mp3' },
    { tip: 'cîntec', titlu: 'Foarte Greu 2', raspuns: 'Casa părintească nu se vinde', puncte: 40, timp: 0, audio: '/audio/proba/fg_2_casa_parinteasca_nu_se_vinde.mp3' },
    {
        tip: 'tranziție',
        titlu: '',
        raspuns: 'Revizuiește Cunoștințele',
        puncte: 0,
        timp: 0,
        html: '',
    },
    {
        tip: 'imagine',
        titlu: 'Personalitate',
        raspuns: 'Mircea Snegur',
        puncte: 20,
        timp: 30,
        html: '<img src="/img/revide/snegur_1.webp"> <img src="/img/revide/snegur_2.webp">',
    },
    {
        tip: 'imagine',
        titlu: 'Personalitate',
        raspuns: 'Grigore Vieru',
        puncte: 20,
        timp: 30,
        html: '<img src="/img/revide/vieru_1.webp"> <img src="/img/revide/vieru_2.webp">',
    },
    {
        tip: 'imagine',
        titlu: 'Locație',
        raspuns: 'Emil Racoviță',
        puncte: 20,
        timp: 30,
        html: '<img src="/img/revide/emil_1.webp"> <img src="/img/revide/emil_2.webp">',
    },
    {
        tip: 'imagine',
        titlu: 'Locație',
        raspuns: 'Pădurea Domeasca',
        puncte: 20,
        timp: 30,
        html: '<img src="/img/revide/padure_1.webp"> <img src="/img/revide/padure_2.webp">',
    },
    {
        tip: 'imagine',
        titlu: 'Personalitate',
        raspuns: 'Natalia Gordienko',
        puncte: 40,
        timp: 30,
        html: '<img src="/img/revide/gordienco_1.webp"> <img src="/img/revide/gordienco_2.webp">',
    },
    {
        tip: 'imagine',
        titlu: 'Personalitate',
        raspuns: 'Ion Ceban',
        puncte: 40,
        timp: 30,
        html: '<img src="/img/revide/ceban_1.webp"> <img src="/img/revide/ceban_2.webp">',
    },
    {
        tip: 'imagine',
        titlu: 'Locație',
        raspuns: 'Cetatea Soroca',
        puncte: 40,
        timp: 30,
        html: '<img src="/img/revide/soroca_1.webp"> <img src="/img/revide/soroca_2.webp">',
    },
    {
        tip: 'imagine',
        titlu: 'Locație',
        raspuns: 'Rezervația Prutul de Jos',
        puncte: 40,
        timp: 30,
        html: '<img src="/img/revide/prut_1.webp"> <img src="/img/revide/prut_2.webp">',
    },
    {
        tip: 'tranziție',
        titlu: '',
        raspuns: 'Definește regionalismul',
        puncte: 0,
        timp: 0,
        html: '',
    },
    {
        tip: 'text',
        titlu: 'Șanti',
        raspuns: 'apoi, ulterior (satul Lopatna, Orhei)',
        puncte: 10,
        timp: 30,
        html: '',
    },
    {
        tip: 'text',
        titlu: 'Chiroște',
        raspuns: 'Colțunași (Briceni)',
        puncte: 10,
        timp: 10,
        html: '',
    },
    {
        tip: 'text',
        titlu: 'Chirtoacă',
        raspuns: 'toporișcă, cuțit mare, unealtă (Nord)',
        puncte: 10,
        timp: 10,
        html: '',
    },
    {
        tip: 'text',
        titlu: 'Pohibă',
        raspuns: 'defect, problemă (Bugeac, Sud)',
        puncte: 10,
        timp: 10,
        html: '',
    },
    {
        tip: 'text',
        titlu: 'Bujdi',
        raspuns: 'a se mișca repede (Nord)',
        puncte: 10,
        timp: 10,
        html: '',
    },
    {
        tip: 'text',
        titlu: 'Hultan',
        raspuns: 'vultur (Briceni)',
        puncte: 10,
        timp: 10,
        html: '',
    },
    {
        tip: 'text',
        titlu: 'Șorcov',
        raspuns: 'agută (Briceni și Basarabeasca)',
        puncte: 10,
        timp: 30,
        html: '',
    },
    {
        tip: 'text',
        titlu: '',
        raspuns: '',
        puncte: 0,
        timp: 0,
        html: '',
    },
];

/** @type {Proba[]} */
export let probe = probe2();

export function skimba_ekipa(/**@type{1|2}*/ nr) {
    x.skimbă_ekipa(x.joc, nr);
    anunta_evt(['raspuns', ''], ['apasat', nr]);
}

/** @param {...[string,any]} data */
export function anunta_evt(...data) {
    x.evente = data;
    x.evente.push(['timp', x.joc.timp])
    x.emitter.dispatchEvent(new Event('control'));
}
