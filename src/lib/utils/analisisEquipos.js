// @ts-nocheck

// ==========================================
// 1. NORMALIZAR HISTORIAL
// ==========================================

export function normalizarHistorial(historial, equipoId) {

    return historial.map(partido => {

        const idTeam1 = String(
            partido.team1?._id ?? partido.team1
        );

        const idTeam2 = String(
            partido.team2?._id ?? partido.team2
        );

        const idObjetivo = String(equipoId);

        const esTeam1 = idTeam1 === idObjetivo;
        const esTeam2 = idTeam2 === idObjetivo;

        if (!esTeam1 && !esTeam2) return null;

        const rival = esTeam1
            ? partido.team2
            : partido.team1;

            const golesFavor = Number(
                (esTeam1 ? partido.golesteam1 : partido.golesteam2) ?? 0
            );

            const golesContra = Number(
                (esTeam1 ? partido.golesteam2 : partido.golesteam1) ?? 0
            );

            const cornersFavor = Number(
                (esTeam1 ? partido.cornersteam1 : partido.cornersteam2) ?? 0
            );

            const cornersContra = Number(
                (esTeam1 ? partido.cornersteam2 : partido.cornersteam1) ?? 0
            );

        return {
            partidoId: partido._id,

            rivalId: esTeam1 ? idTeam2 : idTeam1,
            nombreRival: rival?.nombre ?? "Desconocido",

            puntuacionRival: Number(rival?.puntuacion ?? 0),

            golesFavor,
            golesContra,

            cornersFavor,
            cornersContra,

            resultado:
                golesFavor > golesContra
                    ? "victoria"
                    : golesFavor < golesContra
                        ? "derrota"
                        : "empate",

            // Estilos del equipo analizado
            estiloOfensivoPropio: esTeam1
                ? partido.estiloofteam1
                : partido.estiloofteam2,

            estiloDefensivoPropio: esTeam1
                ? partido.estilodefteam1
                : partido.estilodefteam2,

            // Estilos del rival
            estiloOfensivoRival: esTeam1
                ? partido.estiloofteam2
                : partido.estiloofteam1,

            estiloDefensivoRival: esTeam1
                ? partido.estilodefteam2
                : partido.estilodefteam1
        };
    }).filter(Boolean);
}


// ==========================================
// 2. CALCULAR ESTADÍSTICAS DE UN GRUPO
// ==========================================

function calcularEstadisticas(partidos) {

    const total = partidos.length;

    const victorias = partidos.filter(
        p => p.resultado === "victoria"
    ).length;

    const empates = partidos.filter(
        p => p.resultado === "empate"
    ).length;

    const derrotas = partidos.filter(
        p => p.resultado === "derrota"
    ).length;

    const golesFavor = partidos.reduce(
        (suma, p) => suma + p.golesFavor, 0
    );

    const golesContra = partidos.reduce(
        (suma, p) => suma + p.golesContra, 0
    );

    const cornersFavor = partidos.reduce(
        (suma, p) => suma + p.cornersFavor, 0
    );

    const cornersContra = partidos.reduce(
        (suma, p) => suma + p.cornersContra, 0
    );

    return {
        total,

        resultados: {
            victorias,
            empates,
            derrotas
        },

        porcentajeVictorias: total
            ? victorias / total * 100
            : 0,

        goles: {
            totalFavor: golesFavor,
            totalContra: golesContra,

            promedioFavor: total
                ? golesFavor / total
                : 0,

            promedioContra: total
                ? golesContra / total
                : 0
        },

        corners: {
            totalFavor: cornersFavor,
            totalContra: cornersContra,

            promedioFavor: total
                ? cornersFavor / total
                : 0,

            promedioContra: total
                ? cornersContra / total
                : 0
        }
    };
}


// ==========================================
// 3. ANALIZAR COMPORTAMIENTO POR ESTILOS
// ==========================================

