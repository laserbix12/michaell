/* ================================================
   1. LÓGICA DEL MODAL / LOGIN
   (Usada típicamente en index.html o en una modal de login)
================================================ */

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openBtns = document.querySelectorAll(".btn-open");
const closeBtn = document.querySelector(".btn-close");

if (modal) {
    /* Abrir modal */
    if (openBtns) {
        openBtns.forEach(btn => btn.addEventListener("click", () => {
            modal.classList.remove("hidden");
            overlay.classList.remove("hidden");
        }));
    }

    /* Cerrar modal */
    const closeModal = () => {
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (overlay) overlay.addEventListener("click", closeModal);

    /* Cerrar con ESC */
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            closeModal();
        }
    });
}

// Lógica de Redirección/Guardado del Formulario de Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault(); 

        const terms = document.getElementById("terms");
        // Asegúrate de que los campos 'loginName' y 'loginEmail' existan en el formulario del index.html
        const loginName = document.getElementById("loginName") ? document.getElementById("loginName").value.trim() : "Usuario";
        const loginEmail = document.getElementById("loginEmail") ? document.getElementById("loginEmail").value.trim() : "correo@ejemplo.com";


        if (terms && !terms.checked) {
            alert("Debes aceptar los términos y condiciones.");
            return;
        }

        // 1. Guardamos la sesión
        localStorage.setItem("nombreUsuario", loginName);
        localStorage.setItem("correoUsuario", loginEmail);
        
        // 2. 🚀 CAMBIO CLAVE: Redirigir al dashboard.html
        // Si estamos en la página de inicio (index.html), siempre redirigimos al dashboard.
        window.location.href = "dashboard.html"; 
    });
}


/* ================================================
   2. FORMULARIO LOCALSTORAGE (CRUD DE USUARIOS DE PRUEBA)
   (Usado en otra sección, probablemente no en index/dashboard)
================================================ */

const btnGuardar = document.getElementById("btnGuardar");
const btnVer = document.getElementById("btnVer");
const btnLimpiar = document.getElementById("btnLimpiar"); // Este ID parece no estar en tu HTML de ejemplo
const btnBorrar = document.getElementById("btnBorrar"); // Borrar TODOS los usuarios de prueba

function limpiarFormulario() {
    if (!document.getElementById("nombre")) return;

    document.getElementById("nombre").value = "";
    document.getElementById("email").value = "";
    document.getElementById("edad").value = "";
    document.querySelectorAll(".error").forEach(e => e.textContent = "");
}

function mostrarUsuarios() {
    // Esta función se puede usar en el Dashboard para ver los usuarios guardados
    const resultado = document.getElementById("resultado") || document.getElementById("listaUsuarios");
    if (!resultado) return;

    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuariosGuardados.length === 0) {
        if (document.getElementById("btnVer")) { // Para la vista con botón de "Ver Datos"
            resultado.style.display = "none";
            resultado.innerHTML = "";
            document.getElementById("btnVer").textContent = "Ver Datos";
        } else { // Para la vista del Dashboard
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
            // Lógica para mostrar mensaje en el dashboard (si existe)
            const statusMessage = document.getElementById("statusMessage");
            if (statusMessage) {
                 statusMessage.className = 'message success';
                 statusMessage.textContent = `✅ Usuario #${index + 1} eliminado de la lista.`;
                 statusMessage.style.display = 'block';
            }
        });
    });
}

/* Guardar en localStorage */
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

/* Ver / Ocultar */
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

/* Borrar todo (de la lista de usuarios de prueba) */
if (btnBorrar) {
    btnBorrar.addEventListener("click", () => {
        localStorage.removeItem("usuarios");
        alert("Todos los datos de la lista de usuarios han sido eliminados.");
        
        // Si hay una lista visible, la actualizamos
        if (document.getElementById("resultado")) mostrarUsuarios(); 
    });
}

// Lógica de Borrar Lista Completa del Dashboard (si existe)
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


/* ================================================
   3. DASHBOARD (GRÁFICA)
   (Usado solo si existe el canvas "grafico")
================================================ */

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


/* ================================================
   4. LÓGICA CENTRAL DE SESIÓN (Index y Dashboard)
================================================ */

