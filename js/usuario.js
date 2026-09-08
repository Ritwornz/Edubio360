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
const mensajeUsuario = document.getElementById("mensajeUsuario");
const correoEdicion = new URLSearchParams(window.location.search).get("correo");

function obtenerError(campo) {
    const id = `error${campo.id.charAt(0).toUpperCase()}${campo.id.slice(1)}`;
    let error = document.getElementById(id);
    if (!error) {
        error = document.createElement("small");
        error.id = id;
        error.className = "mensaje-error";
        campo.insertAdjacentElement("afterend", error);
    }
    error.setAttribute("role", "alert");
    campo.setAttribute("aria-describedby", id);
    return error;
}

const camposUsuario = [run, nombre, apellidos, correo, fechaNacimiento, tipoUsuario, region, comuna, direccion].filter(Boolean).map(function (campo) {
    return { campo, error: obtenerError(campo) };
});

function correoValido(valor) {
    return /^[A-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|duocuc\.cl|gmail\.com)$/i.test(valor);
}

function validarRun(valor) {
    const limpio = valor.toUpperCase().trim();
    if (!/^\d{6,8}[\dK]$/.test(limpio)) return false;
    const cuerpo = limpio.slice(0, -1);
    const digito = limpio.slice(-1);
    let suma = 0;
    let multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const resto = 11 - suma % 11;
    const calculado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
    return calculado === digito;
}

function mostrarError(item, mensaje) {
    item.campo.setAttribute("aria-invalid", "true");
    item.error.textContent = mensaje;
    return false;
}

function validarCampo(item) {
    const campo = item.campo;
    const valor = campo.value.trim();
    campo.removeAttribute("aria-invalid");
    item.error.textContent = "";

    if (campo === run) {
        if (!valor) return mostrarError(item, "El RUN es obligatorio.");
        if (/[.-]/.test(valor)) return mostrarError(item, "Ingrese el RUN sin puntos ni guion.");
        if (!validarRun(valor)) return mostrarError(item, "El RUN ingresado no es válido.");
    }
    if (campo === nombre) {
        if (!valor) return mostrarError(item, "El nombre es obligatorio.");
        if (valor.length > 50) return mostrarError(item, "El nombre no puede superar los 50 caracteres.");
    }
    if (campo === apellidos) {
        if (!valor) return mostrarError(item, "Los apellidos son obligatorios.");
        if (valor.length > 100) return mostrarError(item, "Los apellidos no pueden superar los 100 caracteres.");
    }
    if (campo === correo) {
        if (!valor) return mostrarError(item, "El correo es obligatorio.");
        if (valor.length > 100) return mostrarError(item, "El correo no puede superar los 100 caracteres.");
        if (!correoValido(valor)) return mostrarError(item, "Ingrese un correo @duoc.cl, @profesor.duoc.cl, @duocuc.cl o @gmail.com.");
        const repetido = obtenerUsuarios().some(function (usuario) {
            return usuario.correo === valor.toLowerCase() && usuario.correo !== String(correoEdicion || "").toLowerCase();
        });
        if (repetido) return mostrarError(item, "Ya existe un usuario registrado con este correo.");
    }
    if (campo === fechaNacimiento && valor) {
        const fecha = new Date(`${valor}T00:00:00`);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fecha > hoy) return mostrarError(item, "La fecha de nacimiento no puede ser futura.");
    }
    if (campo === tipoUsuario && !valor) return mostrarError(item, "Seleccione un tipo de usuario.");
    if (campo === region && !valor) return mostrarError(item, "Seleccione una región.");
    if (campo === comuna && !valor) return mostrarError(item, "Seleccione una comuna.");
    if (campo === direccion) {
        if (!valor) return mostrarError(item, "La dirección es obligatoria.");
        if (valor.length > 300) return mostrarError(item, "La dirección no puede superar los 300 caracteres.");
    }
    return true;
}

function validarUsuario() {
    mensajeUsuario.classList.add("oculto");
    let valido = true;
    camposUsuario.forEach(function (item) {
        if (!validarCampo(item)) valido = false;
    });
    if (!valido) formUsuario.querySelector('[aria-invalid="true"]')?.focus();
    return valido;
}

function datosFormulario() {
    return {
        run: run.value.trim().toUpperCase(),
        nombre: nombre.value.trim(),
        apellidos: apellidos.value.trim(),
        correo: correo.value.trim().toLowerCase(),
        fechaNacimiento: fechaNacimiento?.value || "",
        rol: tipoUsuario ? tipoUsuario.value : "ESTUDIANTE",
        region: region.options[region.selectedIndex]?.text || region.value,
        comuna: comuna.value,
        direccion: direccion.value.trim(),
        estado: "ACTIVO"
    };
}

function cargarUsuarioEdicion() {
    if (!correoEdicion || !tipoUsuario) return;
    const usuario = buscarUsuario(correoEdicion);
    if (!usuario) {
        mensajeUsuario.textContent = "El usuario solicitado no existe.";
        mensajeUsuario.classList.remove("oculto");
        formUsuario.querySelectorAll("input, select, button").forEach(function (control) { control.disabled = true; });
        return;
    }

    run.value = usuario.run || "";
    nombre.value = usuario.nombre || "";
    apellidos.value = usuario.apellidos || "";
    correo.value = usuario.correo;
    correo.readOnly = true;
    if (fechaNacimiento) fechaNacimiento.value = usuario.fechaNacimiento || "";
    tipoUsuario.value = usuario.rol;
    direccion.value = usuario.direccion || "";

    const indiceRegion = typeof regiones !== "undefined" ? regiones.findIndex(function (item) { return item.nombre === usuario.region; }) : -1;
    if (indiceRegion >= 0) {
        region.value = String(indiceRegion);
        cargarComunas();
        comuna.value = usuario.comuna || "";
    }
}

camposUsuario.forEach(function (item) {
    const evento = item.campo.tagName === "SELECT" ? "change" : "input";
    item.campo.addEventListener(evento, function () {
        mensajeUsuario.classList.add("oculto");
        validarCampo(item);
    });
});

formUsuario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (!validarUsuario()) return;

    const datos = datosFormulario();
    if (correoEdicion && tipoUsuario) {
        const existente = buscarUsuario(correoEdicion);
        actualizarUsuario(correoEdicion, { ...datos, correo: existente.correo, estado: existente.estado });
        mensajeUsuario.textContent = "Usuario actualizado correctamente.";
    } else {
        const usuarios = obtenerUsuarios();
        usuarios.push(datos);
        guardarUsuarios(usuarios);
        mensajeUsuario.textContent = tipoUsuario ? "Usuario creado correctamente." : "Cuenta creada correctamente. Ya puedes iniciar sesión con la contraseña demo 1234.";
        if (!tipoUsuario) formUsuario.reset();
    }
    mensajeUsuario.classList.remove("oculto");
});

cargarUsuarioEdicion();
