
<script>
// @ts-nocheck

    import playerTeam from "../../conexiones/playerAxios.js";

    let { data } = $props();

    console.log("EQUIPOS RECIBIDOS:", data.equipos);

    let jugadoresLocal = [];
    let jugadoresVisitante = [];

    async function obtenerJugadores(idEquipo) {
        try {
            console.log("ID DEL EQUIPO SELECCIONADO:", idEquipo);

            const response = await playerTeam.get(`/${idEquipo}`);

            console.log("RESPUESTA COMPLETA AXIOS:", response);
            console.log("JUGADORES RECIBIDOS:", response.data.players);

            return response.data.players;
            console
        } catch (error) {
            console.error("ERROR OBTENIENDO JUGADORES:", error);
            return [];
        }
    }
    
</script>
<h1>Hola</h1>