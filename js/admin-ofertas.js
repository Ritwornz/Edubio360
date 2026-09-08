const cuerpoOfertas = document.getElementById("cuerpoOfertas");
const contadorOfertas = document.getElementById("contadorOfertas");

function textoSeguro(valor) {
    const elemento = document.createElement("span");
    elemento.textContent = String(valor ?? "");
    return elemento.innerHTML;
}

function precio(valor) {
    return Number(valor).toLocaleString("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: Number(valor) % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

function eliminarOfertaAdmin(id) {
    const oferta = buscarOferta(id);
    if (!oferta || !confirm(`¿Eliminar la oferta ${oferta.carrera} de ${oferta.institucion}?`)) return;
    guardarOfertas(obtenerOfertas().filter(function (item) { return item.id !== id; }));
    try {
        const seleccion = JSON.parse(localStorage.getItem("comparadorEduBio") || "[]");
        if (Array.isArray(seleccion)) localStorage.setItem("comparadorEduBio", JSON.stringify(seleccion.filter(function (seleccionada) { return Number(seleccionada) !== id; })));
    } catch {}
    renderizarOfertasAdmin();
    mostrarConfirmacion("Oferta eliminada. Las solicitudes anteriores conservan su historial.");
}

function renderizarOfertasAdmin() {
    ofertas = obtenerOfertas();
    contadorOfertas.textContent = `${ofertas.length} ofertas registradas`;
    cuerpoOfertas.innerHTML = ofertas.map(function (oferta) {
        const alerta = oferta.cupoCritico !== null && oferta.cupos <= oferta.cupoCritico ? " alerta-cupos" : "";
        return `<tr><td>${textoSeguro(oferta.codigo)}</td><td>${textoSeguro(oferta.carrera)}</td><td>${textoSeguro(oferta.institucion)}</td><td>${textoSeguro(oferta.sede)}</td><td>${precio(oferta.arancel)}</td><td><span class="${alerta.trim()}">${oferta.cupos}</span></td><td><div class="acciones-tabla"><a href="../detalle.html?id=${oferta.id}" class="boton boton-claro">Ver</a><a href="oferta-editar.html?id=${oferta.id}" class="boton boton-secundario">Editar</a><button type="button" class="boton boton-peligro eliminar-oferta" data-id="${oferta.id}">Eliminar</button></div></td></tr>`;
    }).join("");
    document.querySelectorAll(".eliminar-oferta").forEach(function (boton) {
        boton.addEventListener("click", function () { eliminarOfertaAdmin(Number(boton.dataset.id)); });
    });
}

renderizarOfertasAdmin();
