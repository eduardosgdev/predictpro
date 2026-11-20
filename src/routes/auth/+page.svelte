
<script>
    // @ts-nocheck
    import { goto } from "$app/navigation";
    import user from "../../conexiones/authAxios.js";

    // Pestaña activa
    let activeTab = $state("login");

    // Login
    let telefonoLogin = $state("");
    let contraseñaLogin = $state("");

    // Registro
    let nombre = $state("");
    let apellidos = $state("");
    let edad = $state("");
    let telefono = $state("");
    let contraseña = $state("");
    let repetircontraseña = $state("");

    // Estados
    let loading = $state(false);
    let errorMessage = $state("");
    let successMessage = $state("");

    // Visibilidad de contraseñas
    let mostrarPasswordLogin = $state(false);
    let mostrarPasswordRegistro = $state(false);
    let mostrarRepetirPassword = $state(false);

    // Cambiar pestaña
    function changeTab(tab) {
        activeTab = tab;
        errorMessage = "";
        successMessage = "";
    }

    // LOGIN
    const handleLogin = async (event) => {
    event.preventDefault();

    errorMessage = "";
    successMessage = "";

    try {
        loading = true;

        const response = await user.post("/login", {
            telefono: Number(telefonoLogin),
            contraseña: contraseñaLogin
        });

        // Comprobar respuesta del servidor
        if (!response.data?.success || !response.data?.token) {
            errorMessage =
                response.data?.message || "No se pudo iniciar sesión.";
            return;
        }

        // Guardar JWT
        localStorage.setItem("token", response.data.token);

        // Guardar perfil del usuario
        localStorage.setItem("user", JSON.stringify({
            id: response.data.user._id,
            nombre: response.data.user.nombre,
            apellidos: response.data.user.apellidos,
            telefono: response.data.user.telefono,
            rol: response.data.user.rol,
            estadocuenta: response.data.user.estadocuenta
        }));

        successMessage =
            response.data.message || "¡Bienvenido a PredictPro!";

        // Redirigir al usuario
        await goto("/");

    } catch (error) {
        console.error("Error al iniciar sesión:", error);

        errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Error al iniciar sesión. Inténtalo de nuevo.";

    } finally {
        loading = false;
    }
};

    // REGISTRO
    const handleRegister = async (event) => {
        event.preventDefault();

        errorMessage = "";
        successMessage = "";

        // Validar contraseñas
        if (contraseña !== repetircontraseña) {
            errorMessage = "Las contraseñas no coinciden.";
            return;
        }

        try {
            loading = true;

            const response = await user.post("/", {
                nombre,
                apellidos,
                edad: Number(edad),
                telefono: Number(telefono),
                contraseña,
                repetircontraseña
            });

            console.log("Respuesta del registro:", response.data);

            successMessage =
                response.data?.message ||
                "Cuenta creada correctamente. Espera la activación de tu cuenta.";

            // Limpiar formulario
            nombre = "";
            apellidos = "";
            edad = "";
            telefono = "";
            contraseña = "";
            repetircontraseña = "";

        } catch (error) {
            console.error("Error al registrarse:", error);

            errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Error al crear la cuenta. Inténtalo de nuevo.";

        } finally {
            loading = false;
        }
    };
</script>

<svelte:head>
    <title>Acceso | PredictPro</title>
    <meta
        name="description"
        content="Accede o crea tu cuenta en PredictPro."
    />
</svelte:head>

