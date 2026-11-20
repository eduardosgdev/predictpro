
<script>
    import { ArrowRight, Target, ChartNoAxesCombined, ShieldCheck, Zap, Activity, Crosshair, Layers3 } from "lucide-svelte";
    import NavBar from "../../components/navBar.svelte";
</script>
<NavBar />
<svelte:head>
    <title>Sobre Nosotros | PredictPro</title>
    <meta name="description" content="Conoce PredictPro, nuestra metodología de análisis futbolístico y los estilos de juego que estudiamos." />
</svelte:head>

<div class="min-h-screen bg-[#07090E] text-white overflow-hidden">

    <!-- HERO -->
    <section class="relative px-5 py-12 md:py-12 text-center">
        <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(0,255,102,0.10),transparent_60%)]"></div>

        <div class="relative max-w-4xl mx-auto">
            <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00FF66]/20 bg-[#00FF66]/5 text-[#00FF66] text-xs font-bold tracking-widest uppercase mb-7">
                <span class="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
                Football Analytics
            </span>

            <h1 class="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                El fútbol va más allá
                <span class="block text-transparent bg-clip-text bg-gradient-to-r from-[#00FF66] to-[#00F0FF]">
                    de los resultados.
                </span>
            </h1>

            <p class="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mt-7 leading-relaxed">
                Analizamos los estilos de juego, los historiales de enfrentamientos
                y el rendimiento individual para descubrir nuevas perspectivas
                del fútbol.
            </p>
        </div>
    </section>

    <!-- INTRODUCCION -->
    <section class="max-w-6xl mx-auto px-5 pb-20">
        <div class="grid md:grid-cols-2 gap-10 items-center">

            <div>
                <span class="text-[#00FF66] text-xs font-bold tracking-widest uppercase">
                    QUIÉNES SOMOS
                </span>

                <h2 class="text-3xl md:text-4xl font-extrabold mt-4 mb-6">
                    Una nueva forma de
                    <span class="text-[#00FF66]">entender el juego.</span>
                </h2>

                <p class="text-gray-400 leading-relaxed mb-5">
                    PredictPro nace como una herramienta de análisis futbolístico
                    amateur, desarrollada con fines informativos y de entretenimiento.
                </p>

                <p class="text-gray-400 leading-relaxed mb-5">
                    Nuestro objetivo es ofrecer una perspectiva estadística del fútbol
                    mediante el estudio de patrones de juego, historiales de
                    enfrentamientos y rendimiento individual de los jugadores.
                </p>

                <p class="text-gray-400 leading-relaxed">
                    No nos limitamos a observar los resultados: buscamos comprender
                    cómo las características tácticas de cada equipo pueden influir
                    en el desarrollo de un encuentro.
                </p>
            </div>

            <div class="relative">
                <div class="absolute -inset-4 bg-[#00FF66]/5 blur-3xl rounded-full"></div>

                <div class="relative bg-[#0E131F] border border-white/10 rounded-2xl p-7 md:p-9">
                    <div class="flex items-center justify-between mb-8">
                        <span class="text-xs text-gray-500 font-bold tracking-widest uppercase">
                            PredictPro Analytics
                        </span>
                        <Activity size={22} class="text-[#00FF66]" />
                    </div>

                    <div class="space-y-6">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-[#00FF66]/10 flex items-center justify-center text-[#00FF66]">
                                <ChartNoAxesCombined size={23} />
                            </div>
                            <div>
                                <h3 class="font-bold">Análisis histórico</h3>
                                <p class="text-sm text-gray-500">Patrones y tendencias estadísticas</p>
                            </div>
                        </div>

                        <div class="h-px bg-white/5"></div>

                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF]">
                                <Target size={23} />
                            </div>
                            <div>
                                <h3 class="font-bold">Análisis táctico</h3>
                                <p class="text-sm text-gray-500">Estilos ofensivos y defensivos</p>
                            </div>
                        </div>

                        <div class="h-px bg-white/5"></div>

                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <Activity size={23} />
                            </div>
                            <div>
                                <h3 class="font-bold">Rendimiento individual</h3>
                                <p class="text-sm text-gray-500">Estadísticas de los futbolistas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <!-- METODOLOGIA -->
    <section class="bg-[#0A0E17] border-y border-white/5 py-20 px-5">
        <div class="max-w-6xl mx-auto">

            <div class="text-center max-w-2xl mx-auto mb-14">
                <span class="text-[#00FF66] text-xs font-bold tracking-widest uppercase">
                    NUESTRA METODOLOGÍA
                </span>

                <h2 class="text-3xl md:text-4xl font-extrabold mt-4">
                    Dos dimensiones del juego
                </h2>

                <p class="text-gray-400 mt-5 leading-relaxed">
                    El núcleo de PredictPro se basa en estudiar cómo interactúan
                    los diferentes estilos ofensivos y defensivos.
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-7">

                <!-- OFENSIVOS -->
                <div class="bg-[#0E131F] border border-[#00FF66]/15 rounded-2xl p-7">
                    <div class="flex items-center gap-3 mb-7">
                        <div class="w-11 h-11 rounded-xl bg-[#00FF66]/10 flex items-center justify-center text-[#00FF66]">
                            <Zap size={22} />
                        </div>
                        <div>
                            <h3 class="text-xl font-bold">Estilos ofensivos</h3>
                            <p class="text-xs text-gray-500 uppercase tracking-wider">Cómo atacan los equipos</p>
                        </div>
                    </div>

                    <div class="space-y-5">
                        {#each [
                            { name: "Juego interior", desc: "Busca progresar mediante combinaciones y asociaciones por el centro del campo." },
                            { name: "Juego exterior", desc: "Prioriza la amplitud, las bandas y las acciones ofensivas desde los costados." },
                            { name: "Juego directo", desc: "Apuesta por avanzar rápidamente mediante pases largos y ataques verticales." },
                            { name: "Contraataque", desc: "Aprovecha los espacios del rival tras recuperar la posesión." }
                        ] as item, i}
                            <div class="flex gap-4">
                                <span class="text-[#00FF66] font-black text-sm mt-1">0{i + 1}</span>
                                <div>
                                    <h4 class="font-bold text-sm mb-1">{item.name}</h4>
                                    <p class="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- DEFENSIVOS -->
                <div class="bg-[#0E131F] border border-[#00F0FF]/15 rounded-2xl p-7">
                    <div class="flex items-center gap-3 mb-7">
                        <div class="w-11 h-11 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF]">
                            <ShieldCheck size={22} />
                        </div>
                        <div>
                            <h3 class="text-xl font-bold">Estilos defensivos</h3>
                            <p class="text-xs text-gray-500 uppercase tracking-wider">Cómo defienden los equipos</p>
                        </div>
                    </div>

                    <div class="space-y-5">
                        {#each [
                            { name: "Presión alta", desc: "Intenta recuperar el balón cerca del área rival y dificultar su salida." },
                            { name: "Bloque medio", desc: "Mantiene una estructura equilibrada para controlar espacios y limitar al adversario." },
                            { name: "Bloque bajo", desc: "Prioriza la protección del área propia y reduce los espacios disponibles." }
                        ] as item, i}
                            <div class="flex gap-4">
                                <span class="text-[#00F0FF] font-black text-sm mt-1">0{i + 1}</span>
                                <div>
                                    <h4 class="font-bold text-sm mb-1">{item.name}</h4>
                                    <p class="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- ANALISIS -->
    <section class="max-w-6xl mx-auto px-5 py-20">
        <div class="text-center max-w-2xl mx-auto mb-14">
            <span class="text-[#00FF66] text-xs font-bold tracking-widest uppercase">
                ANÁLISIS DE DATOS
            </span>

            <h2 class="text-3xl md:text-4xl font-extrabold mt-4">
                Del historial a la probabilidad.
            </h2>

            <p class="text-gray-400 mt-5 leading-relaxed">
                Estudiamos el comportamiento de equipos y futbolistas
                frente a diferentes contextos tácticos.
            </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">

            <div class="group bg-[#0E131F] border border-white/5 hover:border-[#00FF66]/30 rounded-2xl p-7 transition-all duration-300">
                <div class="w-12 h-12 rounded-xl bg-[#00FF66]/10 text-[#00FF66] flex items-center justify-center mb-6">
                    <Layers3 size={24} />
                </div>

                <h3 class="text-xl font-bold mb-3">Enfrentamientos tácticos</h3>

                <p class="text-gray-400 text-sm leading-relaxed">
                    Analizamos los historiales de encuentros entre equipos con
                    diferentes características ofensivas y defensivas, buscando
                    identificar tendencias y patrones estadísticos relevantes.
                </p>
            </div>

            <div class="group bg-[#0E131F] border border-white/5 hover:border-[#00F0FF]/30 rounded-2xl p-7 transition-all duration-300">
                <div class="w-12 h-12 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center mb-6">
                    <Crosshair size={24} />
                </div>

                <h3 class="text-xl font-bold mb-3">Rendimiento de jugadores</h3>

                <p class="text-gray-400 text-sm leading-relaxed">
                    Estudiamos el comportamiento estadístico individual de los
                    futbolistas frente a rivales con determinados estilos de juego,
                    identificando cómo estos contextos pueden influir en su rendimiento.
                </p>
            </div>

        </div>
    </section>

    <!-- DISCLAIMER -->
    <section class="px-5 pb-20">
        <div class="max-w-5xl mx-auto relative overflow-hidden bg-[#0E131F] border border-purple-500/20 rounded-2xl p-8 md:p-12 text-center">

            <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(112,0,255,0.09),transparent_70%)]"></div>

            <div class="relative">
                <div class="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck size={28} />
                </div>

                <span class="text-purple-400 text-xs font-bold tracking-widest uppercase">
                    IMPORTANTE
                </span>

                <h2 class="text-3xl md:text-4xl font-extrabold mt-4 mb-6">
                    Probabilidades, no certezas.
                </h2>

                <p class="text-gray-400 max-w-3xl mx-auto leading-relaxed mb-5">
                    El fútbol es un deporte imprevisible, condicionado por múltiples
                    factores que ninguna estadística puede anticipar por completo.
                </p>

                <p class="text-gray-400 max-w-3xl mx-auto leading-relaxed mb-7">
                    Los análisis de PredictPro representan estimaciones de probabilidad
                    basadas en datos históricos y patrones estadísticos. No constituyen
                    garantías de resultados futuros ni asesoramiento profesional.
                </p>

                <div class="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-500/20 bg-purple-500/5 text-purple-300 text-sm font-semibold">
                    <Activity size={17} />
                    Herramienta amateur con fines de entretenimiento
                </div>
            </div>
        </div>
    </section>

    <!-- FILOSOFIA -->
    <section class="border-t border-white/5 bg-[#0A0E17] px-5 py-20 text-center">
        <div class="max-w-3xl mx-auto">
            <span class="text-[#00FF66] text-xs font-bold tracking-widest uppercase">
                NUESTRA FILOSOFÍA
            </span>

            <h2 class="text-3xl md:text-5xl font-black mt-5 leading-tight">
                Cada partido cuenta una historia.
                <span class="block text-transparent bg-clip-text bg-gradient-to-r from-[#00FF66] to-[#00F0FF] mt-2">
                    Nosotros analizamos sus datos.
                </span>
            </h2>

            <p class="text-gray-400 mt-7 leading-relaxed">
                Nuestro propósito es explorar los datos, comprender los estilos
                de juego y ofrecer una nueva forma de observar y disfrutar el fútbol.
            </p>

            <div class="mt-10">
                <a href="/"
                    class="inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-[#00FF66] text-black font-extrabold text-sm hover:bg-[#00e65c] transition-all hover:scale-105">
                    Explorar PredictPro
                    <ArrowRight size={18} />
                </a>
            </div>

            <p class="text-gray-600 text-xs font-bold tracking-[0.3em] mt-14 uppercase">
                PredictPro · Football Analytics
            </p>
        </div>
    </section>

</div>