export function analizarComportamientoPorEstilo(
    historial,
    soloCincoEstrellas = false
) {

    const estilosDefensivos = [
        "presion_alta",
        "bloque_medio",
        "bloque_bajo"
    ];

    const estilosOfensivos = [
        "juego_interior",
        "juego_directo",
        "juego_exterior",
        "contraataque"
    ];

    // Filtro opcional de calidad del rival
    const partidosFiltrados = historial.filter(partido => {

        if (!soloCincoEstrellas) return true;

        return partido.puntuacionRival === 5;
    });

    // ==========================================
    // AGRUPAR POR ESTILO DEFENSIVO DEL RIVAL
    // ==========================================

    const porEstiloDefensivoRival =
        estilosDefensivos.map(estilo => {

            const partidos = partidosFiltrados.filter(
                p => p.estiloDefensivoRival === estilo
            );

            return {
                estilo,
                ...calcularEstadisticas(partidos)
            };
        });

    // ==========================================
    // AGRUPAR POR ESTILO OFENSIVO DEL RIVAL
    // ==========================================

    const porEstiloOfensivoRival =
        estilosOfensivos.map(estilo => {

            const partidos = partidosFiltrados.filter(
                p => p.estiloOfensivoRival === estilo
            );

            return {
                estilo,
                ...calcularEstadisticas(partidos)
            };
        });

    // ==========================================
    // AGRUPAR POR COMBINACIÓN DE ESTILOS
    // ==========================================

    const porCombinacionRival = [];

    estilosOfensivos.forEach(estiloOfensivo => {

        estilosDefensivos.forEach(estiloDefensivo => {

            const partidos = partidosFiltrados.filter(
                p =>
                    p.estiloOfensivoRival === estiloOfensivo &&
                    p.estiloDefensivoRival === estiloDefensivo
            );

            porCombinacionRival.push({
                estiloOfensivo,
                estiloDefensivo,
                ...calcularEstadisticas(partidos)
            });
        });
    });

    return {
        totalPartidos: partidosFiltrados.length,

        filtroCincoEstrellas: soloCincoEstrellas,

        porEstiloDefensivoRival,

        porEstiloOfensivoRival,

        porCombinacionRival
    };
}


// ==========================================
// 4. ANÁLISIS EXCLUSIVO CONTRA CINCO ESTRELLAS
// ==========================================

export function analizarContraCincoEstrellas(historial) {

    const partidos = historial.filter(
        partido => partido.puntuacionRival === 5
    );

    return calcularEstadisticas(partidos);
}


// ==========================================
// 5. PRONÓSTICO DE UN ENFRENTAMIENTO ESPECÍFICO
// ==========================================

// Distribución de Poisson
function calcularPoisson(lambda) {
    const probabilidades = [];

    let probabilidad = Math.exp(-lambda);
    probabilidades.push(probabilidad);

    for (let i = 1; i <= 30; i++) {
        probabilidad = probabilidad * lambda / i;
        probabilidades.push(probabilidad);
    }

    // Normalizamos para que la suma sea 1
    const suma = probabilidades.reduce((a, b) => a + b, 0);

    return probabilidades.map(p => p / suma);
}


// Calcula las probabilidades de victoria, empate y derrota
function calcularProbabilidadesResultado(golesLocal, golesVisitante) {

    const poissonLocal = calcularPoisson(golesLocal);
    const poissonVisitante = calcularPoisson(golesVisitante);

    let victoriaLocal = 0;
    let empate = 0;
    let victoriaVisitante = 0;
    let masDe25Goles = 0;
    let ambosMarcan = 0;

    poissonLocal.forEach((probLocal, golesL) => {

        poissonVisitante.forEach((probVisitante, golesV) => {

            const probabilidad = probLocal * probVisitante;

            if (golesL > golesV) {
                victoriaLocal += probabilidad;
            } else if (golesL === golesV) {
                empate += probabilidad;
            } else {
                victoriaVisitante += probabilidad;
            }

            if (golesL + golesV >= 3) {
                masDe25Goles += probabilidad;
            }

            if (golesL > 0 && golesV > 0) {
                ambosMarcan += probabilidad;
            }
        });
    });

    return {
        victoriaLocal: victoriaLocal * 100,
        empate: empate * 100,
        victoriaVisitante: victoriaVisitante * 100,
        masDe25Goles: masDe25Goles * 100,
        ambosMarcan: ambosMarcan * 100
    };
}


