const coordenadasSedes = {
    "Concepción": [-36.827, -73.05],
    "Talcahuano": [-36.724, -73.116],
    "San Pedro de la Paz": [-36.84, -73.103],
    "Los Ángeles": [-37.469, -72.353],
    "Hualpén": [-36.787, -73.09]
};

function escaparHtml(valor) {
    const elemento = document.createElement("span");
    elemento.textContent = String(valor ?? "");
    return elemento.innerHTML;
}

const sedeSolicitada = new URLSearchParams(window.location.search).get("sede");
const centroInicial = coordenadasSedes[sedeSolicitada] || [-36.82, -73.04];
const mapa = L.map("mapa").setView(centroInicial, sedeSolicitada ? 13 : 8);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mapa);

Object.entries(coordenadasSedes).forEach(function ([sede, coordenadas]) {
    const relacionadas = ofertas.filter(function (oferta) { return oferta.sede === sede; });
    if (!relacionadas.length) return;
    const instituciones = [...new Set(relacionadas.map(function (oferta) { return oferta.institucion; }))].sort();
    const grupos = [...new Set(relacionadas.map(function (oferta) { return oferta.grupoComparacion; }))].sort();
    const contenido = `<strong>${escaparHtml(sede)}</strong><p>${relacionadas.length} ofertas de ${instituciones.length} instituciones.</p><p><strong>Instituciones:</strong></p><ul>${instituciones.map(function (institucion) { return `<li>${escaparHtml(institucion)}</li>`; }).join("")}</ul><p><strong>Áreas de comparación:</strong> ${grupos.map(escaparHtml).join(", ")}</p><a href="catalogo.html?sede=${encodeURIComponent(sede)}">Ver ofertas de esta sede</a>`;
    const marcador = L.circleMarker(coordenadas, { radius: 9, color: "#171717", fillColor: "#ffc400", fillOpacity: 1 }).addTo(mapa).bindPopup(contenido);
    if (sede === sedeSolicitada) marcador.openPopup();
});
