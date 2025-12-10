/* ====================================================================
   SCRIPT COMPLETO (Autenticación, Sesión, CRUD, Dashboard)
   ==================================================================== */

// ====================================================================
// 1. OBTENCIÓN Y DECLARACIÓN DE ELEMENTOS DEL DOM (GLOBAL UNIFICADO)
// ====================================================================

// Elementos de la Modal de Autenticación
const openAuthBtns = document.querySelectorAll('[id^="openAuthModal"]');
const authModal = document.getElementById('authModal');
const closeAuthBtn = document.querySelector('.auth-close');
const overlay = document.querySelector('.overlay');

// Vistas dentro de la Modal
const loginView = document.getElementById('loginView');
const registerView = document.getElementById('registerView');

// Enlaces para alternar dentro del formulario
const switchToRegisterLink = document.getElementById('switchToRegister');
const switchToLoginLink = document.getElementById('switchToLogin');

// Elementos de las Pestañas (Añadidos en la corrección anterior)
const authTabItems = document.querySelectorAll('.auth-tab-item');
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');

// Formularios y Campos
const loginForm = document.getElementById("loginForm");
const loginEmailInput = document.getElementById("loginEmail");
const loginPasswordInput = document.getElementById("loginPassword");
const loginTermsInput = document.getElementById("loginTerms");

const registerForm = document.getElementById("registerForm");
const regNameInput = document.getElementById("regName");
const regEmailInput = document.getElementById("regEmail");
const regPasswordInput = document.getElementById("regPassword");
const regConfirmPasswordInput = document.getElementById("regConfirmPassword");

// Elementos del Dashboard y Sesión
const welcomeArea = document.getElementById("welcomeArea");
const loginArea = document.getElementById("loginArea");
const dashboardContent = document.getElementById("dashboardContent");
const noSessionMessage = document.getElementById("noSessionMessage");
const usuariosRegistradosDiv = document.getElementById("usuariosRegistrados");
const btnGuardar = document.getElementById("btnGuardar");
const btnVer = document.getElementById("btnVer");
const btnBorrar = document.getElementById("btnBorrar");
const btnLimpiarDashboard = document.getElementById("btnLimpiarDashboard");
const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
const eliminarCuentaBtn = document.getElementById("eliminarCuentaBtn");


// ====================================================================
// 2. FUNCIONES DE CONTROL DE LA MODAL (AJUSTADAS PARA PESTAÑAS)
// ====================================================================

/**
 * Muestra la modal y la vista de inicio de sesión o registro.
 * @param {string} viewToShow - 'login' o 'register'.
 */
const openAuthModal = (viewToShow = 'login') => {
    if (!authModal) return;

    authModal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    switchView(viewToShow);

    // Nota: El título (<h3>) se mantiene dentro de cada div.auth-view en el HTML,
    // por lo que no necesita ser actualizado aquí.
};

/**
 * Oculta la modal y su fondo.
 */
const closeAuthModal = () => {
    if (!authModal) return;
    authModal.classList.add('hidden');
    overlay.classList.add('hidden');
};

/**
 * Alterna entre las vistas de Login y Registro (contenido y pestañas).
 * @param {string} targetView - 'login' o 'register'.
 */
const switchView = (targetView) => {
    // Es vital chequear si existen las pestañas antes de manipularlas
    if (!loginView || !registerView) return; 

    // 1. Alterna las Vistas del Contenido
    loginView.classList.remove('active');
    registerView.classList.remove('active');

    // 2. Alterna el estado activo de las Pestañas (si existen)
    if (tabLogin && tabRegister) {
        tabLogin.classList.remove('active');
        tabRegister.classList.remove('active');

        if (targetView === 'login') {
            tabLogin.classList.add('active');
        } else if (targetView === 'register') {
            tabRegister.classList.add('active');
        }
    }
    
    // 3. Muestra la vista de formulario correcta
    if (targetView === 'login') {
        loginView.classList.add('active');
    } else if (targetView === 'register') {
        registerView.classList.add('active');
    }
};


// ====================================================================
// 3. EVENTOS DE LA MODAL (AJUSTADOS PARA PESTAÑAS)
// ====================================================================

if (authModal) {
    // 1. Eventos para abrir el modal desde el Hero
    openAuthBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.getAttribute('data-view');
            openAuthModal(view);
        });
    });

    // 2. Eventos para cerrar el modal
    if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModal);
    if (overlay) overlay.addEventListener('click', closeAuthModal);

    // 3. Eventos para las NUEVAS pestañas (tabLogin, tabRegister)
    authTabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            const view = tab.getAttribute('data-target');
            switchView(view);
        });
    });

    // 4. Eventos para alternar entre las vistas desde los enlaces "Regístrate aquí" / "Inicia sesión"
    if (switchToRegisterLink) switchToRegisterLink.addEventListener('click', (e) => {
        e.preventDefault(); 
        switchView('register');
    });
    if (switchToLoginLink) switchToLoginLink.addEventListener('click', (e) => {
        e.preventDefault(); 
        switchView('login');
    });

    // 5. Manejo de la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !authModal.classList.contains('hidden')) {
            closeAuthModal();
        }
    });
}


