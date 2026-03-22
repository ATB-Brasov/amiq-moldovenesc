<script>
    import { quadIn, quadOut, cubicIn } from 'svelte/easing';
    import { slide } from 'svelte/transition';
    import { source } from 'sveltekit-sse';

    /** @type {{ data: import('./$types').PageData }} */
    const { data } = $props();

    const event = source('/eveniment');
    const raspuns = event.select('raspuns');
    const apasat = event.select('apasat');
    const puncte = event.select('puncte');
    const puncte1 = event.select('puncte1');
    const puncte2 = event.select('puncte2');

    const cistigator = $derived(
        parseInt($puncte1) > parseInt($puncte2) ? 1
        : parseInt($puncte1) < parseInt($puncte2) ? 2
        : 0,
    );

    const probe = $derived(data.probe);
    const nr_proba_ev = event.select('nr_proba');
    const nr_proba = $derived(
        ($nr_proba_ev ? parseInt($nr_proba_ev) : data.nr_proba) % probe.length,
    );
    const proba_activa = $derived(probe[nr_proba]);
    const tip_ultima_proba = $derived(
        nr_proba > 0 ? probe[nr_proba - 1].tip : '',
    );

    const timp_evt = event.select('timp');
    const timp = $derived.by(function () {
        const //
            timp = parseInt($timp_evt),
            sec = fmt_timp(Math.max(0, timp % 60).toString());
        // min = fmt_timp(Math.max(0, Math.floor(timp / 60)).toString());
        return sec; // `${min}:${sec}`;
    });

    function fmt_timp(/**@type {string}*/ text) {
        return text.length < 2 ? '0' + text : text;
    }

    let t = $derived((cistigator || proba_activa.tip || tip_ultima_proba || true) && 0);
    setInterval(() => (t += 20), 20 /*50 fps*/);

    let durata_animatiei = $derived(
        proba_activa.tip === 'introducere' ? 1000
        : proba_activa.titlu === 'Rezultate' ? 800
        : 1500,
    ); // msec
    const progres_animatie = $derived(t / durata_animatiei);

    let cortina = $derived.by(() => {
        if (proba_activa.tip === 'tranziție') return 0.7 <= progres_animatie;
        if (tip_ultima_proba === 'tranziție') return progres_animatie <= 0.3;
        return false;
    });

    /**
     * Funcția de interpolare presupune că modificările se fac prin «Closure»
     * @param {number} jos
     * @param {number} sus
     * @param {(interpolator: number) => void} func
     */
    function interpoleaza(jos, sus, func) {
        let interpolator = (progres_animatie - jos) / (sus - jos);
        // clamp(0, 1)
        if (interpolator < 0) interpolator = 0;
        else if (interpolator > 1) interpolator = 1;
        return func(interpolator);
    }

    function ata_intra() {
        let a = 1,
            b = 0,
            c = 0,
            d = 1,
            tx = 420,
            ty = -1360;
        interpoleaza(0.0, 0.3, (i) => (ty += 1000 * quadOut(i))); // traĝe
        interpoleaza(0.5, 0.7, (i) => (ty += 100 * quadOut(i))); // traĝe
        interpoleaza(0.7, 1.0, (i) => (ty -= 100 * quadOut(i))); // se ridică
        return [a, b, c, d, tx, ty].map((x) => x.toString()).join(', ');
    }

    function ata_iese() {
        let a = 1,
            b = 0,
            c = 0,
            d = 1,
            tx = 420,
            ty = -360;
        interpoleaza(0.0, 0.2, (i) => (ty += 100 * quadOut(i))); // traĝe
        interpoleaza(0.2, 0.5, (i) => (ty -= 100 * quadOut(i))); // se ridică
        interpoleaza(0.5, 1.0, (i) => (ty -= 1000 * quadOut(i))); // se ridică
        return [a, b, c, d, tx, ty].map((x) => x.toString()).join(', ');
    }

    function mina_intra() {
        let a = Math.cos(Math.PI / 6),
            b = Math.sin(Math.PI / 6),
            c = -Math.sin(Math.PI / 6),
            d = Math.cos(Math.PI / 6),
            tx = -850,
            ty = 0;
        interpoleaza(0.0, 0.5, (i) => (tx += 750 * quadOut(i))); // intră-n sĉenă
        interpoleaza(0.5, 0.7, (i) => (ty += 100 * quadOut(i))); // traĝe
        interpoleaza(0.7, 1.0, (i) => (ty -= 100 * quadOut(i))); // se ridică
        interpoleaza(0.3, 0.5, (i) => {
            // se rotește
            const mc = Math.cos((Math.PI / 6) * (1 - i));
            const ms = Math.sin((Math.PI / 6) * (1 - i));
            a = mc;
            b = ms;
            c = -ms;
            d = mc;
        });
        return [a, b, c, d, tx, ty].map((x) => x.toString()).join(', ');
    }

    function mina_iese() {
        let a = 1,
            b = 0,
            c = 0,
            d = 1,
            tx = -100,
            ty = 0;
        interpoleaza(0.0, 0.2, (i) => (ty += 100 * quadOut(i))); // traĝe
        interpoleaza(0.2, 0.5, (i) => (ty -= 100 * quadOut(i))); // se ridică
        interpoleaza(0.5, 1.0, (i) => (tx -= 700 * quadOut(i))); // iese din sĉenă
        interpoleaza(0.5, 0.7, (i) => {
            // se rotește
            const //
                mc = Math.cos((Math.PI / 6) * i),
                ms = Math.sin((Math.PI / 6) * i);
            a = mc;
            b = ms;
            c = -ms;
            d = mc;
        });
        return [a, b, c, d, tx, ty].map((x) => x.toString()).join(', ');
    }

    const pozitia_atei = $derived.by(() => {
        if (tip_ultima_proba === 'tranziție') {
            return ata_iese();
        } else if (proba_activa.tip === 'tranziție') {
            return ata_intra();
        }
    });

    const pozitia_minii = $derived.by(() => {
        if (tip_ultima_proba === 'tranziție') {
            return mina_iese();
        } else if (proba_activa.tip === 'tranziție') {
            return mina_intra();
        }
    });

    const pozitia_minii_stingi = (
        tx_initial = 510,
        tx_final = 900,
        ty_initial = -68,
    ) => {
        const teta = Math.PI / 4; // => Math.PI/36 -> PI/36(-4.5 => 1) -> PI/36(5.5t-4.5)
        let a = Math.cos(teta),
            b = Math.sin(teta),
            c = -Math.sin(teta),
            d = Math.cos(teta),
            tx = tx_initial,
            ty = ty_initial;

        interpoleaza(0.0, 0.6, (i) => (ty -= 52 * quadIn(i))); // traĝe
        interpoleaza(0.6, 0.8, (i) => (ty -= 22 * quadOut(i))); // traĝe
        interpoleaza(0.8, 1.0, (i) => (ty += 22 * quadOut(i))); // traĝe
        interpoleaza(
            0.0,
            0.6,
            (i) => (tx += (tx_final - 10 - tx_initial) * quadIn(i)),
        ); // iese din sĉenă
        interpoleaza(0.6, 0.8, (i) => (tx += 10 * quadOut(i))); // iese din sĉenă
        interpoleaza(0.8, 1.0, (i) => (tx -= 5 * quadOut(i))); // iese din sĉenă
        interpoleaza(0.0, 0.6, (i) => {
            // se rotește
            const //
                mc = Math.cos((Math.PI / 36) * (-6.7 * cubicIn(i) + 4.5)),
                ms = Math.sin((Math.PI / 36) * (-6.7 * cubicIn(i) + 4.5));
            a = mc;
            b = ms;
            c = -ms;
            d = mc;
        });
        return [a, b, c, d, tx, ty].map((x) => x.toString()).join(', ');
    };
    const pozitia_minii_drepte = (
        tx_initial = 1180,
        tx_final = 960,
        ty_initial = -50,
    ) => {
        const teta = -Math.PI / 4; // => Math.PI/36 -> PI/36(-4.5 => 1) -> PI/36(5.5t-4.5)
        let a = Math.cos(teta),
            b = Math.sin(teta),
            c = -Math.sin(teta),
            d = Math.cos(teta),
            tx = tx_initial,
            ty = ty_initial;

        interpoleaza(0.0, 0.6, (i) => (ty -= 80 * quadIn(i))); // traĝe
        interpoleaza(0.6, 0.8, (i) => (ty -= 22 * quadOut(i))); // traĝe
        interpoleaza(0.8, 1.0, (i) => (ty += 32 * quadOut(i))); // traĝe
        interpoleaza(
            0.0,
            0.6,
            (i) => (tx += (tx_final + 10 - tx_initial) * quadIn(i)),
        ); // iese din sĉenă
        interpoleaza(0.6, 0.8, (i) => (tx -= 10 * quadOut(i))); // iese din sĉenă
        interpoleaza(0.8, 1.0, (i) => (tx += 5 * quadOut(i))); // iese din sĉenă
        interpoleaza(0.0, 0.6, (i) => {
            // se rotește
            const //
                mc = Math.cos((Math.PI / 36) * (7 * cubicIn(i) - 4.5)),
                ms = Math.sin((Math.PI / 36) * (7 * cubicIn(i) - 4.5));
            a = mc;
            b = ms;
            c = -ms;
            d = mc;
        });
        return [a, b, c, d, tx, ty].map((x) => x.toString()).join(', ');
    };

    /** @type {HTMLAudioElement?} */
    let audio = null;
    function efect_sonor(/**@type{string}*/ nume_audio) {
        audio && audio.pause();
        audio = new Audio(nume_audio);
        audio.play();
    }

    $effect(() => {
        if ($apasat === '1' || $apasat === '2') {
            efect_sonor('/audio/selecție.wav');
        }
    });
    $effect(() => {
        if (tip_ultima_proba === 'tranziție') {
            efect_sonor('/audio/start-runda.mp3');
        } else if (proba_activa.tip === 'tranziție') {
            efect_sonor('/audio/tranzitie.mp3');
        }
    });
    $effect(() => {
        if ($raspuns === 'corect') {
            efect_sonor('/audio/rasp-corect.wav');
        } else if ($raspuns === 'gresit' || $raspuns === 'arata-raspuns') {
            efect_sonor('/audio/rasp-gres.wav');
        }
    });
