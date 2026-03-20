<script>
    import { quadOut } from 'svelte/easing';
    import { slide } from 'svelte/transition';
    import { source } from 'sveltekit-sse';

    /** @type {{ data: import('./$types').PageData }} */
    const { data } = $props();
    const intrebari = $derived(data.intrebari);

    const event = source('/eveniment');
    const nr_intrebare = event.select('nr_intrebare');
    const raspuns = event.select('raspuns');
    const apasat = event.select('apasat');

    const timp_str = event.select('timp');
    const timp = $derived(parseInt($timp_str));
    const secunde = $derived(Math.max(0, timp % 60));
    const minute = $derived(Math.max(0, Math.floor(timp / 60)));

    const puncte_evt = event.select('puncte');
    const idx_intrebare_activa = $derived(
        ($nr_intrebare ? parseInt($nr_intrebare) : data.nr_intrebare) %
            intrebari.length,
    );
    const intrebarea_activa = $derived(intrebari[idx_intrebare_activa]);

    let tip_ultima_intrebare = $derived(
        idx_intrebare_activa > 0 ? intrebari[idx_intrebare_activa - 1].tip : '',
    );

    /** @type {HTMLImageElement} */
    let mina;
    let t = $derived(
        (
            intrebarea_activa.tip === 'tranziție' ||
                tip_ultima_intrebare === 'tranziție'
        ) ?
            0
        :   0,
    );

    setInterval(() => (t += 20), 20);

    const durata_animatiei = 1500, // msec
        progres_animatie = $derived(t / durata_animatiei);

    let cortina = $derived.by(() => {
        if (intrebarea_activa.tip === 'tranziție')
            return 0.7 <= progres_animatie;
        if (tip_ultima_intrebare === 'tranziție')
            return progres_animatie <= 0.3;
        return false;
    });

    /**
     * Funcția de interpolare să modifice matricea direct, acum nu întoarce nimic
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

        interpoleaza(0.0, 0.5, i => tx += 750*quadOut(i)); // intră-n sĉenă
        interpoleaza(0.5, 0.7, i => ty += 100*quadOut(i)); // traĝe
        interpoleaza(0.7, 1.0, i => ty -= 100*quadOut(i)); // se ridică
        interpoleaza(0.3, 0.5, i => {                      // se rotește
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

        interpoleaza(0.0, 0.2, i => ty += 100*quadOut(i));
        interpoleaza(0.2, 0.5, i => ty -= 100*quadOut(i));
        interpoleaza(0.5, 1.0, i => tx -= 700*quadOut(i));
        interpoleaza(0.5, 0.7, i => {
            const mc = Math.cos((Math.PI / 6) * i);
            const ms = Math.sin((Math.PI / 6) * i);
            a = mc;
            b = ms;
            c = -ms;
            d = mc;
        });

        return [a, b, c, d, tx, ty].map((x) => x.toString()).join(', ');
    }

    function animeaza_mina() {
        if (tip_ultima_intrebare === 'tranziție') {
            return mina_iese();
        } else if (intrebarea_activa.tip === 'tranziție') {
            return mina_intra();
        }
    }

    $effect(() => {
        if ($apasat === '1' || $apasat === '2') {
            new Audio('/audio/selecție.wav').play();
        }
    });
    $effect(() => {
        if (tip_ultima_intrebare === 'tranziție') {
            new Audio('/audio/start-runda.mp3').play();
        } else if (intrebarea_activa.tip === 'tranziție') {
            new Audio('/audio/tranzitie.mp3').play();
        }
    });
    $effect(() => {
        if ($raspuns === 'corect') {
            new Audio('/audio/rasp-corect.wav').play();
        } else if ($raspuns === 'gresit') {
            new Audio('/audio/rasp-gres.wav').play();
        }
    });

    /**
     * @param  {string} text
     * @return {string}
     */
    function pad_left(text) {
        if (text.length < 2) return '0' + text;
        return text;
    }
</script>

