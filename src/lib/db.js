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
    joc.întrebarea = 0;
    intrebari = intrebari2();
}

/**
 * @param {StareJoc} joc
 * @param {1|2} nr_ekipa
 * */
function skimbă_ekipa(joc, nr_ekipa) {
    joc.ekipa = nr_ekipa;
    joc.timp = intrebari[x.joc.întrebarea].timp;
    joc.așteptare = false;
}

/**
 * @param {StareJoc} joc
 * @param {'următoare'|'anterioară'|'fix'} directie
 * @param {number} numar
 */
function skimbă_întrebarea(joc, directie = 'următoare', numar = -1) {
    joc.ekipa = 0;
    joc.timp = 0;
    joc.așteptare = true;
    if (directie === 'următoare') {
        joc.întrebarea = (joc.întrebarea + 1) % intrebari.length;
    } else if (directie === 'anterioară') {
        joc.întrebarea =
            (intrebari.length + joc.întrebarea - 1) % intrebari.length;
    } else {
        if (numar <= -1)
            throw new Error('Numărul întrebării nu poate fi negativ');
        if (numar >= intrebari.length)
            throw new Error(
                'Numărul întrebării nu mai mare ca cantitatea întrebărilor',
            );
        joc.întrebarea = numar;
    }
}

export const x = {
    scena: 'introducere',
    joc: joc_nou(),

    resetează_ekipa,
    resetează_joc,
    skimbă_întrebarea,
    skimbă_ekipa,

    event_type: '',
    emitter: new EventTarget(),
    cronometrul: setInterval(() => {
        let timp_nou = x.joc.timp - 1;
        if (timp_nou < 0) {
            return;
        }

        x.joc.timp = Math.max(0, x.joc.timp - 1);
        x.event_type = 'xronox';
        x.emitter.dispatchEvent(new Event('control'));
    }, 1000),
};

export const echipe = [
    { puncte: 0, denumirea: 'BeRe' },
    { puncte: 0, denumirea: 'MeRe' },
];

/** @typedef {'text' | 'imagine' | 'emoji' | 'da-nu' | 'cîntec' | 'tranziție'} TipIntrebare */

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

