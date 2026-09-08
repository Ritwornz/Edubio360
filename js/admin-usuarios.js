const cuerpoUsuarios = document.getElementById("cuerpoUsuarios");

function textoSeguro(valor) {
    const elemento = document.createElement("span");
    elemento.textContent = String(valor ?? "");
    return elemento.innerHTML;
}

function renderizarUsuarios() {
    cuerpoUsuarios.innerHTML = obtenerUsuarios().map(function (usuario) {
        const correo = textoSeguro(usuario.correo);
        return `<tr><td>${textoSeguro(usuario.run)}</td><td>${textoSeguro(usuario.nombre)}</td><td>${correo}</td><td><select class="campo rol-usuario" data-correo="${correo}"><option>ESTUDIANTE</option><option>ORIENTADOR</option><option>ADMINISTRADOR</option></select></td><td><span class="badge">${textoSeguro(usuario.estado)}</span></td><td><button class="boton boton-secundario cambiar-estado" data-correo="${correo}">${usuario.estado === "ACTIVO" ? "Desactivar" : "Activar"}</button></td></tr>`;
    }).join("");
    obtenerUsuarios().forEach(function (usuario, indice) {
        document.querySelectorAll(".rol-usuario")[indice].value = usuario.rol;
    });
    document.querySelectorAll(".rol-usuario").forEach(function (select) {
        select.addEventListener("change", function () { actualizarUsuario(select.dataset.correo, { rol: select.value }); });
    });
    document.querySelectorAll(".cambiar-estado").forEach(function (boton) {
        boton.addEventListener("click", function () {
            const usuario = obtenerUsuarios().find(function (item) { return item.correo === boton.dataset.correo; });
            actualizarUsuario(usuario.correo, { estado: usuario.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO" });
            renderizarUsuarios();
        });
    });
}

renderizarUsuarios();
