
<script>
// @ts-nocheck
    import playerTeam from "../../../conexiones/playerAxios.js";
    import playerstatsAxios from "../../../conexiones/playerStatsAxios.js";
    import NavBar from "#lib/components/NavBar.svelte";
    let { data } = $props();

    let partidos = $derived(data.partidos ?? []);
    let jugadores = $derived(data.jugadores ?? []);

    // FILTROS GENERALES
    let filtroCompeticion = $state("Todos");

    const competiciones = [
        "Todos",
        "Liga",
        "Copa",
        "Champions",
        "Euro"
    ];

    // FILTROS DEL RIVAL
    let filtroPuntuacionRival = $state("Todos");
    let filtroDefensivoRival = $state("Todos");
    let filtroOfensivoRival = $state("Todos");

    const estilosOfensivos = [
        "juego_interior",
        "juego_directo",
        "juego_exterior",
        "contraataque"
    ];

    const estilosDefensivos = [
        "presion_alta",
        "bloque_medio",
        "bloque_bajo"
    ];

    let mostrarTodos = $state(false);

    

    // BUSCAR EL CLUB EN EL HISTORIAL
    let club = $derived(
        partidos
            .flatMap(partido => [
                partido.team1,
                partido.team2
            ])
            .find(equipo =>
                equipo?._id?.toString() === data.equipoId?.toString()
            )
    );

    // NORMALIZAR TODOS LOS ENCUENTROS
    let partidosAnalizados = $derived(
        partidos.map(partido => {

            const equipoId = String(data.equipoId);

            const idTeam1 = partido.team1?._id?.toString();
            const idTeam2 = partido.team2?._id?.toString();

            const esTeam1 = idTeam1 === equipoId;
            const esTeam2 = idTeam2 === equipoId;

            // Comprobar que el equipo participa
            if (!esTeam1 && !esTeam2) return null;

            // Equipo analizado
            const equipo = esTeam1
                ? partido.team1
                : partido.team2;

            // Rival
            const rival = esTeam1
                ? partido.team2
                : partido.team1;

            // Goles del equipo analizado
            const golesFavor = Number(
                esTeam1
                    ? partido.golesteam1
                    : partido.golesteam2
            ) || 0;

            // Goles recibidos
            const golesContra = Number(
                esTeam1
                    ? partido.golesteam2
                    : partido.golesteam1
            ) || 0;

            // Córners del equipo analizado
            const cornersFavor = Number(
                esTeam1
                    ? partido.cornersteam1
                    : partido.cornersteam2
            ) || 0;

            // Córners del rival
            const cornersContra = Number(
                esTeam1
                    ? partido.cornersteam2
                    : partido.cornersteam1
            ) || 0;

            // Determinar resultado
            let resultado = "empate";

            if (golesFavor > golesContra) {
                resultado = "victoria";
            } else if (golesFavor < golesContra) {
                resultado = "derrota";
            }

            return {
                id: partido._id,

                equipo: {
                    nombre: equipo?.nombre,
                    puntuacion: equipo?.puntuacion
                },

                rival: {
                    id: rival?._id,
                    nombre: rival?.nombre,
                    puntuacion: Number(rival?.puntuacion) || 0,

                    estiloOfensivo: esTeam1
                        ? partido.estiloofteam2
                        : partido.estiloofteam1,

                    estiloDefensivo: esTeam1
                        ? partido.estilodefteam2
                        : partido.estilodefteam1
                },

                golesFavor,
                golesContra,
                cornersFavor,
                cornersContra,

                resultado,

                competicion: partido.competicion,
                temporada: partido.temporada,

                estiloOfensivo: esTeam1
                    ? partido.estiloofteam1
                    : partido.estiloofteam2,

                estiloDefensivo: esTeam1
                    ? partido.estilodefteam1
                    : partido.estilodefteam2,

                local: esTeam1
            };
        }).filter(Boolean)
    );

    // FILTRAR POR COMPETICIÓN
    let partidosFiltrados = $derived(
        filtroCompeticion === "Todos"
            ? partidos
            : partidos.filter(
                partido => partido.competicion === filtroCompeticion
            )
    );

    // MOSTRAR TRES O TODOS
    let partidosVisibles = $derived(
        mostrarTodos
            ? partidosFiltrados
            : partidosFiltrados.slice(0, 3)
    );

    // FILTRAR ENCUENTROS SEGÚN EL PERFIL DEL RIVAL
    let partidosPorRival = $derived(
        partidosAnalizados.filter(partido => {

            const coincideCompeticion =
                filtroCompeticion === "Todos" ||
                partido.competicion === filtroCompeticion;

            const coincidePuntuacion =
                filtroPuntuacionRival === "Todos" ||
                partido.rival.puntuacion === Number(filtroPuntuacionRival);

            const coincideDefensivo =
                filtroDefensivoRival === "Todos" ||
                partido.rival.estiloDefensivo === filtroDefensivoRival;

            const coincideOfensivo =
                filtroOfensivoRival === "Todos" ||
                partido.rival.estiloOfensivo === filtroOfensivoRival;

            return (
                coincideCompeticion &&
                coincidePuntuacion &&
                coincideDefensivo &&
                coincideOfensivo
            );
        })
    );
    let modalEstadisticas = $state(false);
    let partidoSeleccionado = $state(null);

    let jugadoresTeam1 = $state([]);
    let jugadoresTeam2 = $state([]);

    let registrosEstadisticas = $state([]);

    let cargandoJugadores = $state(false);
    let guardandoEstadisticas = $state(false);

    let errorEstadisticas = $state("");
    let mensajeEstadisticas = $state("");

    // IDs registrados durante la sesión actual
    let partidosRegistradosLocal = $state(new Set());

    // CALCULAR VICTORIAS, EMPATES Y DERROTAS
    function calcularRendimiento(lista) {

        const total = lista.length;

        const victorias = lista.filter(
            p => p.resultado === "victoria"
        ).length;

        const empates = lista.filter(
            p => p.resultado === "empate"
        ).length;

        const derrotas = lista.filter(
            p => p.resultado === "derrota"
        ).length;

        return {
            total,
            victorias,
            empates,
            derrotas,

            porcentajeVictorias: total
                ? (victorias / total) * 100
                : 0,

            porcentajeEmpates: total
                ? (empates / total) * 100
                : 0,

            porcentajeDerrotas: total
                ? (derrotas / total) * 100
                : 0
        };
    }

    // CALCULAR PROMEDIOS ESTADÍSTICOS
    function calcularPromedios(lista) {

        const total = lista.length;

        if (!total) {
            return {
                golesFavor: 0,
                golesContra: 0,
                cornersFavor: 0,
                cornersContra: 0
            };
        }

        const suma = (campo) =>
            lista.reduce((acumulado, partido) => {
                return acumulado + partido[campo];
            }, 0);

        return {
            golesFavor: suma("golesFavor") / total,
            golesContra: suma("golesContra") / total,
            cornersFavor: suma("cornersFavor") / total,
            cornersContra: suma("cornersContra") / total
        };
    }

    // ESTADÍSTICAS DINÁMICAS
    let rendimientoRival = $derived(
        calcularRendimiento(partidosPorRival)
    );

    let promediosRival = $derived(
        calcularPromedios(partidosPorRival)
    );

    // CAMBIAR FILTRO DE COMPETICIÓN
    function cambiarFiltro(competicion) {
        filtroCompeticion = competicion;
        mostrarTodos = false;
    }

    // REINICIAR FILTROS DEL ANÁLISIS
    function reiniciarFiltrosRival() {
        filtroPuntuacionRival = "Todos";
        filtroDefensivoRival = "Todos";
        filtroOfensivoRival = "Todos";
    }

    // FORMATEAR ESTILOS
    function formatoEstilo(valor) {
        if (!valor) return "—";

        return valor
            .replaceAll("_", " ")
            .replace(/\b\w/g, letra => letra.toUpperCase());
    }

    // CALCULAR PORCENTAJES DEL CLUB
    function porcentaje(valor) {
        if (!club || !club.totalencuentros) return 0;

        return (valor / club.totalencuentros) * 100;
    }
    $effect(() => {
    console.log("PARTIDOS NORMALIZADOS:", partidosAnalizados);
    console.log("PARTIDOS FILTRADOS:", partidosPorRival);
    console.log("RENDIMIENTO:", rendimientoRival);
    console.log("PROMEDIOS:", promediosRival);
});
    // modal

    let modalAnalisis = $state(false);

    // Abrir modal
    function abrirAnalisis() {
        modalAnalisis = true;
    }

    // Cerrar modal
    function cerrarAnalisis() {
        modalAnalisis = false;
    }

    async function abrirModalEstadisticas(partido) {

    const matchId = String(partido._id);

    // Evitar registrar un encuentro ya completado
    if (
        partido.estadisticasRegistradas === true ||
        partidosRegistradosLocal.has(matchId)
    ) {
        return;
    }

    partidoSeleccionado = partido;

    modalEstadisticas = true;
    cargandoJugadores = true;

    errorEstadisticas = "";
    mensajeEstadisticas = "";

    registrosEstadisticas = [];

    try {

        // Obtener jugadores de ambos equipos
        const [responseTeam1, responseTeam2] = await Promise.all([
            playerTeam.get(`/${partido.team1._id}`),
            playerTeam.get(`/${partido.team2._id}`)
        ]);

        jugadoresTeam1 = responseTeam1.data.players ?? [];
        jugadoresTeam2 = responseTeam2.data.players ?? [];

        // Preparar formulario del equipo 1
        const registrosTeam1 = jugadoresTeam1.map(jugador => ({
            player: jugador._id,
            nombre: jugador.nombre,
            apellidos: jugador.apellidos,
            posicion: jugador.posicion,
            equipoNombre: partido.team1.nombre,
            equipoId: partido.team1._id,
            seleccionado: false,
            goles: 0,
            asistencias: 0,
            tirospuerta: 0,
            faltascometidaspartido: 0,
            faltasrecibidaspartido: 0
        }));

        // Preparar formulario del equipo 2
        const registrosTeam2 = jugadoresTeam2.map(jugador => ({
            player: jugador._id,
            nombre: jugador.nombre,
            apellidos: jugador.apellidos,
            posicion: jugador.posicion,
            equipoNombre: partido.team2.nombre,
            equipoId: partido.team2._id,
            seleccionado: false,
            goles: 0,
            asistencias: 0,
            tirospuerta: 0,
            faltascometidaspartido: 0,
            faltasrecibidaspartido: 0
        }));

        registrosEstadisticas = [
            ...registrosTeam1,
            ...registrosTeam2
        ];

    } catch (error) {

        console.error("ERROR AL CARGAR JUGADORES:", error);

        errorEstadisticas =
            "No se pudieron cargar los jugadores de ambos equipos.";

    } finally {

        cargandoJugadores = false;
    }
    }


    // CERRAR MODAL
    function cerrarModalEstadisticas() {

    if (guardandoEstadisticas) return;

    modalEstadisticas = false;
    partidoSeleccionado = null;

    registrosEstadisticas = [];
    errorEstadisticas = "";
    }


    // REGISTRAR ESTADÍSTICAS DE AMBOS EQUIPOS
    async function guardarEstadisticas() {

    if (!partidoSeleccionado || guardandoEstadisticas) return;

    errorEstadisticas = "";
    mensajeEstadisticas = "";

    const jugadoresSeleccionados = registrosEstadisticas.filter(
        registro => registro.seleccionado
    );

    if (jugadoresSeleccionados.length === 0) {

        errorEstadisticas =
            "Selecciona al menos un jugador para registrar sus estadísticas.";

        return;
    }

    guardandoEstadisticas = true;

    try {

        const datos = {
            match: partidoSeleccionado._id,

            estadisticas: jugadoresSeleccionados.map(jugador => ({
                player: jugador.player,
                goles: Number(jugador.goles),
                asistencias: Number(jugador.asistencias),
                tirospuerta: Number(jugador.tirospuerta),
                faltascometidaspartido: Number(
                    jugador.faltascometidaspartido
                ),
                faltasrecibidaspartido: Number(
                    jugador.faltasrecibidaspartido
                )
            }))
        };

        await playerstatsAxios.post("/", datos);

        // Actualizar estado local del encuentro
        const matchId = String(partidoSeleccionado._id);

        partidosRegistradosLocal = new Set([
            ...partidosRegistradosLocal,
            matchId
        ]);

        partidoSeleccionado.estadisticasRegistradas = true;

        mensajeEstadisticas =
            "Estadísticas registradas correctamente.";

        modalEstadisticas = false;

        partidoSeleccionado = null;

        registrosEstadisticas = [];

    } catch (error) {

        console.error("ERROR AL GUARDAR ESTADÍSTICAS:", error);

        errorEstadisticas =
            error.response?.data?.message ||
            "No se pudieron registrar las estadísticas.";

    } finally {

        guardandoEstadisticas = false;
    }
    }
