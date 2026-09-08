const contenedorDetalle = document.getElementById("detalleOferta");
const idOferta = Number(new URLSearchParams(window.location.search).get("id"));
const oferta = ofertas.find(function (item) { return item.id === idOferta; });

function formatearPrecio(valor) {
    return Number(valor).toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

function agregarAComparar() {
    if (!agregarOfertaAlComparador(oferta.id)) {
        const mensajes = {
            duplicado: "Esta oferta ya está en el comparador.",
            maximo: "Puedes comparar hasta tres ofertas a la vez.",
            grupo: "Selecciona ofertas de la misma carrera o grupo para compararlas.",
            inexistente: "La oferta no está disponible."
        };
        alert(mensajes[obtenerErrorComparador()] || "No fue posible agregar la oferta.");
        return;
    }
    alert("Oferta agregada. Busca otra alternativa de la misma carrera para comparar.");
}

if (!oferta) {
    contenedorDetalle.innerHTML = '<div class="estado-vacio"><h2>Oferta no encontrada</h2><p>La oferta académica solicitada no existe.</p><a href="catalogo.html" class="boton boton-primario">Volver al catálogo</a></div>';
} else {
    contenedorDetalle.innerHTML = `<article class="detalle-oferta"><div><img src="${oferta.imagen}" alt="${oferta.carrera}" class="detalle-imagen"></div><div class="detalle-contenido"><span class="badge">${oferta.grupoComparacion}</span><h1>${oferta.carrera}</h1><h2>${oferta.institucion}</h2><div class="detalle-datos"><p><strong>Sede:</strong> ${oferta.sede}</p><p><strong>Modalidad:</strong> ${oferta.modalidad}</p><p><strong>Jornada:</strong> ${oferta.jornada}</p><p><strong>Duración:</strong> ${oferta.duracion}</p><p><strong>Matrícula:</strong> ${formatearPrecio(oferta.matricula)}</p><p><strong>Arancel:</strong> ${formatearPrecio(oferta.arancel)}</p></div><button type="button" class="boton boton-primario" id="btnComparar">Agregar a comparar</button><a href="catalogo.html?carrera=${encodeURIComponent(oferta.grupoComparacion)}" class="boton boton-claro">Ver instituciones comparables</a><a href="solicitud.html?oferta=${oferta.id}" class="boton boton-secundario">Solicitar orientación</a><a href="mapa.html?sede=${encodeURIComponent(oferta.sede)}" class="boton boton-claro">Ver sede en mapa</a></div></article>`;
    document.getElementById("btnComparar").addEventListener("click", agregarAComparar);
}
