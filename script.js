/* ====================================================================
   1. LÓGICA DE LA MODAL ÚNICA DE AUTENTICACIÓN (Login & Registro)
   ==================================================================== */

// 1. Obtener Elementos de la Modal Única
const openAuthBtns = document.querySelectorAll('[id^="openAuthModal"]'); // Botones en el Hero para abrir
const authModal = document.getElementById('authModal');
const closeAuthBtn = document.querySelector('.auth-close'); // Botón de cierre dentro de authModal
const overlay = document.querySelector('.overlay');

const loginView = document.getElementById('loginView');
const registerView = document.getElementById('registerView');
const switchToRegisterLink = document.getElementById('switchToRegister');
const switchToLoginLink = document.getElementById('switchToLogin');

// Campos del formulario de LOGIN (Asegúrate que el HTML los tiene con estos IDs: loginEmail, loginPassword)
const loginForm = document.getElementById("loginForm");
const loginEmailInput = document.getElementById("loginEmail");
const loginPasswordInput = document.getElementById("loginPassword");
const loginTermsInput = document.getElementById("loginTerms");

// Campos del formulario de REGISTRO
const registerForm = document.getElementById("registerForm");
const regNameInput = document.getElementById("regName");
const regEmailInput = document.getElementById("regEmail");
const regPasswordInput = document.getElementById("regPassword");
const regConfirmPasswordInput = document.getElementById("regConfirmPassword");


// 2. Funciones de Control de la Modal
const openAuthModal = (viewToShow = 'login') => {
    if (!authModal) return; // Salir si el modal no existe

    authModal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    switchView(viewToShow); // Mostrar la vista (login o register)
};

const closeAuthModal = () => {
    if (!authModal) return;
    authModal.classList.add('hidden');
    overlay.classList.add('hidden');
};

const switchView = (targetView) => {
    if (!loginView || !registerView) return;

    // Oculta ambas vistas primero
    loginView.classList.remove('active');
    registerView.classList.remove('active');

    // Muestra la vista deseada
    if (targetView === 'login') {
        loginView.classList.add('active');
    } else if (targetView === 'register') {
        registerView.classList.add('active');
    }
};

// 3. Eventos de la Modal
if (authModal) {
    // Eventos para abrir el modal desde el Hero
    openAuthBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.getAttribute('data-view');
            openAuthModal(view);
        });
    });

    // Eventos para cerrar el modal
    if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModal);
    if (overlay) overlay.addEventListener('click', closeAuthModal);

    // Eventos para alternar entre las vistas dentro del modal
    if (switchToRegisterLink) switchToRegisterLink.addEventListener('click', () => switchView('register'));
    if (switchToLoginLink) switchToLoginLink.addEventListener('click', () => switchView('login'));

    // Manejo de la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !authModal.classList.contains('hidden')) {
            closeAuthModal();
        }
    });
}


/* ====================================================================
   2. LÓGICA DE FORMULARIOS Y SESIÓN (Login, Registro y Cierre)
   ==================================================================== */

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault(); 

        const terms = loginTermsInput;
        // Obtenemos los valores de los campos de LOGIN (usando los IDs del modal único)
        const loginName = loginEmailInput.value.split('@')[0].toUpperCase(); // Nombre simple antes del @
        const loginEmail = loginEmailInput.value.trim();
        
        if (terms && !terms.checked) {
            alert("Debes aceptar los términos y condiciones.");
            return;
        }

        // 1. Guardamos la sesión
        localStorage.setItem("nombreUsuario", loginName);
        localStorage.setItem("correoUsuario", loginEmail);
        
        // 2. Cerramos la modal y redirigimos
        closeAuthModal(); 
        window.location.href = "dashboard.html"; 
    });
}

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Validación de Contraseñas
        if (regPasswordInput.value !== regConfirmPasswordInput.value) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const regName = regNameInput.value.trim();
        const regEmail = regEmailInput.value.trim();
        const regPassword = regPasswordInput.value;

        // 1. (Simulación) Guardar como usuario de prueba
        const nuevoUsuario = { nombre: regName, email: regEmail, edad: "N/A" }; 
        let lista = JSON.parse(localStorage.getItem("usuarios")) || [];
        lista.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(lista));

        // 2. Iniciar sesión automáticamente (Usamos el nombre simple para la sesión)
        const sessionName = regName.split(' ')[0].toUpperCase();
        localStorage.setItem("nombreUsuario", sessionName);
        localStorage.setItem("correoUsuario", regEmail);

        alert(`¡Bienvenido, ${sessionName}! Te has registrado e iniciado sesión.`);
        closeAuthModal();
        window.location.href = "dashboard.html";
    });
}

// Elementos del DOM para la lógica de sesión (manteniendo los IDs originales)
const welcomeArea = document.getElementById("welcomeArea");
const loginArea = document.getElementById("loginArea");
const dashboardContent = document.getElementById("dashboardContent");
const noSessionMessage = document.getElementById("noSessionMessage");
const usuariosRegistradosDiv = document.getElementById("usuariosRegistrados");

