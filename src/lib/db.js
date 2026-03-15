
/**
 * @typedef {Object} StareJoc
 * @property {number}  întrebarea
 * @property {number}  ekipa
 * @property {boolean} așteptare
 * @property {number}  timp
 */


/** @returns {StareJoc} */
function joc_nou() {
    return {
        întrebarea: 0,
        ekipa: 0,
        timp: 0,
        așteptare: true,
    }
}

/** @param {StareJoc} joc */
function resetează_ekipa(joc) {
    joc.ekipa     = 0;
    joc.așteptare  = true;
    joc.timp       = 0;
}

/** @param {StareJoc} joc */
function resetează_joc(joc) {
    resetează_ekipa(joc);
    joc.întrebarea = 0;
}

/** 
 * @param {StareJoc} joc
 * @param {1|2} nr_ekipa
 * */
function skimbă_ekipa(joc, nr_ekipa) {
    joc.ekipa = nr_ekipa;
    joc.timp = intrebari[x.joc.întrebarea].timp;
    joc.așteptare= false
}


/** 
 * @param {StareJoc} joc 
 * @param {'următoare'|'anterioară'} directie
 */
function skimbă_întrebarea(joc, directie="următoare") {
    joc.ekipa = 0;
    joc.timp = 0;
    joc.așteptare = true;
    if (directie ==="următoare") {
        joc.întrebarea= (joc.întrebarea + 1) % intrebari.length;
    } else {
        joc.întrebarea= (intrebari.length + joc.întrebarea- 1) % intrebari.length;
    }
}

export const x = {

    joc: joc_nou(),

    resetează_ekipa,
    resetează_joc,
    skimbă_întrebarea,
    skimbă_ekipa,

    event_type: '',
    emitter: new EventTarget(),
    cronometrul: setInterval(() => {
        x.joc.timp = Math.max(0, x.joc.timp-1);
        x.event_type = 'xronox'
        x.emitter.dispatchEvent(new Event('control'));
    }, 1000),
};

export const echipe = [
    { puncte: 0, denumirea: 'BeRe' },
    { puncte: 0, denumirea: 'MeRe' },
];

/** @typedef {'text' | 'imagine' | 'emoji' | 'da-nu' | 'cîntec'} TipIntrebare */

/**
 * @typedef {Object} Intrebare
 * @property {TipIntrebare} tip - Tipul întrebării
 *
 * @property {string} titlu - Întrebarea propriu zisă
 * @property {string} raspuns - Răspunsul întrebării
 * @property {number} puncte - Punctele atribuite la răspuns corect
 * @property {number} timp - Timpul pentru a da răspuns
 *
 * @property {string} [html] - Html pentru a include imaginile
 * @property {string} [audio] - Audio pentru întrebare tip cîntec
 * @property {number} [echipa] - Echipa care a răspuns
 */

/** @type {Intrebare[]} */
export const intrebari = [
    {
        tip: 'text',
        titlu: 'Ĉine-i krasavĉik?',
        raspuns: "Vițăpredsedatel' Coordonator EduTI",
        puncte: 1,
        timp: 10,
    },
    {
        tip: 'cîntec',
        titlu: '[stinker]',
        raspuns: 'Adventa',
        audio: '/audio/atventa.mp3',
        puncte: 1,
        timp: 10,
    },
    {
        tip: 'cîntec',
        titlu: '[stinker]',
        raspuns: 'Aba',
        audio: '/audio/aba.opus',
        puncte: 1,
        timp: 10,
    },
    {
        tip: 'emoji',
        titlu: '🆓🧀🪤',
        raspuns:
            'Brînza gratis îi numai în capcană (бесплатнный сыр только в мышиловке)',
        puncte: 1,
        timp: 10,
    },
    {
        tip: 'emoji',
        titlu: '🤣🤣🤣🏁',
        raspuns: 'Rîde cel ce rîde la urmă',
        puncte: 1,
        timp: 10,
    },
    {
        tip: 'imagine',
        titlu: 'peepoo + calendar',
        html: "<img height='100px' src='/img/peepoo.webp'> + <img height='100px' src='/img/calendar.webp'>",
        raspuns: "It's wednesday ma' dudes!",
        puncte: 1,
        timp: 10,
    },
];
