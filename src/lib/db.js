export const x = {
    echipa_activa: 0,
    nr_intrebare: 0, // TODO: De schimbat numele!
    emitter: new EventTarget(),
    event_type: "",
}

export const echipe = [
    { puncte: 0, denumirea: "BeRe" },
    { puncte: 0, denumirea: "MeRe" }
]


/**
 * @typedef {Object} Intrebare
 * @property {number} id - Identificatorul întrebării
 * @property { 'text' | 'imagine' | 'emoji' | 'da-nu' | 'cintec' } tip - Tipul întrebării
 * @property {string} titlu - Întrebarea propriu zisă
 * @property {string} html - Html pentru a include imaginile
 * @property {string} raspuns - Răspunsul întrebării
 * @property {number} puncte - Punctele atribuite la răspuns corect
 */

/** @type {Intrebare[]} */
export const intrebari = [
    { tip: 'text', titlu: "Ĉine-i krasavĉik?", raspuns: "Vițăpredsedatel' Coordonator EduTI", puncte: 1},
    { tip: 'emoji', titlu: "🆓🧀🪤", raspuns: "Brînza gratis îi numai în capcană (бесплатнный сыр только в мышиловке)", puncte: 1},
    { tip: 'emoji', titlu: "🤣🤣🤣🏁", raspuns: "Rîde cel ce rîde la urmă", puncte: 1},
    { tip: 'imagine', titlu: "peepoo + calendar", html: "<img height='100px' src='/img/peepoo.webp'> + <img height='100px' src='/img/calendar.webp'>", raspuns: "It's wednesday ma' dudes!", puncte: 1},
]
