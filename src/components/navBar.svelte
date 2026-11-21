
<script>
// @ts-nocheck

    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import apiTeams from "../conexiones/teamAxios";
    
    let mostrarModal = $state(false);
    let tipoModal = $state("");
    let sesionActiva = $state(false);
    let equipos = $state([]);
let busquedaEquipo = $state("");
let mostrarResultados = $state(false);
let cargandoEquipos = $state(false);

    // COMPROBAR SESIÓN AL CARGAR
    onMount(() => {
        sesionActiva = !!localStorage.getItem("token");
        cargarEquipos();
    });

    const enlaces = [
        { nombre: "Inicio", ruta: "/" }
    ];

    // CONTROL DE ACCESO A PREDICTS
    function accederPredicts() {

        const token = localStorage.getItem("token");

        // 1. Comprobar si existe token
        if (!token) {
            sesionActiva = false;
            tipoModal = "login";
            mostrarModal = true;
            return;
        }

        try {

            // 2. Decodificar JWT
            const payload = JSON.parse(
                atob(
                    token.split(".")[1]
                        .replace(/-/g, "+")
                        .replace(/_/g, "/")
                )
            );
            // 3. Comprobar caducidad
            if (!payload.exp || payload.exp * 1000 < Date.now()) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                sesionActiva = false;
                tipoModal = "login";
                mostrarModal = true;
                return;
            }

            // 4. Comprobar estado de cuenta
            if (payload.estado !== "activo") {

                tipoModal = "inactivo";
                mostrarModal = true;
                return;
            }

            // 5. Acceso permitido
            sesionActiva = true;
            goto("/predicts");
            
        } catch (error) {

            // Token inválido
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            sesionActiva = false;
            tipoModal = "login";
            mostrarModal = true;
        }
        
    }

    // CERRAR SESIÓN
    function cerrarSesion() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sesionActiva = false;

        goto("/");
    }

    // CERRAR MODAL
    function cerrarModal() {
        mostrarModal = false;
    }

    // IR AL LOGIN
    function irLogin() {
        mostrarModal = false;
        goto("/auth");
    }

    async function cargarEquipos() {
    try {
        cargandoEquipos = true;

        const response = await apiTeams.get("");

        equipos = response.data.equipos || [];

        console.log("Equipos cargados:", equipos.length);

    } catch (error) {
        console.error("Error cargando equipos:", error);
    } finally {
        cargandoEquipos = false;
    }
}

// FILTRAR EQUIPOS
let equiposFiltrados = $derived(
    equipos
        .filter(team =>
            team.nombre?.toLowerCase().includes(busquedaEquipo.toLowerCase())
        )
        .slice(0, 8)
);

// NAVEGAR AL EQUIPO
function seleccionarEquipo(team) {
    busquedaEquipo = "";
    mostrarResultados = false;

    goto(`/teams/${team._id}`);
}

</script>


