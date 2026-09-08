const CLAVE_SESION = "sesionEduBio";
const CLAVE_RETORNO = "retornoEduBio";

function obtenerSesion() {
    try {
        return JSON.parse(sessionStorage.getItem(CLAVE_SESION));
    } catch {
        return null;
    }
}

function prefijoRaiz() {
    return document.body.dataset.login || "";
}

function destinoRol(rol) {
    const destinos = {
        ESTUDIANTE: "estudiante/index.html",
        ORIENTADOR: "orientador/index.html",
        ADMINISTRADOR: "admin/index.html"
    };
    return destinos[rol] || "login.html";
}

function cerrarSesion() {
    sessionStorage.removeItem(CLAVE_SESION);
    sessionStorage.removeItem(CLAVE_RETORNO);
    window.location.href = `${prefijoRaiz()}login.html`;
}

function protegerPagina() {
    const rolRequerido = document.body.dataset.rol;
    if (!rolRequerido) return true;

    const sesion = obtenerSesion();
    if (!sesion) {
        sessionStorage.setItem(CLAVE_RETORNO, window.location.href);
        window.location.replace(`${prefijoRaiz()}login.html`);
        return false;
    }

    if (sesion.rol !== rolRequerido) {
        window.location.replace(`${prefijoRaiz()}${destinoRol(sesion.rol)}`);
        return false;
    }

    return true;
}

function ajustarNavegacionPublica() {
    if (document.body.dataset.rol) return;
    const sesion = obtenerSesion();
    if (!sesion) return;

    document.querySelectorAll('a[href="login.html"]').forEach(function (enlace) {
        enlace.href = destinoRol(sesion.rol);
        enlace.textContent = "Mi panel";
    });

    document.querySelectorAll('a[href="registro.html"]').forEach(function (enlace) {
        const item = enlace.closest("li");
        if (item) item.remove();
        else enlace.remove();
    });

    const lista = document.querySelector(".nav-links");
    if (lista && !lista.querySelector(".cerrar-sesion")) {
        const item = document.createElement("li");
        const enlace = document.createElement("a");
        enlace.href = "login.html";
        enlace.className = "cerrar-sesion";
        enlace.textContent = "Cerrar sesión";
        item.appendChild(enlace);
        lista.appendChild(item);
    }
}

function prepararMenuMovil() {
    const contenedor = document.querySelector(".navbar-contenido");
    const navegacion = contenedor?.querySelector("nav");
    if (!contenedor || !navegacion || contenedor.querySelector(".menu-toggle")) return;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "menu-toggle";
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-label", "Abrir menú");
    boton.textContent = "Menú";
    contenedor.insertBefore(boton, navegacion);

    boton.addEventListener("click", function () {
        const abierto = navegacion.classList.toggle("nav-abierto");
        boton.setAttribute("aria-expanded", String(abierto));
        boton.textContent = abierto ? "Cerrar" : "Menú";
    });
}

function cargarAjustesVisuales() {
    if (document.querySelector('link[href$="ajustes.css"]')) return;
    const enlace = document.createElement("link");
    enlace.rel = "stylesheet";
    enlace.href = `${prefijoRaiz()}css/ajustes.css`;
    document.head.appendChild(enlace);
}

function activarCierreSesion() {
    document.querySelectorAll(".cerrar-sesion").forEach(function (enlace) {
        if (enlace.dataset.cierrePreparado) return;
        enlace.dataset.cierrePreparado = "true";
        enlace.addEventListener("click", function (evento) {
            evento.preventDefault();
            cerrarSesion();
        });
    });
}

function actualizarContadorSeleccion() {
    let cantidad = 0;
    try {
        const seleccion = JSON.parse(localStorage.getItem("comparadorEduBio"));
        cantidad = Array.isArray(seleccion) ? seleccion.length : 0;
    } catch {}
    document.querySelectorAll('a[href$="comparar.html"]').forEach(function (enlace) {
        enlace.textContent = `Mi selección (${cantidad})`;
        enlace.setAttribute("aria-label", `Mi selección, ${cantidad} oferta${cantidad === 1 ? "" : "s"}`);
    });
}

if (protegerPagina()) {
    cargarAjustesVisuales();
    ajustarNavegacionPublica();
    prepararMenuMovil();
    activarCierreSesion();
    actualizarContadorSeleccion();
}
