/* ====================================================================
   1. DECLARACIÓN DE ELEMENTOS DEL DOM
   ==================================================================== */

// Botones para abrir el modal (ej: en index.html, Iniciar sesión.html)
const openAuthBtns = document.querySelectorAll('[id^="openAuthModal"]');

// Elementos de la Modal de AUTENTICACIÓN
const authModal = document.getElementById('authModal');
const closeAuthBtn = document.querySelector('.auth-close');
const overlay = document.querySelector('.overlay');

// Elementos de la Modal de SUSCRIPCIÓN (NUEVO)
const subscriptionModal = document.getElementById('subscriptionModal');
const openSubscriptionBtns = document.querySelectorAll('#openModalBtn, #openModalBtn2'); // Botones de suscripción
const closeSubscriptionBtn = document.getElementById('closeModalBtn'); // Botón de cerrar de la modal de suscripción


// Vistas dentro de la Modal de Autenticación
const loginView = document.getElementById('loginView');
const registerView = document.getElementById('registerView');

// Pestañas y enlaces de cambio de vista (Autenticación)
const switchToRegisterTab = document.getElementById('switchToRegister');
const switchToLoginTab = document.getElementById('switchToLogin');
const switchToRegisterLink = document.getElementById('switchToRegisterLink');
const switchToLoginLink = document.getElementById('switchToLoginLink');

// Formularios
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// Inputs de Login
const loginEmailInput = document.getElementById("loginEmail");
const loginPasswordInput = document.getElementById("loginPassword");
const loginTermsInput = document.getElementById("loginTerms");

// Inputs de Registro
const regNameInput = document.getElementById("regName");
const regEmailInput = document.getElementById("regEmail");
const regPasswordInput = document.getElementById("regPassword");
const regConfirmPasswordInput = document.getElementById("regConfirmPassword");

// Elementos de la Interfaz (Index y Dashboard)
const welcomeArea = document.getElementById("welcomeArea");
const loginArea = document.getElementById("loginArea"); // Área que contiene el botón de abrir modal
const dashboardContent = document.getElementById("dashboardContent");
const noSessionMessage = document.getElementById("noSessionMessage");
const usuariosRegistradosDiv = document.getElementById("usuariosRegistrados");
const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
const eliminarCuentaBtn = document.getElementById("eliminarCuentaBtn");

// Elementos de la Barra de Navegación (para control de sesión global)
const loginLinkNav = document.getElementById("loginLinkNav");
const dashboardLinkNav = document.getElementById("dashboardLinkNav");
const logoutLinkNav = document.getElementById("logoutLinkNav");


/* ====================================================================
   2. FUNCIONALIDAD DE LAS MODALES (Abrir, Cerrar, Cambiar Vista)
   ==================================================================== */

// 2.1. Modal de Autenticación (Login/Register)
const switchView = (targetView) => {
    if (!loginView || !registerView) return;

    const tabs = document.querySelectorAll('.auth-tabs button');
    
    loginView.classList.remove('active', 'hidden');
    registerView.classList.remove('active', 'hidden');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    if (targetView === 'login') {
        registerView.classList.add('hidden');
    } else if (targetView === 'register') {
        loginView.classList.add('hidden');
    }

    if (targetView === 'login') {
        loginView.classList.add('active');
        loginView.classList.remove('hidden');
        if (switchToLoginTab) switchToLoginTab.classList.add('active');
    } else if (targetView === 'register') {
        registerView.classList.add('active');
        registerView.classList.remove('hidden');
        if (switchToRegisterTab) switchToRegisterTab.classList.add('active');
    }
};

const openAuthModal = (viewToShow = 'login') => {
    if (!authModal || !overlay) return;

    authModal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    switchView(viewToShow);
};

