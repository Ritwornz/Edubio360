const cuerpoOfertas = document.getElementById("cuerpoOfertas");
const contadorOfertas = document.getElementById("contadorOfertas");

function textoSeguro(valor) {
    const elemento = document.createElement("span");
    elemento.textContent = String(valor ?? "");
    return elemento.innerHTML;
}

function precio(valor) {
    return Number(valor).toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

function renderizarOfertasAdmin() {
    ofertas = obtenerOfertas();
    contadorOfertas.textContent = `${ofertas.length} ofertas registradas`;
    cuerpoOfertas.innerHTML = ofertas.map(function (oferta) {
        return `<tr><td>${textoSeguro(oferta.codigo)}</td><td>${textoSeguro(oferta.carrera)}</td><td>${textoSeguro(oferta.institucion)}</td><td>${textoSeguro(oferta.sede)}</td><td>${precio(oferta.arancel)}</td><td><div class="acciones-tabla"><a href="../detalle.html?id=${oferta.id}" class="boton boton-claro">Ver</a><a href="oferta-editar.html?id=${oferta.id}" class="boton boton-secundario">Editar</a></div></td></tr>`;
    }).join("");
}

renderizarOfertasAdmin();
