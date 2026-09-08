const cuerpoUsuarios = document.getElementById("cuerpoUsuarios");

function textoSeguro(valor) {
    const elemento = document.createElement("span");
    elemento.textContent = String(valor ?? "");
    return elemento.innerHTML;
}

function renderizarUsuarios() {
    const usuarios = obtenerUsuarios();
    cuerpoUsuarios.innerHTML = usuarios.map(function (usuario) {
        const correo = textoSeguro(usuario.correo);
        return `<tr><td>${textoSeguro(usuario.run)}</td><td>${textoSeguro(`${usuario.nombre} ${usuario.apellidos || ""}`.trim())}</td><td>${correo}</td><td><select class="campo rol-usuario" data-correo="${correo}"><option value="ESTUDIANTE">Estudiante</option><option value="ORIENTADOR">Orientador</option><option value="ADMINISTRADOR">Administrador</option></select></td><td><span class="badge">${textoSeguro(usuario.estado)}</span></td><td><div class="acciones-tabla"><a class="boton boton-claro" href="usuario-editar.html?correo=${encodeURIComponent(usuario.correo)}">Editar</a><button class="boton boton-secundario cambiar-estado" data-correo="${correo}">${usuario.estado === "ACTIVO" ? "Desactivar" : "Activar"}</button></div></td></tr>`;
    }).join("");

    usuarios.forEach(function (usuario, indice) {
        document.querySelectorAll(".rol-usuario")[indice].value = usuario.rol;
    });

    document.querySelectorAll(".rol-usuario").forEach(function (select) {
        select.addEventListener("change", function () {
            actualizarUsuario(select.dataset.correo, { rol: select.value });
        });
    });

    document.querySelectorAll(".cambiar-estado").forEach(function (boton) {
        boton.addEventListener("click", function () {
            const usuario = buscarUsuario(boton.dataset.correo);
            if (!usuario) return;
            actualizarUsuario(usuario.correo, { estado: usuario.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO" });
            renderizarUsuarios();
        });
    });
}

renderizarUsuarios();