/**
 * Verifica el localStorage y actualiza la vista de la página (Index o Dashboard).
 */
function checkSession() {
    const nombreUsuario = localStorage.getItem("nombreUsuario");
    const correoUsuario = localStorage.getItem("correoUsuario");
    
    // Lógica para la página de INICIO (index.html) - Si existe welcomeArea
    if (welcomeArea) {
        if (nombreUsuario && correoUsuario) {
            // Sesión Activa
            loginArea.style.display = 'none';
            welcomeArea.style.display = 'flex';
            document.getElementById("welcomeMessage").textContent = `¡Hola, ${nombreUsuario}!`;
            document.getElementById("sessionInfo").textContent = `Tu correo es: ${correoUsuario}`;
        } else {
            // Sesión Inactiva
            loginArea.style.display = 'block';
            welcomeArea.style.display = 'none';
        }
    }
    
    // Lógica para la página del DASHBOARD (dashboard.html) - Si existe dashboardContent
    if (dashboardContent) {
        // Ocultar mensajes de estado temporales al cargar
        const statusMessage = document.getElementById("statusMessage");
        if (statusMessage) statusMessage.style.display = 'none'; 

        if (nombreUsuario && correoUsuario) {
            // Sesión Activa en Dashboard
            dashboardContent.style.display = 'block';
            if (noSessionMessage) noSessionMessage.style.display = 'none';
            
            document.getElementById("nombreUsuario").textContent = "Bienvenido, " + nombreUsuario;
            document.getElementById("correoUsuario").textContent = "Correo: " + correoUsuario;
            
            // Mostrar lista de usuarios de prueba
            if (usuariosRegistradosDiv) usuariosRegistradosDiv.style.display = 'block';
            mostrarUsuarios(); // Llama a la función para pintar los usuarios
        } else {
            // Sesión Inactiva en Dashboard
            dashboardContent.style.display = 'none';
            if (noSessionMessage) noSessionMessage.style.display = 'block';
            if (usuariosRegistradosDiv) usuariosRegistradosDiv.style.display = 'none';
        }
    }
}

// 3. Funciones de Cierre/Eliminación de Sesión

function handleLogout(e) {
    e.preventDefault(); 
    localStorage.removeItem("nombreUsuario");
    localStorage.removeItem("correoUsuario");
    
    // Muestra mensaje si estamos en el dashboard
    if (document.getElementById("dashboardContent")) {
        const statusMessage = document.getElementById("statusMessage");
        if (statusMessage) {
            statusMessage.className = 'message success';
            statusMessage.textContent = "✅ Sesión cerrada. Los datos de sesión locales han sido eliminados.";
            statusMessage.style.display = 'block';
        }
    }
    window.location.href = "Iniciar sesión.html"; // Redirigir siempre a la página de login
}

function handleDeleteAccount() {
    localStorage.clear(); // Elimina TODOS los datos (sesión y usuarios de prueba)
    
    // Muestra mensaje si estamos en el dashboard
    const statusMessage = document.getElementById("statusMessage");
    if (statusMessage) {
        statusMessage.className = 'message error';
        statusMessage.textContent = "❌ Cuenta eliminada. Todos tus datos locales han sido borrados.";
        statusMessage.style.display = 'block';
    }
    window.location.href = "Iniciar sesión.html"; // Redirigir siempre a la página de login
}


// 4. CRUD de Usuarios de Prueba (Mantenido)
// ... [El resto de las funciones: limpiarFormulario, mostrarUsuarios, lógica de btnGuardar, btnVer, etc., se mantienen sin cambios]

// ---------------------- INICIO DEL CÓDIGO MANTENIDO ----------------------

const btnGuardar = document.getElementById("btnGuardar");
const btnVer = document.getElementById("btnVer");
const btnBorrar = document.getElementById("btnBorrar"); // Borrar TODOS los usuarios de prueba

function limpiarFormulario() {
    if (!document.getElementById("nombre")) return;

    document.getElementById("nombre").value = "";
    document.getElementById("email").value = "";
    document.getElementById("edad").value = "";
    document.querySelectorAll(".error").forEach(e => e.textContent = "");
}

