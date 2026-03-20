<script>
    import { quadOut } from 'svelte/easing';
    import { slide } from 'svelte/transition';
    import { source } from 'sveltekit-sse';

    /** @type {{ data: import('./$types').PageData }} */
    const { data } = $props();

    const event = source('/eveniment');
    const raspuns = event.select('raspuns');
    const apasat = event.select('apasat');
    const puncte = event.select('puncte');

    const probe = $derived(data.probe);
    const nr_proba_ev = event.select('nr_intrebare');
    const nr_proba = $derived(
        ($nr_proba_ev ? parseInt($nr_proba_ev) : data.nr_intrebare) %
            probe.length,
    );
    const proba_activa = $derived(probe[nr_proba]);
    const tip_ultima_proba = $derived(
        nr_proba > 0 ? probe[nr_proba - 1].tip : '',
    );

    const timp_evt = event.select('timp');
    const timp = $derived.by(function () {
        const //
            timp = parseInt($timp_evt),
            sec = fmt_timp(Math.max(0, timp % 60).toString()),
            min = fmt_timp(Math.max(0, Math.floor(timp / 60)).toString());
        return `${min}:${sec}`;
    });

    function fmt_timp(/**@type {string}*/ text) {
        return text.length < 2 ? '0' + text : text;
    }

    let t = $derived((proba_activa.tip || tip_ultima_proba || true) && 0);
    setInterval(() => (t += 20), 20 /*50 fps*/);

    const //
        durata_animatiei = 1500, // msec
        progres_animatie = $derived(t / durata_animatiei);

    let cortina = $derived.by(() => {
        if (proba_activa.tip === 'tranziție')
            return 0.7 <= progres_animatie;
        if (tip_ultima_proba === 'tranziție')
            return progres_animatie <= 0.3;
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

    function mina_intra() {
        let a = Math.cos(Math.PI / 6),
            b = Math.sin(Math.PI / 6),
            c = -Math.sin(Math.PI / 6),
            d = Math.cos(Math.PI / 6),
            tx = -850,
            ty = -300;
        interpoleaza(0.0, 0.5, (i) => (tx += 750 * quadOut(i))); // intră-n sĉenă
        interpoleaza(0.5, 0.7, (i) => (ty += 100 * quadOut(i))); // traĝe
        interpoleaza(0.7, 1.0, (i) => (ty -= 100 * quadOut(i))); // se ridică
        interpoleaza(0.3, 0.5, (i) => { // se rotește
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
        let a = 1, b = 0, c = 0, d = 1,
            tx = -100,
            ty = -300;
        interpoleaza(0.0, 0.2, (i) => (ty += 100 * quadOut(i))); // traĝe
        interpoleaza(0.2, 0.5, (i) => (ty -= 100 * quadOut(i))); // se ridică
        interpoleaza(0.5, 1.0, (i) => (tx -= 700 * quadOut(i))); // iese din sĉenă
        interpoleaza(0.5, 0.7, (i) => { // se rotește
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

    const pozitia_minii = $derived.by(() => {
        if (tip_ultima_proba === 'tranziție') {
            return mina_iese();
        } else if (proba_activa.tip === 'tranziție') {
            return mina_intra();
        }
    });

    /** @type {HTMLAudioElement?} */
    let audio = null;
    function efect_sonor(/**@type{string}*/ nume_audio) {
        audio && audio.pause()
        audio = new Audio(nume_audio)
        audio.play()
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
        } else if ($raspuns === 'gresit') {
            efect_sonor('/audio/rasp-gres.wav');
        }
    });
</script>

<div class="bg-[url(/baza-90.jpg)] bg-cover text-yellow-900">
    <!-- INFO: Antetul cu echipe și timp -->
    <div
        class="fixed flex w-full flex-row justify-between bg-amber-100/80 text-5xl font-bold"
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
        <div class="w-150 text-center text-stone-400">
            <div class="relative py-10">
                <span>{timp}</span>
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
        class="relative flex h-screen w-screen flex-col justify-center overflow-hidden text-center font-mono text-6xl font-bold"
    >
        <!-- INFO: Animația de tranziție -->
        {#if proba_activa.tip === 'tranziție' || tip_ultima_proba === 'tranziție'}
            {#if cortina}
                <div
                    out:slide={{ duration: 900 }}
                    in:slide={{ duration: 900 }}
                    class="absolute top-0 z-100 flex h-screen w-screen items-center justify-center bg-white"
                >
                    <div class="text-6xl font-bold text-stone-600">
                        {#if proba_activa.tip === 'tranziție'}
                            {proba_activa.raspuns}
                        {:else}
                            {probe[nr_proba - 1].raspuns}
                        {/if}
                    </div>
                </div>
            {/if}
            <img
                src="/img/mina.webp"
                class="absolute z-150"
                alt="mînă care trage ața pentru tranziție"
                style="transform: matrix({pozitia_minii});"
            />
        {/if}

        <!-- INFO: Întrebarea propriu zisă -->
        <div>
            {#if proba_activa.tip === 'emoji' || proba_activa.tip === 'text'}
                <span
                    class={{
                        'emoji text-9xl': proba_activa.tip === 'emoji',
                    }}>{proba_activa.titlu}</span
                >
            {:else if proba_activa.tip === 'cîntec'}
                <div class="flex flex-row items-center justify-center gap-10">
                    <img
                        height="400px"
                        class="animate-bounce"
                        src="/img/apu_listen_muzik.webp"
                        alt="Apu listens to music"
                    />
                </div>
            {:else if proba_activa.tip === 'imagine'}
                <div class="flex flex-row items-center justify-center gap-10">
                    {@html proba_activa.html}
                </div>
            {:else}
                <span>{proba_activa.titlu}</span>
            {/if}
        </div>
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