</script>

<NavBar />
<section class="min-h-screen bg-[#0b1117] text-white p-6">
    
    <div class="max-w-7xl mx-auto">

        <!-- CABECERA -->

        <div class="mb-8">

            <span class="text-[#00ff66] text-xs font-bold tracking-[3px]">
                PREDICTPRO / ESTADÍSTICAS
            </span>

            <h1 class="text-3xl font-black mt-2">
                Historial de encuentros
            </h1>

            <p class="text-gray-500 text-sm mt-2">
                Comparativa estadística de todos los partidos registrados.
            </p>

        </div>


        <!-- PERFIL DEL CLUB -->

        {#if club}

            <section class="mb-10">

                <div class="bg-[#111a22] border border-white/10 rounded-2xl p-6">

                    <!-- INFORMACIÓN PRINCIPAL -->

                    <div class="flex flex-col md:flex-row items-center gap-6">

                        <!-- ESCUDO -->

                        <div class="w-28 h-28 flex items-center justify-center bg-[#0b1117] rounded-2xl border border-white/10 shrink-0">

                            <img
                                src={club.escudo}
                                alt={club.nombre}
                                class="w-20 h-20 object-contain"
                            />

                        </div>

                        <!-- NOMBRE Y PAÍS -->

                        <div class="flex-1 text-center md:text-left">

                            <span class="text-xs text-[#00ff66] font-bold tracking-widest">
                                PERFIL DEL CLUB
                            </span>

                            <h2 class="text-3xl font-black mt-2">
                                {club.nombre}
                            </h2>

                            <p class="text-sm text-gray-500 mt-1">
                                {club.pais}
                            </p>

                            <!-- PUNTUACIÓN -->

                            <div class="flex justify-center md:justify-start gap-1 mt-3">

                                {#each Array(5) as _, i}

                                    <span
                                        class="text-xl"
                                        class:text-[#00ff66]={i < club.puntuacion}
                                        class:text-gray-700={i >= club.puntuacion}
                                    >
                                        ★
                                    </span>

                                {/each}

                            </div>

                        </div>

                        <!-- TOTAL ENCUENTROS -->

                        <div class="text-center bg-[#0b1117] border border-white/10 rounded-xl p-5 min-w-32">

                            <span class="block text-3xl font-black text-[#00ff66]">
                                {club.totalencuentros}
                            </span>

                            <span class="text-[10px] text-gray-500 font-bold tracking-widest">
                                ENCUENTROS
                            </span>

                        </div>

                    </div>


                    <!-- ESTADÍSTICAS GENERALES -->

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">

                        <div class="bg-[#0b1117] rounded-xl p-4 border border-white/5">

                            <span class="text-xs text-gray-500">
                                Goles a favor
                            </span>

                            <p class="text-2xl font-black mt-1">
                                {club.golesafavor}
                            </p>

                        </div>

                        <div class="bg-[#0b1117] rounded-xl p-4 border border-white/5">

                            <span class="text-xs text-gray-500">
                                Goles en contra
                            </span>

                            <p class="text-2xl font-black mt-1">
                                {club.golesencontra}
                            </p>

                        </div>

                        <div class="bg-[#0b1117] rounded-xl p-4 border border-white/5">

                            <span class="text-xs text-gray-500">
                                Victorias
                            </span>

                            <p class="text-2xl font-black text-[#00ff66] mt-1">
                                {club.encuentrosganados}
                            </p>

                        </div>

                        <div class="bg-[#0b1117] rounded-xl p-4 border border-white/5">

                            <span class="text-xs text-gray-500">
                                Córners creados
                            </span>

                            <p class="text-2xl font-black mt-1">
                                {club.cornerscreados}
                            </p>

                        </div>

                    </div>


                    <!-- BARRA DE RENDIMIENTO -->

                    <div class="mt-7">

                        <div class="flex justify-between text-xs mb-3">

                            <span class="text-gray-500 font-bold tracking-wider">
                                RENDIMIENTO
                            </span>

                            <span class="text-[#00ff66] font-bold">
                                {porcentaje(club.encuentrosganados).toFixed(1)}% victorias
                            </span>

                        </div>

                        <div class="flex h-3 overflow-hidden rounded-full bg-gray-800">

                            {#if club.totalencuentros > 0}

                                <div
                                    class="bg-[#00ff66]"
                                    style={`width: ${porcentaje(club.encuentrosganados)}%`}
                                ></div>

                                <div
                                    class="bg-yellow-400"
                                    style={`width: ${porcentaje(club.encuentrosempatados)}%`}
                                ></div>

                                <div
                                    class="bg-red-500"
                                    style={`width: ${porcentaje(club.encuentrosperdidos)}%`}
                                ></div>

                            {/if}

                        </div>

                        <div class="flex flex-wrap gap-4 mt-3 text-[10px] font-bold">

                            <span class="text-[#00ff66]">
                                ● {club.encuentrosganados} VICTORIAS
                            </span>

                            <span class="text-yellow-400">
                                ● {club.encuentrosempatados} EMPATES
                            </span>

                            <span class="text-red-500">
                                ● {club.encuentrosperdidos} DERROTAS
                            </span>

                        </div>

                    </div>
                    <div class="mt-8 flex justify-center">
                        <button
                            onclick={abrirAnalisis}
                            class="flex items-center gap-3 px-7 py-4 rounded-xl bg-[#00ff66] text-[#0b1117] font-black text-sm hover:bg-[#00e65c] transition duration-300 shadow-lg shadow-[#00ff66]/10"
                        >
                            <span>ANÁLISIS ESTADÍSTICO PRO</span>
                            <span>↗</span>
                        </button>
                    </div>
                </div>

            </section>

        {/if}


        <!-- FILTROS DE COMPETICIÓN -->

        <section class="mb-7">

            <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-5">

                <div>

                    <span class="text-[#00ff66] text-xs font-bold tracking-widest">
                        ANÁLISIS DE RENDIMIENTO
                    </span>

                    <h2 class="text-2xl font-black mt-1">
                        Historial de encuentros
                    </h2>

                    <p class="text-gray-500 text-sm mt-2">
                        {partidosFiltrados.length} encuentros encontrados
                    </p>

                </div>

                <!-- BOTONES DE FILTRO -->

                <div class="flex flex-wrap gap-2">

                    {#each competiciones as competicion}

                    <button
                    onclick={() => cambiarFiltro(competicion)}
                    class={`px-4 py-2 rounded-lg text-xs font-bold transition border ${
                        filtroCompeticion === competicion
                            ? "bg-[#00ff66] text-[#0b1117] border-[#00ff66]"
                            : "bg-[#111a22] text-gray-400 border-white/10"
                    }`}
                >
                    {competicion}
                </button>

                    {/each}

                </div>

            </div>

        </section>


        <!-- GRID DE PARTIDOS -->

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {#each partidosVisibles as partido (partido._id)}

                <article class="bg-[#111a22] border border-white/10 rounded-2xl overflow-hidden hover:border-[#00ff66]/40 transition duration-300">

                    <!-- CABECERA DEL PARTIDO -->

                    <div class="p-5 border-b border-white/10">

                        <div class="flex justify-between items-center mb-5">

                            <span class="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                                {partido.competicion || "Competición"}
                            </span>

                            <span class="text-[10px] text-[#00ff66] bg-[#00ff66]/10 px-2 py-1 rounded-md">
                                {partido.temporada || "Temporada"}
                            </span>

                        </div>

                        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">

                            <!-- EQUIPO 1 -->

                            <div class="flex flex-col items-center text-center gap-2 min-w-0">

                                <img
                                    src={partido.team1?.escudo}
                                    alt={partido.team1?.nombre || "Equipo 1"}
                                    class="w-14 h-14 object-contain"
                                />

                                <span class="text-xs font-bold text-gray-300 line-clamp-2">
                                    {partido.team1?.nombre || "Equipo 1"}
                                </span>

                            </div>


                            <!-- RESULTADO -->

                            <div class="flex flex-col items-center">

                                <span class="text-[9px] text-gray-500 font-bold tracking-widest mb-1">
                                    RESULTADO
                                </span>

                                <div class="flex items-center gap-3 bg-[#0b1117] border border-white/10 rounded-xl px-4 py-3">

                                    <span class="text-2xl font-black text-white tabular-nums">
                                        {partido.golesteam1 ?? 0}
                                    </span>

                                    <span class="text-gray-600 font-bold">
                                        :
                                    </span>

                                    <span class="text-2xl font-black text-white tabular-nums">
                                        {partido.golesteam2 ?? 0}
                                    </span>

                                </div>

                            </div>


                            <!-- EQUIPO 2 -->

                            <div class="flex flex-col items-center text-center gap-2 min-w-0">

                                <img
                                    src={partido.team2?.escudo}
                                    alt={partido.team2?.nombre || "Equipo 2"}
                                    class="w-14 h-14 object-contain"
                                />

                                <span class="text-xs font-bold text-gray-300 line-clamp-2">
                                    {partido.team2?.nombre || "Equipo 2"}
                                </span>

                            </div>

                        </div>

                    </div>


                    <!-- TABLA ESTADÍSTICA -->

                    <div class="p-4">

                        <div class="grid grid-cols-[1fr_1fr_1fr] items-center gap-2 mb-3">

                            <span class="text-[9px] text-gray-600 font-bold tracking-wider">
                                ESTADÍSTICA
                            </span>

                            <span class="text-[9px] text-[#00ff66] font-bold text-center">
                                LOCAL
                            </span>

                            <span class="text-[9px] text-[#00ff66] font-bold text-center">
                                VISITANTE
                            </span>

                        </div>


                        <div class="space-y-1">

                            <!-- GOLES -->

                            <div class="grid grid-cols-[1fr_1fr_1fr] items-center gap-2 py-3 border-b border-white/5">

                                <span class="text-xs text-gray-400 font-semibold">
                                    Goles
                                </span>

                                <span class="text-center text-lg font-black text-white">
                                    {partido.golesteam1 ?? 0}
                                </span>

                                <span class="text-center text-lg font-black text-white">
                                    {partido.golesteam2 ?? 0}
                                </span>

                            </div>


                            <!-- CÓRNERS -->

                            <div class="grid grid-cols-[1fr_1fr_1fr] items-center gap-2 py-3 border-b border-white/5">

                                <span class="text-xs text-gray-400 font-semibold">
                                    Córners
                                </span>

                                <span class="text-center text-lg font-bold text-white">
                                    {partido.cornersteam1 ?? 0}
                                </span>

                                <span class="text-center text-lg font-bold text-white">
                                    {partido.cornersteam2 ?? 0}
                                </span>

                            </div>


                            <!-- ESTILO OFENSIVO -->

                            <div class="grid grid-cols-[1fr_1fr_1fr] items-center gap-2 py-3 border-b border-white/5">

                                <span class="text-xs text-gray-400 font-semibold">
                                    Estilo ofensivo
                                </span>

                                <span class="text-center text-[11px] text-[#00ff66] font-bold capitalize">
                                    {formatoEstilo(partido.estiloofteam1)}
                                </span>

                                <span class="text-center text-[11px] text-[#00ff66] font-bold capitalize">
                                    {formatoEstilo(partido.estiloofteam2)}
                                </span>

                            </div>


                            <!-- ESTILO DEFENSIVO -->

                            <div class="grid grid-cols-[1fr_1fr_1fr] items-center gap-2 py-3">

                                <span class="text-xs text-gray-400 font-semibold">
                                    Estilo defensivo
                                </span>

                                <span class="text-center text-[11px] text-blue-400 font-bold capitalize">
                                    {formatoEstilo(partido.estilodefteam1)}
                                </span>

                                <span class="text-center text-[11px] text-blue-400 font-bold capitalize">
                                    {formatoEstilo(partido.estilodefteam2)}
                                </span>

                            </div>

                        </div>

                    </div>


                    <!-- PIE DE TARJETA -->

                    <div class="px-5 py-3 bg-[#0b1117]/70 border-t border-white/5 flex justify-between items-center">

                        <span class="text-[9px] text-gray-600 font-bold tracking-widest">
                            PREDICTPRO DATA
                        </span>

                        <span class="text-[9px] text-gray-500">
                            ID: {partido._id?.slice(-6).toUpperCase()}
                        </span>

                    </div>

                    <!-- REGISTRO DE ESTADÍSTICAS INDIVIDUALES -->
                    <div class="p-4 border-t border-white/5">

                        {#if partido.estadisticasRegistradas === true || partidosRegistradosLocal.has(String(partido._id))}

                            <div class="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
                                <span>✓</span>
                                ESTADÍSTICAS REGISTRADAS
                            </div>

                        {:else}

                            <button
                                type="button"
                                onclick={() => abrirModalEstadisticas(partido)}
                                class="w-full py-3 rounded-xl bg-[#00ff66] text-[#0b1117] font-black text-xs hover:bg-[#00e65c] transition"
                            >
                                + AÑADIR ESTADÍSTICAS DE JUGADORES
                            </button>

                        {/if}

                    </div>

                </article>

            {/each}

        </div>


        <!-- SIN PARTIDOS -->

        {#if partidosFiltrados.length === 0}

            <div class="text-center py-16 border border-white/10 rounded-2xl">

                <p class="text-gray-500">
                    No hay encuentros registrados en esta competición.
                </p>

            </div>

        {/if}


        <!-- BOTÓN VER MÁS -->

        {#if partidosFiltrados.length > 3}

            <div class="flex justify-center mt-8">

                <button
                    onclick={() => mostrarTodos = !mostrarTodos}
                    class="px-8 py-3 rounded-xl bg-[#111a22] border border-[#00ff66]/30 text-[#00ff66] font-bold text-sm hover:bg-[#00ff66] hover:text-[#0b1117] transition duration-300"
                >

                    {mostrarTodos
                        ? "Ver menos"
                        : "Ver todos los partidos"}

                    <span class="ml-2">
                        {mostrarTodos ? "↑" : "↓"}
                    </span>

                </button>

            </div>

        {/if}

    </div>
    <!-- PLANTILLA DE JUGADORES -->
<!-- PLANTILLA DE JUGADORES -->
<section class="mt-12 p-16">

    <!-- CABECERA -->
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-7 gap-3">
        <div>
            <span class="text-[#00ff66] text-xs font-bold tracking-[3px]">
                PREDICTPRO / PLAYER DATA
            </span>
            <h2 class="text-2xl font-black mt-2 text-white">
                Rendimiento de jugadores
            </h2>
            <p class="text-gray-500 text-sm mt-2">
                Análisis individual de rendimiento y estadísticas.
            </p>
        </div>

        <span class="text-xs text-gray-500 bg-[#111a22] border border-white/10 px-4 py-2 rounded-lg">
            {jugadores.length} jugadores registrados
        </span>
    </div>

    <!-- GRID -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {#each jugadores as jugador (jugador._id)}

            <article class="relative bg-[#111a22] rounded-2xl border border-white/10 overflow-hidden group hover:border-[#00ff66]/50 transition-all duration-300">

                <!-- FRANJA SUPERIOR -->
                <div class="h-1 bg-gradient-to-r from-[#00ff66] via-[#00ff66]/40 to-transparent"></div>

                <!-- PERFIL -->
                <div class="p-5">

                    <div class="flex items-center gap-4">

                        <!-- AVATAR -->
                        <div class="w-20 h-20 shrink-0 rounded-2xl bg-[#0b1117] border border-[#00ff66]/20 p-1 overflow-hidden">
                            <img
                                src="/imagenes/avatar.png"
                                alt="Avatar de {jugador.nombre}"
                                class="w-full h-full object-cover rounded-xl"
                            />
                        </div>

                        <!-- NOMBRE Y POSICIÓN -->
                        <div class="flex-1 min-w-0">
                            <span class="text-[9px] text-gray-500 font-bold tracking-[2px]">
                                JUGADOR
                            </span>

                            <h3 class="text-lg font-black text-white mt-1 truncate">
                                {jugador.nombre} {jugador.apellidos}
                            </h3>

                            <span class="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-[#00ff66] bg-[#00ff66]/10 border border-[#00ff66]/20 px-3 py-1 rounded-md">
                                {jugador.posicion || "Sin posición"}
                            </span>
                        </div>

                    </div>

                    <!-- ESTADÍSTICA PRINCIPAL -->
                    <div class="grid grid-cols-2 gap-3 mt-6">

                        <div class="bg-[#0b1117] rounded-xl p-4 border border-white/5">
                            <span class="text-[10px] text-gray-500 font-bold tracking-wider">
                                GOLES
                            </span>
                            <div class="flex items-end justify-between mt-2">
                                <span class="text-3xl font-black text-[#00ff66]">
                                    {jugador.goles ?? 0}
                                </span>
                                <span class="text-[10px] text-gray-600 mb-1">GOL</span>
                            </div>
                        </div>

                        <div class="bg-[#0b1117] rounded-xl p-4 border border-white/5">
                            <span class="text-[10px] text-gray-500 font-bold tracking-wider">
                                ASISTENCIAS
                            </span>
                            <div class="flex items-end justify-between mt-2">
                                <span class="text-3xl font-black text-white">
                                    {jugador.asistencias ?? 0}
                                </span>
                                <span class="text-[10px] text-gray-600 mb-1">AST</span>
                            </div>
                        </div>

                    </div>

                    <!-- ESTADÍSTICAS SECUNDARIAS -->
                    <div class="mt-5">

                        <div class="flex justify-between items-center mb-3">
                            <span class="text-[10px] text-gray-500 font-bold tracking-widest">
                                DATOS DE RENDIMIENTO
                            </span>
                            <span class="text-[9px] text-[#00ff66] font-bold">
                                ESTADÍSTICAS
                            </span>
                        </div>

                        <div class="space-y-3">

                            <!-- ENCUENTROS -->
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-gray-400">Encuentros disputados</span>
                                <span class="text-sm font-bold text-white tabular-nums">
                                    {jugador.encuentros ?? 0}
                                </span>
                            </div>

                            <div class="h-px bg-white/5"></div>

                            <!-- TIROS -->
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-gray-400">Tiros a puerta</span>
                                <span class="text-sm font-bold text-white tabular-nums">
                                    {jugador.tirospuerta ?? 0}
                                </span>
                            </div>

                            <div class="h-px bg-white/5"></div>

                            <!-- FALTAS RECIBIDAS -->
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-gray-400">Faltas recibidas</span>
                                <span class="text-sm font-bold text-blue-400 tabular-nums">
                                    {jugador.faltasrecibidas ?? 0}
                                </span>
                            </div>

                            <div class="h-px bg-white/5"></div>

                            <!-- FALTAS COMETIDAS -->
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-gray-400">Faltas cometidas</span>
                                <span class="text-sm font-bold text-red-400 tabular-nums">
                                    {jugador.faltascometidas ?? 0}
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

                <!-- FOOTER -->
                <div class="px-5 py-3 bg-[#0b1117]/80 border-t border-white/5 flex justify-between items-center">
                    <span class="text-[9px] text-gray-600 font-bold tracking-widest">
                        PREDICTPRO
                    </span>

                    <span class="text-[9px] text-gray-500 font-mono">
                        PLAYER #{jugador._id?.slice(-6).toUpperCase() || "------"}
                    </span>
                </div>

            </article>

        {/each}

    </div>

    {#if jugadores.length === 0}
        <div class="text-center py-16 border border-white/10 rounded-2xl">
            <p class="text-gray-500 text-sm">
                No hay jugadores registrados para este equipo.
            </p>
        </div>
    {/if}

</section>

{#if modalEstadisticas}

<div
    class="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
    role="presentation"
    onclick={cerrarModalEstadisticas}
>

    <div
        class="bg-[#0b1117] border border-white/10 rounded-2xl w-full max-w-7xl max-h-[94vh] overflow-y-auto shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-estadisticas"
        onclick={(e) => e.stopPropagation()}
    >

        <!-- CABECERA -->

        <div class="sticky top-0 z-20 bg-[#111a22] border-b border-white/10 p-5 md:p-6 flex justify-between items-center gap-4">

            <div>
                <span class="text-[#00ff66] text-[10px] font-bold tracking-[3px]">
                    PREDICTPRO / PLAYER MATCH DATA
                </span>

                <h2
                    id="titulo-estadisticas"
                    class="text-xl md:text-2xl font-black mt-2"
                >
                    Estadísticas individuales
                </h2>

                <p class="text-gray-500 text-xs mt-1">
                    {partidoSeleccionado?.team1?.nombre}
                    vs
                    {partidoSeleccionado?.team2?.nombre}
                </p>
            </div>

            <button
                type="button"
                onclick={cerrarModalEstadisticas}
                disabled={guardandoEstadisticas}
                class="w-10 h-10 shrink-0 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-red-500 transition"
            >
                ✕
            </button>

        </div>


        <div class="p-5 md:p-7 space-y-8">

            <!-- INFORMACIÓN DEL ENCUENTRO -->

            {#if partidoSeleccionado}

                <div class="grid grid-cols-3 items-center gap-3 bg-[#111a22] border border-white/5 rounded-2xl p-5">

                    <div class="flex flex-col items-center text-center gap-2">

                        <img
                            src={partidoSeleccionado.team1?.escudo}
                            alt={partidoSeleccionado.team1?.nombre}
                            class="w-16 h-16 object-contain"
                        />

                        <span class="text-xs font-bold">
                            {partidoSeleccionado.team1?.nombre}
                        </span>

                    </div>

                    <div class="text-center">

                        <span class="text-[9px] text-gray-500 font-bold tracking-widest">
                            RESULTADO
                        </span>

                        <p class="text-2xl font-black mt-2">
                            {partidoSeleccionado.golesteam1}
                            -
                            {partidoSeleccionado.golesteam2}
                        </p>

                        <span class="text-[9px] text-[#00ff66]">
                            {partidoSeleccionado.competicion}
                        </span>

                    </div>

                    <div class="flex flex-col items-center text-center gap-2">

                        <img
                            src={partidoSeleccionado.team2?.escudo}
                            alt={partidoSeleccionado.team2?.nombre}
                            class="w-16 h-16 object-contain"
                        />

                        <span class="text-xs font-bold">
                            {partidoSeleccionado.team2?.nombre}
                        </span>

                    </div>

                </div>

            {/if}


            {#if cargandoJugadores}

                <div class="py-16 text-center">
                    <p class="text-[#00ff66] font-bold animate-pulse">
                        CARGANDO PLANTILLAS...
                    </p>

                    <p class="text-gray-500 text-xs mt-2">
                        Obteniendo jugadores de ambos equipos
                    </p>
                </div>

            {:else}

                <!-- EQUIPO LOCAL -->

                <section>

                    <div class="flex items-center gap-3 mb-5">

                        <img
                            src={partidoSeleccionado?.team1?.escudo}
                            alt=""
                            class="w-10 h-10 object-contain"
                        />

                        <div>
                            <h3 class="font-black text-white">
                                {partidoSeleccionado?.team1?.nombre}
                            </h3>

                            <p class="text-[10px] text-gray-500">
                                {jugadoresTeam1.length} jugadores disponibles
                            </p>
                        </div>

                    </div>


                    <div class="space-y-3">

                        {#each registrosEstadisticas.filter(j => String(j.equipoId) === String(partidoSeleccionado?.team1?._id)) as jugador (jugador.player)}

                            <div class="bg-[#111a22] border border-white/10 rounded-xl p-4">

                                <div class="flex items-center gap-3 mb-4">

                                    <input
                                        type="checkbox"
                                        bind:checked={jugador.seleccionado}
                                        class="w-5 h-5 accent-[#00ff66]"
                                    />

                                    <div class="flex-1 min-w-0">

                                        <p class="text-sm font-bold text-white">
                                            {jugador.nombre} {jugador.apellidos}
                                        </p>

                                        <p class="text-[10px] text-gray-500">
                                            {jugador.posicion || "Sin posición"}
                                        </p>

                                    </div>

                                    {#if jugador.seleccionado}
                                        <span class="text-[9px] text-[#00ff66] font-bold">
                                            SELECCIONADO
                                        </span>
                                    {/if}

                                </div>


                                <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">

                                    <div>
                                        <label class="text-[10px] text-gray-500 block mb-1">
                                            Goles
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            disabled={!jugador.seleccionado}
                                            bind:value={jugador.goles}
                                            class="w-full bg-[#0b1117] border border-white/10 rounded-lg p-2 text-white text-sm disabled:opacity-30"
                                        />
                                    </div>

                                    <div>
                                        <label class="text-[10px] text-gray-500 block mb-1">
                                            Asistencias
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            disabled={!jugador.seleccionado}
                                            bind:value={jugador.asistencias}
                                            class="w-full bg-[#0b1117] border border-white/10 rounded-lg p-2 text-white text-sm disabled:opacity-30"
                                        />
                                    </div>

                                    <div>
                                        <label class="text-[10px] text-gray-500 block mb-1">
                                            Tiros a puerta
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            disabled={!jugador.seleccionado}
                                            bind:value={jugador.tirospuerta}
                                            class="w-full bg-[#0b1117] border border-white/10 rounded-lg p-2 text-white text-sm disabled:opacity-30"
                                        />
                                    </div>

                                    <div>
                                        <label class="text-[10px] text-gray-500 block mb-1">
                                            Faltas cometidas
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            disabled={!jugador.seleccionado}
                                            bind:value={jugador.faltascometidaspartido}
                                            class="w-full bg-[#0b1117] border border-white/10 rounded-lg p-2 text-white text-sm disabled:opacity-30"
                                        />
                                    </div>

                                    <div>
                                        <label class="text-[10px] text-gray-500 block mb-1">
                                            Faltas recibidas
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            disabled={!jugador.seleccionado}
                                            bind:value={jugador.faltasrecibidaspartido}
                                            class="w-full bg-[#0b1117] border border-white/10 rounded-lg p-2 text-white text-sm disabled:opacity-30"
                                        />
                                    </div>

                                </div>

                            </div>

                        {/each}

                        {#if jugadoresTeam1.length === 0}
                            <p class="text-gray-500 text-sm text-center py-5">
                                No hay jugadores registrados en este equipo.
                            </p>
                        {/if}

                    </div>

                </section>


                <!-- EQUIPO VISITANTE -->

                <section>

                    <div class="flex items-center gap-3 mb-5">

                        <img
                            src={partidoSeleccionado?.team2?.escudo}
                            alt=""
                            class="w-10 h-10 object-contain"
                        />

                        <div>
                            <h3 class="font-black text-white">
                                {partidoSeleccionado?.team2?.nombre}
                            </h3>

                            <p class="text-[10px] text-gray-500">
                                {jugadoresTeam2.length} jugadores disponibles
                            </p>
                        </div>

                    </div>


                    <div class="space-y-3">

                        {#each registrosEstadisticas.filter(j => String(j.equipoId) === String(partidoSeleccionado?.team2?._id)) as jugador (jugador.player)}

                            <div class="bg-[#111a22] border border-white/10 rounded-xl p-4">

                                <div class="flex items-center gap-3 mb-4">

                                    <input
                                        type="checkbox"
                                        bind:checked={jugador.seleccionado}
                                        class="w-5 h-5 accent-[#00ff66]"
                                    />

                                    <div class="flex-1 min-w-0">

                                        <p class="text-sm font-bold text-white">
                                            {jugador.nombre} {jugador.apellidos}
                                        </p>

                                        <p class="text-[10px] text-gray-500">
                                            {jugador.posicion || "Sin posición"}
                                        </p>

                                    </div>

                                    {#if jugador.seleccionado}
                                        <span class="text-[9px] text-[#00ff66] font-bold">
                                            SELECCIONADO
                                        </span>
                                    {/if}

                                </div>


                                <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">

                                    <div>
                                        <label class="text-[10px] text-gray-500 block mb-1">
                                            Goles
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            disabled={!jugador.seleccionado}
                                            bind:value={jugador.goles}
                                            class="w-full bg-[#0b1117] border border-white/10 rounded-lg p-2 text-white text-sm disabled:opacity-30"
                                        />
                                    </div>

                                    <div>
                                        <label class="text-[10px] text-gray-500 block mb-1">
                                            Asistencias
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            disabled={!jugador.seleccionado}
                                            bind:value={jugador.asistencias}
                                            class="w-full bg-[#0b1117] border border-white/10 rounded-lg p-2 text-white text-sm disabled:opacity-30"
                                        />
                                    </div>

                                    <div>
                                        <label class="text-[10px] text-gray-500 block mb-1">
                                            Tiros a puerta
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            disabled={!jugador.seleccionado}
                                            bind:value={jugador.tirospuerta}
                                            class="w-full bg-[#0b1117] border border-white/10 rounded-lg p-2 text-white text-sm disabled:opacity-30"
                                        />
                                    </div>

                                    <div>
                                        <label class="text-[10px] text-gray-500 block mb-1">
                                            Faltas cometidas
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            disabled={!jugador.seleccionado}
                                            bind:value={jugador.faltascometidaspartido}
                                            class="w-full bg-[#0b1117] border border-white/10 rounded-lg p-2 text-white text-sm disabled:opacity-30"
                                        />
                                    </div>

                                    <div>
                                        <label class="text-[10px] text-gray-500 block mb-1">
                                            Faltas recibidas
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            disabled={!jugador.seleccionado}
                                            bind:value={jugador.faltasrecibidaspartido}
                                            class="w-full bg-[#0b1117] border border-white/10 rounded-lg p-2 text-white text-sm disabled:opacity-30"
                                        />
                                    </div>

                                </div>

                            </div>

                        {/each}

                        {#if jugadoresTeam2.length === 0}
                            <p class="text-gray-500 text-sm text-center py-5">
                                No hay jugadores registrados en este equipo.
                            </p>
                        {/if}

                    </div>

                </section>

            {/if}


            <!-- MENSAJES -->

            {#if errorEstadisticas}

                <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                    {errorEstadisticas}
                </div>

            {/if}


            <!-- BOTONES -->

            <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">

                <button
                    type="button"
                    onclick={cerrarModalEstadisticas}
                    disabled={guardandoEstadisticas}
                    class="flex-1 py-4 rounded-xl border border-white/10 text-gray-400 font-bold text-xs hover:bg-white/5 transition"
                >
                    CANCELAR
                </button>

                <button
                    type="button"
                    onclick={guardarEstadisticas}
                    disabled={cargandoJugadores || guardandoEstadisticas}
                    class="flex-1 py-4 rounded-xl bg-[#00ff66] text-[#0b1117] font-black text-xs hover:bg-[#00e65c] disabled:opacity-40 transition"
                >
                    {guardandoEstadisticas
                        ? "GUARDANDO..."
                        : "REGISTRAR ESTADÍSTICAS"}
                </button>

            </div>

        </div>

    </div>

</div>

{/if}

{#if modalAnalisis}
    <div
        class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
        role="presentation"
        onclick={cerrarAnalisis}
        onkeydown={(e) => {
            if (e.key === "Escape") cerrarAnalisis();
        }}
    >
        <div
            class="bg-[#0b1117] border border-white/10 rounded-2xl w-full max-w-7xl max-h-[92vh] overflow-y-auto shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-analisis"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
        >

            <!-- CABECERA -->
            <div class="sticky top-0 z-10 bg-[#111a22] border-b border-white/10 p-5 md:p-7 flex justify-between items-center gap-4">

                <div>
                    <span class="text-[#00ff66] text-[10px] font-bold tracking-[3px]">
                        PREDICTPRO / ADVANCED ANALYTICS
                    </span>

                    <h2 id="titulo-analisis" class="text-xl md:text-2xl font-black text-white mt-2">
                        Análisis de comportamiento
                    </h2>

                    <p class="text-xs text-gray-500 mt-1">
                        {club?.nombre} · Rendimiento según el perfil del rival
                    </p>
                </div>

                <button
                    onclick={cerrarAnalisis}
                    aria-label="Cerrar análisis"
                    class="w-10 h-10 shrink-0 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-red-500 transition"
                >
                    ✕
                </button>

            </div>

            <div class="p-5 md:p-7 space-y-8">

                <!-- FILTROS -->
                <section>
                    <div class="flex justify-between items-center mb-4 gap-3">
                        <h3 class="text-white font-black text-sm">
                            FILTRAR PERFIL DEL RIVAL
                        </h3>

                        <button
                            onclick={reiniciarFiltrosRival}
                            class="text-xs text-[#00ff66] hover:underline"
                        >
                            Reiniciar filtros
                        </button>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        <div>
                            <label class="text-xs text-gray-500 block mb-2">
                                Puntuación del rival
                            </label>

                            <select
                                bind:value={filtroPuntuacionRival}
                                class="w-full bg-[#111a22] border border-white/10 rounded-xl p-3 text-white text-sm"
                            >
                                <option value="Todos">Todas las puntuaciones</option>
                                {#each [1,2,3,4,5] as estrella}
                                    <option value={String(estrella)}>
                                        {estrella} estrellas
                                    </option>
                                {/each}
                            </select>
                        </div>

                        <div>
                            <label class="text-xs text-gray-500 block mb-2">
                                Estilo defensivo
                            </label>

                            <select
                            bind:value={filtroDefensivoRival}
                            class="w-full bg-[#111a22] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00ff66]"
                        >
                            <option value="Todos">Todos los estilos</option>
                            {#each estilosDefensivos as estilo}
                                <option value={estilo}>{formatoEstilo(estilo)}</option>
                            {/each}
                        </select>
                        </div>

                        <div>
                            <label class="text-xs text-gray-500 block mb-2">
                                Estilo ofensivo
                            </label>

                            <select
                            bind:value={filtroOfensivoRival}
                            class="w-full bg-[#111a22] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00ff66]"
                        >
                            <option value="Todos">Todos los estilos</option>
                            {#each estilosOfensivos as estilo}
                                <option value={estilo}>{formatoEstilo(estilo)}</option>
                            {/each}
                            </select>
                        </div>

                    </div>

                    <p class="text-xs text-gray-500 mt-3">
                        Encuentros que cumplen los filtros:
                        <strong class="text-[#00ff66]">
                            {partidosPorRival.length}
                        </strong>
                    </p>
                </section>

                <!-- RESULTADOS -->
                <section>
                    <h3 class="text-white font-black text-sm mb-4">
                        RENDIMIENTO DEL EQUIPO
                    </h3>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">

                        <div class="bg-[#111a22] border border-white/5 rounded-xl p-4">
                            <span class="text-xs text-gray-500">Encuentros</span>
                            <p class="text-3xl font-black text-white mt-2">
                                {rendimientoRival.total}
                            </p>
                        </div>

                        <div class="bg-[#111a22] border border-white/5 rounded-xl p-4">
                            <span class="text-xs text-gray-500">Victorias</span>
                            <p class="text-3xl font-black text-[#00ff66] mt-2">
                                {rendimientoRival.victorias}
                            </p>
                            <span class="text-xs text-gray-500">
                                {rendimientoRival.porcentajeVictorias.toFixed(1)}%
                            </span>
                        </div>

                        <div class="bg-[#111a22] border border-white/5 rounded-xl p-4">
                            <span class="text-xs text-gray-500">Empates</span>
                            <p class="text-3xl font-black text-yellow-400 mt-2">
                                {rendimientoRival.empates}
                            </p>
                            <span class="text-xs text-gray-500">
                                {rendimientoRival.porcentajeEmpates.toFixed(1)}%
                            </span>
                        </div>

                        <div class="bg-[#111a22] border border-white/5 rounded-xl p-4">
                            <span class="text-xs text-gray-500">Derrotas</span>
                            <p class="text-3xl font-black text-red-400 mt-2">
                                {rendimientoRival.derrotas}
                            </p>
                            <span class="text-xs text-gray-500">
                                {rendimientoRival.porcentajeDerrotas.toFixed(1)}%
                            </span>
                        </div>

                    </div>
                </section>

                <!-- PROMEDIOS -->
                <section>
                    <h3 class="text-white font-black text-sm mb-4">
                        PROMEDIOS POR ENCUENTRO
                    </h3>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">

                        <div class="bg-[#111a22] rounded-xl p-4 border border-white/5">
                            <span class="text-xs text-gray-500">Goles a favor</span>
                            <p class="text-2xl font-black text-[#00ff66] mt-2">
                                {promediosRival.golesFavor.toFixed(2)}
                            </p>
                        </div>

                        <div class="bg-[#111a22] rounded-xl p-4 border border-white/5">
                            <span class="text-xs text-gray-500">Goles en contra</span>
                            <p class="text-2xl font-black text-red-400 mt-2">
                                {promediosRival.golesContra.toFixed(2)}
                            </p>
                        </div>

                        <div class="bg-[#111a22] rounded-xl p-4 border border-white/5">
                            <span class="text-xs text-gray-500">Córners generados</span>
                            <p class="text-2xl font-black text-white mt-2">
                                {promediosRival.cornersFavor.toFixed(2)}
                            </p>
                        </div>

                        <div class="bg-[#111a22] rounded-xl p-4 border border-white/5">
                            <span class="text-xs text-gray-500">Córners concedidos</span>
                            <p class="text-2xl font-black text-white mt-2">
                                {promediosRival.cornersContra.toFixed(2)}
                            </p>
                        </div>

                    </div>
                </section>

                <!-- GRÁFICO DE RENDIMIENTO -->
                <section class="bg-[#111a22] rounded-2xl border border-white/5 p-5">

                    <h3 class="text-white font-black text-sm mb-5">
                        DISTRIBUCIÓN DE RESULTADOS
                    </h3>

                    <div class="space-y-5">

                        <div>
                            <div class="flex justify-between text-xs mb-2">
                                <span class="text-[#00ff66]">Victorias</span>
                                <span class="text-white font-bold">
                                    {rendimientoRival.porcentajeVictorias.toFixed(1)}%
                                </span>
                            </div>
                            <div class="h-3 bg-[#0b1117] rounded-full overflow-hidden">
                                <div
                                    class="h-full bg-[#00ff66] rounded-full transition-all duration-500"
                                    style={`width: ${rendimientoRival.porcentajeVictorias}%`}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs mb-2">
                                <span class="text-yellow-400">Empates</span>
                                <span class="text-white font-bold">
                                    {rendimientoRival.porcentajeEmpates.toFixed(1)}%
                                </span>
                            </div>
                            <div class="h-3 bg-[#0b1117] rounded-full overflow-hidden">
                                <div
                                    class="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                    style={`width: ${rendimientoRival.porcentajeEmpates}%`}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs mb-2">
                                <span class="text-red-400">Derrotas</span>
                                <span class="text-white font-bold">
                                    {rendimientoRival.porcentajeDerrotas.toFixed(1)}%
                                </span>
                            </div>
                            <div class="h-3 bg-[#0b1117] rounded-full overflow-hidden">
                                <div
                                    class="h-full bg-red-500 rounded-full transition-all duration-500"
                                    style={`width: ${rendimientoRival.porcentajeDerrotas}%`}
                                ></div>
                            </div>
                        </div>

                    </div>
                </section>

                {#if partidosPorRival.length === 0}
                    <div class="text-center py-10 border border-white/10 rounded-xl">
                        <p class="text-gray-400 font-bold">
                            No hay encuentros con estos filtros.
                        </p>
                        <p class="text-gray-600 text-xs mt-2">
                            Prueba con otros perfiles de rival.
                        </p>
                    </div>
                {/if}

            </div>

            <!-- PIE -->
            <div class="border-t border-white/10 p-4 text-center">
                <span class="text-[10px] text-gray-600 font-bold tracking-widest">
                    PREDICTPRO ADVANCED ANALYTICS
                </span>
            </div>

        </div>
    </div>
{/if}
</section>