function mostrarUsuarios() {
    const resultado = document.getElementById("resultado") || document.getElementById("listaUsuarios");
    if (!resultado) return;

    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuariosGuardados.length === 0) {
        if (document.getElementById("btnVer")) {
            resultado.style.display = "none";
            resultado.innerHTML = "";
            document.getElementById("btnVer").textContent = "Ver Datos";
        } else { 
            resultado.innerHTML = "<p>No hay cuentas de prueba registradas aún.</p>";
        }
        return;
    }

    let html = document.getElementById("listaUsuarios") ? "" : "<h3>Usuarios Guardados:</h3>";

    usuariosGuardados.forEach((u, i) => {
        html += `
            <div class="usuario" data-index="${i}">
                <p><strong>Usuario #${i + 1}</strong></p>
                <p><strong>Nombre:</strong> ${u.nombre}</p>
                <p><strong>Email:</strong> ${u.email}</p>
                <p><strong>Edad:</strong> ${u.edad}</p>
                <button class="btn-borrar-individual btn-action btn-danger" data-index="${i}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Borrar Usuario</button>
            </div>
            ${document.getElementById("btnVer") ? '<hr>' : ''}
        `;
    });

    resultado.innerHTML = html;
    resultado.style.display = "block";
    if (document.getElementById("btnVer")) document.getElementById("btnVer").textContent = "Ocultar Datos";


    const botonesBorrar = document.querySelectorAll(".btn-borrar-individual");
    botonesBorrar.forEach(btn => {
        btn.addEventListener("click", e => {
            const index = parseInt(e.target.dataset.index);
            let lista = JSON.parse(localStorage.getItem("usuarios")) || [];

            lista.splice(index, 1);
            localStorage.setItem("usuarios", JSON.stringify(lista));

            mostrarUsuarios();
            const statusMessage = document.getElementById("statusMessage");
            if (statusMessage) {
                 statusMessage.className = 'message success';
                 statusMessage.textContent = `✅ Usuario #${index + 1} eliminado de la lista.`;
                 statusMessage.style.display = 'block';
            }
        });
    });
}

if (btnGuardar) {
    btnGuardar.addEventListener("click", () => {
        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const edad = document.getElementById("edad").value.trim();

        if (!nombre || !email || !edad) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        const usuario = { nombre, email, edad };
        let lista = JSON.parse(localStorage.getItem("usuarios")) || [];

        lista.push(usuario);
        localStorage.setItem("usuarios", JSON.stringify(lista));

        alert("Guardado correctamente.");
        limpiarFormulario();
    });
}

if (btnVer) {
    btnVer.addEventListener("click", () => {
        const resultado = document.getElementById("resultado");

        if (resultado.style.display === "block") {
            resultado.style.display = "none";
            resultado.innerHTML = "";
            btnVer.textContent = "Ver Datos";
        } else {
            mostrarUsuarios();
        }
    });
}

if (btnBorrar) {
    btnBorrar.addEventListener("click", () => {
        localStorage.removeItem("usuarios");
        alert("Todos los datos de la lista de usuarios han sido eliminados.");
        if (document.getElementById("resultado")) mostrarUsuarios(); 
    });
}

const btnLimpiarDashboard = document.getElementById("btnLimpiarDashboard");
if (btnLimpiarDashboard) {
    btnLimpiarDashboard.addEventListener("click", () => {
        localStorage.removeItem("usuarios");
        
        const statusMessage = document.getElementById("statusMessage");
        if (statusMessage) {
            statusMessage.className = 'message error';
            statusMessage.textContent = "❌ Lista de usuarios de prueba eliminada.";
            statusMessage.style.display = 'block';
        }
        mostrarUsuarios();
    });
}

// ---------------------- FIN DEL CÓDIGO MANTENIDO ----------------------


/* ====================================================================
   5. DASHBOARD (GRÁFICA) Y EVENTOS FINALES
   ==================================================================== */

if (document.getElementById("grafico")) {
    let usuarios = 350;
    let partidos = 120;
    let activos = 87;

    document.getElementById("usuarios").textContent = usuarios;
    document.getElementById("partidos").textContent = partidos;
    document.getElementById("activos").textContent = activos;

    let canvas = document.getElementById("grafico");
    let ctx = canvas.getContext("2d");

    let datos = [usuarios, partidos, activos];
    let colores = ["#ff5c00", "#ffa559", "#ff7f32"];
    let etiquetas = ["Usuarios", "Partidos", "Activos"];

    for (let i = 0; i < datos.length; i++) {
        let x = 80 + i * 120;
        let y = 150 - datos[i] / 3;

        ctx.fillStyle = colores[i];
        ctx.fillRect(x, y, 80, datos[i] / 3);

        ctx.fillStyle = "#000";
        ctx.font = "14px Arial";
        ctx.fillText(etiquetas[i], x + 5, 145);
    }
}

// 6. Asignación de Eventos de Cierre/Eliminación (Para Botones de Dashboard y Nav)
const linkCerrarSesion = document.getElementById("linkCerrarSesion");
const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
const eliminarCuentaBtn = document.getElementById("eliminarCuentaBtn");

// Botones de cierre/eliminación del Dashboard
if (cerrarSesionBtn) cerrarSesionBtn.addEventListener("click", handleLogout);
if (eliminarCuentaBtn) eliminarCuentaBtn.addEventListener("click", handleDeleteAccount);

// Enlaces del nav (funcionan en index y dashboard)
document.querySelectorAll("#cerrarSesion, #eliminarCuenta").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        if (link.id === "cerrarSesion") {
            handleLogout(e);
        } else if (link.id === "eliminarCuenta") {
            handleDeleteAccount();
        }
    });
});

/* ====================================================================
   EJECUCIÓN INICIAL
   ==================================================================== */
document.addEventListener("DOMContentLoaded", checkSession);