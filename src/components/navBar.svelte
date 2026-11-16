
<script>
    import { page } from "$app/state";

    const enlaces = [
        { nombre: "Inicio", ruta: "/" },
        { nombre: "Predict Pro", ruta: "/predicts" }
    ];
</script>

<header class="sticky top-0 z-50 border-b border-white/10 bg-[#080d12]/90 backdrop-blur-xl">

    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <!-- LOGO: VUELVE A INICIO -->
        <a href="/" class="flex items-center gap-3 group">

            <div class="w-10 h-10 rounded-xl bg-[#00ff66] flex items-center justify-center text-black text-xl shadow-[0_0_25px_#00ff6655] group-hover:shadow-[0_0_30px_#00ff6680] transition">
                <i class="fa-solid fa-chart-line"></i>
            </div>

            <span class="text-2xl font-black tracking-tight text-white">
                Predict<span class="text-[#00ff66]">Pro</span>
            </span>

        </a>

        <!-- NAVEGACIÓN -->
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

        </nav>

        <!-- ACCESO MÓVIL -->
        <nav class="flex md:hidden items-center gap-2">

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

        </nav>

    </div>
</header>