// Probabilidad de superar una línea de córners
function probabilidadMasDeCorners(lambda, linea) {

    const poisson = calcularPoisson(lambda);

    const minimo = Math.floor(linea) + 1;

    const probabilidad = poisson
        .slice(minimo)
        .reduce((suma, valor) => suma + valor, 0);

    return probabilidad * 100;
}


// ==========================================
// FUNCIÓN PRINCIPAL
// ==========================================

export function analizarEnfrentamiento(
    historialLocal,
    historialVisitante,
    estilosLocal,
    estilosVisitante
) {

    // 1. Historial del local contra equipos
    // que tienen el perfil del visitante

    const partidosLocal = historialLocal.filter(partido =>
        partido.estiloOfensivoRival === estilosVisitante.ofensivo &&
        partido.estiloDefensivoRival === estilosVisitante.defensivo
    );


    // 2. Historial del visitante contra equipos
    // que tienen el perfil del local

    const partidosVisitante = historialVisitante.filter(partido =>
        partido.estiloOfensivoRival === estilosLocal.ofensivo &&
        partido.estiloDefensivoRival === estilosLocal.defensivo
    );


    // 3. Estadísticas de ambos grupos

    const estadisticasLocal = calcularEstadisticas(partidosLocal);
    const estadisticasVisitante = calcularEstadisticas(partidosVisitante);


    // Si no hay partidos de alguno de los dos perfiles,
    // no inventamos una predicción.

    if (!partidosLocal.length || !partidosVisitante.length) {
        return {
            disponible: false,
            mensaje: "No hay suficientes enfrentamientos históricos con estos perfiles tácticos.",
            muestra: {
                local: partidosLocal.length,
                visitante: partidosVisitante.length
            },
            estadisticasLocal,
            estadisticasVisitante
        };
    }


    // 4. Goles esperados
    // Ataque local + goles concedidos por el visitante

    const golesEsperadosLocal = (
        estadisticasLocal.goles.promedioFavor +
        estadisticasVisitante.goles.promedioContra
    ) / 2;


    // Ataque visitante + goles concedidos por el local

    const golesEsperadosVisitante = (
        estadisticasVisitante.goles.promedioFavor +
        estadisticasLocal.goles.promedioContra
    ) / 2;


    // 5. Córners esperados

    const cornersEsperadosLocal = (
        estadisticasLocal.corners.promedioFavor +
        estadisticasVisitante.corners.promedioContra
    ) / 2;


    const cornersEsperadosVisitante = (
        estadisticasVisitante.corners.promedioFavor +
        estadisticasLocal.corners.promedioContra
    ) / 2;


    const golesTotalesEsperados =
        golesEsperadosLocal + golesEsperadosVisitante;

    const cornersTotalesEsperados =
        cornersEsperadosLocal + cornersEsperadosVisitante;


    // 6. Probabilidades del resultado

    const probabilidades = calcularProbabilidadesResultado(
        golesEsperadosLocal,
        golesEsperadosVisitante
    );


    // 7. Probabilidades de córners totales

    const mercadosCorners = {
        masDe75: probabilidadMasDeCorners(cornersTotalesEsperados, 7.5),
        masDe85: probabilidadMasDeCorners(cornersTotalesEsperados, 8.5),
        masDe95: probabilidadMasDeCorners(cornersTotalesEsperados, 9.5),
        masDe105: probabilidadMasDeCorners(cornersTotalesEsperados, 10.5)
    };


    // 8. Resultado final

    return {
        disponible: true,

        muestra: {
            local: partidosLocal.length,
            visitante: partidosVisitante.length
        },

        estadisticasLocal,
        estadisticasVisitante,

        goles: {
            local: golesEsperadosLocal,
            visitante: golesEsperadosVisitante,
            total: golesTotalesEsperados
        },

        corners: {
            local: cornersEsperadosLocal,
            visitante: cornersEsperadosVisitante,
            total: cornersTotalesEsperados
        },

        probabilidades,

        mercados: {
            masDe25Goles: probabilidades.masDe25Goles,
            ambosMarcan: probabilidades.ambosMarcan,
            corners: mercadosCorners
        }
    };
}


