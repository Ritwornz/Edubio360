const contenedorDestacadas = document.getElementById("ofertasDestacadas");
const gruposDestacados = ["Ingeniería Informática", "Enfermería", "Ingeniería Comercial"];
const destacadas = gruposDestacados.map(function (grupo) {
    return ofertas.find(function (oferta) { return oferta.grupoComparacion === grupo; });
}).filter(Boolean);

function precioHome(valor) {
    return Number(valor).toLocaleString("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: Number(valor) % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

contenedorDestacadas.innerHTML = destacadas.map(function (oferta) {
    return `<article class="tarjeta tarjeta-oferta"><img src="${oferta.imagen}" alt="${oferta.carrera}" class="oferta-imagen"><div class="oferta-contenido"><span class="badge">${oferta.grupoComparacion}</span><h3 class="tarjeta-titulo">${oferta.carrera}</h3><p>${oferta.institucion}</p><p><strong>Sede:</strong> ${oferta.sede}</p><p><strong>Arancel:</strong> ${precioHome(oferta.arancel)}</p><div class="oferta-acciones"><a href="detalle.html?id=${oferta.id}" class="boton boton-primario">Ver detalle</a><a href="catalogo.html?carrera=${encodeURIComponent(oferta.grupoComparacion)}" class="boton boton-claro">Comparar alternativas</a></div></div></article>`;
}).join("");
