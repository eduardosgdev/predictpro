
<script>
    // @ts-nocheck
    
    import matchTeam from "../../conexiones/matchAxios.js";
    import playerTeam from "../../conexiones/playerAxios.js";
    
    import {
    normalizarHistorial,
    analizarContraCincoEstrellas,
    analizarComportamientoPorEstilo
} from "#lib/utils/analisisEquipos.js";
    
    let { data } = $props();
    
    // ==========================================
    // 1. EQUIPOS RECIBIDOS DESDE +page.js
    // ==========================================
    
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
    
            estilosLocal = [];
            estilosVisitante = [];

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
    
            console.log("TOTAL PARTIDOS LOCAL:", historialLocal.length);
            console.log("TOTAL PARTIDOS VISITANTE:", historialVisitante.length);
    
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
    
            historialNormalizadoLocal = normalizarHistorial(
                historialLocal,
                equipoLocal
            );
    
            // ==========================================
            // NORMALIZAR HISTORIAL VISITANTE
            // ==========================================
    
            historialNormalizadoVisitante = normalizarHistorial(
                historialVisitante,
                equipoVisitante
            );
    
            console.log(
                "HISTORIAL NORMALIZADO LOCAL:",
                historialNormalizadoLocal
            );
    
            console.log(
                "HISTORIAL NORMALIZADO VISITANTE:",
                historialNormalizadoVisitante
            );
    
            // ==========================================
            // ANALIZAR CONTRA EQUIPOS DE 5 ESTRELLAS
            // ==========================================
    
            analisisLocal = analizarContraCincoEstrellas(
                historialNormalizadoLocal
            );
    
            analisisVisitante = analizarContraCincoEstrellas(
                historialNormalizadoVisitante
            );
    
            // ==========================================
            // ANALIZAR ESTILOS DE LOS RIVALES
            // ==========================================
    
                
            // ==========================================
            // RESULTADOS FINALES
            // ==========================================
    
            console.log("ANÁLISIS LOCAL:", analisisLocal);
            console.log("ANÁLISIS VISITANTE:", analisisVisitante);
    
            console.log("ESTILOS LOCAL:", estilosLocal);
            console.log("ESTILOS VISITANTE:", estilosVisitante);
    
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
    </script>
    
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

</section>