// ==========================================
// ANÁLISIS INDIVIDUAL CONTRA ESTILO DEFENSIVO
// ==========================================
function probabilidadPoisson(lambda, minimo) {

    lambda = Number(lambda ?? 0);

    if (lambda <= 0) return 0;

    let acumulado = 0;
    let factorial = 1;

    for (let i = 0; i < minimo; i++) {

        if (i > 0) factorial *= i;

        acumulado += (
            Math.pow(lambda, i) *
            Math.exp(-lambda)
        ) / factorial;
    }

    return Number((1 - acumulado).toFixed(4));
}

export function analizarJugadorContraEstiloDefensivo(
    jugadorId,
    estadisticasJugadores,
    estiloDefensivoRival
) {
    const idJugador = String(jugadorId);

    // 1. Filtrar los registros del jugador
    const estadisticasJugador = estadisticasJugadores.filter(registro => {
        const id = registro.player?._id ?? registro.player;
        return String(id) === idJugador;
    });

    if (estadisticasJugador.length === 0) {
        return {
            disponible: false,
            mensaje: "No existen estadísticas para este jugador"
        };
    }

    // 2. Identificar el equipo del jugador
    const jugador = estadisticasJugador[0].player;
    const equipoId = jugador?.equipo?._id ?? jugador?.equipo;

    if (!equipoId) {
        return {
            disponible: false,
            mensaje: "No se pudo identificar el equipo del jugador"
        };
    }

    // 3. Filtrar partidos contra el estilo defensivo indicado
    const partidosFiltrados = estadisticasJugador.filter(registro => {
        const partido = registro.match;

        if (!partido || typeof partido !== "object") return false;

        const idLocal = partido.team1?._id ?? partido.team1;
        const idVisitante = partido.team2?._id ?? partido.team2;

        const equipoJugador = String(equipoId);

        // El jugador pertenecía al equipo local
        if (String(idLocal) === equipoJugador) {
            return partido.estilodefteam2 === estiloDefensivoRival;
        }

        // El jugador pertenecía al equipo visitante
        if (String(idVisitante) === equipoJugador) {
            return partido.estilodefteam1 === estiloDefensivoRival;
        }

        return false;
    });

    // 4. Comprobar historial
    if (partidosFiltrados.length === 0) {
        return {
            disponible: false,
            mensaje: "El jugador no tiene partidos registrados contra este estilo defensivo",
            estiloDefensivoAnalizado: estiloDefensivoRival,
            partidosAnalizados: 0
        };
    }

    // 5. Calcular totales
    const total = partidosFiltrados.reduce((acumulado, registro) => {
        acumulado.goles += Number(registro.goles ?? 0);
        acumulado.asistencias += Number(registro.asistencias ?? 0);
        acumulado.tirospuerta += Number(registro.tirospuerta ?? 0);
        acumulado.faltascometidaspartido += Number(registro.faltascometidaspartido ?? 0);
        acumulado.faltasrecibidaspartido += Number(registro.faltasrecibidaspartido ?? 0);

        return acumulado;
    }, {
        goles: 0,
        asistencias: 0,
        tirospuerta: 0,
        faltascometidaspartido: 0,
        faltasrecibidaspartido: 0
    });

    // 6. Calcular número de partidos
    const partidosAnalizados = partidosFiltrados.length;

    // 7. Calcular promedios
    const promedio = {};

    Object.keys(total).forEach(campo => {
        promedio[campo] = Number(
            (total[campo] / partidosAnalizados).toFixed(2)
        );
    });

    // 8. Calcular probabilidades Poisson
    const probabilidades = {};

    Object.keys(promedio).forEach(campo => {
        probabilidades[campo] = {
            alMenos1: probabilidadPoisson(promedio[campo], 1),
            alMenos2: probabilidadPoisson(promedio[campo], 2),
            alMenos3: probabilidadPoisson(promedio[campo], 3)
        };
    });

    // 9. Devolver análisis
    return {
        disponible: true,
        jugadorId: idJugador,
        equipoId: String(equipoId),
        estiloDefensivoAnalizado: estiloDefensivoRival,
        partidosAnalizados,
        totales: total,
        prediccion: promedio,
        probabilidades
    };
}


