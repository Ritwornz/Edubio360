const CLAVE_SESION = "sesionEduBio";

function obtenerSesion() {
    try {
        return JSON.parse(sessionStorage.getItem(CLAVE_SESION));
    } catch {
        return null;
    }
}

function cerrarSesion() {
    sessionStorage.removeItem(CLAVE_SESION);
    const prefijo = document.body.dataset.login || "";
    window.location.href = `${prefijo}login.html`;
}

const rolRequerido = document.body.dataset.rol;
if (rolRequerido) {
    const sesionActual = obtenerSesion();
    if (!sesionActual) {
        window.location.replace(`${document.body.dataset.login || ""}login.html`);
    } else if (sesionActual.rol !== rolRequerido) {
        const destinos = { ESTUDIANTE: "estudiante/index.html", ORIENTADOR: "orientador/index.html", ADMINISTRADOR: "admin/index.html" };
        const prefijo = document.body.dataset.login || "";
        window.location.replace(`${prefijo}${destinos[sesionActual.rol] || "login.html"}`);
    }
}

document.querySelectorAll(".cerrar-sesion").forEach(function (enlace) {
    enlace.addEventListener("click", function (evento) {
        evento.preventDefault();
        cerrarSesion();
    });
});