// ====================================================================
// 4. LÓGICA DE FORMULARIOS Y SESIÓN (Sin cambios en la lógica)
// ====================================================================

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

        localStorage.setItem("nombreUsuario", loginName);
        localStorage.setItem("correoUsuario", loginEmail);
        
        closeAuthModal(); 
        window.location.href = "dashboard.html"; 
    });
}

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (regPasswordInput.value !== regConfirmPasswordInput.value) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const regName = regNameInput.value.trim();
        const regEmail = regEmailInput.value.trim();

        // 1. Guardar como usuario de prueba
        const nuevoUsuario = { nombre: regName, email: regEmail, edad: "N/A" }; 
        let lista = JSON.parse(localStorage.getItem("usuarios")) || [];
        lista.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(lista));

        // 2. Iniciar sesión automáticamente
        const sessionName = regName.split(' ')[0].toUpperCase();
        localStorage.setItem("nombreUsuario", sessionName);
        localStorage.setItem("correoUsuario", regEmail);

        alert(`¡Bienvenido, ${sessionName}! Te has registrado e iniciado sesión.`);
        closeAuthModal();
        window.location.href = "dashboard.html";
    });
}


// ====================================================================
// 5. FUNCIONES DE CIERRE/ELIMINACIÓN DE SESIÓN (Sin cambios)
// ====================================================================

function handleLogout(e) {
    e.preventDefault(); 
    localStorage.removeItem("nombreUsuario");
    localStorage.removeItem("correoUsuario");
    
    if (document.getElementById("dashboardContent")) {
        const statusMessage = document.getElementById("statusMessage");
        if (statusMessage) {
            statusMessage.className = 'message success';
            statusMessage.textContent = "✅ Sesión cerrada. Los datos de sesión locales han sido eliminados.";
            statusMessage.style.display = 'block';
        }
    }
    window.location.href = "Iniciar sesión.html";
}

function handleDeleteAccount() {
    localStorage.clear(); 
    
    const statusMessage = document.getElementById("statusMessage");
    if (statusMessage) {
        statusMessage.className = 'message error';
        statusMessage.textContent = "❌ Cuenta eliminada. Todos tus datos locales han sido borrados.";
        statusMessage.style.display = 'block';
    }
    window.location.href = "Iniciar sesión.html";
}


// ====================================================================
// 6. VERIFICACIÓN DE SESIÓN (checkSession) (Sin cambios)
// ====================================================================