<div class="auth-page">

    <!-- Fondo decorativo -->
    <div class="glow glow-green"></div>
    <div class="glow glow-blue"></div>

    <!-- Contenido -->
    <div class="auth-container">

        <!-- Logo -->
        <a href="/" class="brand">
            <div class="brand-icon">
                <span>PP</span>
            </div>

            <div class="brand-name">
                <span>PREDICT</span><span class="green">PRO</span>
            </div>
        </a>

        <div class="subtitle">
            <span class="status-dot"></span>
            TU PLATAFORMA DE PREDICCIONES DEPORTIVAS
        </div>

        <!-- Tarjeta -->
        <div class="auth-card">

            <!-- Cabecera -->
            <div class="card-header">

                <div class="card-icon">
                    {#if activeTab === "login"}
                        <span>↗</span>
                    {:else}
                        <span>＋</span>
                    {/if}
                </div>

                <h1>
                    {activeTab === "login"
                        ? "Bienvenido de nuevo"
                        : "Únete a PredictPro"}
                </h1>

                <p>
                    {activeTab === "login"
                        ? "Introduce tus credenciales para continuar"
                        : "Crea tu cuenta y empieza tu experiencia"}
                </p>

            </div>

            <!-- Pestañas -->
            <div class="tabs">

                <button
                    type="button"
                    class:active={activeTab === "login"}
                    onclick={() => changeTab("login")}
                >
                    Iniciar sesión
                </button>

                <button
                    type="button"
                    class:active={activeTab === "register"}
                    onclick={() => changeTab("register")}
                >
                    Registrarse
                </button>

            </div>

            <!-- Mensajes -->
            {#if errorMessage}
                <div class="alert error">
                    <span>!</span>
                    {errorMessage}
                </div>
            {/if}

            {#if successMessage}
                <div class="alert success">
                    <span>✓</span>
                    {successMessage}
                </div>
            {/if}

            <!-- LOGIN -->
            {#if activeTab === "login"}

                <form onsubmit={handleLogin}>

                    <div class="form-group">
                        <label for="telefonoLogin">Teléfono</label>

                        <input
                            id="telefonoLogin"
                            type="tel"
                            placeholder="Introduce tu teléfono"
                            bind:value={telefonoLogin}
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="passwordLogin">Contraseña</label>

                        <div class="password-wrapper">

                            <input
                                id="passwordLogin"
                                type={mostrarPasswordLogin ? "text" : "password"}
                                placeholder="Introduce tu contraseña"
                                bind:value={contraseñaLogin}
                                required
                            />

                            <button
                                type="button"
                                class="toggle-password"
                                onclick={() => mostrarPasswordLogin = !mostrarPasswordLogin}
                            >
                                {mostrarPasswordLogin ? "Ocultar" : "Mostrar"}
                            </button>

                        </div>
                    </div>

                    <button
                        type="submit"
                        class="submit-button"
                        disabled={loading}
                    >
                        {loading ? "Comprobando..." : "INICIAR SESIÓN"}
                        <span>→</span>
                    </button>

                </form>

            {:else}

                <!-- REGISTRO -->
                <form onsubmit={handleRegister}>

                    <div class="form-grid">

                        <div class="form-group">
                            <label for="nombre">Nombre</label>

                            <input
                                id="nombre"
                                type="text"
                                placeholder="Nombre"
                                bind:value={nombre}
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="apellidos">Apellidos</label>

                            <input
                                id="apellidos"
                                type="text"
                                placeholder="Apellidos"
                                bind:value={apellidos}
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="edad">Edad</label>

                            <input
                                id="edad"
                                type="number"
                                min="18"
                                placeholder="Edad"
                                bind:value={edad}
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="telefono">Teléfono</label>

                            <input
                                id="telefono"
                                type="tel"
                                placeholder="Teléfono"
                                bind:value={telefono}
                                required
                            />
                        </div>

                    </div>

                    <div class="form-group">
                        <label for="passwordRegister">Contraseña</label>

                        <div class="password-wrapper">

                            <input
                                id="passwordRegister"
                                type={mostrarPasswordRegistro ? "text" : "password"}
                                placeholder="Crea una contraseña"
                                bind:value={contraseña}
                                required
                            />

                            <button
                                type="button"
                                class="toggle-password"
                                onclick={() => mostrarPasswordRegistro = !mostrarPasswordRegistro}
                            >
                                {mostrarPasswordRegistro ? "Ocultar" : "Mostrar"}
                            </button>

                        </div>
                    </div>

                    <div class="form-group">
                        <label for="repetirPassword">Repetir contraseña</label>

                        <div class="password-wrapper">

                            <input
                                id="repetirPassword"
                                type={mostrarRepetirPassword ? "text" : "password"}
                                placeholder="Repite tu contraseña"
                                bind:value={repetircontraseña}
                                required
                            />

                            <button
                                type="button"
                                class="toggle-password"
                                onclick={() => mostrarRepetirPassword = !mostrarRepetirPassword}
                            >
                                {mostrarRepetirPassword ? "Ocultar" : "Mostrar"}
                            </button>

                        </div>
                    </div>

                    <button
                        type="submit"
                        class="submit-button"
                        disabled={loading}
                    >
                        {loading ? "Creando cuenta..." : "CREAR CUENTA"}
                        <span>→</span>
                    </button>

                </form>

            {/if}

            <div class="card-footer">
                <span>
                    Al continuar, aceptas las condiciones de uso de PredictPro.
                </span>
            </div>

        </div>

        <div class="bottom-text">
            <span>© 2026 PREDICTPRO</span>
            <span class="footer-dot">●</span>
            <span>SPORTS ANALYTICS</span>
        </div>

    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        background: #07090E;
        font-family: 'Inter', sans-serif;
    }

    .auth-page {
        min-height: 100vh;
        background: #07090E;
        color: #F3F4F6;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        position: relative;
        overflow: hidden;
    }

    .glow {
        position: absolute;
        width: 350px;
        height: 350px;
        border-radius: 50%;
        filter: blur(120px);
        pointer-events: none;
        opacity: 0.12;
    }

    .glow-green {
        background: #00FF66;
        top: 5%;
        left: -180px;
    }

    .glow-blue {
        background: #00F0FF;
        bottom: 0;
        right: -180px;
    }

    .auth-container {
        width: 100%;
        max-width: 440px;
        position: relative;
        z-index: 1;
    }

    .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        text-decoration: none;
        margin-bottom: 18px;
    }

    .brand-icon {
        width: 42px;
        height: 42px;
        background: #00FF66;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #07090E;
        font-weight: 900;
        font-size: 15px;
        box-shadow: 0 0 22px #00ff6640;
    }

    .brand-name {
        font-size: 23px;
        font-weight: 900;
        letter-spacing: 1px;
        color: #F3F4F6;
    }

    .green {
        color: #00FF66;
    }

    .subtitle {
        text-align: center;
        color: #8994A5;
        font-size: 9px;
        letter-spacing: 2px;
        margin-bottom: 30px;
    }

    .status-dot {
        display: inline-block;
        width: 7px;
        height: 7px;
        background: #00FF66;
        border-radius: 50%;
        margin-right: 7px;
        box-shadow: 0 0 8px #00FF66;
    }

    .auth-card {
        background: #0E131F;
        border: 1px solid #252E40;
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 20px 70px #00000070;
    }

    .card-header {
        text-align: center;
        margin-bottom: 25px;
    }

    .card-icon {
        width: 48px;
        height: 48px;
        border: 1px solid #00FF6640;
        background: #00FF6610;
        border-radius: 14px;
        color: #00FF66;
        font-size: 27px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto 16px;
    }

    .card-header h1 {
        font-size: 23px;
        margin: 0 0 9px;
        font-weight: 800;
    }

    .card-header p {
        color: #8994A5;
        font-size: 12px;
        margin: 0;
    }

    .tabs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        background: #080C15;
        padding: 5px;
        border-radius: 10px;
        margin-bottom: 25px;
        gap: 5px;
    }

    .tabs button {
        border: none;
        background: transparent;
        color: #8994A5;
        padding: 12px 5px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: 0.2s;
    }

    .tabs button.active {
        background: #00FF66;
        color: #07090E;
        box-shadow: 0 0 15px #00FF6625;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0 12px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 18px;
        min-width: 0;
    }

    .form-group label {
        font-size: 12px;
        font-weight: 700;
        color: #D1D5DB;
    }

    .form-group input {
        width: 100%;
        box-sizing: border-box;
        background: #080C15;
        border: 1px solid #293449;
        border-radius: 9px;
        padding: 13px;
        color: #F3F4F6;
        font-size: 12px;
        outline: none;
        transition: 0.2s;
    }

    .form-group input::placeholder {
        color: #586477;
    }

    .form-group input:focus {
        border-color: #00FF66;
        box-shadow: 0 0 0 3px #00FF6610;
    }

    .password-wrapper {
        display: flex;
        position: relative;
        align-items: center;
    }

    .password-wrapper input {
        padding-right: 70px;
    }

    .toggle-password {
        position: absolute;
        right: 10px;
        background: transparent;
        border: none;
        color: #00FF66;
        font-size: 10px;
        font-weight: 700;
        cursor: pointer;
    }

    .submit-button {
        width: 100%;
        background: #00FF66;
        color: #07090E;
        border: none;
        padding: 15px;
        border-radius: 9px;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 1px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: 0.2s;
        margin-top: 8px;
    }

    .submit-button:hover:not(:disabled) {
        background: #00D654;
        box-shadow: 0 0 22px #00FF6640;
        transform: translateY(-1px);
    }

    .submit-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .alert {
        padding: 12px;
        border-radius: 8px;
        font-size: 11px;
        margin-bottom: 18px;
        display: flex;
        align-items: center;
        gap: 9px;
        line-height: 1.5;
    }

    .alert.error {
        background: #FF444410;
        border: 1px solid #FF444440;
        color: #FF7777;
    }

    .alert.success {
        background: #00FF6610;
        border: 1px solid #00FF6640;
        color: #00FF66;
    }

    .card-footer {
        border-top: 1px solid #252E40;
        margin-top: 23px;
        padding-top: 18px;
        text-align: center;
    }

    .card-footer span {
        font-size: 10px;
        color: #687386;
    }

    .bottom-text {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 25px;
        font-size: 9px;
        letter-spacing: 1px;
        color: #596477;
    }

    .footer-dot {
        color: #00FF66;
        font-size: 7px;
    }

    @media (max-width: 480px) {
        .auth-page {
            padding: 30px 14px;
        }

        .auth-card {
            padding: 23px 18px;
        }

        .card-header h1 {
            font-size: 20px;
        }

        .form-grid {
            grid-template-columns: 1fr;
        }
    }
</style>

