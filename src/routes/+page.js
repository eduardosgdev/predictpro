import apiTeams from "../conexiones/teamAxios.js";

export async function load(){
    try {
        const response = await apiTeams.get(`/`)
        return {
            teams:response.data.equipos
        }
    } catch (error) {
        console.error("Error al obtener detalles:", error);
        return {
            juego: null,
            error: "No se pudo cargar los equipos."
          };
    }
}