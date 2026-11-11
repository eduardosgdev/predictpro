
<script>
    // @ts-nocheck
    import "#lib/styles/pronostico.css";
    import playerstatsAxios from "../../conexiones/playerStatsAxios.js";
    import matchTeam from "../../conexiones/matchAxios.js";
    import playerTeam from "../../conexiones/playerAxios.js";
    import NavBar from "#lib/components/NavBar.svelte";
    import {
    normalizarHistorial,
    analizarContraCincoEstrellas,
    analizarComportamientoPorEstilo,
    analizarEnfrentamiento,
    analizarJugadorContraEstiloDefensivo
} from "#lib/utils/analisisEquipos.js";
    
    let { data } = $props();
    let pronostico = $state(null);
    let prediccionesJugadores = $state([]);
    // ==========================================
    // 1. EQUIPOS RECIBIDOS DESDE +page.js
    // ==========================================
    let equipoLocalCompleto = $derived(
    equipos.find(e => String(e._id) === String(equipoLocal))
        );

        let equipoVisitanteCompleto = $derived(
            equipos.find(e => String(e._id) === String(equipoVisitante))
);
    let equipos = $derived(data.teams ?? []);
    
    // ==========================================
    // 2. SELECCIÓN DE EQUIPOS
    // ==========================================
    
    let equipoLocal = $state("");
    let equipoVisitante = $state("");
    
    // ==========================================
    // 3. FILTROS INDEPENDIENTES POR PAÍS
    // ==========================================
    
    let filtroPaisLocal = $state("Todos");
    let filtroPaisVisitante = $state("Todos");
    
    let busquedaLocal = $state("");
    let busquedaVisitante = $state("");
    
    // ==========================================
    // 4. LISTA DE PAÍSES
    // ==========================================
    
    let paises = $derived([
        "Todos",
        ...new Set(
            equipos
                .map(team => team.pais)
                .filter(Boolean)
                .sort()
        )
    ]);
    
    // ==========================================
    // 5. FILTRAR EQUIPOS LOCALES
    // ==========================================
    
    let equiposLocalFiltrados = $derived(
        equipos.filter(team => {
            const coincidePais =
                filtroPaisLocal === "Todos" ||
                team.pais === filtroPaisLocal;
    
            const coincideNombre =
                team.nombre.toLowerCase().includes(
                    busquedaLocal.toLowerCase()
                );
    
            const noEsVisitante =
                String(team._id) !== String(equipoVisitante);
    
            return coincidePais && coincideNombre && noEsVisitante;
        })
    );
    
    // ==========================================
    // 6. FILTRAR EQUIPOS VISITANTES
    // ==========================================
    
    let equiposVisitanteFiltrados = $derived(
        equipos.filter(team => {
            const coincidePais =
                filtroPaisVisitante === "Todos" ||
                team.pais === filtroPaisVisitante;
    
            const coincideNombre =
                team.nombre.toLowerCase().includes(
                    busquedaVisitante.toLowerCase()
                );
    
            const noEsLocal =
                String(team._id) !== String(equipoLocal);
    
            return coincidePais && coincideNombre && noEsLocal;
        })
    );
    
    // ==========================================
    // 7. EQUIPOS SELECCIONADOS
    // ==========================================
    
    let equipoLocalSeleccionado = $derived(
        equipos.find(team => String(team._id) === String(equipoLocal))
    );
    
    let equipoVisitanteSeleccionado = $derived(
        equipos.find(team => String(team._id) === String(equipoVisitante))
    );
    
    // ==========================================
    // 8. CAMBIAR FILTROS DE PAÍS
    // ==========================================
    
    function cambiarPaisLocal(event) {
        filtroPaisLocal = event.currentTarget.value;
        equipoLocal = "";
    }
    
    function cambiarPaisVisitante(event) {
        filtroPaisVisitante = event.currentTarget.value;
        equipoVisitante = "";
    }
    
    // ==========================================
    // 9. HISTORIALES DE PARTIDOS
    // ==========================================
    
    let historialLocal = $state([]);
    let historialVisitante = $state([]);
    
    // ==========================================
    // 10. JUGADORES
    // ==========================================
    
    let jugadoresLocal = $state([]);
    let jugadoresVisitante = $state([]);
    
    // ==========================================
    // 11. RESULTADOS DE LOS ANÁLISIS
    // ==========================================
    
    let historialNormalizadoLocal = $state([]);
    let historialNormalizadoVisitante = $state([]);
    
    let analisisLocal = $state(null);
    let analisisVisitante = $state(null);
    
    let estilosLocal = $state([]);
    let estilosVisitante = $state([]);
    
    let cincoEstrellasLocal = $state(null);
    let cincoEstrellasVisitante = $state(null);
    // ==========================================
    // 12. ESTADO DE CARGA
    // ==========================================
    
    let cargandoAnalisis = $state(false);
    let errorAnalisis = $state("");
    
    // ==========================================
    // 13. OBTENER DATOS DE LA COMPARATIVA
    // ==========================================
        function formatoEstilo(valor) {
        if (!valor) return "Sin especificar";

        return valor
            .replaceAll("_", " ")
            .replace(/\b\w/g, letra => letra.toUpperCase());
    }

        function resumenEstadisticas(grupo) {

            if (!grupo || grupo.total === 0) {
                return "Sin datos suficientes";
            }

            const { resultados, goles, corners } = grupo;

            return [
                `PJ: ${grupo.total}`,
                `V-E-D: ${resultados.victorias}-${resultados.empates}-${resultados.derrotas}`,
                `Goles F/C: ${goles.promedioFavor.toFixed(2)} / ${goles.promedioContra.toFixed(2)}`,
                `Córners F/C: ${corners.promedioFavor.toFixed(2)} / ${corners.promedioContra.toFixed(2)}`,
                `% Victorias: ${grupo.porcentajeVictorias.toFixed(1)}%`
            ].join(" · ");
        }

        function obtenerEstilosEquipo(historial) {
            const partido = historial?.[0];

            if (!partido) return null;

            return {
                ofensivo: partido.estiloOfensivoPropio,
                defensivo: partido.estiloDefensivoPropio
            };
        }
   