<!-- HEADER -->
<header class="sticky top-0 z-50 border-b border-white/10 bg-[#080d12]/90 backdrop-blur-xl flex flex-col md:flex-row justify-between items-center">

    <div class=" px-6 py-4 flex items-center  gap-2">

        <!-- LOGO -->
        <a href="/" class="flex items-center gap-1 md:gap-3 group">

            <div class="w-6 h-6 md:w-8 md:h-8 rounded-xl bg-[#00ff66] flex items-center justify-center text-black shadow-[0_0_25px_#00ff6655] group-hover:shadow-[0_0_30px_#00ff6680] transition">
                <i class="fa-solid fa-chart-line"></i>
            </div>

            <span class="text-lg md:text-2xl font-black tracking-tight text-white">
                Predict<span class="text-[#00ff66]">Pro</span>
            </span>

        </a>


        <!-- NAVEGACIÓN DESKTOP -->
        <nav class="hidden md:flex items-center gap-3">

            {#each enlaces as enlace}
                <a
                    href={enlace.ruta}
                    class="px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                    {page.url.pathname === enlace.ruta
                        ? 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20'
                        : 'text-gray-400 border border-transparent hover:text-white hover:bg-white/5'}"
                >
                    {enlace.nombre}
                </a>
            {/each}

            <!-- PREDICT PRO -->
            <button
                type="button"
                onclick={accederPredicts}
                class="px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                {page.url.pathname === '/predicts'
                    ? 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20'
                    : 'text-gray-400 border border-transparent hover:text-white hover:bg-white/5'}"
            >
                Predict Pro
            </button>

            <!-- LOGIN / CERRAR SESIÓN -->
            {#if sesionActiva}

                <button
                    type="button"
                    onclick={cerrarSesion}
                    class="px-5 py-2.5 rounded-xl text-sm font-bold text-red-400 border border-transparent hover:bg-red-400/10 transition-all"
                >
                    <i class="fa-solid fa-right-from-bracket mr-2"></i>
                    Cerrar sesión
                </button>

            {:else}

                <a
                    href="/auth"
                    class="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-400 border border-transparent hover:text-white hover:bg-white/5 transition-all"
                >
                    <i class="fa-solid fa-user mr-2"></i>
                    Login
                </a>

            {/if}

        </nav>


        <!-- NAVEGACIÓN MÓVIL -->
        <nav class="flex md:hidden items-center gap-1">

            {#each enlaces as enlace}
                <a
                    href={enlace.ruta}
                    class="px-3 py-2 rounded-lg text-xs font-bold transition
                    {page.url.pathname === enlace.ruta
                        ? 'bg-[#00ff66]/10 text-[#00ff66]'
                        : 'text-gray-400 hover:text-white'}"
                >
                    {enlace.nombre}
                </a>
            {/each}

            <!-- PREDICT PRO -->
            <button
                type="button"
                onclick={accederPredicts}
                class="px-3 py-2 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition"
            >
                Predict Pro
            </button>

            <!-- LOGIN / CERRAR SESIÓN -->
            {#if sesionActiva}

                <button
                    type="button"
                    onclick={cerrarSesion}
                    class="px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-400/10 transition"
                >
                    Salir
                </button>

            {:else}

                <a
                    href="/auth"
                    class="px-3 py-2 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition"
                >
                    Login
                </a>

            {/if}

        </nav>

    </div>
    <!-- BUSCADOR DE EQUIPOS -->
    <div class=" flex-1 mb-3 p-2 mt-3 w-full mx-2  md:mx-6">

        <div>

            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>

            <input
                type="text"
                placeholder="Buscar equipo..."
                bind:value={busquedaEquipo}
                onfocus={() => mostrarResultados = true}
                class="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-[#00ff66]/50 transition placeholder:text-gray-500"
            />

        </div>

        {#if mostrarResultados && busquedaEquipo.trim().length > 0}

            <div class="absolute top-full left-0 mt-2 w-full min-w-[240px] bg-[#0E131F] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100]">

                {#if cargandoEquipos}

                    <div class="p-4 text-center text-gray-400 text-sm">
                        Buscando equipos...
                    </div>

                {:else if equiposFiltrados.length > 0}

                    {#each equiposFiltrados as team}

                        <button
                            type="button"
                            onclick={() => seleccionarEquipo(team)}
                            class="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#00ff66]/10 transition text-left group"
                        >

                            <div class="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">

                                {#if team.escudo}
                                    <img
                                        src={team.escudo}
                                        alt={team.nombre}
                                        class="w-7 h-7 object-contain"
                                    />
                                {:else}
                                    <span>⚽</span>
                                {/if}

                            </div>

                            <span class="text-sm font-semibold text-gray-300 group-hover:text-[#00ff66] transition">
                                {team.nombre}
                            </span>

                            <i class="fa-solid fa-chevron-right ml-auto text-xs text-gray-600 group-hover:text-[#00ff66]"></i>

                        </button>

                    {/each}

                {:else}

                    <div class="p-4 text-center text-gray-500 text-sm">
                        No se encontraron equipos.
                    </div>

                {/if}

            </div>

        {/if}

    </div>
</header>


<!-- MODAL DE ACCESO -->
{#if mostrarModal}

    <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-5"
        onclick={(e) => {
            if (e.target === e.currentTarget) cerrarModal();
        }}
    >

        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            class="relative w-full max-w-md bg-[#0E131F] border border-white/10 rounded-2xl p-7 shadow-[0_0_50px_#00ff6615]"
        >

            <!-- CERRAR -->
            <button
                type="button"
                onclick={cerrarModal}
                aria-label="Cerrar"
                class="absolute top-4 right-4 text-gray-500 hover:text-white transition text-xl"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>


            <!-- ICONO -->
            <div class="w-16 h-16 mx-auto rounded-2xl bg-[#00ff66]/10 border border-[#00ff66]/20 flex items-center justify-center mb-6">

                {#if tipoModal === "login"}
                <i class="fa-solid fa-triangle-exclamation text-3xl text-yellow-400"></i>
                {:else}
                    <i class="fa-solid fa-user-shield text-2xl text-red-400"></i>
                {/if}

            </div>


            <div class="text-center">

                {#if tipoModal === "login"}

                    <!-- USUARIO NO REGISTRADO -->
                    <span class="text-[#00ff66] text-xs font-bold tracking-widest uppercase">
                        ACCESO RESTRINGIDO
                    </span>

                    <h2 id="modal-title" class="text-2xl font-black text-white mt-3 mb-3">
                        ¡Un momento!
                    </h2>

                    <p class="text-gray-400 text-sm leading-relaxed mb-7">
                        Esta opción está disponible únicamente para usuarios registrados.
                        Inicia sesión o crea una cuenta para acceder a los análisis de PredictPro.
                    </p>

                    <button
                        type="button"
                        onclick={irLogin}
                        class="w-full py-3.5 rounded-xl bg-[#00ff66] text-black font-extrabold text-sm hover:bg-[#00e65c] transition-all hover:shadow-[0_0_25px_#00ff6640]"
                    >
                        Iniciar sesión / Registrarme
                    </button>


                {:else if tipoModal === "inactivo"}

                    <!-- CUENTA NO ACTIVA -->
                    <span class="text-red-400 text-xs font-bold tracking-widest uppercase">
                        ACCESO NO DISPONIBLE
                    </span>

                    <h2 id="modal-title" class="text-2xl font-black text-white mt-3 mb-3">
                        Cuenta no activa
                    </h2>

                    <p class="text-gray-400 text-sm leading-relaxed mb-7">
                        Tu cuenta no se encuentra activa actualmente.
                        Para volver a acceder a esta función, ponte en contacto
                        con el administrador de PredictPro.
                    </p>

                    <button
                        type="button"
                        onclick={cerrarModal}
                        class="w-full py-3.5 rounded-xl bg-[#00ff66] text-black font-extrabold text-sm hover:bg-[#00e65c] transition-all"
                    >
                        Entendido
                    </button>

                {/if}

            </div>

        </div>

    </div>

{/if}

