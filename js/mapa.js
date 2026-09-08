const coordenadasSedes = {
    "Concepción": [-36.827, -73.05],
    "Talcahuano": [-36.724, -73.116],
    "San Pedro de la Paz": [-36.84, -73.103],
    "Los Ángeles": [-37.469, -72.353],
    "Chillán": [-36.606, -72.103]
};
const sedeSolicitada = new URLSearchParams(window.location.search).get("sede");
const centroInicial = coordenadasSedes[sedeSolicitada] || [-36.82, -73.04];
const mapa = L.map("mapa").setView(centroInicial, sedeSolicitada ? 13 : 8);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mapa);

Object.entries(coordenadasSedes).forEach(function ([sede, coordenadas]) {
    const relacionadas = ofertas.filter(function (oferta) { return oferta.sede === sede; });
    const institucion = relacionadas[0]?.institucion || "Sede de referencia";
    const lista = relacionadas.length
        ? relacionadas.map(function (oferta) { return `<li>${oferta.carrera}</li>`; }).join("")
        : "<li>Consulta la oferta disponible</li>";
    const marcador = L.circleMarker(coordenadas, { radius: 9, color: "#171717", fillColor: "#ffc400", fillOpacity: 1 })
        .addTo(mapa)
        .bindPopup(`<strong>${institucion}</strong><br>${sede}<ul>${lista}</ul><a href="catalogo.html?sede=${encodeURIComponent(sede)}">Ver ofertas relacionadas</a>`);
    if (sede === sedeSolicitada) marcador.openPopup();
});