async function obtenerDatosComparativa() {

if (!equipoLocal || !equipoVisitante) {
    errorAnalisis = "Selecciona los dos equipos.";
    return;
}

if (equipoLocal === equipoVisitante) {
    errorAnalisis = "No puedes seleccionar el mismo equipo.";
    return;
}

try {

    cargandoAnalisis = true;
    errorAnalisis = "";

    // ==========================================
    // LIMPIAR INFORMACIÓN ANTERIOR
    // ==========================================

    historialLocal = [];
    historialVisitante = [];

    jugadoresLocal = [];
    jugadoresVisitante = [];

    historialNormalizadoLocal = [];
    historialNormalizadoVisitante = [];

    analisisLocal = null;
    analisisVisitante = null;

    cincoEstrellasLocal = null;
    cincoEstrellasVisitante = null;

    estilosLocal = [];
    estilosVisitante = [];

    pronostico = null;

    // ==========================================
    // PETICIONES AL BACKEND
    // ==========================================

    const [
        partidosLocal,
        partidosVisitante,
        jugadoresEquipoLocal,
        jugadoresEquipoVisitante
    ] = await Promise.all([

        matchTeam.get(`/${equipoLocal}`),
        matchTeam.get(`/${equipoVisitante}`),

        playerTeam.get(`/${equipoLocal}`),
        playerTeam.get(`/${equipoVisitante}`)

    ]);

    // ==========================================
    // RECUPERAR HISTORIALES
    // ==========================================

    historialLocal = Array.isArray(partidosLocal.data)
        ? partidosLocal.data
        : [];

    historialVisitante = Array.isArray(partidosVisitante.data)
        ? partidosVisitante.data
        : [];


    // ==========================================
    // RECUPERAR JUGADORES
    // ==========================================

    jugadoresLocal =
        jugadoresEquipoLocal.data.players ?? [];

    jugadoresVisitante =
        jugadoresEquipoVisitante.data.players ?? [];

    // ==========================================
    // NORMALIZAR HISTORIAL LOCAL
    // ==========================================


        const idsPartidos = [
        ...historialLocal,
        ...historialVisitante
    ].map(partido => partido._id);

    const idsJugadores = [
        ...jugadoresLocal,
        ...jugadoresVisitante
    ].map(jugador => jugador._id);

        historialNormalizadoLocal = normalizarHistorial(
            historialLocal,
            equipoLocal
        );
    
        const partidosUnicos = [...new Set(idsPartidos.map(String))];
        const jugadoresUnicos = [...new Set(idsJugadores.map(String))];

    // ==========================================
    // NORMALIZAR HISTORIAL VISITANTE
    // ==========================================

    historialNormalizadoVisitante = normalizarHistorial(
        historialVisitante,
        equipoVisitante
    );

    // ==========================================
    // ANALIZAR COMPORTAMIENTO POR ESTILOS
    // ==========================================

    analisisLocal = analizarComportamientoPorEstilo(
        historialNormalizadoLocal
    );

    analisisVisitante = analizarComportamientoPorEstilo(
        historialNormalizadoVisitante
    );

    // ==========================================
    // ANALIZAR CONTRA EQUIPOS DE 5 ESTRELLAS
    // ==========================================

    cincoEstrellasLocal = analizarContraCincoEstrellas(
        historialNormalizadoLocal
    );

    cincoEstrellasVisitante = analizarContraCincoEstrellas(
        historialNormalizadoVisitante
    );
    console.log(jugadoresLocal)
    // ==========================================
    // OBTENER ESTILOS PROPIOS DE CADA EQUIPO
    // ==========================================

    const estilosLocalPartido = obtenerEstilosEquipo(
        historialNormalizadoLocal
    );

    const estilosVisitantePartido = obtenerEstilosEquipo(
        historialNormalizadoVisitante
    );

    const responseStats = await playerstatsAxios.post(
            "/comparativa",
            {
                matches: partidosUnicos,
                players: jugadoresUnicos
            }
        );

const estadisticasJugadores = responseStats.data.estadisticas;





// 3. Comprobar que tenemos los estilos
if (
    estilosLocalPartido?.defensivo &&
    estilosVisitantePartido?.defensivo
) {

    // 4. AQUÍ PEGAS EL ÚLTIMO CÓDIGO
    // PREDICCIONES INDIVIDUALES
    const estiloDefensivoLocal = estilosLocalPartido.defensivo;
    const estiloDefensivoVisitante = estilosVisitantePartido.defensivo;


    prediccionesJugadores = estadisticasJugadores.reduce((resultado, registro) => {

        const jugador = registro.player;

        if (!jugador?._id) return resultado;

        const jugadorId = String(jugador._id);

        if (resultado.some(p => p.jugadorId === jugadorId)) {
            return resultado;
        }

        const equipoJugador = String(
            jugador.equipo?._id ?? jugador.equipo
        );

        let estiloRival;

        if (equipoJugador === String(equipoLocal)) {
            estiloRival = estiloDefensivoVisitante;
        } else if (equipoJugador === String(equipoVisitante)) {
            estiloRival = estiloDefensivoLocal;
        } else {
            return resultado;
        }

        const analisis = analizarJugadorContraEstiloDefensivo(
            jugadorId,
            estadisticasJugadores,
            estiloRival
        );

        resultado.push({
            nombre: jugador.nombre,
            jugadorId,
            equipoId: equipoJugador,
            ...analisis
        });

        return resultado;

    }, []);

    console.log("PREDICCIONES INDIVIDUALES:", prediccionesJugadores);

} else {
    prediccionesJugadores = [];

    console.error("No se pudieron obtener los estilos defensivos");
}

    // ==========================================
    // GENERAR PRONÓSTICO DEL ENFRENTAMIENTO
    // ==========================================

    if (
    estilosLocalPartido?.ofensivo &&
    estilosLocalPartido?.defensivo &&
    estilosVisitantePartido?.ofensivo &&
    estilosVisitantePartido?.defensivo
) {
    pronostico = analizarEnfrentamiento(
        historialNormalizadoLocal,
        historialNormalizadoVisitante,
        estilosLocalPartido,
        estilosVisitantePartido
    );

    

} else {
    pronostico = null;

    console.error("Faltan datos de estilos:", {
        local: estilosLocalPartido,
        visitante: estilosVisitantePartido
    });
}

} catch (error) {

    console.error(
        "Error al obtener los datos:",
        error.response?.data || error.message
    );

    errorAnalisis = "No se pudieron obtener los datos de los equipos.";

} finally {

    cargandoAnalisis = false;

}
}
function porcentaje(valor) {
    if (valor === null || valor === undefined || !Number.isFinite(Number(valor))) {
        return 0;
    }

    const numero = Number(valor);
    return Math.max(0, Math.min(100, numero <= 1 ? numero * 100 : numero));
}