</script>

<div class="bg-[url(/baza-90.jpg)] bg-cover text-yellow-900">
    <!-- INFO: Antetul cu echipe și timp -->
    <div
        class="fixed flex w-full flex-row justify-between bg-amber-100/80 font-[Syne] text-5xl font-bold"
    >
        <div
            class={[
                'flex flex-row',
                'w-full px-15 py-10',
                $apasat === '1' && 'bg-orange-300',
            ]}
        >
            <span>{data.ekipa1.denumirea}</span>
        </div>
        <div class="w-150 text-center">
            <div class="relative py-10 font-[FiraCode_Nerd_Font]">
                <span class="text-6xl font-extrabold text-[#3R0C09]"
                    >{timp}</span
                >
                <div class="absolute -bottom-4 w-full">
                    <span
                        class={[
                            'mx-auto w-fit px-2 py-1',
                            'text-center text-3xl font-bold text-emerald-500',
                            'bg-emerald-50',
                            'rounded-xl border-2 border-emerald-100',
                        ]}>+{$puncte}pt</span
                    >
                </div>
            </div>
        </div>
        <div
            class={[
                'w-full px-15 py-10',
                'flex flex-row justify-end',
                $apasat === '2' && 'bg-orange-300',
            ]}
        >
            <span>{data.ekipa2.denumirea}</span>
        </div>
    </div>

    <div
        class="flex h-screen w-screen flex-col justify-center overflow-hidden text-center text-6xl font-bold"
    >
        {#if proba_activa.tip === 'introducere' || nr_proba === 1}
            <div
                class="absolute top-0 z-100 flex h-screen w-screen items-center justify-center bg-[url(/baza-90.jpg)] bg-cover"
            ></div>
            <img
                class="absolute top-1/2 left-1/2 z-101 h-80"
                style="transform: translateX(calc(-50% - 70px));"
                src="/img/coperta/amiq_farabec.webp"
                alt=""
            />
            <img
                class="absolute z-102 h-46"
                style="left: calc(50% - 70px + 60px); top: calc(50% - 155px + 160px);"
                src="/img/coperta/becstins.webp"
                alt=""
            />
            {#if progres_animatie >= 0.6}
                <img
                    class="absolute z-102 h-46"
                    style="left: calc(50% - 70px - 25px); top: calc(50% - 455px + 120px);"
                    src="/img/coperta/lumina.webp"
                    alt=""
                />
                <img
                    class="absolute z-102 h-46"
                    style="left: calc(50% - 70px + 60px); top: calc(50% - 155px + 160px);"
                    src="/img/coperta/becaprins.webp"
                    alt=""
                />
            {/if}
            <img
                class="absolute z-102 h-46"
                style="transform: matrix({pozitia_minii_stingi()})"
                src="/img/coperta/minastinga.webp"
                alt=""
            />
            <img
                class="absolute z-103 h-46"
                style="transform: matrix({pozitia_minii_drepte()})"
                src="/img/coperta/minadreapta.webp"
                alt=""
            />
        {/if}

        {#if proba_activa.tip === 'scena'}
            {#if proba_activa.titlu === 'Cronometru'}
                <div
                    class="absolute top-0 z-100 flex h-screen w-screen items-center justify-center bg-white bg-[url(/img/xrono/fundal.webp)] bg-cover"
                >
                    <img
                        class="mr-14 mb-2 h-[600px]"
                        src="/img/xrono/cronometru.webp"
                        alt=""
                    />
                    <span
                        class="absolute font-[FiraCode_Nerd_Font] text-[10rem] font-extrabold text-[#3R0C09]"
                        >{timp}</span
                    >
                </div>
            {:else if proba_activa.titlu === 'Rezultate'}
                <div
                    class={[
                        'absolute top-0 z-100 flex h-screen w-screen items-center justify-center bg-cover',
                        cistigator === 1 ?
                            'bg-[url(/img/rezultat/fundalw1.webp)]'
                        : cistigator === 2 ?
                            'bg-[url(/img/rezultat/fundalw2.webp)]'
                        :   'bg-[url(/img/rezultat/fundal.webp)]',
                    ]}
                >
                    <div
                        class="absolute flex flex-col justify-center"
                        style="transform: translate(-100%, {cistigator === 0 ? 19.75
                        :   0}%);"
                    >
                        <span
                            class="mb-8"
                            class:text-amber-100={cistigator === 2}
                            >{data.ekipa1.denumirea}</span
                        >
                        <span
                            class="mb-8"
                            class:text-amber-100={cistigator === 2}
                            >{$puncte1}</span
                        >
                        <img
                            class="trofeu"
                            class:opacity-0={cistigator !== 1}
                            src="/img/rezultat/trofeu.webp"
                            alt=""
                        />
                    </div>
                    <div
                        class="absolute flex flex-col justify-center"
                        class:flex-col-reverse={cistigator === 0}
                        style="transform: translate(100%, {cistigator === 0 ? 15
                        :   0}%);"
                    >
                        <img
                            class="trofeu"
                            class:opacity-0={cistigator !== 2}
                            src="/img/rezultat/trofeu.webp"
                            alt=""
                        />
                        <span
                            class="mt-8"
                            class:text-amber-100={cistigator === 1}
                            >{$puncte2}</span
                        >
                        <span
                            class="mt-8"
                            class:text-amber-100={cistigator === 1}
                            >{data.ekipa2.denumirea}</span
                        >
                    </div>
                    <div class="relative">
                        <img
                            class="absolute z-102 h-46"
                            style="transform: matrix({pozitia_minii_stingi(
                                0,
                                120,
                                -180,
                            )})"
                            src="/img/coperta/minastinga.webp"
                            alt=""
                            class:opacity-0={cistigator !== 0}
                        />
                        <img
                            class="absolute z-103 h-46"
                            style="transform: matrix({pozitia_minii_drepte(
                                300,
                                180,
                                -163,
                            )})"
                            src="/img/coperta/minadreapta.webp"
                            alt=""
                            class:opacity-0={cistigator !== 0}
                        />
                        <img
                            class="trofeu"
                            class:opacity-0={cistigator !== 0}
                            src="/img/rezultat/trofeu.webp"
                            alt=""
                        />
                    </div>
                </div>
            {/if}
        {/if}

        <!-- INFO: Animația de tranziție -->
        {#if proba_activa.tip === 'tranziție' || tip_ultima_proba === 'tranziție'}
            {#if cortina}
                <div
                    out:slide={{ duration: 900 }}
                    in:slide={{ duration: 900 }}
                    class="absolute top-0 z-110 flex h-screen w-screen flex-col items-center justify-center bg-[url(/img/draperie.png)] bg-cover"
                >
                    <div
                        class="font-[Syne] text-6xl font-extrabold text-[#FDF7D3]"
                    >
                        {#if proba_activa.tip === 'tranziție'}
                            {proba_activa.raspuns}
                        {:else}
                            {probe[nr_proba - 1].raspuns}
                        {/if}
                    </div>
                </div>
            {/if}
            <img
                src="/img/ata.webp"
                class="absolute z-149"
                alt="ața pentru tranziție"
                style="transform: matrix({pozitia_atei});"
            />
            <img
                src="/img/mina.webp"
                class="absolute z-150"
                alt="mînă care trage ața pentru tranziție"
                style="transform: matrix({pozitia_minii});"
            />
        {/if}

        <!-- INFO: Întrebarea propriu zisă -->
        <div class="font-[Syne] font-semibold text-[#3R0C09]">
            {#if proba_activa.tip === 'text'}
                <span>{@html proba_activa.titlu}</span>
            {:else if proba_activa.tip === 'cîntec'}
                <div class="flex flex-col items-center justify-center gap-10">
                    <img
                        height="400px"
                        class="animate-bounce"
                        src="/img/apu_listen_muzik.webp"
                        alt="Apu listens to music"
                    />
                    <div>{proba_activa.titlu}</div>
                </div>
            {:else if proba_activa.tip === 'emoji'}
                <div class="flex flex-col items-center justify-center gap-10">
                    <div class="flex flex-row gap-6">
                        {@html proba_activa.html}
                    </div>
                </div>
            {:else if proba_activa.tip === 'imagine'}
                <div class="flex flex-col items-center justify-center gap-10">
                    <div class="imagini flex flex-row gap-6">
                        {@html proba_activa.html}
                    </div>
                    <div>{proba_activa.titlu}</div>
                </div>
            {:else}
                <span>{proba_activa.titlu}</span>
            {/if}
        </div>
    </div>

    <div class="absolute bottom-0 left-0 w-full px-15 py-10">
        <img class="h-20" src="/img/logoamiq.webp" alt="" />
    </div>

    <!-- INFO: Răspunsul la întrebare -->
    {#if $raspuns !== ''}
        <div
            class={[
                'fixed bottom-0 w-full',
                $raspuns === 'gresit' && 'bg-red-50 text-red-500',
                $raspuns === 'arata-raspuns' && 'bg-amber-50 text-amber-500',
                $raspuns === 'corect' && 'bg-green-50 text-green-500',
            ]}
        >
            <div
                class="m-auto min-h-50 w-350 py-[2.5vh] text-center text-5xl font-bold"
            >
                {#if $raspuns !== 'gresit'}
                    Răspunsul corect: <i>{proba_activa.raspuns}</i>
                {:else}
                    Răspuns greșit
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .imagini :global(img) {
        height: 30rem;
    }
    .trofeu {
        height: 500px;
    }
</style>