const closeAuthModal = () => {
    if (!authModal || !overlay) return;
    authModal.classList.add('hidden');
    // Si la otra modal está abierta, el overlay debe seguir visible
    if (!subscriptionModal || subscriptionModal.classList.contains('hidden')) {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();
};

// 2.2. Modal de Suscripción (NUEVO)
const openSubscriptionModal = () => {
    if (!subscriptionModal || !overlay) return;

    subscriptionModal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

const closeSubscriptionModal = () => {
    if (!subscriptionModal || !overlay) return;
    subscriptionModal.classList.add('hidden');
    // Si la otra modal está abierta, el overlay debe seguir visible
    if (!authModal || authModal.classList.contains('hidden')) {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
    // Opcional: Limpiar el formulario de suscripción
    const subscriptionForm = subscriptionModal.querySelector('form');
    if (subscriptionForm) subscriptionForm.reset();
};


/* ====================================================================
   3. EVENTOS DE LAS MODALES Y NAVEGACIÓN
   ==================================================================== */

// Eventos de la Modal de AUTENTICACIÓN
if (authModal) {
    // Abrir modal desde botones con id^="openAuthModal"
    openAuthBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.getAttribute('data-view') || 'login';
            closeSubscriptionModal(); // Cierra la de suscripción si está abierta
            openAuthModal(view);
        });
    });
    
    // Abrir modal desde el enlace de navegación "Iniciar sesión"
    if (loginLinkNav) {
        loginLinkNav.addEventListener('click', (e) => {
            e.preventDefault();
            closeSubscriptionModal(); // Cierra la de suscripción si está abierta
            openAuthModal('login');
        });
    }

    // Cerrar modal de autenticación
    if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModal);
    
    // Alternar vistas (Pestañas y enlaces internos)
    if (switchToRegisterTab) switchToRegisterTab.addEventListener('click', () => switchView('register'));
    if (switchToLoginTab) switchToLoginTab.addEventListener('click', () => switchView('login'));
    if (switchToRegisterLink) switchToRegisterLink.addEventListener('click', (e) => { e.preventDefault(); switchView('register'); });
    if (switchToLoginLink) switchToLoginLink.addEventListener('click', (e) => { e.preventDefault(); switchView('login'); });
}

// Eventos de la Modal de SUSCRIPCIÓN (NUEVO)
if (subscriptionModal) {
    // Abrir modal desde botones de suscripción
    openSubscriptionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeAuthModal(); // Cierra la de autenticación si está abierta
            openSubscriptionModal();
        });
    });

    // Cerrar modal de suscripción
    if (closeSubscriptionBtn) closeSubscriptionBtn.addEventListener('click', closeSubscriptionModal);
}

// Cerrar AMBAS modales con overlay o Escape
if (overlay) overlay.addEventListener('click', () => {
    closeAuthModal();
    closeSubscriptionModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAuthModal();
        closeSubscriptionModal();
    }
});


/* ====================================================================
   4. GESTIÓN DE SESIÓN CON LOCALSTORAGE (Mantenida)
   ... (El resto de la Sección 4 se mantiene igual, ya que no afecta a la nueva modal)
   ==================================================================== */

/**
 * Verifica el localStorage y actualiza la vista de la página y la barra de navegación.
 */
