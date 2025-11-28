/* ================================================
    1. LÓGICA DEL MODAL/VENTANA EMERGENTE 
    ================================================
*/
const modal = document.querySelector(".modal"); // El modal
const overlay = document.querySelector(".overlay"); // El fondo oscuro
const openModalBtn = document.querySelectorAll(".btn-open"); // Botones abrir
const closeModalBtn = document.querySelector(".btn-close"); // Botón cerrar

/* Función para ABRIR el modal */
const openModal = function () {
  modal.classList.remove("hidden"); // Muestra el modal
  overlay.classList.remove("hidden"); // Muestra el overlay
};
/* Evento: cuando el usuario hace click en los botones, se abre el modal */
openModalBtn.forEach(btn => btn.addEventListener("click", openModal));

/* Función para CERRAR el modal */
const closeModal = function () {
  modal.classList.add("hidden"); // Oculta el modal
  overlay.classList.add("hidden"); // Oculta el overlay
};

/* Eventos para cerrar el modal */
closeModalBtn.addEventListener("click", closeModal); // Botón de cerrar dentro del modal
overlay.addEventListener("click", closeModal); // Cerrar haciendo clic en el overlay
document.addEventListener("keydown", function (e) { // Cerrar con la tecla Escape
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

/* ================================================
    2. LÓGICA DEL FORMULARIO Y LOCALSTORAGE
    ================================================
*/

// ====== REFERENCIAS A LOS BOTONES ======
const btnGuardar = document.getElementById("btnGuardar");
const btnVer = document.getElementById("btnVer");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnBorrar = document.getElementById("btnBorrar");

// ==== FUNCION PARA LIMPIAR FORMULARIO ====
function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("email").value = "";
  document.getElementById("edad").value = "";
  // Limpiar mensajes de error
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
}

// ==== FUNCIÓN PARA MOSTRAR USUARIOS ====
function mostrarUsuarios() {
  const resultado = document.getElementById("resultado");
  const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuariosGuardados.length === 0) {
    // Si no hay usuarios
    resultado.style.display = "none";
    resultado.innerHTML = "";
    btnVer.textContent = "Ver Datos";
    return;
  }

  // Generar HTML para mostrar usuarios
  let html = "<h3>Usuarios Guardados:</h3>";
  usuariosGuardados.forEach((u, i) => {
    html += `
            <div class="usuario" data-index="${i}">
                <p><strong>Usuario #${i + 1}</strong></p>
                <p><strong>Nombre:</strong> ${u.nombre}</p>
                <p><strong>Email:</strong> ${u.email}</p>
                <p><strong>Edad:</strong> ${u.edad}</p>
                <button class="btn-borrar-individual" data-index="${i}">Borrar Usuario</button>
            </div>
            <hr>
        `;
  });

  resultado.innerHTML = html;
  resultado.style.display = "block";
  btnVer.textContent = "Ocultar Datos";

  // Botones de borrar individual - se tienen que añadir después de crear el HTML
  const botonesBorrar = document.querySelectorAll(".btn-borrar-individual");
  botonesBorrar.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Pedir confirmación antes de borrar
      if (!confirm("¿Estás seguro de que quieres borrar este usuario?")) {
        return;
      }
      
      const index = parseInt(e.target.getAttribute("data-index"));
      
      // La lista se debe obtener de nuevo por si se ha modificado en otro lugar
      let currentUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      currentUsuarios.splice(index, 1); // Borrar el usuario por índice
      localStorage.setItem("usuarios", JSON.stringify(currentUsuarios));
      
      mostrarUsuarios(); // refresca la lista automáticamente
      alert("Usuario eliminado.");
    });
  });
}


// ==== GUARDAR DATOS ====
btnGuardar.addEventListener("click", () => {
  // 1. Limpiar errores previos
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));

  // 2. Obtener y sanear valores
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const edad = document.getElementById("edad").value.trim();

  let valido = true;

  // 3. Validaciones
  if (nombre === "") {
    document.getElementById("error-nombre").textContent = "El nombre es obligatorio.";
    valido = false;
  }

  if (email === "") {
    document.getElementById("error-email").textContent = "El email es obligatorio.";
    valido = false;
  } else if (!email.includes("@") || !email.includes(".")) {
    document.getElementById("error-email").textContent = "Ingrese un email válido.";
    valido = false;
  }

  if (edad === "") {
    document.getElementById("error-edad").textContent = "La edad es obligatoria.";
    valido = false;
  } else if (isNaN(edad) || Number(edad) <= 0) { // Usar Number(edad) para la comparación
    document.getElementById("error-edad").textContent = "Ingrese una edad válida.";
    valido = false;
  }

  // 4. Si es válido, guardar
  if (valido) {
    const usuario = { nombre, email, edad: Number(edad) }; // Guardar edad como número
    let listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    listaUsuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
    alert("✅ Datos guardados correctamente en LocalStorage.");
    limpiarFormulario();

    // Refrescar la lista de usuarios si está visible
    const resultado = document.getElementById("resultado");
    if (resultado.style.display === "block") {
      mostrarUsuarios();
    }
  }
});

// ==== BOTÓN VER/OCULTAR DATOS ====
btnVer.addEventListener("click", () => {
  const resultado = document.getElementById("resultado");

  if (resultado.style.display === "block") {
    // Ocultar lista
    resultado.style.display = "none";
    resultado.innerHTML = "";
    btnVer.textContent = "Ver Datos";
  } else {
    // Mostrar lista (incluye comprobación de si hay datos dentro de la función)
    mostrarUsuarios();
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuariosGuardados.length > 0) {
       btnVer.textContent = "Ocultar Datos";
    }
  }
});

// ==== LIMPIAR FORMULARIO ====
btnLimpiar.addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const edad = document.getElementById("edad").value;

  const errores = [...document.querySelectorAll(".error")];
  const hayErrores = errores.some((e) => e.textContent.trim() !== "");

  const todoVacio =
    nombre.trim() === "" &&
    email.trim() === "" &&
    edad.trim() === "" &&
    !hayErrores;

  if (todoVacio) {
    alert("No hay nada que limpiar.");
    return;
  }

  limpiarFormulario();
  alert("Formulario limpiado.");
});

// ==== BORRAR TODOS LOS DATOS DE LOCALSTORAGE ====
btnBorrar.addEventListener("click", () => {
  const usuarios = JSON.parse(localStorage.getItem("usuarios"));

  if (!usuarios || usuarios.length === 0) {
    alert("⚠ No hay datos para borrar.");
    return;
  }
  
  if (!confirm("⚠️ ¿Estás seguro de que quieres borrar TODOS los datos de LocalStorage? Esta acción no se puede deshacer.")) {
    return;
  }

  localStorage.removeItem("usuarios");
  document.getElementById("resultado").innerHTML = "";
  document.getElementById("resultado").style.display = "none";
  btnVer.textContent = "Ver Datos";
  alert("✅ Todos los datos han sido borrados del LocalStorage.");
});