function checkSession() {
    const nombreUsuario = localStorage.getItem("nombreUsuario");
    const correoUsuario = localStorage.getItem("correoUsuario");
    
    // Lógica para la página de INICIO (index.html)
    if (welcomeArea) {
        if (nombreUsuario && correoUsuario) {
            loginArea.style.display = 'none';
            welcomeArea.style.display = 'flex';
            document.getElementById("welcomeMessage").textContent = `¡Hola, ${nombreUsuario}!`;
            document.getElementById("sessionInfo").textContent = `Tu correo es: ${correoUsuario}`;
        } else {
            loginArea.style.display = 'block';
            welcomeArea.style.display = 'none';
        }
    }
    
    // Lógica para la página del DASHBOARD (dashboard.html)
    if (dashboardContent) {
        const statusMessage = document.getElementById("statusMessage");
        if (statusMessage) statusMessage.style.display = 'none'; 

        if (nombreUsuario && correoUsuario) {
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


// ====================================================================
// 7. FUNCIONES CRUD DE USUARIOS DE PRUEBA (Sin cambios)
// ====================================================================

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

// ====================================================================
// 8. EVENTOS CRUD DE USUARIOS DE PRUEBA (Sin cambios)
// ====================================================================

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


// ====================================================================
// 9. DASHBOARD (GRÁFICA) (Sin cambios)
// ====================================================================

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


// ====================================================================
// 10. ASIGNACIÓN DE EVENTOS FINALES (Sin cambios)
// ====================================================================

// Botones de cierre/eliminación del Dashboard
if (cerrarSesionBtn) cerrarSesionBtn.addEventListener("click", handleLogout);
if (eliminarCuentaBtn) eliminarCuentaBtn.addEventListener("click", handleDeleteAccount);

// Enlaces del nav
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
   11. EJECUCIÓN INICIAL (Sin cambios)
   ==================================================================== */
document.addEventListener("DOMContentLoaded", checkSession);
document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos de la Modal
    const authModal = document.getElementById('authModal');
    const overlay = document.querySelector('.overlay');
    
    // Botones de Apertura y Cierre
    const openAuthModalBtn = document.getElementById('openAuthModal');
    const closeBtn = authModal.querySelector('.auth-close');

    // 2. Elementos de las Pestañas
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');

    // Enlaces de cambio rápido entre formularios
    const switchToRegisterLink = document.getElementById('switchToRegister');
    const switchToLoginLink = document.getElementById('switchToLogin');
    
    // Función para abrir la modal
    function openModal(initialTab = 'login') {
        authModal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        // Asegura que la vista correcta esté activa al abrir
        if (initialTab === 'register') {
             switchTab(tabRegister, registerView);
        } else {
             switchTab(tabLogin, loginView);
        }
    }

    // Función para cerrar la modal
    function closeModal() {
        authModal.classList.add('hidden');
        overlay.classList.add('hidden');
    }

    // Función para cambiar la pestaña activa
    function switchTab(clickedTab, targetView) {
        // Remover 'active' de todas las pestañas y vistas
        tabLogin.classList.remove('active');
        tabRegister.classList.remove('active');
        loginView.classList.remove('active');
        registerView.classList.remove('active');

        // Agregar 'active' a la pestaña y vista seleccionadas
        clickedTab.classList.add('active');
        targetView.classList.add('active');
    }

    // --- MANEJO DE EVENTOS ---
    
    // ABRIR MODAL
    openAuthModalBtn.addEventListener('click', () => openModal('login'));

    // CERRAR MODAL
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !authModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // CAMBIO DE PESTAÑAS (TABS)
    tabLogin.addEventListener('click', () => switchTab(tabLogin, loginView));
    tabRegister.addEventListener('click', () => switchTab(tabRegister, registerView));

    // CAMBIO DE ENLACES (DENTRO DEL FORMULARIO)
    switchToRegisterLink.addEventListener('click', () => switchTab(tabRegister, registerView));
    switchToLoginLink.addEventListener('click', () => switchTab(tabLogin, loginView));
    
    // MANEJO DEL OJO (Toggle Password Visibility)
    const togglePasswords = authModal.querySelectorAll('.toggle-password');
    togglePasswords.forEach(icon => {
        icon.addEventListener('click', () => {
            const passwordInput = icon.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });

    // Nota: Aquí iría la lógica de envío de formularios (loginForm, registerForm)
});
document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos de la Modal
    const authModal = document.getElementById('authModal');
    const overlay = document.querySelector('.overlay');
    
    // Botones de Apertura (Ambos en la página principal)
    const openAuthModalBtnLogin = document.getElementById('openAuthModal');
    const openAuthModalBtnRegister = document.getElementById('openAuthModal2');
    const closeBtn = authModal.querySelector('.auth-close');

    // 2. Elementos de las Pestañas
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');

    // Enlaces de cambio rápido entre formularios
    const switchToRegisterLink = document.getElementById('switchToRegister');
    const switchToLoginLink = document.getElementById('switchToLogin');
    
    // Función central para cambiar la pestaña y la vista
    function switchTab(clickedTab, targetView) {
        // Remover 'active' de todas las pestañas y vistas
        tabLogin.classList.remove('active');
        tabRegister.classList.remove('active');
        loginView.classList.remove('active');
        registerView.classList.remove('active');

        // Agregar 'active' a la pestaña y vista seleccionadas
        clickedTab.classList.add('active');
        targetView.classList.add('active');
    }

    // Función para abrir la modal
    function openModal(initialTab = 'login') {
        authModal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        
        // Determina qué pestaña debe estar activa al abrir
        if (initialTab === 'register') {
             switchTab(tabRegister, registerView);
        } else {
             switchTab(tabLogin, loginView);
        }
    }

    // Función para cerrar la modal
    function closeModal() {
        authModal.classList.add('hidden');
        overlay.classList.add('hidden');
    }

    // --- MANEJO DE EVENTOS ---
    
    // ABRIR MODAL: BOTÓN "Iniciar sesión"
    if (openAuthModalBtnLogin) {
        openAuthModalBtnLogin.addEventListener('click', () => openModal('login'));
    }

    // ABRIR MODAL: BOTÓN "Registro"
    if (openAuthModalBtnRegister) {
        openAuthModalBtnRegister.addEventListener('click', () => openModal('register'));
    }


    // CERRAR MODAL
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !authModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // CAMBIO DE PESTAÑAS (TABS)
    if (tabLogin && loginView) {
        tabLogin.addEventListener('click', () => switchTab(tabLogin, loginView));
    }
    if (tabRegister && registerView) {
        tabRegister.addEventListener('click', () => switchTab(tabRegister, registerView));
    }

    // CAMBIO DE ENLACES (DENTRO DEL FORMULARIO)
    if (switchToRegisterLink) {
        switchToRegisterLink.addEventListener('click', () => switchTab(tabRegister, registerView));
    }
    if (switchToLoginLink) {
        switchToLoginLink.addEventListener('click', () => switchTab(tabLogin, loginView));
    }
    
    // MANEJO DEL OJO (Toggle Password Visibility)
    const togglePasswords = authModal ? authModal.querySelectorAll('.toggle-password') : [];
    togglePasswords.forEach(icon => {
        icon.addEventListener('click', () => {
            const passwordInput = icon.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            // Cambia el ícono del ojo
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });
});