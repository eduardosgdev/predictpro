
<script>
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    
    let mostrarModal = $state(false);
    let tipoModal = $state("");
    let sesionActiva = $state(false);

    // COMPROBAR SESIÓN AL CARGAR
    onMount(() => {
        sesionActiva = !!localStorage.getItem("token");
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

</script>


<!-- HEADER -->
<header class="sticky top-0 z-50 border-b border-white/10 bg-[#080d12]/90 backdrop-blur-xl">

    <div class="max-w-10xl mx-auto px-6 py-4 flex items-center justify-between gap-2">

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
                    <i class="fa-solid fa-lock text-2xl text-[#00ff66]"></i>
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

