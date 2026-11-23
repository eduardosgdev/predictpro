// @ts-nocheck
import matchTeam from "../../../conexiones/matchAxios.js";
import playerTeam from "../../../conexiones/playerAxios.js";
import playerstatsAxios from "../../../conexiones/playerStatsAxios.js";

export async function load({params}) {
    try {
        const response = await matchTeam.get(`/teammatch/${params.id}`)
        const responsePlayer = await playerTeam.get(`/${params.id}`);

        const players = responsePlayer.data.players;

        const estadisticas = await Promise.all(
            response.data.map(async (partido) => {
                const responseStats = await playerstatsAxios.get(`/match/${partido._id}`);

                return {
                    matchId: partido._id,
                    estadisticas: responseStats.data.estadisticas
                };
            })
        );
        return {
            partidos: response.data,
            jugadores: players,
            estadisticas,
            equipoId: params.id
        }
    } catch (error) {
        console.error('Error al obtener el equipo:', error);

        return {
            partidos: [],
            jugadores: [],
            estadisticas: [],
            equipoId: params.id
        }
    }
}