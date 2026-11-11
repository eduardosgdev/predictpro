
<script>
    // @ts-nocheck

    import matchAxios from "../../conexiones/matchAxios.js";

    let { data } = $props();

    // ==========================================
    // 1. DATOS DE EQUIPOS
    // ==========================================

    let equipos = $derived(data.equipos ?? []);

    let equipoLocalId = $state("");
    let equipoVisitanteId = $state("");

    let paisLocal = $state("");
    let paisVisitante = $state("");

    let paisesDisponibles = $derived(
        [...new Set(
            equipos
                .map(equipo => equipo.pais)
                .filter(Boolean)
        )].sort((a, b) => a.localeCompare(b))
    );

    let equiposLocalesFiltrados = $derived(
        equipos.filter(equipo =>
            (!paisLocal || equipo.pais === paisLocal) &&
            equipo._id !== equipoVisitanteId
        )
    );

    let equiposVisitantesFiltrados = $derived(
        equipos.filter(equipo =>
            (!paisVisitante || equipo.pais === paisVisitante) &&
            equipo._id !== equipoLocalId
        )
    );

    let equipoLocal = $derived(
        equipos.find(equipo => equipo._id === equipoLocalId) ?? null
    );

    let equipoVisitante = $derived(
        equipos.find(equipo => equipo._id === equipoVisitanteId) ?? null
    );

    // ==========================================
    // 2. DATOS DEL ENCUENTRO
    // ==========================================

    let competicion = $state("Liga");
    let temporada = $state("26/27");

    let golesteam1 = $state(0);
    let golesteam2 = $state(0);

    let cornersteam1 = $state(0);
    let cornersteam2 = $state(0);

    let estiloofteam1 = $state("");
    let estiloofteam2 = $state("");

    let estilodefteam1 = $state("");
    let estilodefteam2 = $state("");

    // ==========================================
    // 3. ESTADOS DE LA INTERFAZ
    // ==========================================

    let cargando = $state(false);
    let mensaje = $state("");
    let tipoMensaje = $state("");

    // ==========================================
    // 4. CAMBIOS DE PAÍS Y EQUIPOS
    // ==========================================

    function cambiarPaisLocal(event) {
        paisLocal = event.currentTarget.value;
        equipoLocalId = "";
    }

    function cambiarPaisVisitante(event) {
        paisVisitante = event.currentTarget.value;
        equipoVisitanteId = "";
    }

    function cambiarEquipoLocal(event) {
        equipoLocalId = event.currentTarget.value;
    }

    function cambiarEquipoVisitante(event) {
        equipoVisitanteId = event.currentTarget.value;
    }

    // ==========================================
    // 5. REGISTRAR ENCUENTRO
    // ==========================================

    async function crearEncuentro(event) {
        event.preventDefault();

        mensaje = "";
        tipoMensaje = "";

        if (!equipoLocalId || !equipoVisitanteId) {
            mensaje = "Debes seleccionar los dos equipos.";
            tipoMensaje = "error";
            return;
        }

        if (equipoLocalId === equipoVisitanteId) {
            mensaje = "Los equipos deben ser diferentes.";
            tipoMensaje = "error";
            return;
        }

        if (!competicion || !temporada) {
            mensaje = "Completa la competición y la temporada.";
            tipoMensaje = "error";
            return;
        }

        const valores = [
            golesteam1,
            golesteam2,
            cornersteam1,
            cornersteam2
        ].map(Number);

        if (
            valores.some(valor =>
                !Number.isInteger(valor) ||
                valor < 0 ||
                !Number.isFinite(valor)
            )
        ) {
            mensaje = "Los goles y córners deben ser enteros no negativos.";
            tipoMensaje = "error";
            return;
        }

        if (
            !estiloofteam1 ||
            !estiloofteam2 ||
            !estilodefteam1 ||
            !estilodefteam2
        ) {
            mensaje = "Selecciona los estilos de juego de ambos equipos.";
            tipoMensaje = "error";
            return;
        }

        const datosEncuentro = {
            competicion,
            temporada,

            team1: equipoLocalId,
            team2: equipoVisitanteId,

            golesteam1: valores[0],
            golesteam2: valores[1],

            cornersteam1: valores[2],
            cornersteam2: valores[3],

            estiloofteam1,
            estiloofteam2,

            estilodefteam1,
            estilodefteam2
        };

        try {
            cargando = true;

            const response = await matchAxios.post(
                "/",
                datosEncuentro
            );

            mensaje =
                response.data.mensaje ||
                "Encuentro registrado correctamente.";

            tipoMensaje = "success";

            // Limpiar los datos del encuentro
            equipoLocalId = "";
            equipoVisitanteId = "";

            paisLocal = "";
            paisVisitante = "";

            competicion = "Liga";
            temporada = "26/27";

            golesteam1 = 0;
            golesteam2 = 0;

            cornersteam1 = 0;
            cornersteam2 = 0;

            estiloofteam1 = "";
            estiloofteam2 = "";

            estilodefteam1 = "";
            estilodefteam2 = "";

        } catch (error) {
            console.error(
                "ERROR AL REGISTRAR ENCUENTRO:",
                error
            );

            mensaje =
                error.response?.data?.error ||
                "No se pudo registrar el encuentro.";

            tipoMensaje = "error";

        } finally {
            cargando = false;
        }
    }