function formatoPorcentaje(valor) {
    return `${porcentaje(valor).toFixed(1)}%`;
}

function formatoNumero(valor) {
    const numero = Number(valor ?? 0);
    return Number.isFinite(numero) ? numero.toFixed(2) : "0.00";
}

</script>
<NavBar />
<section class="min-h-screen bg-[#0b1117] text-white p-6">

    <!-- CABECERA -->
    <div class="max-w-6xl mx-auto mb-10">

        <span class="text-[#00ff66] text-xs font-bold tracking-[3px]">
            PREDICTPRO / MOTOR DE ANÁLISIS
        </span>

        <h1 class="text-3xl md:text-4xl font-black mt-3">
            Centro de predicciones
        </h1>

        <p class="text-gray-500 text-sm mt-2">
            Selecciona dos equipos para comenzar el análisis estadístico.
        </p>

    </div>

    <!-- SELECTORES -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- EQUIPO LOCAL -->
        <div class="bg-[#111a22] border border-white/10 rounded-2xl p-6">

            <div class="flex items-center justify-between mb-6">
                <div>
                    <span class="text-[#00ff66] text-[10px] font-bold tracking-widest">
                        EQUIPO 01
                    </span>
                    <h2 class="text-xl font-black mt-1">Equipo local</h2>
                </div>

                <span class="text-2xl">🏟️</span>
            </div>

            <!-- FILTRO PAÍS -->
            <label class="block text-xs text-gray-400 font-bold mb-2">
                FILTRAR POR PAÍS
            </label>

            <select
                value={filtroPaisLocal}
                onchange={cambiarPaisLocal}
                class="w-full bg-[#0b1117] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00ff66] mb-4"
            >
                {#each paises as pais}
                    <option value={pais}>{pais}</option>
                {/each}
            </select>

            <!-- BUSCADOR -->
            <label class="block text-xs text-gray-400 font-bold mb-2">
                BUSCAR EQUIPO
            </label>

            <input
                type="text"
                bind:value={busquedaLocal}
                placeholder="Escribe el nombre del equipo..."
                class="w-full bg-[#0b1117] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00ff66] mb-4"
            />

            <!-- SELECTOR DE EQUIPOS -->
            <label class="block text-xs text-gray-400 font-bold mb-2">
                SELECCIONAR EQUIPO
            </label>

            <select
                bind:value={equipoLocal}
                class="w-full bg-[#0b1117] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00ff66]"
            >
                <option value="">Seleccionar equipo local</option>

                {#each equiposLocalFiltrados as team (team._id)}
                    <option
                        value={team._id}
                        disabled={String(team._id) === String(equipoVisitante)}
                    >
                        {team.nombre} · {team.pais}
                    </option>
                {/each}
            </select>

            <!-- TARJETA DEL EQUIPO SELECCIONADO -->
            {#if equipoLocalSeleccionado}
                <div class="mt-6 bg-[#0b1117] border border-[#00ff66]/30 rounded-xl p-5 flex items-center gap-4">

                    <img
                        src={equipoLocalSeleccionado.escudo}
                        alt={equipoLocalSeleccionado.nombre}
                        class="w-16 h-16 object-contain"
                    />

                    <div class="flex-1 min-w-0">
                        <span class="text-[10px] text-[#00ff66] font-bold tracking-widest">
                            LOCAL SELECCIONADO
                        </span>

                        <h3 class="font-black text-lg truncate mt-1">
                            {equipoLocalSeleccionado.nombre}
                        </h3>

                        <p class="text-xs text-gray-500">
                            {equipoLocalSeleccionado.pais}
                        </p>

                        <div class="text-yellow-400 text-sm mt-1">
                            {"★".repeat(Math.max(0, Math.min(5, Number(equipoLocalSeleccionado.puntuacion) || 0)))}
                        </div>
                    </div>
                </div>
            {:else}
                <div class="mt-6 bg-[#0b1117] border border-dashed border-white/10 rounded-xl p-8 text-center">
                    <span class="text-3xl">⚽</span>
                    <p class="text-gray-500 text-xs mt-3">
                        Selecciona el equipo que jugará como local.
                    </p>
                </div>
            {/if}

        </div>


        <!-- EQUIPO VISITANTE -->
        <div class="bg-[#111a22] border border-white/10 rounded-2xl p-6">

            <div class="flex items-center justify-between mb-6">
                <div>
                    <span class="text-blue-400 text-[10px] font-bold tracking-widest">
                        EQUIPO 02
                    </span>
                    <h2 class="text-xl font-black mt-1">Equipo visitante</h2>
                </div>

                <span class="text-2xl">✈️</span>
            </div>

            <!-- FILTRO PAÍS -->
            <label class="block text-xs text-gray-400 font-bold mb-2">
                FILTRAR POR PAÍS
            </label>

            <select
                value={filtroPaisVisitante}
                onchange={cambiarPaisVisitante}
                class="w-full bg-[#0b1117] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-400 mb-4"
            >
                {#each paises as pais}
                    <option value={pais}>{pais}</option>
                {/each}
            </select>

            <!-- BUSCADOR -->
            <label class="block text-xs text-gray-400 font-bold mb-2">
                BUSCAR EQUIPO
            </label>

            <input
                type="text"
                bind:value={busquedaVisitante}
                placeholder="Escribe el nombre del equipo..."
                class="w-full bg-[#0b1117] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-400 mb-4"
            />

            <!-- SELECTOR DE EQUIPOS -->
            <label class="block text-xs text-gray-400 font-bold mb-2">
                SELECCIONAR EQUIPO
            </label>

            <select
                bind:value={equipoVisitante}
                class="w-full bg-[#0b1117] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-400"
            >
                <option value="">Seleccionar equipo visitante</option>

                {#each equiposVisitanteFiltrados as team (team._id)}
                    <option
                        value={team._id}
                        disabled={String(team._id) === String(equipoLocal)}
                    >
                        {team.nombre} · {team.pais}
                    </option>
                {/each}
            </select>

            <!-- TARJETA DEL EQUIPO SELECCIONADO -->
            {#if equipoVisitanteSeleccionado}
                <div class="mt-6 bg-[#0b1117] border border-blue-400/30 rounded-xl p-5 flex items-center gap-4">

                    <img
                        src={equipoVisitanteSeleccionado.escudo}
                        alt={equipoVisitanteSeleccionado.nombre}
                        class="w-16 h-16 object-contain"
                    />

                    <div class="flex-1 min-w-0">
                        <span class="text-[10px] text-blue-400 font-bold tracking-widest">
                            VISITANTE SELECCIONADO
                        </span>

                        <h3 class="font-black text-lg truncate mt-1">
                            {equipoVisitanteSeleccionado.nombre}
                        </h3>

                        <p class="text-xs text-gray-500">
                            {equipoVisitanteSeleccionado.pais}
                        </p>

                        <div class="text-yellow-400 text-sm mt-1">
                            {"★".repeat(Math.max(0, Math.min(5, Number(equipoVisitanteSeleccionado.puntuacion) || 0)))}
                        </div>
                    </div>
                </div>
            {:else}
                <div class="mt-6 bg-[#0b1117] border border-dashed border-white/10 rounded-xl p-8 text-center">
                    <span class="text-3xl">⚽</span>
                    <p class="text-gray-500 text-xs mt-3">
                        Selecciona el equipo que jugará como visitante.
                    </p>
                </div>
            {/if}

        </div>

    </div>

    <!-- BOTÓN DE ANÁLISIS -->
    <div class="max-w-6xl mx-auto mt-8">

        <button
            onclick={obtenerDatosComparativa}
            disabled={!equipoLocal || !equipoVisitante || equipoLocal === equipoVisitante || cargandoAnalisis}
            class="w-full py-4 rounded-xl font-black text-sm tracking-widest transition duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-[#00ff66] text-[#0b1117] hover:bg-[#00e65c]"
        >
            {#if cargandoAnalisis}
                ANALIZANDO EQUIPOS...
            {:else}
                GENERAR PREDICCIÓN ↗
            {/if}
        </button>

    </div>
    {#if pronostico?.disponible}
        <section class="pronostico-panel ">

            <div class="pronostico-header">
                <div>
                    <span class="pronostico-etiqueta">PREDICTPRO · ANÁLISIS</span>
                    <h2>Pronóstico del encuentro</h2>
                    <p>Estimaciones basadas en el comportamiento histórico de ambos equipos.</p>
                </div>
                <div class="estado-pronostico">
                    <span></span>
                    Análisis disponible
                </div>
            </div>

            <!-- MUESTRA HISTÓRICA -->
            <div class="pronostico-muestras">
                <div class="muestra-equipo local">
                    <span>Partidos analizados · Local</span>
                    <strong>{pronostico.muestra.local}</strong>
                </div>

                <div class="muestra-equipo visitante">
                    <span>Partidos analizados · Visitante</span>
                    <strong>{pronostico.muestra.visitante}</strong>
                </div>
            </div>

            <!-- PROBABILIDADES 1X2 -->
            <div class="pronostico-card">
                <h3>Probabilidades del resultado</h3>

                <div class="resultado-probabilidades">

                    <div class="probabilidad-item">
                        <div class="probabilidad-info">
                            <span>Victoria local</span>
                            <strong>{formatoPorcentaje(pronostico.probabilidades.victoriaLocal)}</strong>
                        </div>
                        <div class="barra-fondo">
                            <div
                                class="barra-progreso barra-local"
                                style={`width: ${porcentaje(pronostico.probabilidades.victoriaLocal)}%`}
                            ></div>
                        </div>
                    </div>

                    <div class="probabilidad-item">
                        <div class="probabilidad-info">
                            <span>Empate</span>
                            <strong>{formatoPorcentaje(pronostico.probabilidades.empate)}</strong>
                        </div>
                        <div class="barra-fondo">
                            <div
                                class="barra-progreso barra-empate"
                                style={`width: ${porcentaje(pronostico.probabilidades.empate)}%`}
                            ></div>
                        </div>
                    </div>

                    <div class="probabilidad-item">
                        <div class="probabilidad-info">
                            <span>Victoria visitante</span>
                            <strong>{formatoPorcentaje(pronostico.probabilidades.victoriaVisitante)}</strong>
                        </div>
                        <div class="barra-fondo">
                            <div
                                class="barra-progreso barra-visitante"
                                style={`width: ${porcentaje(pronostico.probabilidades.victoriaVisitante)}%`}
                            ></div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- GOLES Y CÓRNERS -->
            <div class="pronostico-grid">

                <div class="pronostico-card">
                    <h3><span>⚽</span> Goles esperados</h3>

                    <div class="comparativa-valores">
                        <div class="valor-equipo">
                            <span>Local</span>
                            <strong class="texto-local">
                                {formatoNumero(pronostico.goles.local)}
                            </strong>
                        </div>

                        <div class="valor-total">
                            <span>Total estimado</span>
                            <strong>{formatoNumero(pronostico.goles.total)}</strong>
                        </div>

                        <div class="valor-equipo">
                            <span>Visitante</span>
                            <strong class="texto-visitante">
                                {formatoNumero(pronostico.goles.visitante)}
                            </strong>
                        </div>
                    </div>
                </div>

                <div class="pronostico-card">
                    <h3><span>🚩</span> Córners esperados</h3>

                    <div class="comparativa-valores">
                        <div class="valor-equipo">
                            <span>Local</span>
                            <strong class="texto-local">
                                {formatoNumero(pronostico.corners.local)}
                            </strong>
                        </div>

                        <div class="valor-total">
                            <span>Total estimado</span>
                            <strong>{formatoNumero(pronostico.corners.total)}</strong>
                        </div>

                        <div class="valor-equipo">
                            <span>Visitante</span>
                            <strong class="texto-visitante">
                                {formatoNumero(pronostico.corners.visitante)}
                            </strong>
                        </div>
                    </div>
                </div>

            </div>

            <!-- MERCADOS DE GOLES -->
            <div class="pronostico-card">
                <h3>Mercados de goles</h3>

                <div class="mercados-grid">
                    <div class="mercado-item">
                        <span>Más de 2.5 goles</span>
                        <strong>{formatoPorcentaje(pronostico.mercados.masDe25Goles)}</strong>
                    </div>

                    <div class="mercado-item">
                        <span>Ambos equipos marcan</span>
                        <strong>{formatoPorcentaje(pronostico.mercados.ambosMarcan)}</strong>
                    </div>
                </div>
            </div>

            <!-- MERCADOS DE CÓRNERS -->
            <div class="pronostico-card">
                <h3>Mercados de córners</h3>

                <div class="mercados-grid">
                    <div class="mercado-item">
                        <span>Más de 7.5</span>
                        <strong>{formatoPorcentaje(pronostico.mercados.corners.masDe75)}</strong>
                    </div>

                    <div class="mercado-item">
                        <span>Más de 8.5</span>
                        <strong>{formatoPorcentaje(pronostico.mercados.corners.masDe85)}</strong>
                    </div>

                    <div class="mercado-item">
                        <span>Más de 9.5</span>
                        <strong>{formatoPorcentaje(pronostico.mercados.corners.masDe95)}</strong>
                    </div>

                    <div class="mercado-item">
                        <span>Más de 10.5</span>
                        <strong>{formatoPorcentaje(pronostico.mercados.corners.masDe105)}</strong>
                    </div>
                </div>
            </div>

            <p class="pronostico-nota">
                Las probabilidades son estimaciones estadísticas basadas en el historial disponible.
                No garantizan el resultado del encuentro.
            </p>

        </section>
    {/if}
    {#if prediccionesJugadores.length > 0}
    <section class="max-w-7xl mx-auto mt-16 space-y-8">

        <div class="text-center space-y-2">
            <h2 class="text-3xl font-black text-white">
                Predicción individual de jugadores
            </h2>
            <p class="text-gray-400">
                Probabilidades según el estilo defensivo del rival
            </p>
        </div>

        <div class="grid grid-cols-1  gap-6">

            {#each prediccionesJugadores as jugador (jugador.jugadorId)}

                <article class="bg-[#111a22] border border-white/10 rounded-2xl p-6 space-y-5
                    {jugador.equipoId === String(equipoLocal)
                        ? 'border-l-4 border-l-[#00ff66]'
                        : 'border-l-4 border-l-blue-500'}">

                    <!-- CABECERA -->
                    <div class="flex justify-between items-start gap-3">

                        <div>
                            <h3 class="text-xl font-bold text-white">
                                {jugador.nombre}
                            </h3>

                            <p class="text-sm text-gray-400 mt-1">
                                Rival:
                                <span class="text-[#00ff66]">
                                    {formatoEstilo(jugador.estiloDefensivoAnalizado)}
                                </span>
                            </p>
                        </div>

                        <span class="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full whitespace-nowrap">
                            {jugador.partidosAnalizados ?? 0} partidos
                        </span>

                    </div>

                    {#if jugador.disponible}

                        <!-- PROBABILIDADES -->
                        <div class="space-y-4">

                            <!-- GOLES -->
                            <div class="bg-black/20 rounded-xl p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-sm font-semibold text-gray-300">
                                        <i class="fa-solid fa-futbol text-[#00ff66] mr-2"></i>
                                        Marcar 1 gol o más
                                    </span>

                                    <span class="text-xl font-black text-[#00ff66]">
                                        {formatoPorcentaje(jugador.probabilidades.goles.alMenos1)}
                                    </span>
                                </div>

                                <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        class="h-full bg-[#00ff66] rounded-full transition-all"
                                        style={`width: ${porcentaje(jugador.probabilidades.goles.alMenos1)}%`}
                                    ></div>
                                </div>
                            </div>

                            <!-- ASISTENCIAS -->
                            <div class="bg-black/20 rounded-xl p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-sm font-semibold text-gray-300">
                                        <i class="fa-solid fa-handshake text-blue-400 mr-2"></i>
                                        1 asistencia o más
                                    </span>

                                    <span class="text-xl font-black text-blue-400">
                                        {formatoPorcentaje(jugador.probabilidades.asistencias.alMenos1)}
                                    </span>
                                </div>

                                <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        class="h-full bg-blue-400 rounded-full transition-all"
                                        style={`width: ${porcentaje(jugador.probabilidades.asistencias.alMenos1)}%`}
                                    ></div>
                                </div>
                            </div>

                            <!-- TIROS A PUERTA -->
                            <div class="bg-black/20 rounded-xl p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-sm font-semibold text-gray-300">
                                        <i class="fa-solid fa-bullseye text-yellow-400 mr-2"></i>
                                        1 tiro a puerta o más
                                    </span>

                                    <span class="text-xl font-black text-yellow-400">
                                        {formatoPorcentaje(jugador.probabilidades.tirospuerta.alMenos1)}
                                    </span>
                                </div>

                                <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        class="h-full bg-yellow-400 rounded-full transition-all"
                                        style={`width: ${porcentaje(jugador.probabilidades.tirospuerta.alMenos1)}%`}
                                    ></div>
                                </div>

                                <p class="text-xs text-gray-500 mt-2">
                                    2 o más:
                                    {formatoPorcentaje(jugador.probabilidades.tirospuerta.alMenos2)}
                                </p>
                            </div>

                            <!-- FALTAS COMETIDAS -->
                            <div class="bg-black/20 rounded-xl p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-sm font-semibold text-gray-300">
                                        <i class="fa-solid fa-triangle-exclamation text-orange-400 mr-2"></i>
                                        1 falta cometida o más
                                    </span>

                                    <span class="text-xl font-black text-orange-400">
                                        {formatoPorcentaje(jugador.probabilidades.faltascometidaspartido.alMenos1)}
                                    </span>
                                </div>

                                <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        class="h-full bg-orange-400 rounded-full transition-all"
                                        style={`width: ${porcentaje(jugador.probabilidades.faltascometidaspartido.alMenos1)}%`}
                                    ></div>
                                </div>
                            </div>

                            <!-- FALTAS RECIBIDAS -->
                            <div class="bg-black/20 rounded-xl p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-sm font-semibold text-gray-300">
                                        <i class="fa-solid fa-person-circle-exclamation text-purple-400 mr-2"></i>
                                        1 falta recibida o más
                                    </span>

                                    <span class="text-xl font-black text-purple-400">
                                        {formatoPorcentaje(jugador.probabilidades.faltasrecibidaspartido.alMenos1)}
                                    </span>
                                </div>

                                <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        class="h-full bg-purple-400 rounded-full transition-all"
                                        style={`width: ${porcentaje(jugador.probabilidades.faltasrecibidaspartido.alMenos1)}%`}
                                    ></div>
                                </div>
                            </div>

                        </div>

                        <!-- INFORMACIÓN -->
                        <div class="border-t border-white/10 pt-4">
                            <p class="text-xs text-gray-500">
                                Probabilidades estimadas mediante modelo Poisson,
                                calculadas a partir del historial del jugador
                                contra este estilo defensivo.
                            </p>
                        </div>

                    {:else}

                        <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                            <p class="text-sm text-yellow-400">
                                {jugador.mensaje}
                            </p>
                        </div>

                    {/if}

                </article>

            {/each}

        </div>
    </section>
    {/if}
    {#if analisisLocal && analisisVisitante}

    <div class="max-w-7xl mx-auto mt-16 space-y-8">

        <!-- CABECERA DE RESULTADOS -->
        <div class="border-b border-white/10 pb-6">

            <span class="text-[#00ff66] text-xs font-bold tracking-[3px]">
                PREDICTPRO / RESULTADOS ESTADÍSTICOS
            </span>

            <h2 class="text-2xl md:text-3xl font-black mt-3">
                Comparativa de comportamiento
            </h2>

            <p class="text-gray-500 text-sm mt-2">
                Análisis histórico según los estilos de juego de los rivales.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                <div class="bg-[#111a22] border border-[#00ff66]/30 rounded-xl p-4">
                    <p class="text-xs text-[#00ff66] font-bold">
                        EQUIPO 01
                    </p>
                    <h3 class="font-black mt-1">
                        {equipoLocalSeleccionado?.nombre}
                    </h3>
                    <p class="text-gray-500 text-xs mt-2">
                        {analisisLocal.totalPartidos} partidos analizados
                    </p>
                </div>

                <div class="bg-[#111a22] border border-blue-400/30 rounded-xl p-4">
                    <p class="text-xs text-blue-400 font-bold">
                        EQUIPO 02
                    </p>
                    <h3 class="font-black mt-1">
                        {equipoVisitanteSeleccionado?.nombre}
                    </h3>
                    <p class="text-gray-500 text-xs mt-2">
                        {analisisVisitante.totalPartidos} partidos analizados
                    </p>
                </div>

            </div>
        </div>


        <!-- 1. ANÁLISIS POR DEFENSA RIVAL -->
        <section class="bg-[#111a22] border border-white/10 rounded-2xl p-5 md:p-6">

            <div class="mb-6">
                <span class="text-[#00ff66] text-xs font-bold tracking-widest">
                    ANÁLISIS 01
                </span>

                <h3 class="text-xl font-black mt-2">
                    Contra estilos defensivos
                </h3>

                <p class="text-gray-500 text-xs mt-2">
                    Comportamiento frente a la forma de defender del rival.
                </p>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[650px] text-sm text-left">

                    <thead>
                        <tr class="text-gray-400 border-b border-white/10">
                            <th class="py-4 pr-4">Defensa rival</th>
                            <th class="py-4 px-4 text-[#00ff66]">
                                {equipoLocalSeleccionado?.nombre}
                            </th>
                            <th class="py-4 px-4 text-blue-400">
                                {equipoVisitanteSeleccionado?.nombre}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {#each analisisLocal.porEstiloDefensivoRival as grupo, i}
                            <tr class="border-b border-white/5">

                                <td class="py-5 pr-4 font-bold">
                                    {formatoEstilo(grupo.estilo)}
                                </td>

                                <td class="py-5 px-4 text-gray-300 text-xs leading-6">
                                    {resumenEstadisticas(grupo)}
                                </td>

                                <td class="py-5 px-4 text-gray-300 text-xs leading-6">
                                    {resumenEstadisticas(
                                        analisisVisitante.porEstiloDefensivoRival[i]
                                    )}
                                </td>

                            </tr>
                        {/each}
                    </tbody>

                </table>
            </div>

        </section>


        <!-- 2. ANÁLISIS POR ATAQUE RIVAL -->
        <section class="bg-[#111a22] border border-white/10 rounded-2xl p-5 md:p-6">

            <div class="mb-6">
                <span class="text-blue-400 text-xs font-bold tracking-widest">
                    ANÁLISIS 02
                </span>

                <h3 class="text-xl font-black mt-2">
                    Contra estilos ofensivos
                </h3>

                <p class="text-gray-500 text-xs mt-2">
                    Comportamiento frente a las diferentes formas de atacar del rival.
                </p>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[650px] text-sm text-left">

                    <thead>
                        <tr class="text-gray-400 border-b border-white/10">
                            <th class="py-4 pr-4">Ataque rival</th>
                            <th class="py-4 px-4 text-[#00ff66]">
                                {equipoLocalSeleccionado?.nombre}
                            </th>
                            <th class="py-4 px-4 text-blue-400">
                                {equipoVisitanteSeleccionado?.nombre}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {#each analisisLocal.porEstiloOfensivoRival as grupo, i}
                            <tr class="border-b border-white/5">

                                <td class="py-5 pr-4 font-bold">
                                    {formatoEstilo(grupo.estilo)}
                                </td>

                                <td class="py-5 px-4 text-gray-300 text-xs leading-6">
                                    {resumenEstadisticas(grupo)}
                                </td>

                                <td class="py-5 px-4 text-gray-300 text-xs leading-6">
                                    {resumenEstadisticas(
                                        analisisVisitante.porEstiloOfensivoRival[i]
                                    )}
                                </td>

                            </tr>
                        {/each}
                    </tbody>

                </table>
            </div>

        </section>


        <!-- 3. ANÁLISIS POR COMBINACIÓN -->
        <section class="bg-[#111a22] border border-white/10 rounded-2xl p-5 md:p-6">

            <div class="mb-6">
                <span class="text-purple-400 text-xs font-bold tracking-widest">
                    ANÁLISIS 03
                </span>

                <h3 class="text-xl font-black mt-2">
                    Combinaciones de estilos
                </h3>

                <p class="text-gray-500 text-xs mt-2">
                    Análisis de las 12 combinaciones ofensivas y defensivas posibles.
                </p>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[750px] text-sm text-left">

                    <thead>
                        <tr class="text-gray-400 border-b border-white/10">
                            <th class="py-4 pr-4">Ataque rival</th>
                            <th class="py-4 px-4">Defensa rival</th>
                            <th class="py-4 px-4 text-[#00ff66]">
                                {equipoLocalSeleccionado?.nombre}
                            </th>
                            <th class="py-4 px-4 text-blue-400">
                                {equipoVisitanteSeleccionado?.nombre}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {#each analisisLocal.porCombinacionRival as grupo, i}
                            <tr class="border-b border-white/5">

                                <td class="py-4 pr-4 font-semibold">
                                    {formatoEstilo(grupo.estiloOfensivo)}
                                </td>

                                <td class="py-4 px-4 font-semibold">
                                    {formatoEstilo(grupo.estiloDefensivo)}
                                </td>

                                <td class="py-4 px-4 text-gray-300 text-xs leading-6">
                                    {resumenEstadisticas(grupo)}
                                </td>

                                <td class="py-4 px-4 text-gray-300 text-xs leading-6">
                                    {resumenEstadisticas(
                                        analisisVisitante.porCombinacionRival[i]
                                    )}
                                </td>

                            </tr>
                        {/each}
                    </tbody>

                </table>
            </div>

        </section>

    </div>

    {/if}
    

</section>