<div class="bg-[url(/baza-90.jpg)] bg-cover text-yellow-900">
    <div
        class="fixed flex w-full flex-row justify-between bg-amber-100/80 text-5xl font-bold"
    >
        <div
            class="flex w-full flex-row px-15 py-10"
            class:bg-orange-300={$apasat === '1'}
        >
            <div>{data.echipa1.denumirea}</div>
        </div>

        <div class="w-150 text-center text-stone-400">
            <div class="relative py-10">
                <span
                    >{pad_left(minute.toString())}:{pad_left(
                        secunde.toString(),
                    )}</span
                >

                <div class="absolute -bottom-4 w-full">
                    <span
                        class="mx-auto w-fit rounded-xl border-2 border-emerald-100 bg-emerald-50 px-2 py-1 text-center text-3xl font-bold text-emerald-500"
                        >+{$puncte_evt}pt</span
                    >
                </div>
            </div>
        </div>

        <div
            class="flex w-full flex-row justify-end px-15 py-10"
            class:bg-orange-300={$apasat === '2'}
        >
            <div>{data.echipa2.denumirea}</div>
        </div>
    </div>

    <div
        class="relative flex h-screen w-full flex-col justify-center overflow-hidden text-center font-mono text-6xl font-bold"
    >
        <!-- <img bind:this={mina} src="/img/mina.webp" class="z-150 absolute" style="transform: matrix({Math.cos(t*1/(2*Math.PI))}, {Math.sin(t*1/(2*Math.PI))}, {-Math.sin(t*1/(2*Math.PI))}, {Math.cos(t*1/(2*Math.PI))}, 300, 0);"> -->

        {#if intrebarea_activa.tip === 'tranziție' || tip_ultima_intrebare === 'tranziție'}
            {#if cortina}
                <div
                    out:slide={{ duration: 900 }}
                    in:slide={{ duration: 900 }}
                    class="absolute top-0 z-100 flex h-screen w-screen items-center justify-center bg-white"
                >
                    <div class="text-6xl font-bold text-stone-600">
                        {#if intrebarea_activa.tip === 'tranziție'}
                            {intrebarea_activa.raspuns}
                        {:else}
                            {intrebari[idx_intrebare_activa - 1].raspuns}
                        {/if}
                    </div>
                </div>
            {/if}

            <img
                bind:this={mina}
                src="/img/mina.webp"
                class="absolute z-150"
                style="transform: matrix({animeaza_mina()});"
            />
        {/if}

        <div class="relative">
            {#if intrebarea_activa.tip === 'emoji' || intrebarea_activa.tip === 'text'}
                <span class:emoji={intrebarea_activa.tip === 'emoji'} class:text-9xl={intrebarea_activa.tip === 'emoji'}
                    >{intrebarea_activa.titlu}</span
                >
            {:else if intrebarea_activa.tip === 'cîntec'}
                <div class="flex flex-row items-center justify-center gap-10">
                    <img
                        height="400px"
                        class="animate-bounce"
                        src="/img/apu_listen_muzik.webp"
                        alt="Apu listens to music"
                    />
                </div>
            {:else if intrebarea_activa.tip === 'imagine'}
                <div class="flex flex-row items-center justify-center gap-10">
                    {@html intrebarea_activa.html}
                </div>
            {:else}
                <span>{intrebarea_activa.titlu}</span>
            {/if}
        </div>
    </div>

    {#if $raspuns !== ''}
        <div
            class="fixed bottom-0 w-full"
            class:bg-red-50={$raspuns === 'gresit'}
            class:bg-amber-50={$raspuns === 'arata-raspuns'}
            class:bg-green-50={$raspuns === 'corect'}
        >
            <div
                class:text-red-500={$raspuns === 'gresit'}
                class:text-amber-500={$raspuns === 'arata-raspuns'}
                class:text-green-500={$raspuns === 'corect'}
                class="m-auto w-350 min-h-50 py-[2.5vh] text-center text-5xl font-bold"
            >
                Raspuns
                {#if $raspuns !== 'gresit'}
                    corect: <i>{intrebarea_activa.raspuns}</i>
                {:else}
                    greșit
                {/if}
            </div>
        </div>
    {/if}

</div>


<style>
</style>