function checkSession() {
    const nombreUsuario = localStorage.getItem("nombreUsuario");
    const correoUsuario = localStorage.getItem("correoUsuario");
    
    const isSessionActive = nombreUsuario && correoUsuario;

    // Lógica para la barra de navegación (Aplica a todas las páginas)
    if (loginLinkNav && dashboardLinkNav && logoutLinkNav) {
        if (isSessionActive) {
            loginLinkNav.classList.add('hidden');
            dashboardLinkNav.classList.remove('hidden');
            logoutLinkNav.classList.remove('hidden');
        } else {
            loginLinkNav.classList.remove('hidden');
            dashboardLinkNav.classList.add('hidden');
            logoutLinkNav.classList.add('hidden');
        }
    }


    // Lógica para la página de INICIO (index.html) y LOGIN (Iniciar sesión.html)
    if (welcomeArea) {
        if (isSessionActive) {
            if (loginArea) loginArea.classList.add('hidden');
            welcomeArea.classList.remove('hidden');
            document.getElementById("welcomeMessage").textContent = `¡Hola, ${nombreUsuario}!`;
            document.getElementById("sessionInfo").textContent = `Tu correo es: ${correoUsuario}`;
        } else {
            if (loginArea) loginArea.classList.remove('hidden');
            welcomeArea.classList.add('hidden');
        }
    }
    
    // Lógica para la página del DASHBOARD (dashboard.html)
    if (dashboardContent) {
        const statusMessage = document.getElementById("statusMessage");
        if (statusMessage) statusMessage.style.display = 'none';

        if (isSessionActive) {
            dashboardContent.style.display = 'block';
            if (noSessionMessage) noSessionMessage.style.display = 'none';
            
            document.getElementById("nombreUsuario").textContent = "Bienvenido, " + nombreUsuario;
            document.getElementById("correoUsuario").textContent = "Correo: " + correoUsuario;
            
            if (usuariosRegistradosDiv) usuariosRegistradosDiv.style.display = 'block';
            mostrarUsuarios();
        } else {
            dashboardContent.style.display = 'none';
            if (noSessionMessage) noSessionMessage.style.display = 'block';
            if (usuariosRegistradosDiv) usuariosRegistradosDiv.style.display = 'none';
        }
    }
}

// 4.1. LÓGICA DE LOGIN
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const terms = loginTermsInput;
        const loginName = loginEmailInput.value.split('@')[0].toUpperCase();
        const loginEmail = loginEmailInput.value.trim();

        if (terms && !terms.checked) {
            alert("Debes aceptar los términos y condiciones.");
            return;
        }
        
        // ** INICIAR SESIÓN (Persistencia en localStorage) **
        localStorage.setItem("nombreUsuario", loginName);
        localStorage.setItem("correoUsuario", loginEmail);
        
        closeAuthModal();
        
        // Redirigir al Dashboard después de Iniciar Sesión
        window.location.href = "dashboard.html";
    });
}

// 4.2. LÓGICA DE REGISTRO
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

        // 1. Guardar el usuario en la lista de prueba
        const nuevoUsuario = { nombre: regName, email: regEmail, edad: "N/A" };
        let lista = JSON.parse(localStorage.getItem("usuarios")) || [];
        lista.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(lista));

        // 2. ** INICIAR SESIÓN AUTOMÁTICAMENTE (Persistencia en localStorage) **
        const sessionName = regName.split(' ')[0].toUpperCase();
        localStorage.setItem("nombreUsuario", sessionName);
        localStorage.setItem("correoUsuario", regEmail);

        alert(`¡Bienvenido, ${sessionName}! Te has registrado e iniciado sesión.`);
        
        closeAuthModal();
        // Redirigir al Dashboard después de Registrarse
        window.location.href = "dashboard.html";
    });
}

// 4.3. FUNCIONES DE CIERRE/ELIMINACIÓN DE SESIÓN (Usadas por botones en nav/dashboard)

function handleLogout(e) {
    if (e) e.preventDefault();
    localStorage.removeItem("nombreUsuario");
    localStorage.removeItem("correoUsuario");
    
    // Muestra mensaje de éxito si estamos en el dashboard
    if (document.getElementById("dashboardContent")) {
        const statusMessage = document.getElementById("statusMessage");
        if (statusMessage) {
            statusMessage.className = 'message success';
            statusMessage.textContent = "✅ Sesión cerrada. Los datos de sesión locales han sido eliminados.";
            statusMessage.style.display = 'block';
        }
    }
    window.location.href = "Iniciar sesión.html"; // Redirigir a la página de login
}

function handleDeleteAccount() {
    localStorage.clear(); // ELIMINA TODO (sesión y lista de usuarios de prueba)
    
    // Muestra mensaje de error si estamos en el dashboard
    const statusMessage = document.getElementById("statusMessage");
    if (statusMessage) {
        statusMessage.className = 'message error';
        statusMessage.textContent = "❌ Cuenta eliminada. Todos tus datos locales han sido borrados.";
        statusMessage.style.display = 'block';
    }
    window.location.href = "Iniciar sesión.html"; // Redirigir a la página de login
}