// Elementos del DOM para la lógica de sesión
const loginArea = document.getElementById("loginArea");
const welcomeArea = document.getElementById("welcomeArea");
const welcomeMessage = document.getElementById("welcomeMessage");
const sessionInfo = document.getElementById("sessionInfo");
const linkDashboard = document.getElementById("linkDashboard");
const linkCerrarSesion = document.getElementById("linkCerrarSesion");
const logoutBtn = document.getElementById("logoutBtn");
const dashboardContent = document.getElementById("dashboardContent");
const noSessionMessage = document.getElementById("noSessionMessage");
const usuariosRegistradosDiv = document.getElementById("usuariosRegistrados");


/**
 * Verifica el localStorage y actualiza la vista de la página (Index o Dashboard).
 */
function checkSession() {
    const nombreUsuario = localStorage.getItem("nombreUsuario");
    const correoUsuario = localStorage.getItem("correoUsuario");
    
    // Si estamos en la página de INICIO (index.html)
    if (welcomeArea) {
        if (nombreUsuario && correoUsuario) {
            // Sesión Activa en Inicio
            loginArea.style.display = 'none';
            welcomeArea.style.display = 'flex';
            welcomeMessage.textContent = `¡Hola, ${nombreUsuario}!`;
            sessionInfo.textContent = `Tu correo es: ${correoUsuario}`;
            linkDashboard.style.display = 'inline';
            linkCerrarSesion.style.display = 'inline';
        } else {
            // Sesión Inactiva en Inicio
            loginArea.style.display = 'block';
            welcomeArea.style.display = 'none';
            linkDashboard.style.display = 'none';
            linkCerrarSesion.style.display = 'none';
        }
    }
    
    // Si estamos en la página del DASHBOARD (dashboard.html)
    if (dashboardContent) {
        const statusMessage = document.getElementById("statusMessage");
        if (statusMessage) statusMessage.style.display = 'none'; // Ocultar mensajes de estado temporales

        if (nombreUsuario && correoUsuario) {
            // Sesión Activa en Dashboard
            dashboardContent.style.display = 'block';
            if (noSessionMessage) noSessionMessage.style.display = 'none';
            
            document.getElementById("nombreUsuario").textContent = "Bienvenido, " + nombreUsuario;
            document.getElementById("correoUsuario").textContent = "Correo: " + correoUsuario;
            
            // Mostrar lista de usuarios de prueba (si existe el contenedor)
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

// 5. EVENTOS DE CIERRE DE SESIÓN (Funciona en Index y Dashboard)
function handleLogout(e) {
    e.preventDefault(); 
    localStorage.removeItem("nombreUsuario");
    localStorage.removeItem("correoUsuario");
    
    // Si estamos en el dashboard, mostramos un mensaje de estado
    if (document.getElementById("dashboardContent")) {
        const statusMessage = document.getElementById("statusMessage");
        if (statusMessage) {
            statusMessage.className = 'message success';
            statusMessage.textContent = "✅ Sesión cerrada. Los datos de sesión locales han sido eliminados.";
            statusMessage.style.display = 'block';
        }
    }
    
    checkSession(); // Actualiza la vista de la página
}

// Añadir evento al botón de bienvenida y al enlace del nav (en Index)
if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
if (linkCerrarSesion) linkCerrarSesion.addEventListener("click", handleLogout);

// Añadir evento a los botones de cierre del Dashboard
const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
const eliminarCuentaBtn = document.getElementById("eliminarCuentaBtn");

if (cerrarSesionBtn) cerrarSesionBtn.addEventListener("click", handleLogout);

if (eliminarCuentaBtn) {
    eliminarCuentaBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.clear(); // Elimina TODOS los datos (sesión y usuarios de prueba)
        
        const statusMessage = document.getElementById("statusMessage");
        if (statusMessage) {
            statusMessage.className = 'message error';
            statusMessage.textContent = "❌ Cuenta eliminada. Todos tus datos locales han sido borrados.";
            statusMessage.style.display = 'block';
        }
        checkSession();
    });
}

// Enlaces del nav para Index y Dashboard
document.querySelectorAll("#cerrarSesion, #eliminarCuenta").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        if (link.id === "cerrarSesion") {
            handleLogout(e);
        } else if (link.id === "eliminarCuenta") {
            if (eliminarCuentaBtn) eliminarCuentaBtn.click();
        }
    });
});


/* ================================================
   EJECUCIÓN INICIAL
================================================ */
document.addEventListener("DOMContentLoaded", checkSession);