</script>

<svelte:head>
    <title>Registrar encuentro | PredictPro</title>
    <meta
        name="description"
        content="Registro de encuentros y estadísticas de equipos en PredictPro"
    />
</svelte:head>

<div class="min-h-screen bg-[#0b1117] text-white px-4 py-10">

    <div class="max-w-6xl mx-auto">

        <!-- CABECERA -->

        <div class="mb-10 text-center">

            <p class="text-[#00ff66] uppercase tracking-[0.3em] text-xs font-bold mb-3">
                PredictPro Analytics
            </p>

            <h1 class="text-3xl md:text-4xl font-black">
                Registrar encuentro
            </h1>

            <p class="text-gray-400 mt-3">
                Introduce los datos del partido y el comportamiento de ambos equipos.
            </p>

        </div>

        <form onsubmit={crearEncuentro} class="space-y-8">

            <!-- ================================= -->
            <!-- SELECCIÓN DE EQUIPOS -->
            <!-- ================================= -->

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <!-- EQUIPO LOCAL -->

                <section class="tarjeta">

                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-2 h-8 bg-[#00ff66] rounded-full"></div>
                        <h2 class="text-xl font-bold">Equipo local</h2>
                    </div>

                    <label class="etiqueta">Filtrar por país</label>

                    <select
                        class="campo mb-4"
                        value={paisLocal}
                        onchange={cambiarPaisLocal}
                    >
                        <option value="">Todos los países</option>

                        {#each paisesDisponibles as pais}
                            <option value={pais}>{pais}</option>
                        {/each}
                    </select>

                    <label class="etiqueta">Seleccionar equipo</label>

                    <select
                        class="campo"
                        value={equipoLocalId}
                        onchange={cambiarEquipoLocal}
                    >
                        <option value="">Selecciona equipo local</option>

                        {#each equiposLocalesFiltrados as equipo}
                            <option value={equipo._id}>
                                {equipo.nombre}
                            </option>
                        {/each}
                    </select>

                    {#if equipoLocal}

                        <div class="dato-equipo mt-6">

                            {#if equipoLocal.escudo}
                                <img
                                    src={equipoLocal.escudo}
                                    alt={equipoLocal.nombre}
                                    class="w-24 h-24 object-contain mx-auto mb-3"
                                />
                            {/if}

                            <h3 class="text-xl font-black text-center">
                                {equipoLocal.nombre}
                            </h3>

                            <p class="text-gray-400 text-center text-sm">
                                {equipoLocal.pais}
                            </p>

                            <div class="grid grid-cols-2 gap-3 mt-5">

                                <div class="estadistica">
                                    <span>Puntuación</span>
                                    <strong>{equipoLocal.puntuacion ?? 0}</strong>
                                </div>

                                <div class="estadistica">
                                    <span>Encuentros</span>
                                    <strong>{equipoLocal.totalencuentros ?? 0}</strong>
                                </div>

                                <div class="estadistica">
                                    <span>Victorias</span>
                                    <strong>{equipoLocal.encuentrosganados ?? 0}</strong>
                                </div>

                                <div class="estadistica">
                                    <span>Derrotas</span>
                                    <strong>{equipoLocal.encuentrosperdidos ?? 0}</strong>
                                </div>

                                <div class="estadistica">
                                    <span>Goles a favor</span>
                                    <strong>{equipoLocal.golesafavor ?? 0}</strong>
                                </div>

                                <div class="estadistica">
                                    <span>Goles en contra</span>
                                    <strong>{equipoLocal.golesencontra ?? 0}</strong>
                                </div>

                            </div>

                        </div>

                    {/if}

                </section>


                <!-- EQUIPO VISITANTE -->

                <section class="tarjeta">

                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-2 h-8 bg-blue-500 rounded-full"></div>
                        <h2 class="text-xl font-bold">Equipo visitante</h2>
                    </div>

                    <label class="etiqueta">Filtrar por país</label>

                    <select
                        class="campo mb-4"
                        value={paisVisitante}
                        onchange={cambiarPaisVisitante}
                    >
                        <option value="">Todos los países</option>

                        {#each paisesDisponibles as pais}
                            <option value={pais}>{pais}</option>
                        {/each}
                    </select>

                    <label class="etiqueta">Seleccionar equipo</label>

                    <select
                        class="campo"
                        value={equipoVisitanteId}
                        onchange={cambiarEquipoVisitante}
                    >
                        <option value="">Selecciona equipo visitante</option>

                        {#each equiposVisitantesFiltrados as equipo}
                            <option value={equipo._id}>
                                {equipo.nombre}
                            </option>
                        {/each}
                    </select>

                    {#if equipoVisitante}

                        <div class="dato-equipo mt-6">

                            {#if equipoVisitante.escudo}
                                <img
                                    src={equipoVisitante.escudo}
                                    alt={equipoVisitante.nombre}
                                    class="w-24 h-24 object-contain mx-auto mb-3"
                                />
                            {/if}

                            <h3 class="text-xl font-black text-center">
                                {equipoVisitante.nombre}
                            </h3>

                            <p class="text-gray-400 text-center text-sm">
                                {equipoVisitante.pais}
                            </p>

                            <div class="grid grid-cols-2 gap-3 mt-5">

                                <div class="estadistica">
                                    <span>Puntuación</span>
                                    <strong>{equipoVisitante.puntuacion ?? 0}</strong>
                                </div>

                                <div class="estadistica">
                                    <span>Encuentros</span>
                                    <strong>{equipoVisitante.totalencuentros ?? 0}</strong>
                                </div>

                                <div class="estadistica">
                                    <span>Victorias</span>
                                    <strong>{equipoVisitante.encuentrosganados ?? 0}</strong>
                                </div>

                                <div class="estadistica">
                                    <span>Derrotas</span>
                                    <strong>{equipoVisitante.encuentrosperdidos ?? 0}</strong>
                                </div>

                                <div class="estadistica">
                                    <span>Goles a favor</span>
                                    <strong>{equipoVisitante.golesafavor ?? 0}</strong>
                                </div>

                                <div class="estadistica">
                                    <span>Goles en contra</span>
                                    <strong>{equipoVisitante.golesencontra ?? 0}</strong>
                                </div>

                            </div>

                        </div>

                    {/if}

                </section>

            </div>


            <!-- ================================= -->
            <!-- INFORMACIÓN DEL ENCUENTRO -->
            <!-- ================================= -->

            <section class="tarjeta">

                <div class="mb-6">
                    <h2 class="text-xl font-bold">
                        Información del encuentro
                    </h2>
                    <p class="text-gray-400 text-sm mt-1">
                        Competición y temporada correspondiente.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <label class="etiqueta">Competición</label>

                        <select class="campo" bind:value={competicion}>
                            <option value="Liga">Liga</option>
                            <option value="Copa">Copa</option>
                            <option value="Champions ">Champions League</option>
                            <option value="Euro">Europa League</option>
                            
                        </select>
                    </div>

                    <div>
                        <label class="etiqueta">Temporada</label>

                        <input
                            class="campo"
                            type="text"
                            bind:value={temporada}
                            placeholder="Ejemplo: 26/27"
                        />
                    </div>

                </div>

            </section>


            <!-- ================================= -->
            <!-- MARCADOR Y CÓRNERS -->
            <!-- ================================= -->

            <section class="tarjeta">

                <h2 class="text-xl font-bold mb-6">
                    Resultado del encuentro
                </h2>

                <div class="grid grid-cols-2 gap-4 md:gap-10">

                    <div>
                        <p class="text-gray-400 text-center mb-3">
                            {equipoLocal?.nombre ?? "Equipo local"}
                        </p>

                        <input
                            class="marcador"
                            type="number"
                            min="0"
                            step="1"
                            bind:value={golesteam1}
                        />

                        <label class="etiqueta text-center mt-4">
                            Córners
                        </label>

                        <input
                            class="campo text-center"
                            type="number"
                            min="0"
                            step="1"
                            bind:value={cornersteam1}
                        />
                    </div>

                    <div>
                        <p class="text-gray-400 text-center mb-3">
                            {equipoVisitante?.nombre ?? "Equipo visitante"}
                        </p>

                        <input
                            class="marcador"
                            type="number"
                            min="0"
                            step="1"
                            bind:value={golesteam2}
                        />

                        <label class="etiqueta text-center mt-4">
                            Córners
                        </label>

                        <input
                            class="campo text-center"
                            type="number"
                            min="0"
                            step="1"
                            bind:value={cornersteam2}
                        />
                    </div>

                </div>

            </section>


            <!-- ================================= -->
            <!-- ESTILOS DE JUEGO -->
            <!-- ================================= -->

            <section class="tarjeta">

                <h2 class="text-xl font-bold mb-2">
                    Análisis táctico
                </h2>

                <p class="text-gray-400 text-sm mb-6">
                    Define los comportamientos ofensivos y defensivos de cada equipo.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <!-- ESTILOS EQUIPO LOCAL -->

                    <div class="space-y-5">

                        <h3 class="font-bold text-[#00ff66]">
                            {equipoLocal?.nombre ?? "Equipo local"}
                        </h3>

                        <div>
                            <label class="etiqueta">Estilo ofensivo</label>

                            <select
                                class="campo"
                                bind:value={estiloofteam1}
                            >
                                <option value="">Seleccionar estilo ofensivo</option>
                                <option value="juego_interior">Juego interior</option>
                                <option value="juego_directo">Juego directo</option>
                                <option value="juego_exterior">Juego exterior</option>
                                <option value="contraataque">Contraataque</option>
                            </select>
                        </div>

                        <div>
                            <label class="etiqueta">Estilo defensivo</label>

                            <select
                                class="campo"
                                bind:value={estilodefteam1}
                            >
                                <option value="">Seleccionar estilo defensivo</option>
                                <option value="presion_alta">Presión alta</option>
                                <option value="bloque_medio">Bloque medio</option>
                                <option value="bloque_bajo">Bloque bajo</option>
                            </select>
                        </div>

                    </div>


                    <!-- ESTILOS EQUIPO VISITANTE -->

                    <div class="space-y-5">

                        <h3 class="font-bold text-blue-400">
                            {equipoVisitante?.nombre ?? "Equipo visitante"}
                        </h3>

                        <div>
                            <label class="etiqueta">Estilo ofensivo</label>

                            <select
                                class="campo"
                                bind:value={estiloofteam2}
                            >
                                <option value="">Seleccionar estilo ofensivo</option>
                                <option value="juego_interior">Juego interior</option>
                                <option value="juego_directo">Juego directo</option>
                                <option value="juego_exterior">Juego exterior</option>
                                <option value="contraataque">Contraataque</option>
                            </select>
                        </div>

                        <div>
                            <label class="etiqueta">Estilo defensivo</label>

                            <select
                                class="campo"
                                bind:value={estilodefteam2}
                            >
                                <option value="">Seleccionar estilo defensivo</option>
                                <option value="presion_alta">Presión alta</option>
                                <option value="bloque_medio">Bloque medio</option>
                                <option value="bloque_bajo">Bloque bajo</option>
                            </select>
                        </div>

                    </div>

                </div>

            </section>


            <!-- ================================= -->
            <!-- MENSAJES -->
            <!-- ================================= -->

            {#if mensaje}
    <div
        class={`p-4 rounded-xl text-center font-semibold ${
            tipoMensaje === "success"
                ? "bg-green-900/30 text-green-400"
                : "bg-red-900/30 text-red-400"
        }`}
    >
        {mensaje}
    </div>
{/if} 


            <!-- ================================= -->
            <!-- BOTÓN REGISTRAR -->
            <!-- ================================= -->

            <div class="flex justify-center pb-10">

                <button
                    type="submit"
                    disabled={cargando}
                    class="w-full md:w-auto px-12 py-4 rounded-xl bg-[#00ff66] text-black font-black uppercase tracking-wider hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {cargando ? "Registrando encuentro..." : "Registrar encuentro"}
                </button>

            </div>

        </form>

    </div>

</div>

<style>
    .tarjeta {
        background: #111a22;
        border: 1px solid #263440;
        border-radius: 18px;
        padding: 24px;
    }

    .campo {
        width: 100%;
        background: #0b1117;
        border: 1px solid #344451;
        border-radius: 10px;
        padding: 13px 14px;
        color: white;
        outline: none;
        transition: border-color 0.2s;
    }

    .campo:focus {
        border-color: #00ff66;
    }

    .campo option {
        background: #111a22;
        color: white;
    }

    .etiqueta {
        display: block;
        color: #a5b4c0;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
    }

    .dato-equipo {
        background: #0b1117;
        border: 1px solid #263440;
        border-radius: 14px;
        padding: 20px;
    }

    .estadistica {
        display: flex;
        flex-direction: column;
        gap: 5px;
        background: #17232d;
        border-radius: 9px;
        padding: 12px;
        text-align: center;
    }

    .estadistica span {
        color: #91a0ad;
        font-size: 11px;
        text-transform: uppercase;
    }

    .estadistica strong {
        color: #00ff66;
        font-size: 19px;
        font-weight: 800;
    }

    .marcador {
        width: 100%;
        background: #0b1117;
        border: 2px solid #344451;
        border-radius: 14px;
        padding: 20px 10px;
        color: #00ff66;
        font-size: 42px;
        font-weight: 900;
        text-align: center;
        outline: none;
    }

    .marcador:focus {
        border-color: #00ff66;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        opacity: 1;
    }
</style>