// 4.4. ASIGNACIÓN DE EVENTOS DE SESIÓN
if (cerrarSesionBtn) cerrarSesionBtn.addEventListener("click", handleLogout);
if (eliminarCuentaBtn) eliminarCuentaBtn.addEventListener("click", handleDeleteAccount);

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
   5. LÓGICA DE PRUEBA (CRUD DE USUARIOS - MANTENIDO)
   ... (Se mantiene la misma lógica para el dashboard)
   ==================================================================== */

const btnGuardar = document.getElementById("btnGuardar");
const btnVer = document.getElementById("btnVer");
const btnBorrar = document.getElementById("btnBorrar");
const btnLimpiarDashboard = document.getElementById("btnLimpiarDashboard");

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

// CRUD Events (Guardar, Ver, Borrar)
if (btnGuardar) btnGuardar.addEventListener("click", () => {
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

if (btnVer) btnVer.addEventListener("click", () => {
    const resultado = document.getElementById("resultado");
    if (resultado.style.display === "block") {
        resultado.style.display = "none";
        resultado.innerHTML = "";
        btnVer.textContent = "Ver Datos";
    } else {
        mostrarUsuarios();
    }
});

if (btnBorrar) btnBorrar.addEventListener("click", () => {
    localStorage.removeItem("usuarios");
    alert("Todos los datos de la lista de usuarios han sido eliminados.");
    if (document.getElementById("resultado")) mostrarUsuarios();
});

if (btnLimpiarDashboard) btnLimpiarDashboard.addEventListener("click", () => {
    localStorage.removeItem("usuarios");
    const statusMessage = document.getElementById("statusMessage");
    if (statusMessage) {
        statusMessage.className = 'message error';
        statusMessage.textContent = "❌ Lista de usuarios de prueba eliminada.";
        statusMessage.style.display = 'block';
    }
    mostrarUsuarios();
});


/* ====================================================================
   6. DASHBOARD (GRÁFICA) Y EJECUCIÓN INICIAL
   ... (Se mantiene la misma lógica para el dashboard)
   ==================================================================== */

if (document.getElementById("grafico")) {
    let usuarios = 350;
    let partidos = 120;
    let activos = 87;

    document.getElementById("usuarios").textContent = usuarios;
    document.getElementById("partidos").textContent = partidos;
    document.getElementById("activos").textContent = activos;

    let canvas = document.getElementById("grafico");
    if (canvas) {
        let ctx = canvas.getContext("2d");

        let datos = [usuarios, partidos, activos];
        let colores = ["#ff5c00", "#ffa559", "#ff7f32"];
        let etiquetas = ["Usuarios", "Partidos", "Activos"];
        
        // Dibujar gráfico de barras (simulación)
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        
        const chartHeight = 150;
        const chartYStart = canvas.height - 20;
        const barWidth = 40;
        const spacing = 60;
        const scaleFactor = chartHeight / Math.max(...datos);
        
        for (let i = 0; i < datos.length; i++) {
            let barHeight = datos[i] * scaleFactor;
            let x = 50 + i * (barWidth + spacing);
            let y = chartYStart - barHeight;

            // Dibujar barra
            ctx.fillStyle = colores[i];
            ctx.fillRect(x, y, barWidth, barHeight);

            // Dibujar etiqueta de valor
            ctx.fillStyle = "#333";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(datos[i], x + barWidth / 2, y - 5); 

            // Dibujar etiqueta de categoría
            ctx.fillStyle = "#000";
            ctx.font = "14px Arial";
            ctx.fillText(etiquetas[i], x + barWidth / 2, chartYStart + 15);
        }
    }
}


// Ejecución inicial al cargar la página:
document.addEventListener("DOMContentLoaded", checkSession);