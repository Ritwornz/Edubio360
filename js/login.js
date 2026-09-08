const formLogin = document.getElementById("formLogin");

const correo = document.getElementById("correo");
const password = document.getElementById("password");

const errorCorreo = document.getElementById("errorCorreo");
const errorPassword = document.getElementById("errorPassword");

const mensajeLogin = document.getElementById("mensajeLogin");

errorCorreo.setAttribute("role", "alert");
errorPassword.setAttribute("role", "alert");

function correoValido(valor) {
    const expresion = /^[A-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|duocuc\.cl|gmail\.com)$/i;
    return expresion.test(valor);
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

    if (valor === "") {
        mostrarError(correo, errorCorreo, "El correo es obligatorio.");
        return false;
    }

    if (valor.length > 100) {
        mostrarError(correo, errorCorreo, "El correo no puede superar los 100 caracteres.");
        return false;
    }

    if (!correoValido(valor)) {
        mostrarError(correo, errorCorreo, "Ingrese un correo @duoc.cl, @profesor.duoc.cl, @duocuc.cl o @gmail.com.");
        return false;
    }

    return true;
}

function validarPasswordLogin() {
    limpiarCampo(password, errorPassword);

    const valor = password.value;

    if (valor === "") {
        mostrarError(password, errorPassword, "La contraseña es obligatoria.");
        return false;
    }

    if (valor.length < 4 || valor.length > 10) {
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

    const correoCorrecto = validarCorreoLogin();
    const passwordCorrecta = validarPasswordLogin();

    if (!correoCorrecto || !passwordCorrecta) {
        const primerCampoInvalido = formLogin.querySelector('[aria-invalid="true"]');

        if (primerCampoInvalido) {
            primerCampoInvalido.focus();
        }

        return;
    }

    const accesos = {
        "estudiante@duocuc.cl": { destino: "estudiante/index.html", rol: "ESTUDIANTE", nombre: "Estudiante Demo" },
        "orientador@duocuc.cl": { destino: "orientador/index.html", rol: "ORIENTADOR", nombre: "Orientador Demo" },
        "admin@duocuc.cl": { destino: "admin/index.html", rol: "ADMINISTRADOR", nombre: "Administrador Demo" }
    };
    const acceso = accesos[correo.value.trim().toLowerCase()];
    const usuario = typeof obtenerUsuarios === "function"
        ? obtenerUsuarios().find(function (item) { return item.correo === correo.value.trim().toLowerCase(); })
        : null;

    if (password.value !== "1234" || !acceso || usuario?.estado === "INACTIVO") {
        mostrarError(password, errorPassword, "Las credenciales demo no son válidas.");
        return;
    }

    sessionStorage.setItem("sesionEduBio", JSON.stringify({ correo: correo.value.trim().toLowerCase(), rol: acceso.rol, nombre: acceso.nombre }));
    window.location.href = acceso.destino;
});
