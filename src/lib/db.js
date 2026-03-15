export const x = {
    echipa_activa: 0,
    nr_intrebare: 0, // TODO: De schimbat numele!
    emitter: new EventTarget(),
    event_type: '',
    asteapta: true,
    timp: 0,
    cronometrul: setInterval(() => {
        x.timp = Math.max(0, x.timp-1);
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
 * @property {string} titlu - Întrebarea propriu zisă
 * @property {string} [html] - Html pentru a include imaginile
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
