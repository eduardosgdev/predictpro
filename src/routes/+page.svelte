<script>
// @ts-nocheck

// @ts-ignore
import 'flag-icons/css/flag-icons.min.css';
let { data } = $props();

let teams = data.teams ;
console.log(teams)
let mostrarTodos = $state(false);

// Ordenar equipos por puntuación (5 a 1)
let equiposOrdenados = $derived(
    [...teams].sort((a, b) => b.puntuacion - a.puntuacion)
);

// Mostrar inicialmente 6 equipos
let equiposVisibles = $derived(
    mostrarTodos
        ? equiposOrdenados
        : equiposOrdenados.slice(0, 6)
);

const banderas = {
    "España": "es",
    "Inglaterra": "gb-eng",
    "Francia": "fr",
    "Alemania": "de",
    "Italia": "it",
    "Portugal": "pt",
    "Argentina": "ar",
    "Brasil": "br",
    "México": "mx",
    "Estados Unidos": "us",
    "Países Bajos": "nl",
    "Bélgica": "be",
    "Turquía": "tr",
    "Arabia Saudita": "sa"
};
</script>
<svelte:head>
    <title>PredictPro | Inteligencia Deportiva</title>
    <meta name="description" content="Predicciones deportivas con inteligencia artificial." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
</svelte:head>

