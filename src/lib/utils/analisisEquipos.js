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

