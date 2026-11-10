
import apiTeams from "../../conexiones/teamAxios.js";

export async function load() {
    try {
        const response = await apiTeams.get("/");

        return {
            equipos: response.data.equipos,
            error: null
        };

    } catch (error) {
        console.error("Error al obtener equipos:", error);

        return {
            equipos: [],
            error: "No se pudieron cargar los equipos"
        };
    }
}
