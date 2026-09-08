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
let errorFechaNacimiento = document.getElementById("errorFechaNacimiento");
const errorTipoUsuario = document.getElementById("errorTipoUsuario");
const errorRegion = document.getElementById("errorRegion");
const errorComuna = document.getElementById("errorComuna");
const errorDireccion = document.getElementById("errorDireccion");

const mensajeUsuario = document.getElementById("mensajeUsuario");

if (!errorFechaNacimiento) {
    errorFechaNacimiento = document.createElement("small");
    errorFechaNacimiento.id = "errorFechaNacimiento";
    errorFechaNacimiento.className = "mensaje-error";
    fechaNacimiento.insertAdjacentElement("afterend", errorFechaNacimiento);
}

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
].filter(function ([campo, error]) {
    return campo && error;
});

camposUsuario.forEach(function ([campo, error]) {
    error.setAttribute("role", "alert");

    if (!campo.hasAttribute("aria-describedby")) {
        campo.setAttribute("aria-describedby", error.id);
    }
});

function correoValido(valor) {
    const expresion = /^[A-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|duocuc\.cl|gmail\.com)$/i;
    return expresion.test(valor);
}

function validarRun(valor) {
    valor = valor.toUpperCase().trim();

    if (!/^\d{6,8}[\dK]$/.test(valor)) {
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

function limpiarCampo(campo, error) {
    campo.removeAttribute("aria-invalid");
    error.textContent = "";
}

function mostrarError(campo, error, mensaje) {
    campo.setAttribute("aria-invalid", "true");
    error.textContent = mensaje;
}

function validarCampoUsuario(campo) {
    const par = camposUsuario.find(function ([campoActual]) {
        return campoActual === campo;
    });

    if (!par) {
        return true;
    }

    const error = par[1];
    limpiarCampo(campo, error);

    const valor = campo.value.trim();

    if (campo === run) {
        if (valor === "") {
            mostrarError(run, errorRun, "El RUN es obligatorio.");
            return false;
        }

        if (valor.includes(".") || valor.includes("-")) {
            mostrarError(run, errorRun, "Ingrese el RUN sin puntos ni guion.");
            return false;
        }

        if (!validarRun(valor)) {
            mostrarError(run, errorRun, "El RUN ingresado no es válido.");
            return false;
        }
    }

    if (campo === nombre) {
        if (valor === "") {
            mostrarError(nombre, errorNombre, "El nombre es obligatorio.");
            return false;
        }

        if (valor.length > 50) {
            mostrarError(nombre, errorNombre, "El nombre no puede superar los 50 caracteres.");
            return false;
        }
    }

    if (campo === apellidos) {
        if (valor === "") {
            mostrarError(apellidos, errorApellidos, "Los apellidos son obligatorios.");
            return false;
        }

        if (valor.length > 100) {
            mostrarError(apellidos, errorApellidos, "Los apellidos no pueden superar los 100 caracteres.");
            return false;
        }
    }

    if (campo === correo) {
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
    }

    if (campo === fechaNacimiento && valor !== "") {
        const fechaIngresada = new Date(`${valor}T00:00:00`);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaIngresada > hoy) {
            mostrarError(fechaNacimiento, errorFechaNacimiento, "La fecha de nacimiento no puede ser futura.");
            return false;
        }
    }

    if (campo === tipoUsuario && tipoUsuario && valor === "") {
        mostrarError(tipoUsuario, errorTipoUsuario, "Seleccione un tipo de usuario.");
        return false;
    }

    if (campo === region && valor === "") {
        mostrarError(region, errorRegion, "Seleccione una región.");
        return false;
    }

    if (campo === comuna && valor === "") {
        mostrarError(comuna, errorComuna, "Seleccione una comuna.");
        return false;
    }

    if (campo === direccion) {
        if (valor === "") {
            mostrarError(direccion, errorDireccion, "La dirección es obligatoria.");
            return false;
        }

        if (valor.length > 300) {
            mostrarError(direccion, errorDireccion, "La dirección no puede superar los 300 caracteres.");
            return false;
        }
    }

    return true;
}

function validarUsuario() {
    mensajeUsuario.classList.add("oculto");

    let valido = true;

    camposUsuario.forEach(function ([campo]) {
        if (!validarCampoUsuario(campo)) {
            valido = false;
        }
    });

    if (!valido) {
        const primerCampoInvalido = formUsuario.querySelector('[aria-invalid="true"]');

        if (primerCampoInvalido) {
            primerCampoInvalido.focus();
        }
    }

    return valido;
}

camposUsuario.forEach(function ([campo]) {
    const evento = campo.tagName === "SELECT" ? "change" : "input";

    campo.addEventListener(evento, function () {
        mensajeUsuario.classList.add("oculto");
        validarCampoUsuario(campo);
    });
});

formUsuario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (validarUsuario()) {
        if (typeof obtenerUsuarios === "function" && tipoUsuario) {
            const usuarios = obtenerUsuarios();
            const datos = {
                run: run.value.trim(),
                nombre: `${nombre.value.trim()} ${apellidos.value.trim()}`,
                correo: correo.value.trim().toLowerCase(),
                rol: tipoUsuario.value,
                region: region.options[region.selectedIndex].text,
                comuna: comuna.value,
                estado: "ACTIVO"
            };
            const indice = usuarios.findIndex(function (usuario) { return usuario.correo === datos.correo; });
            if (indice >= 0) usuarios[indice] = { ...usuarios[indice], ...datos };
            else usuarios.push(datos);
            guardarUsuarios(usuarios);
        }
        mensajeUsuario.classList.remove("oculto");
    }
});
