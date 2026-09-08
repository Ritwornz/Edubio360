const sesionPerfil = obtenerSesion();
const usuarioPerfil = obtenerUsuarios().find(function (usuario) { return usuario.correo === sesionPerfil?.correo; });
const formPerfil = document.getElementById("formPerfil");

if (usuarioPerfil) {
    ["nombre", "correo", "run", "region", "comuna", "rol"].forEach(function (campo) {
        document.getElementById(campo).value = usuarioPerfil[campo] || "";
    });
}

formPerfil.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const actualizado = actualizarUsuario(sesionPerfil.correo, {
        nombre: document.getElementById("nombre").value.trim(),
        run: document.getElementById("run").value.trim(),
        region: document.getElementById("region").value.trim(),
        comuna: document.getElementById("comuna").value.trim()
    });
    sessionStorage.setItem("sesionEduBio", JSON.stringify({ ...sesionPerfil, nombre: actualizado.nombre }));
    document.getElementById("mensajePerfil").classList.remove("oculto");
});
