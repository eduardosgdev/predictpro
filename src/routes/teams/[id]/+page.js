// @ts-nocheck
import matchTeam from "../../../conexiones/matchAxios.js";
import playerTeam from "../../../conexiones/playerAxios.js";

export async function load({params}) {
    try {
        const response = await matchTeam.get(`/teammatch/${params.id}`)
        const responsePlayer = await playerTeam.get(`/${params.id}`);

        const players = responsePlayer.data.players;
        return {
            partidos:response.data,
            jugadores: players,
            equipoId: params.id
        }
    } catch (error) {
        console.error('Error al obtener el equipo:', error);

        return {
            partidos: [],
            jugadores: [],
            equipoId: params.id
    }
}
}