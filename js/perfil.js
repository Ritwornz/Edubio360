const sesionPerfil = obtenerSesion();
const usuarioPerfil = buscarUsuario(sesionPerfil?.correo);
const formPerfil = document.getElementById("formPerfil");
const mensajePerfil = document.getElementById("mensajePerfil");

function cargarPerfil() {
    if (!usuarioPerfil) return;
    ["nombre", "apellidos", "correo", "run", "region", "comuna", "direccion", "rol"].forEach(function (id) {
        const campo = document.getElementById(id);
        if (campo) campo.value = usuarioPerfil[id] || "";
    });
}

formPerfil.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const run = document.getElementById("run").value.trim().toUpperCase();
    const region = document.getElementById("region").value.trim();
    const comuna = document.getElementById("comuna").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    if (!nombre || !apellidos || !run || !region || !comuna || !direccion) {
        mensajePerfil.textContent = "Completa los campos obligatorios.";
        mensajePerfil.classList.remove("oculto");
        return;
    }
    const actualizado = actualizarUsuario(sesionPerfil.correo, { nombre, apellidos, run, region, comuna, direccion });
    sessionStorage.setItem("sesionEduBio", JSON.stringify({ ...sesionPerfil, nombre: `${actualizado.nombre} ${actualizado.apellidos}`.trim() }));
    mensajePerfil.textContent = "Perfil actualizado correctamente.";
    mensajePerfil.classList.remove("oculto");
});

cargarPerfil();
