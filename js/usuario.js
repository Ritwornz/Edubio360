const formUsuario = document.getElementById("formUsuario");

const run = document.getElementById("run");
const nombre = document.getElementById("nombre");
const apellidos = document.getElementById("apellidos");
const correo = document.getElementById("correo");
const fechaNacimiento = document.getElementById("fechaNacimiento");
const tipoUsuario = document.getElementById("tipoUsuario");
const region = document.getElementById("region");
const comuna = document.getElementById("comuna");
const direccion = document.getElementById("direccion");

const errorRun = document.getElementById("errorRun");
const errorNombre = document.getElementById("errorNombre");
const errorApellidos = document.getElementById("errorApellidos");
const errorCorreo = document.getElementById("errorCorreo");
const errorFechaNacimiento = document.createElement("small");
const errorTipoUsuario = document.getElementById("errorTipoUsuario");
const errorRegion = document.getElementById("errorRegion");
const errorComuna = document.getElementById("errorComuna");
const errorDireccion = document.getElementById("errorDireccion");

const mensajeUsuario = document.getElementById("mensajeUsuario");

errorFechaNacimiento.id = "errorFechaNacimiento";
errorFechaNacimiento.className = "mensaje-error";
fechaNacimiento.insertAdjacentElement("afterend", errorFechaNacimiento);
fechaNacimiento.setAttribute("aria-describedby", errorFechaNacimiento.id);

const camposUsuario = [
    [run, errorRun],
    [nombre, errorNombre],
    [apellidos, errorApellidos],
    [correo, errorCorreo],
    [fechaNacimiento, errorFechaNacimiento],
    [tipoUsuario, errorTipoUsuario],
    [region, errorRegion],
    [comuna, errorComuna],
    [direccion, errorDireccion]
];

camposUsuario.forEach(function ([campo, error]) {
    error.setAttribute("role", "alert");

    if (!campo.hasAttribute("aria-describedby")) {
        campo.setAttribute("aria-describedby", error.id);
    }
});

function correoValido(valor) {
    const expresion = /^[A-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

    return expresion.test(valor);
}

function validarRun(valor) {
    valor = valor.toUpperCase().trim();

    if (!/^[0-9]{6,8}[0-9K]$/.test(valor)) {
        return false;
    }

    const cuerpo = valor.slice(0, -1);
    const digitoIngresado = valor.slice(-1);

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplicador;

        multiplicador++;

        if (multiplicador > 7) {
            multiplicador = 2;
        }
    }

    const resto = 11 - (suma % 11);

    let digitoCalculado;

    if (resto === 11) {
        digitoCalculado = "0";
    } else if (resto === 10) {
        digitoCalculado = "K";
    } else {
        digitoCalculado = String(resto);
    }

    return digitoCalculado === digitoIngresado;
}

function limpiarErrores() {
    camposUsuario.forEach(function ([campo, error]) {
        campo.removeAttribute("aria-invalid");
        error.textContent = "";
    });

    mensajeUsuario.classList.add("oculto");
}

function mostrarError(campo, error, mensaje) {
    campo.setAttribute("aria-invalid", "true");
    error.textContent = mensaje;
}

function validarUsuario() {
    limpiarErrores();

    let valido = true;

    const valorRun = run.value.trim();
    const valorNombre = nombre.value.trim();
    const valorApellidos = apellidos.value.trim();
    const valorCorreo = correo.value.trim();
    const valorFechaNacimiento = fechaNacimiento.value;
    const valorDireccion = direccion.value.trim();

    if (valorRun === "") {
        mostrarError(run, errorRun, "El RUN es obligatorio.");
        valido = false;
    } else if (valorRun.includes(".") || valorRun.includes("-")) {
        mostrarError(run, errorRun, "Ingrese el RUN sin puntos ni guion.");
        valido = false;
    } else if (!validarRun(valorRun)) {
        mostrarError(run, errorRun, "El RUN ingresado no es válido.");
        valido = false;
    }

    if (valorNombre === "") {
        mostrarError(nombre, errorNombre, "El nombre es obligatorio.");
        valido = false;
    } else if (valorNombre.length > 50) {
        mostrarError(nombre, errorNombre, "El nombre no puede superar los 50 caracteres.");
        valido = false;
    }

    if (valorApellidos === "") {
        mostrarError(apellidos, errorApellidos, "Los apellidos son obligatorios.");
        valido = false;
    } else if (valorApellidos.length > 100) {
        mostrarError(apellidos, errorApellidos, "Los apellidos no pueden superar los 100 caracteres.");
        valido = false;
    }

    if (valorCorreo === "") {
        mostrarError(correo, errorCorreo, "El correo es obligatorio.");
        valido = false;
    } else if (valorCorreo.length > 100) {
        mostrarError(correo, errorCorreo, "El correo no puede superar los 100 caracteres.");
        valido = false;
    } else if (!correoValido(valorCorreo)) {
        mostrarError(correo, errorCorreo, "Ingrese un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        valido = false;
    }

    if (tipoUsuario.value === "") {
        mostrarError(tipoUsuario, errorTipoUsuario, "Seleccione un tipo de usuario.");
        valido = false;
    }

    if (valorFechaNacimiento === "") {
        mostrarError(fechaNacimiento, errorFechaNacimiento, "La fecha de nacimiento es obligatoria.");
        valido = false;
    } else {
        const fechaIngresada = new Date(`${valorFechaNacimiento}T00:00:00`);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaIngresada > hoy) {
            mostrarError(fechaNacimiento, errorFechaNacimiento, "La fecha de nacimiento no puede ser futura.");
            valido = false;
        }
    }

    if (region.value === "") {
        mostrarError(region, errorRegion, "Seleccione una región.");
        valido = false;
    }

    if (comuna.value === "") {
        mostrarError(comuna, errorComuna, "Seleccione una comuna.");
        valido = false;
    }

    if (valorDireccion === "") {
        mostrarError(direccion, errorDireccion, "La dirección es obligatoria.");
        valido = false;
    } else if (valorDireccion.length > 300) {
        mostrarError(direccion, errorDireccion, "La dirección no puede superar los 300 caracteres.");
        valido = false;
    }

    if (!valido) {
        const primerCampoInvalido = formUsuario.querySelector('[aria-invalid="true"]');
        primerCampoInvalido.focus();
    }

    return valido;
}

formUsuario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (validarUsuario()) {
        mensajeUsuario.classList.remove("oculto");
    }
});