<div class="min-h-screen bg-[#080d12] text-white font-['Inter']">

    <!-- HEADER -->
    <header class="sticky top-0 z-50 border-b border-white/10 bg-[#080d12]/90 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#00ff66] flex items-center justify-center text-black text-xl shadow-[0_0_25px_#00ff6655]">
                    <i class="fa-solid fa-chart-line"></i>
                </div>
                <span class="text-2xl font-black tracking-tight">Predict<span class="text-[#00ff66]">Pro</span></span>
            </a>

            <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-400">
                <a href="#inicio" class="hover:text-[#00ff66] transition">Inicio</a>
                <a href="#partidos" class="hover:text-[#00ff66] transition">Partidos</a>
                <a href="#funciones" class="hover:text-[#00ff66] transition">Características</a>
                <a href="#precios" class="hover:text-[#00ff66] transition">Planes</a>
            </nav>

            <div class="hidden md:flex items-center gap-4">
                <a href="#" class="text-gray-300 hover:text-white font-semibold text-sm">Iniciar sesión</a>
                <a href="#" class="bg-[#00ff66] hover:bg-[#00dd59] text-black px-5 py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_#00ff6633] transition">
                    Crear cuenta <i class="fa-solid fa-arrow-right ml-2"></i>
                </a>
            </div>

            <a href="#partidos" class="md:hidden text-2xl text-[#00ff66]">
                <i class="fa-solid fa-bars"></i>
            </a>
        </div>
    </header>

    <!-- HERO -->
    <section id="inicio" class="relative overflow-hidden py-24 md:py-32">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#00ff6618,_transparent_55%)]"></div>
        <div class="absolute top-20 left-0 w-72 h-72 bg-cyan-500/10 blur-[120px] rounded-full"></div>

        <div class="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div>
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00ff66]/30 bg-[#00ff66]/10 text-[#00ff66] text-xs font-bold mb-8">
                    <span class="w-2 h-2 bg-[#26ff00] rounded-full animate-pulse"></span>
                    INTELIGENCIA ARTIFICIAL DEPORTIVA
                </div>

                <h1 class="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
                    Predice el juego.
                    <span class="block text-transparent bg-clip-text bg-gradient-to-r from-[#00ff66] to-blue-500">Domina el resultado.</span>
                </h1>

                <p class="text-gray-400 text-lg leading-relaxed mt-7 max-w-xl">
                    Analizamos estadísticas, estilos de juego y rendimiento de los equipos para ofrecerte una nueva perspectiva del fútbol.
                </p>

                <div class="flex flex-wrap gap-4 mt-9">
                    <a href="#partidos" class="px-7 py-4 rounded-xl bg-[#00ff66] text-black font-extrabold hover:shadow-[0_0_30px_#00ff6677] transition">
                        Explorar partidos <i class="fa-solid fa-arrow-right ml-2"></i>
                    </a>
                    <a href="#funciones" class="px-7 py-4 rounded-xl border border-white/15 bg-white/5 font-bold hover:bg-white/10 transition">
                        Conocer más
                    </a>
                </div>

                <div class="grid grid-cols-3 gap-6 mt-14 border-t border-white/10 pt-8">
                    <div>
                        <p class="text-3xl font-black text-[#00ff66]">45+</p>
                        <p class="text-xs text-gray-500 mt-2">Competiciones</p>
                    </div>
                    <div>
                        <p class="text-3xl font-black">100K+</p>
                        <p class="text-xs text-gray-500 mt-2">Datos analizados</p>
                    </div>
                    <div>
                        <p class="text-3xl font-black">24/7</p>
                        <p class="text-xs text-gray-500 mt-2">Análisis deportivo</p>
                    </div>
                </div>
            </div>

            <!-- PARTIDO DESTACADO -->
            <div class="relative">
                <div class="absolute -inset-5 bg-[#00ff66]/10 blur-3xl rounded-full"></div>
                <div class="relative rounded-3xl border border-white/10 bg-[#111a22] p-7 shadow-2xl">
                    <div class="flex items-center justify-between mb-8">
                        <span class="text-xs font-bold tracking-widest text-gray-400">PARTIDO DESTACADO</span>
                        <span class="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold">EN ANÁLISIS</span>
                    </div>

                    <div class="flex items-center justify-between gap-4">
                        <div class="text-center flex-1">
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="1.89 2.46 138.04 139.75"><!-- Source: https://football-logos.cc --><path d="M74.644 174.448c50.081 21.983 132.278 19.38 187.41-22.228 77.09 56.484 151.285 50.686 222.027 0 47.165 34.092 119.78 48.648 187.916 22.944l30.545 42.44c-79.649 106.443-50.166 208.19 31.988 297.731l-34.498 34.98c7.815 229.58-169.998 284.393-272.102 290.083l-54.897 44.915-54.487-44.245C136.26 825.325 40.016 729.158 45.97 550.904L10.5 515.068C79.804 440.105 131.882 337.67 42.855 217.58z" style="fill:#000;fill-opacity:1;fill-rule:evenodd;stroke:#000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" transform="translate(.398 -25.853)scale(.18927)" data-source="https://football-logos.cc"></path><path d="M78.794 546.281h586.55c15.415 162.311-87.706 249.98-244.514 258.598l-99.643.252c-150.023-10.784-261.795-89.993-242.393-258.85" style="fill:#004d98;fill-opacity:1;fill-rule:evenodd;stroke:none" transform="translate(.398 -25.853)scale(.18927)"></path><path d="M331.65 548.233h83.086v259.363H331.65z" style="fill:#a50044;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="translate(.398 -25.853)scale(.18927)"></path><path d="M166.417 548.233h83.086v231.796h-83.086z" style="fill:#a50044;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="translate(.373 -25.853)scale(.18927)"></path><path d="M195.386 768.152h54.117v23.877h-54.117zm300.817-219.919h83.086v231.796h-83.086z" style="fill:#a50044;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="translate(.373 -25.853)scale(.18927)"></path><path d="M496.203 768.152h54.117v23.877h-54.117z" style="fill:#a50044;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="translate(.373 -25.853)scale(.18927)"></path><path d="M370.491 228.08v230.373L90.5 460.48l28.86-110.884L83.41 216.94l177.21-22.784z" style="fill:#fff;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" transform="translate(.398 -25.853)scale(.18927)"></path><path d="M374.542 228.08v230.373l279.993 2.026-28.86-110.884 35.948-132.655-177.21-22.784z" style="fill:#ffed02;fill-opacity:1;fill-rule:evenodd;stroke:none" transform="translate(.398 -25.853)scale(.18927)"></path><path d="M208.704 200.719h80.278v256.307h-80.278z" style="fill:#db0030;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="translate(.398 -25.853)scale(.18927)"></path><path d="M296.322-370.491H376.6v249.801h-80.278z" style="fill:#db0030;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="rotate(90 13.125 -12.727)scale(.18927)"></path><path d="M399.801 218.888h29.691v236.469h-29.691zm56.362-16.939h29.691v253.966h-29.691zm56.732 14.315h29.691v240.18h-29.691zm56.201 8.799h29.691V456.23h-29.691z" style="fill:#db0030;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="translate(.373 -25.853)scale(.18927)" data-source="https://football-logos.cc"></path><path d="M261.587 170.469c-51.707 37.9-133.53 41.887-180.5 22.937l-18.813 24.219c80.708 113.56 34.338 227.81-29.656 297.781l29.469 31.188c-11.958 171.165 87.93 270.157 263.531 280.343l47.594 39.75 47.5-40.375c102.26-1.763 281.57-59.115 262.25-279.968l29.625-30.688c-75.153-83.346-101.056-197.505-28.438-298.031l-17.656-24.062c-64.255 21.116-137.765 9.411-182-22.563-66.348 47.537-150.605 52.444-222.906-.531zM485.087 203c39.892 24.77 83.974 31.818 159.969 25.156-38.055 65.84-42.165 144.274-8.47 220l-527.374-.312c28.364-67.666 34.872-145.53-9.594-221.188 54.813 7.958 108.356 6.051 161.75-23 72.423 42.515 146.929 43.293 223.719-.656zM90.493 548.844h565.531c14.863 156.492-84.563 241.002-235.75 249.312l-96.094.25c-144.644-10.398-252.393-86.76-233.687-249.562z" style="fill:#edbb00;fill-opacity:1;fill-rule:evenodd;stroke:#deb405;stroke-width:.93788052px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" transform="translate(.398 -25.853)scale(.18927)"></path><path d="M99.008 227.48c44.466 75.657 37.953 153.52 9.59 221.186l527.362.312c-33.695-75.727-29.57-154.161 8.483-220.001-75.994 6.66-120.065-.38-159.957-25.15-76.79 43.95-151.32 43.155-223.744.64-53.393 29.05-106.921 30.971-161.734 23.013zm-8.52 321.363H656.01c14.863 156.492-84.561 241.017-235.748 249.328l-96.07.243c-144.646-10.398-252.41-86.768-233.704-249.57zm282.209-313.45v213.684" style="fill:none;fill-rule:evenodd;stroke:#000;stroke-width:4;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" transform="translate(.398 -25.853)scale(.18927)"></path><path d="M391.554 656.71a57.378 57.378 0 1 1-114.755 0 57.378 57.378 0 1 1 114.755 0z" style="fill:#edbb00;fill-opacity:1;fill-rule:nonzero;stroke:#000;stroke-width:3;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;stroke-dashoffset:0" transform="translate(-13.608 -65.45)scale(.25363)"></path><g style="stroke-width:3.5;stroke-miterlimit:4;stroke-dasharray:none"><path d="M329.448 608.16c-8.975 32.709-14.54 64.915 11.35 80.391 18.09 10.814 30.322-11.24 33.711-19.784" style="fill:none;fill-rule:evenodd;stroke:#000;stroke-width:3.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" transform="translate(.398 -25.853)scale(.18927)"></path><path d="M302.65 701.792c15.157-.692 23.066-1.938 32.788-16.709" style="fill:none;fill-rule:evenodd;stroke:#000;stroke-width:3.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" transform="translate(.398 -25.853)scale(.18927)"></path></g><path d="M373.871 669.341c15.21-9.35 28.738-4.825 35.023 18.58 14.803-5.949 29.07 5.476 32.787 17.024" style="fill:none;fill-rule:evenodd;stroke:#000;stroke-width:3.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" transform="translate(.398 -25.853)scale(.18927)"></path><path d="M409.209 687.92c-11.237 27.129-40.792 39.687-82.283 43.822m46.969-61.289c-9.336-8.548-23.698-18.33-2.775-43.461-8.878-11.25-11.297-22.243.309-32.674" style="fill:none;fill-rule:evenodd;stroke:#000;stroke-width:3.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" transform="translate(.398 -25.853)scale(.18927)"></path><path d="M450.338 675.385c-13.655-24.138-45.436-57.585-79.218-48.702" style="fill:none;fill-rule:evenodd;stroke:#000;stroke-width:3.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" transform="translate(.398 -25.853)scale(.18927)"></path><path d="M266.3 461.88v.28h-13.969v72.657h15.094v-30.156h21.531v-15.375h-21.53v-11.781h37.155V461.88z" style="fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:3.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" transform="translate(.398 -25.853)scale(.18927)"></path><path d="m380.57 484.64 13.547-7.076c-8.648-19.12-43.71-24.557-55.244 0-11.9 29.293.75 56.506 23.784 59.158 14.636 2.131 26.234-5.034 31.159-17.762l-13.397-7.677c-3.568 8.89-17.172 15.009-27.547.15-3.195-6.64-4.014-16.86-.451-26.794 8.508-11.69 20.945-10.425 28.148 0z" style="fill:#000;fill-rule:evenodd;stroke:#000;stroke-width:.2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" transform="translate(.398 -25.853)scale(.18927)"></path><path d="m432.363 462.067.28 73.313 39.907-.157c12.985-1.818 30.008-23.074 10.063-39.593 10.545-9.294 9.223-29.173-11.875-33.407zm15.343 14.438h19.875c8.74 2.515 6.147 10.917.282 12.343h-20.157zm.157 26.656 20.906.281c10.341 3.078 8.006 14.863.312 16.875l-21.062-.156z" style="fill:#000;fill-rule:evenodd;stroke:#000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" transform="translate(.398 -25.853)scale(.18927)" data-source="https://football-logos.cc"></path><!-- source: https://football-logos.cc --></svg>
                            <h3 class="font-bold mt-4">Real Madrid</h3>
                            <p class="text-xs text-gray-500 mt-1">Local</p>
                        </div>
                        <div class="text-center">
                            <span class="text-3xl font-black text-gray-600">VS</span>
                            <p class="text-xs text-gray-500 mt-2">Champions</p>
                        </div>
                        <div class="text-center flex-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79.34 79.34"><!-- Source: https://football-logos.cc --><path d="M-65.768 55.49c-21.876 0-39.67 17.796-39.67 39.67s17.794 39.672 39.67 39.672c21.874 0 39.67-17.798 39.67-39.672s-17.796-39.67-39.67-39.67" style="fill:#004170;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.74937963" transform="translate(105.439 -55.49)" data-source="https://football-logos.cc"></path><path d="M-65.823 58.337c-9.838 0-19.089 3.83-26.046 10.788-6.958 6.957-10.789 16.208-10.789 26.047 0 9.838 3.831 19.087 10.789 26.046 6.957 6.957 16.208 10.788 26.046 10.788s19.09-3.83 26.047-10.788 10.788-16.208 10.788-26.046-3.831-19.09-10.788-26.047-16.208-10.788-26.047-10.788m0 1.459c19.539 0 35.376 15.838 35.376 35.376s-15.837 35.376-35.376 35.376c-19.537 0-35.376-15.84-35.376-35.376 0-19.538 15.84-35.376 35.376-35.376" style="fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.74937963" transform="translate(105.439 -55.49)"></path><path d="m-76.43 69.685.156-3.895 2.566 2.942q-1.394.407-2.722.953m.546-5.902q-.972.311-1.917.68l-.681 10.33a24 24 0 0 1 1.888-1.042l.098-2.407a26 26 0 0 1 3.883-1.356l1.587 1.821c.698-.15 1.406-.273 2.124-.36zm28.003 6.38c1.365-.32 3.872 2.171 4.35 3.858.4-.305 1.287-.955 1.287-.955-1.06-3.016-5.28-6.034-7.285-4.145-1.19 1.124-.514 2.854.523 3.947l1.008 1.06c1.029 1.083 1.926 2.16 1.1 2.841-.88.728-3.341-1.095-4.82-4.225l-1.325 1c.316.823 1.03 2.016 1.989 3.026 1.086 1.144 2.27 1.889 3.33 2.097.833.165 1.664.04 2.212-.469 1.366-1.266.87-3.114-1.277-5.374l-.89-.936c-.989-1.04-.585-1.634-.202-1.725m-40.016 2.648 2.482-2.724a1.504 1.504 0 0 1 2.223 2.026l-2.482 2.725zm5.477 4.992-2.064-1.88 2.557-2.817c1.158-1.268 1.158-3.311-.112-4.468s-3.337-.999-4.494.272l-3.798 4.177 6.615 6.027c.414-.455.85-.889 1.296-1.31m16.476-13.921h3.387c.83 0 1.505.675 1.505 1.504 0 .83-.676 1.505-1.505 1.505h-3.387zm0 7.377v-2.757h2.308l1.99 3.147q1.185.215 2.324.543l-2.386-3.805c1.368-.366 2.496-1.571 2.496-3 0-1.718-1.627-3.118-3.345-3.118h-5.229v9.067c.607-.047 1.22-.077 1.84-.077zm10.088 2.226 3.5-8.42a32 32 0 0 0-1.746-.721L-57.6 72.76q.89.328 1.745.726" style="fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.74937963" transform="translate(105.439 -55.49)"></path><path d="M-58.772 94.91c-3.168-5.558-5.042-12.12-5.182-19.794a21 21 0 0 0-1.842-.088c-.626 0-1.244.033-1.856.09-.14 7.672-2.014 14.234-5.182 19.792zm.464.79h-14.99c-2.485 4.122-5.693 7.678-9.444 10.704a20.4 20.4 0 0 0 6.275 6.118 9.6 9.6 0 0 1-.143-1.643c0-5.584 4.84-10.111 10.813-10.111 5.972 0 10.813 4.527 10.813 10.111q-.002.84-.144 1.643a20.4 20.4 0 0 0 6.27-6.11c-3.754-3.029-6.964-6.587-9.45-10.712" style="fill:#e30613;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.74937963" transform="translate(105.439 -55.49)" data-source="https://football-logos.cc"></path><path d="M-62.935 75.234c9.836 1.39 17.403 9.84 17.403 20.06 0 3.273-.78 6.363-2.16 9.1-8.928-6.698-14.353-16.138-15.243-29.16m7.807 37.288a9.6 9.6 0 0 0 .144-1.643c0-5.584-4.84-10.111-10.813-10.111s-10.813 4.527-10.813 10.111q.001.84.145 1.643a20.35 20.35 0 0 1-6.275-6.118c3.749-3.026 6.957-6.582 9.441-10.704h14.99c2.487 4.125 5.697 7.683 9.451 10.711a20.35 20.35 0 0 1-6.27 6.111m-3.397 1.686a20.2 20.2 0 0 1-7.272 1.351c-2.563 0-5.012-.481-7.27-1.35a7.8 7.8 0 0 1-1.302-4.313c0-4.496 3.838-8.141 8.572-8.141 4.735 0 8.573 3.645 8.573 8.141a7.8 7.8 0 0 1-1.301 4.312m-27.537-18.914c0-10.221 7.57-18.67 17.408-20.06-.89 13.022-6.317 22.464-15.248 29.162a20.2 20.2 0 0 1-2.16-9.102m20.265-20.265c.623 0 1.235.032 1.844.088.138 7.673 2.013 14.235 5.181 19.792h-14.063c3.17-5.557 5.043-12.12 5.183-19.792.61-.054 1.23-.088 1.855-.088m0-1.459c-11.978 0-21.722 9.746-21.722 21.724s9.744 21.722 21.722 21.722 21.724-9.744 21.724-21.722S-53.82 73.57-65.797 73.57" style="fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.74937963" transform="translate(105.439 -55.49)"></path><path d="M-62.496 108.43c-1.05 0-2.06.845-2.643 2.388a.178.178 0 0 0 .318.157l.002-.009.001-.004c.448-.967 1.28-1.422 1.753-1.422a.48.48 0 1 1-.086.955c-.02-.003-.071-.015-.098.042-.019.047-.059.278.147.515.121.136.37.25.606.25a1.436 1.436 0 1 0 0-2.873m-4.005 2.388c-.586-1.543-1.595-2.388-2.643-2.388a1.436 1.436 0 1 0 0 2.873c.236 0 .485-.114.605-.25.207-.237.166-.468.145-.513-.024-.06-.075-.047-.096-.044a.48.48 0 1 1-.086-.953c.471 0 1.306.453 1.752 1.422l.001.004q.003.003.004.007a.178.178 0 0 0 .318-.157m2.115-3.054c0-.828-1.083-3.412-1.41-3.412q-.037 0-.08.037c-.396.319-1.332 2.605-1.332 3.375 0 .617 1.247 2.244 1.247 3.13a.164.164 0 1 0 .33 0l-.003-.006c.005-.885 1.248-2.508 1.248-3.124m-.69 4.548a1.06 1.06 0 0 1-.482-.652.25.25 0 0 0-.24-.184.25.25 0 0 0-.239.184 1.06 1.06 0 0 1-.481.652c-.044.026-.047.046-.03.079.144.285.387.638.684.878.042.033.058.035.067.035s.024-.002.066-.035c.3-.24.54-.593.684-.878.018-.033.014-.053-.03-.079" style="fill:#ceab5d;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.74937963" transform="translate(105.439 -55.49)"></path><path d="m-70.247 123.71-1.21-.266.11-.49 1.209.273zm-14.933-9.732c-.278-1.037-1.329-2.053-2.123-2.053a.77.77 0 0 0-.473.152.7.7 0 0 0-.283.47c-.045.305.077.688.329 1.022l.362.485c.28.374.551.766.493 1.076a.43.43 0 0 1-.208.299.4.4 0 0 1-.218.06c-.492 0-1.323-.874-1.732-2.13l-.01-.023-.356.336-.007.007.002.007c.08.315.294.823.652 1.304.378.503.808.853 1.213.983q.196.063.38.063a.77.77 0 0 0 .454-.131.8.8 0 0 0 .345-.544c.06-.401-.153-.931-.632-1.571l-.32-.429c-.255-.341-.245-.563-.19-.69a.34.34 0 0 1 .265-.2q.027-.002.056-.002c.583 0 1.408.967 1.624 1.717l.005.018.017-.01.348-.199.01-.007zm32.919 4.38-.436.223-.073 2.409-1.993-1.356-.435.224 1.483 3.056.445-.198-1.03-2.172.008-.005 1.975 1.338.075-2.383.009-.005 1.156 2.113.424-.24zm5.755-4.566 3.271.226.006-.007-1.92-1.727.328-.364 2.526 2.273-.294.364-3.305-.226-.007.007 1.944 1.75-.343.35-2.533-2.282zm-1.347 1.331 2.32 2.497-.366.323-2.313-2.487zm-2.003 2.348.25 1.274.871-.62zm3.063 1.228-.427.34-1.051-.644-1.237.88.24 1.231-.436.278-.717-3.656.443-.313zm-11.843 2.862.289.958 1.448-.435c.352-.107.497-.348.4-.665-.11-.37-.419-.376-.688-.294zm1.309-.905c.52-.157 1.098-.042 1.298.621.213.707-.193 1.07-.46 1.176l1.062 1.144-.515.184-1.055-1.159-1.208.364.407 1.367-.467.133-.98-3.253zm-3.088.857.07.484-2.27.326.127.883 1.144-.164.07.484-1.144.165.147 1.027 2.355-.338.068.483-2.837.408-.483-3.365zm-5.293 2.054 1.557.025-.014.902c-.01.611-.687 1.008-1.54.994-.904-.016-1.84-.65-1.82-1.805.014-.97.8-1.753 1.889-1.736.81.013 1.23.445 1.424.639l-.345.343c-.164-.166-.421-.481-1.037-.492-.903-.015-1.433.565-1.443 1.276-.012.666.504 1.271 1.364 1.287.59.01 1.015-.257 1.018-.546l.007-.38-1.068-.017zm-7.467-2.537-.161.462-1.125-.392-.967 2.773-.462-.161.965-2.773-1.124-.392.16-.461zm-5.875-2.512.588 3.224.009.004 1.2-2.285.434.227-1.58 3.011-.429-.194-.593-3.263-.007-.004-1.22 2.32-.42-.245 1.586-3.023zm-1.491-.95-1.904 2.887-.409-.268 1.903-2.886zm-2.917-1.433-1.172.556.814.691zm-.439 3.305-.435-.327.369-1.215-1.156-.981-1.15.546-.39-.357 3.394-1.602.414.351z" style="fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.74937963" transform="translate(105.439 -55.49)" data-source="https://football-logos.cc"></path><!-- source: https://football-logos.cc --></svg>
                            <h3 class="font-bold mt-4">Man. City</h3>
                            <p class="text-xs text-gray-500 mt-1">Visitante</p>
                        </div>
                    </div>

                    <div class="border-t border-white/10 mt-8 pt-7">
                        <div class="flex justify-between text-sm mb-4">
                            <span class="text-gray-400">Probabilidad estimada</span>
                            <span class="text-[#00ff66] font-bold">Análisis IA</span>
                        </div>
                        <div class="grid grid-cols-3 gap-3 text-center">
                            <div class="rounded-xl bg-[#00ff66]/10 border border-[#00ff66]/20 p-4">
                                <p class="text-2xl font-black text-[#00ff66]">42%</p>
                                <p class="text-xs text-gray-400 mt-1">Local</p>
                            </div>
                            <div class="rounded-xl bg-white/5 border border-white/10 p-4">
                                <p class="text-2xl font-black">26%</p>
                                <p class="text-xs text-gray-400 mt-1">Empate</p>
                            </div>
                            <div class="rounded-xl bg-white/5 border border-white/10 p-4">
                                <p class="text-2xl font-black">32%</p>
                                <p class="text-xs text-gray-400 mt-1">Visitante</p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 flex items-center justify-between text-xs text-gray-500">
                        <span><i class="fa-solid fa-chart-simple text-[#00ff66] mr-2"></i>Análisis estadístico</span>
                        <span>Datos ilustrativos</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- PARTIDOS -->
    <section id="partidos" class="py-24 bg-[#0c131a] border-y border-white/5">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <span class="text-[#00ff66] text-xs font-black tracking-[0.25em]">CENTRO DE ANÁLISIS</span>
                    <h2 class="text-4xl md:text-5xl font-black mt-3">Equipos <span class="text-[#00ff66]">destacados</span></h2>
                    <p class="text-gray-500 mt-3">Consulta los enfrentamientos y sus indicadores estadísticos.</p>
                </div>
                <div class="relative">
                    <input type="text" placeholder="Buscar equipo..." class="w-full md:w-72 bg-[#111a22] border border-white/10 rounded-xl px-5 py-3 pl-11 text-sm outline-none focus:border-[#00ff66] transition" />
                    <i class="fa-solid fa-magnifying-glass absolute left-4 top-4 text-gray-500"></i>
                </div>
            </div>

            <div class="flex flex-wrap gap-3 mb-10">
                <button class="px-5 py-2.5 rounded-full bg-[#00ff66] text-black font-bold text-sm">Todos</button>
                <button class="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white text-sm">LaLiga</button>
                <button class="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white text-sm">Premier League</button>
                <button class="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white text-sm">Champions</button>
                <button class="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white text-sm">Serie A</button>
            </div>

            

                <!-- TARJETA 1 -->
                
<section class="py-16 px-6 bg-[#0b1117] text-white">

    <div class="max-w-7xl mx-auto">

        <!-- CABECERA -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">

            <div>
                <p class="text-[#00ff66] text-xs font-bold tracking-[3px] mb-2">
                    BASE DE DATOS
                </p>

                <h2 class="text-3xl md:text-4xl font-black">
                    EQUIPOS <span class="text-[#00ff66]">DESTACADOS</span>
                </h2>

                <p class="text-gray-500 text-sm mt-2">
                    Consulta el rendimiento y valoración de cada equipo.
                </p>
            </div>

            <span class="text-xs text-gray-500">
                {teams.length} EQUIPOS REGISTRADOS
            </span>

        </div>


        <!-- TARJETAS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {#each equiposVisibles as team}

                {@const partidos = team.totalencuentros || 0}
                {@const golesFavor = partidos ? (team.golesafavor / partidos).toFixed(2) : "0.00"}
                {@const golesContra = partidos ? (team.golesencontra / partidos).toFixed(2) : "0.00"}
                {@const victorias = partidos ? (team.encuentrosganados / partidos * 100) : 0}
                {@const empates = partidos ? (team.encuentrosempatados / partidos * 100) : 0}
                {@const derrotas = partidos ? (team.encuentrosperdidos / partidos * 100) : 0}
                {@const corners = partidos ? (team.cornerscreados / partidos).toFixed(2) : "0.00"}

                <div class="group rounded-2xl bg-[#111a22] border border-white/10 p-6 hover:border-[#00ff66]/50 hover:-translate-y-1 transition duration-300">

                    <!-- CABECERA TARJETA -->
                    <div class="flex justify-between items-center mb-7">

                        <div class="flex items-center gap-2">

                            {#if banderas[team.pais]}
                                <span
                                    class={`fi fi-${banderas[team.pais]}`}
                                    title={team.pais}
                                ></span>
                            {/if}
                        
                            <span class="text-xs text-gray-500 font-bold tracking-wider">
                                {team.pais?.toUpperCase() || "EQUIPO"}
                            </span>
                        
                        </div>

                        <span class="text-[10px] text-[#00ff66] bg-[#00ff66]/10 px-3 py-1 rounded-full">
                            {team.puntuacion}/5 ESTRELLAS
                        </span>

                    </div>


                    <!-- INFORMACIÓN EQUIPO -->
                    <div class="flex items-center gap-5">

                        <!-- ESCUDO -->
                        <div class="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center shrink-0">

                            {#if team.escudo}
                                <img
                                    src={team.escudo}
                                    alt={team.nombre}
                                    class="w-16 h-16 object-contain"
                                />
                            {:else}
                                <span class="text-4xl">⚽</span>
                            {/if}

                        </div>

                        <!-- NOMBRE -->
                        <div class="flex-1 min-w-0">

                            <h3 class="font-black text-xl group-hover:text-[#00ff66] transition truncate">
                                {team.nombre}
                            </h3>

                            <p class="text-xs text-gray-500 mt-1">
                                {partidos} encuentros disputados
                            </p>

                            <div class="flex gap-1 mt-2 text-sm">
                                {#each Array(5) as _, i}
                                    <span class={i < team.puntuacion ? "text-[#00ff66]" : "text-gray-700"}>
                                        ★
                                    </span>
                                {/each}
                            </div>

                        </div>

                    </div>


                    <!-- INDICADORES OFENSIVOS Y DEFENSIVOS -->
                    <div class="border-t border-white/10 mt-7 pt-5">

                        <p class="text-xs text-gray-500 font-bold mb-4 tracking-wider">
                            RENDIMIENTO ESTADÍSTICO
                        </p>

                        <div class="grid grid-cols-2 gap-3">

                            <!-- GOLES A FAVOR -->
                            <div class="bg-white/5 rounded-lg p-3">
                                <p class="text-[10px] text-gray-500 mb-1">
                                    GOLES A FAVOR
                                </p>
                                <p class="text-2xl font-black text-[#00ff66]">
                                    {golesFavor}
                                </p>
                                <p class="text-[10px] text-gray-600">
                                    Por encuentro
                                </p>
                            </div>

                            <!-- GOLES EN CONTRA -->
                            <div class="bg-white/5 rounded-lg p-3">
                                <p class="text-[10px] text-gray-500 mb-1">
                                    GOLES EN CONTRA
                                </p>
                                <p class="text-2xl font-black">
                                    {golesContra}
                                </p>
                                <p class="text-[10px] text-gray-600">
                                    Por encuentro
                                </p>
                            </div>

                            <!-- PORCENTAJE VICTORIAS -->
                            <div class="bg-white/5 rounded-lg p-3">
                                <p class="text-[10px] text-gray-500 mb-1">
                                    VICTORIAS
                                </p>
                                <p class="text-2xl font-black text-[#00ff66]">
                                    {victorias.toFixed(1)}%
                                </p>
                                <p class="text-[10px] text-gray-600">
                                    {team.encuentrosganados} ganados
                                </p>
                            </div>

                            <!-- CORNERS -->
                            <div class="bg-white/5 rounded-lg p-3">
                                <p class="text-[10px] text-gray-500 mb-1">
                                    CÓRNERS
                                </p>
                                <p class="text-2xl font-black">
                                    {corners}
                                </p>
                                <p class="text-[10px] text-gray-600">
                                    Por encuentro
                                </p>
                            </div>

                        </div>

                    </div>


                    <!-- RESULTADOS -->
                    <div class="border-t border-white/10 mt-6 pt-5">

                        <div class="flex justify-between items-center mb-3">

                            <p class="text-xs text-gray-500 font-bold">
                                RESULTADOS
                            </p>

                            <span class="text-xs text-gray-500">
                                {partidos} PJ
                            </span>

                        </div>

                        <!-- BARRA DE RESULTADOS -->
                        <div class="flex w-full h-2 rounded-full overflow-hidden bg-white/5">

                            <div
                                class="bg-[#00ff66]"
                                style={`width: ${victorias}%`}
                            ></div>

                            <div
                                class="bg-yellow-500"
                                style={`width: ${empates}%`}
                            ></div>

                            <div
                                class="bg-red-500"
                                style={`width: ${derrotas}%`}
                            ></div>

                        </div>

                        <div class="flex justify-between mt-3 text-[10px] font-bold">

                            <span class="text-[#00ff66]">
                                G {team.encuentrosganados}
                            </span>

                            <span class="text-yellow-500">
                                E {team.encuentrosempatados}
                            </span>

                            <span class="text-red-500">
                                P {team.encuentrosperdidos}
                            </span>

                        </div>

                    </div>


                    <!-- PIE TARJETA -->
                    <div class="mt-6 flex justify-between items-center text-xs ">

                        <button class="ml-32 p-3 text-gray-700 rounded-xl bg-[#00ff66] font-bold group-hover:translate-x-1 transition">Analizis PRO</button>  
                    </div>

                </div>

            {/each}

        </div>


        <!-- BOTÓN VER TODOS -->
        {#if teams.length > 6}

            <div class="flex justify-center mt-10">

                <button
                    onclick={() => mostrarTodos = !mostrarTodos}
                    class="px-8 py-3 rounded-xl border border-[#00ff66]/40 text-[#00ff66] font-bold text-sm hover:bg-[#00ff66] hover:text-black transition duration-300"
                >
                    {mostrarTodos ? "Ver menos equipos ↑" : "Ver todos los equipos ↓"}
                </button>

            </div>

        {/if}

    </div>

</section>


                
                
            
        </div>
    </section>

    <!-- CARACTERÍSTICAS -->
    <section id="funciones" class="py-24">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-2xl mx-auto mb-16">
                <span class="text-[#00ff66] text-xs font-black tracking-[0.25em]">TECNOLOGÍA Y ANÁLISIS</span>
                <h2 class="text-4xl md:text-5xl font-black mt-4">Una nueva forma de <span class="text-[#00ff66]">entender el fútbol</span></h2>
                <p class="text-gray-400 mt-5">Herramientas estadísticas para estudiar cada encuentro desde diferentes perspectivas.</p>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="rounded-2xl border border-white/10 bg-[#111a22] p-7 hover:border-[#00ff66]/40 transition">
                    <div class="w-14 h-14 rounded-2xl bg-[#00ff66]/10 text-[#00ff66] flex items-center justify-center text-2xl mb-7"><i class="fa-solid fa-brain"></i></div>
                    <h3 class="text-lg font-extrabold">Análisis inteligente</h3>
                    <p class="text-gray-500 text-sm leading-relaxed mt-3">Interpretación de datos y patrones de rendimiento de los equipos.</p>
                </div>

                <div class="rounded-2xl border border-white/10 bg-[#111a22] p-7 hover:border-cyan-400/40 transition">
                    <div class="w-14 h-14 rounded-2xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center text-2xl mb-7"><i class="fa-solid fa-chart-pie"></i></div>
                    <h3 class="text-lg font-extrabold">Probabilidades</h3>
                    <p class="text-gray-500 text-sm leading-relaxed mt-3">Indicadores porcentuales para diferentes escenarios del partido.</p>
                </div>

                <div class="rounded-2xl border border-white/10 bg-[#111a22] p-7 hover:border-purple-400/40 transition">
                    <div class="w-14 h-14 rounded-2xl bg-purple-400/10 text-purple-400 flex items-center justify-center text-2xl mb-7"><i class="fa-solid fa-futbol"></i></div>
                    <h3 class="text-lg font-extrabold">Estilos de juego</h3>
                    <p class="text-gray-500 text-sm leading-relaxed mt-3">Comparación de comportamientos ofensivos y defensivos.</p>
                </div>

                <div class="rounded-2xl border border-white/10 bg-[#111a22] p-7 hover:border-orange-400/40 transition">
                    <div class="w-14 h-14 rounded-2xl bg-orange-400/10 text-orange-400 flex items-center justify-center text-2xl mb-7"><i class="fa-solid fa-clock-rotate-left"></i></div>
                    <h3 class="text-lg font-extrabold">Historial deportivo</h3>
                    <p class="text-gray-500 text-sm leading-relaxed mt-3">Consulta el rendimiento histórico y la evolución estadística.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ESTADÍSTICAS -->
    <section class="py-20 bg-[#0c131a] border-y border-white/5">
        <div class="max-w-7xl mx-auto px-6">
            <div class="rounded-3xl relative overflow-hidden bg-gradient-to-r from-[#10251b] via-[#10251b] to-[#10202b] border border-[#00ff66]/20 p-10 md:p-16">
                <div class="absolute right-0 top-0 w-96 h-96 bg-[#00ff66]/10 blur-[100px] rounded-full"></div>
                <div class="relative grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span class="text-[#00ff66] text-xs font-black tracking-[0.25em]">DATOS QUE MARCAN LA DIFERENCIA</span>
                        <h2 class="text-4xl md:text-5xl font-black mt-5">El fútbol también se <span class="text-[#00ff66]">analiza.</span></h2>
                        <p class="text-gray-400 mt-5 leading-relaxed">No te quedes únicamente con los resultados. Observa las estadísticas, los estilos y los comportamientos que hay detrás de cada encuentro.</p>
                        <a href="#partidos" class="inline-block mt-8 bg-[#00ff66] text-black font-extrabold px-7 py-4 rounded-xl hover:shadow-[0_0_30px_#00ff6655] transition">Descubrir análisis <i class="fa-solid fa-arrow-right ml-2"></i></a>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-black/20 border border-white/10 rounded-2xl p-6"><i class="fa-solid fa-chart-column text-[#00ff66] text-2xl"></i><p class="text-3xl font-black mt-5">100K+</p><p class="text-gray-500 text-sm mt-2">Variables estadísticas</p></div>
                        <div class="bg-black/20 border border-white/10 rounded-2xl p-6"><i class="fa-solid fa-earth-europe text-cyan-400 text-2xl"></i><p class="text-3xl font-black mt-5">45+</p><p class="text-gray-500 text-sm mt-2">Ligas y competiciones</p></div>
                        <div class="bg-black/20 border border-white/10 rounded-2xl p-6"><i class="fa-solid fa-futbol text-purple-400 text-2xl"></i><p class="text-3xl font-black mt-5">360°</p><p class="text-gray-500 text-sm mt-2">Visión del encuentro</p></div>
                        <div class="bg-black/20 border border-white/10 rounded-2xl p-6"><i class="fa-solid fa-bolt text-orange-400 text-2xl"></i><p class="text-3xl font-black mt-5">24/7</p><p class="text-gray-500 text-sm mt-2">Acceso a la plataforma</p></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- PRECIOS -->
    <section id="precios" class="py-24">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <span class="text-[#00ff66] text-xs font-black tracking-[0.25em]">MEMBRESÍAS</span>
                <h2 class="text-4xl md:text-5xl font-black mt-4">Elige tu <span class="text-[#00ff66]">nivel de análisis</span></h2>
                <p class="text-gray-500 mt-4">Accede a las herramientas que mejor se adapten a ti.</p>
            </div>

            <div class="grid lg:grid-cols-3 gap-7 items-stretch">
                <!-- FREE -->
                <div class="rounded-3xl border border-white/10 bg-[#111a22] p-8">
                    <h3 class="text-xl font-black">Free</h3>
                    <p class="text-gray-500 text-sm mt-2">Para comenzar a explorar.</p>
                    <div class="my-8"><span class="text-5xl font-black">0€</span><span class="text-gray-500"> / siempre</span></div>
                    <a href="#" class="block text-center border border-white/20 rounded-xl py-4 font-bold hover:bg-white/5 transition">Empezar gratis</a>
                    <div class="border-t border-white/10 mt-8 pt-7 space-y-5 text-sm text-gray-400">
                        <p><i class="fa-solid fa-check text-[#00ff66] mr-3"></i>Análisis básicos</p>
                        <p><i class="fa-solid fa-check text-[#00ff66] mr-3"></i>Partidos destacados</p>
                        <p><i class="fa-solid fa-check text-[#00ff66] mr-3"></i>Estadísticas generales</p>
                        <p><i class="fa-solid fa-check text-[#00ff66] mr-3"></i>Acceso limitado</p>
                    </div>
                </div>

                <!-- PRO -->
                <div class="relative rounded-3xl border-2 border-[#00ff66] bg-[#102019] p-8 shadow-[0_0_45px_#00ff6615] lg:scale-105">
                    <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00ff66] text-black rounded-full px-5 py-2 text-xs font-black tracking-wider">MÁS POPULAR</div>
                    <h3 class="text-xl font-black">PRO VIP</h3>
                    <p class="text-gray-400 text-sm mt-2">Para los amantes del análisis.</p>
                    <div class="my-8"><span class="text-5xl font-black">9,99€</span><span class="text-gray-500"> / mes</span></div>
                    <a href="#" class="block text-center bg-[#00ff66] text-black rounded-xl py-4 font-black hover:shadow-[0_0_25px_#00ff6666] transition">Elegir PRO VIP</a>
                    <div class="border-t border-white/10 mt-8 pt-7 space-y-5 text-sm text-gray-300">
                        <p><i class="fa-solid fa-check text-[#00ff66] mr-3"></i>Análisis avanzados</p>
                        <p><i class="fa-solid fa-check text-[#00ff66] mr-3"></i>Probabilidades detalladas</p>
                        <p><i class="fa-solid fa-check text-[#00ff66] mr-3"></i>Estilos ofensivos y defensivos</p>
                        <p><i class="fa-solid fa-check text-[#00ff66] mr-3"></i>Estadísticas completas</p>
                        <p><i class="fa-solid fa-check text-[#00ff66] mr-3"></i>Historial de partidos</p>
                    </div>
                </div>

                <!-- ELITE -->
                <div class="rounded-3xl border border-white/10 bg-[#111a22] p-8">
                    <h3 class="text-xl font-black">Elite Anual</h3>
                    <p class="text-gray-500 text-sm mt-2">La experiencia completa.</p>
                    <div class="my-8"><span class="text-5xl font-black">99€</span><span class="text-gray-500"> / año</span></div>
                    <a href="#" class="block text-center border border-white/20 rounded-xl py-4 font-bold hover:bg-white/5 transition">Elegir Elite</a>
                    <div class="border-t border-white/10 mt-8 pt-7 space-y-5 text-sm text-gray-400">
                        <p><i class="fa-solid fa-check text-[#00ff66] mr-3"></i>Todas las funciones PRO</p>
                        <p><i class="fa-solid fa-check text-[#00ff66] mr-3"></i>Análisis completos</p>
                        <p><i class="fa-solid fa-check text-[#00ff66] mr-3"></i>Comparativas avanzadas</p>
                        <p><i class="fa-solid fa-check text-[#00ff66] mr-3"></i>Acceso anual</p>
                        <p><i class="fa-solid fa-check text-[#00ff66] mr-3"></i>Contenido exclusivo</p>
                    </div>
                </div>
            </div>
            <p class="text-center text-gray-600 text-xs mt-10">Las funciones y precios mostrados son ilustrativos y pueden modificarse.</p>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-[#05090d] border-t border-white/10 pt-16 pb-8">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 pb-14">
                <div class="lg:col-span-2">
                    <a href="/" class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-[#00ff66] flex items-center justify-center text-black text-xl"><i class="fa-solid fa-chart-line"></i></div>
                        <span class="text-2xl font-black">Predict<span class="text-[#00ff66]">Pro</span></span>
                    </a>
                    <p class="text-gray-500 text-sm leading-relaxed max-w-sm mt-6">Tecnología, datos y análisis deportivo para entender el fútbol desde una perspectiva diferente.</p>
                    <div class="flex gap-4 mt-7 text-gray-500">
                        <a href="#" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:text-[#00ff66] transition"><i class="fa-brands fa-x-twitter"></i></a>
                        <a href="#" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:text-[#00ff66] transition"><i class="fa-brands fa-instagram"></i></a>
                        <a href="#" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:text-[#00ff66] transition"><i class="fa-brands fa-telegram"></i></a>
                    </div>
                </div>

                <div>
                    <h4 class="font-extrabold mb-6">Plataforma</h4>
                    <div class="space-y-4 text-sm text-gray-500">
                        <a href="#inicio" class="block hover:text-[#00ff66]">Inicio</a>
                        <a href="#partidos" class="block hover:text-[#00ff66]">Partidos</a>
                        <a href="#funciones" class="block hover:text-[#00ff66]">Características</a>
                        <a href="#precios" class="block hover:text-[#00ff66]">Planes</a>
                    </div>
                </div>

                <div>
                    <h4 class="font-extrabold mb-6">Información</h4>
                    <div class="space-y-4 text-sm text-gray-500">
                        <a href="#" class="block hover:text-[#00ff66]">Sobre nosotros</a>
                        <a href="#" class="block hover:text-[#00ff66]">Contacto</a>
                        <a href="#" class="block hover:text-[#00ff66]">Privacidad</a>
                        <a href="#" class="block hover:text-[#00ff66]">Términos y condiciones</a>
                    </div>
                </div>
            </div>

            <div class="border-t border-white/10 pt-7 flex flex-col md:flex-row justify-between gap-4 text-xs text-gray-600">
                <p>© 2026 PredictPro. Todos los derechos reservados.</p>
                <p>El análisis estadístico no garantiza resultados deportivos.</p>
            </div>
        </div>
    </footer>
</div>

<style>
    :global(html) {
        scroll-behavior: smooth;
    }

    :global(body) {
        margin: 0;
        background: #080d12;
        font-family: 'Inter', sans-serif;
    }

    :global(*) {
        box-sizing: border-box;
    }

    ::selection {
        background: #00ff66;
        color: #080d12;
    }
</style>
