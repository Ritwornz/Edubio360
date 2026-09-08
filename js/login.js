const formLogin = document.getElementById("formLogin");
const correo = document.getElementById("correo");
const password = document.getElementById("password");
const errorCorreo = document.getElementById("errorCorreo");
const errorPassword = document.getElementById("errorPassword");
const mensajeLogin = document.getElementById("mensajeLogin");

errorCorreo.setAttribute("role", "alert");
errorPassword.setAttribute("role", "alert");

function correoValido(valor) {
    return /^[A-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(valor);
}

function limpiarCampo(campo, error) {
    campo.removeAttribute("aria-invalid");
    error.textContent = "";
}

function mostrarError(campo, error, mensaje) {
    campo.setAttribute("aria-invalid", "true");
    error.textContent = mensaje;
}

function validarCorreoLogin() {
    limpiarCampo(correo, errorCorreo);
    const valor = correo.value.trim();
    if (!valor) {
        mostrarError(correo, errorCorreo, "El correo es obligatorio.");
        return false;
    }
    if (valor.length > 100) {
        mostrarError(correo, errorCorreo, "El correo no puede superar los 100 caracteres.");
        return false;
    }
    if (!correoValido(valor)) {
        mostrarError(correo, errorCorreo, "Ingrese un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        return false;
    }
    return true;
}

function validarPasswordLogin() {
    limpiarCampo(password, errorPassword);
    if (!password.value) {
        mostrarError(password, errorPassword, "La contraseña es obligatoria.");
        return false;
    }
    if (password.value.length < 4 || password.value.length > 10) {
        mostrarError(password, errorPassword, "La contraseña debe tener entre 4 y 10 caracteres.");
        return false;
    }
    return true;
}

correo.addEventListener("input", function () {
    mensajeLogin.classList.add("oculto");
    validarCorreoLogin();
});

password.addEventListener("input", function () {
    mensajeLogin.classList.add("oculto");
    validarPasswordLogin();
});

formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (!validarCorreoLogin() || !validarPasswordLogin()) {
        formLogin.querySelector('[aria-invalid="true"]')?.focus();
        return;
    }

    const usuario = buscarUsuario(correo.value);
    if (!usuario || usuario.estado !== "ACTIVO" || password.value !== "1234") {
        mostrarError(password, errorPassword, "Las credenciales no son válidas o el usuario está inactivo.");
        return;
    }

    const destinos = {
        ESTUDIANTE: "estudiante/index.html",
        ORIENTADOR: "orientador/index.html",
        ADMINISTRADOR: "admin/index.html"
    };
    const nombreCompleto = `${usuario.nombre} ${usuario.apellidos || ""}`.trim();
    sessionStorage.setItem("sesionEduBio", JSON.stringify({ correo: usuario.correo, rol: usuario.rol, nombre: nombreCompleto }));
    mensajeLogin.classList.remove("oculto");

    const retorno = sessionStorage.getItem("retornoEduBio");
    sessionStorage.removeItem("retornoEduBio");
    if (retorno) {
        try {
            const url = new URL(retorno);
            if (url.origin === window.location.origin) {
                window.location.href = retorno;
                return;
            }
        } catch {}
    }

    window.location.href = destinos[usuario.rol] || "index.html";
});