/** @type {() => Intrebare[]} */
const intrebari_ = () => [
    {
        tip: 'tranziție',
        raspuns: '1 Ghiciți proverbul din emoji',
        titlu: '',
        puncte: 0,
        timp: 0,
    },
    {
        tip: 'emoji',
        puncte: 10,
        timp: 30,
        titlu: '🐺💇🏼‍♀️❌',
        raspuns: 'Lupul își schimbă părul, dar năravul ba.',
    },
    {
        tip: 'emoji',
        puncte: 10,
        timp: 30,
        titlu: '🐶❌🫦',
        raspuns: 'Câinele care latră nu mușcă.',
    },
    {
        tip: 'emoji',
        puncte: 10,
        timp: 30,
        titlu: '🌊➡️🪨',
        raspuns: 'Apa trece, pietrele rămân.',
    },
    {
        tip: 'emoji',
        puncte: 10,
        timp: 30,
        titlu: '🐦‍⬛👅☠️',
        raspuns: ' Pasărea pe limba ei piere.',
    },
    {
        tip: 'emoji',
        puncte: 10,
        timp: 30,
        titlu: '💵❌🎉',
        raspuns: 'Banii nu aduc fericirea.',
    },
    {
        tip: 'emoji',
        puncte: 10,
        timp: 30,
        titlu: 'ℹ️📖ℹ️🍰',
        raspuns: 'Ai carte ai parte.',
    },
    {
        tip: 'emoji',
        puncte: 10,
        timp: 30,
        titlu: '🐔👵🏻🍲',
        raspuns: ' Găina bătrână face zeamă bună.',
    },
    {
        tip: 'emoji',
        puncte: 10,
        timp: 30,
        titlu: '👤❄️🛷☀️🐎',
        raspuns: ' Omul gospodar își face vara sanie și iarna car.',
    },
    {
        tip: 'tranziție',
        raspuns: '2 Ce? Unde? Cînd?',
        titlu: '',
        puncte: 0,
        timp: 0,
    },
    { tip: 'text', puncte: 10, timp: 30, titlu: 'TBD', raspuns: 'În lucru!' },
    {
        tip: 'tranziție',
        raspuns: '3 Ghicește Melodia',
        titlu: '',
        puncte: 0,
        timp: 0,
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
    { tip: 'tranziție', raspuns: '4 Imagini', titlu: '', puncte: 0, timp: 0 },
    {
        tip: 'imagine',
        titlu: 'peepoo + calendar',
        html: "<img height='100px' src='/img/peepoo.webp'> + <img height='100px' src='/img/calendar.webp'>",
        raspuns: "It's wednesday ma' dudes!",
        puncte: 1,
        timp: 10,
    },
    {
        tip: 'tranziție',
        raspuns: '5 Definește regionalismul',
        titlu: '',
        puncte: 0,
        timp: 0,
    },
    {
        tip: 'text',
        puncte: 10,
        timp: 30,
        titlu: 'Șanti',
        raspuns: 'apoi, ulterior (satul Lopatna, Orhei)',
    },
    {
        tip: 'text',
        puncte: 10,
        timp: 30,
        titlu: 'Chiroște',
        raspuns: 'Colțunași (Briceni)',
    },
    {
        tip: 'text',
        puncte: 10,
        timp: 30,
        titlu: 'Chirtoacă',
        raspuns: 'toporișcă, cuțit mare, unealtă (Nord)',
    },
    {
        tip: 'text',
        puncte: 10,
        timp: 30,
        titlu: 'Pohibă',
        raspuns: 'defect, problemă (Bugeac, Sud)',
    },
    {
        tip: 'text',
        puncte: 10,
        timp: 30,
        titlu: 'Bujdi',
        raspuns: 'a se mișca repede (Nord)',
    },
    {
        tip: 'text',
        puncte: 10,
        timp: 30,
        titlu: 'Hultan',
        raspuns: 'vultur (Briceni)',
    },
    {
        tip: 'text',
        puncte: 10,
        timp: 30,
        titlu: 'Șorcov',
        raspuns: 'agută (Briceni și Basarabeasca)',
    },
    {
        tip: 'tranziție',
        raspuns: '6 Adevăr sau Mit?',
        titlu: '',
        puncte: 0,
        timp: 0,
    },
    {
        tip: 'da-nu',
        puncte: 10,
        timp: 30,
        titlu: '',
        raspuns: 'agută (Briceni și Basarabeasca)',
    },
];

/** @type {() => Intrebare[]} */
const intrebari2 = () => [
    {
        tip: 'tranziție',
        titlu: '',
        raspuns: '1 Ghiciți proverbul din emoji',
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
        raspuns: '2 Ce? Unde? Cînd?',
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
        raspuns: '3 Ghicește Melodia',
        puncte: 0,
        timp: 0,
        html: '',
    },
    {
        tip: 'cîntec',
        titlu: '[dacă ai un nume de identificare, poți băga și nivelul aici]',
        raspuns: '[răspunsul corect]',
        puncte: 10,
        timp: 30,
        html: '',
    },
    {
        tip: 'tranziție',
        titlu: '',
        raspuns: '4 Imagini',
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
        html: '',
    },
    {
        tip: 'imagine',
        titlu: 'Personalitate',
        raspuns: 'Grigore Vieru',
        puncte: 20,
        timp: 30,
        html: '',
    },
    {
        tip: 'imagine',
        titlu: 'Locație',
        raspuns: 'Emil Racoviță',
        puncte: 20,
        timp: 30,
        html: '',
    },
    {
        tip: 'imagine',
        titlu: 'Locație',
        raspuns: 'Pădurea Domeasca',
        puncte: 20,
        timp: 30,
        html: '',
    },
    {
        tip: 'imagine',
        titlu: 'Personalitate',
        raspuns: 'Natalia Gordienko',
        puncte: 40,
        timp: 30,
        html: '',
    },
    {
        tip: 'imagine',
        titlu: 'Personalitate ',
        raspuns: 'Ion Ceban',
        puncte: 40,
        timp: 30,
        html: '',
    },
    {
        tip: 'imagine',
        titlu: 'Locație',
        raspuns: 'Cetatea Soroca',
        puncte: 40,
        timp: 30,
        html: '',
    },
    {
        tip: 'imagine',
        titlu: 'Locație',
        raspuns: 'Rezervația Prutul de Jos',
        puncte: 40,
        timp: 30,
        html: '',
    },
    {
        tip: 'tranziție',
        titlu: '',
        raspuns: '5 Definește regionalismul',
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

/** @type {Intrebare[]} */
export let intrebari = intrebari2();
