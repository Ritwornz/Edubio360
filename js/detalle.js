const contenedorDetalle = document.getElementById("detalleOferta");

const parametros = new URLSearchParams(window.location.search);

const idOferta = Number(parametros.get("id"));

const oferta = ofertas.find(function (oferta) {
    return oferta.id === idOferta;
});

function formatearPrecio(valor) {
    return valor.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP"
    });
}

function mostrarDetalle() {
    if (!oferta) {
        contenedorDetalle.innerHTML = `
            <div class="estado-vacio">
                <h2>Oferta no encontrada</h2>
                <p>La oferta académica solicitada no existe.</p>
                <a href="catalogo.html" class="boton boton-primario">
                    Volver al catálogo
                </a>
            </div>
        `;

        return;
    }

    contenedorDetalle.innerHTML = `
        <article class="detalle-oferta">

            <div>
                <img
                    src="${oferta.imagen}"
                    alt="${oferta.carrera}"
                    class="detalle-imagen"
                >
            </div>

            <div class="detalle-contenido">

                <span class="badge">
                    ${oferta.area}
                </span>

                <h1>
                    ${oferta.carrera}
                </h1>

                <h2>
                    ${oferta.institucion}
                </h2>

                <div class="detalle-datos">

                    <p>
                        <strong>Sede:</strong>
                        ${oferta.sede}
                    </p>

                    <p>
                        <strong>Modalidad:</strong>
                        ${oferta.modalidad}
                    </p>

                    <p>
                        <strong>Jornada:</strong>
                        ${oferta.jornada}
                    </p>

                    <p>
                        <strong>Duración:</strong>
                        ${oferta.duracion}
                    </p>

                    <p>
                        <strong>Matrícula:</strong>
                        ${formatearPrecio(oferta.matricula)}
                    </p>

                    <p>
                        <strong>Arancel:</strong>
                        ${formatearPrecio(oferta.arancel)}
                    </p>

                </div>

                <button
                    type="button"
                    class="boton boton-primario"
                    id="btnComparar"
                >
                    Agregar a comparar
                </button>

                <a href="solicitud.html?oferta=${oferta.id}" class="boton boton-secundario">
                    Solicitar orientación
                </a>

                <a href="mapa.html?sede=${encodeURIComponent(oferta.sede)}" class="boton boton-claro">
                    Ver sede en mapa
                </a>

            </div>

        </article>
    `;

    document
        .getElementById("btnComparar")
        .addEventListener("click", agregarAComparar);
}

function agregarAComparar() {
    if (!agregarOfertaAlComparador(oferta.id)) {
        alert("Esta oferta ya está en el comparador.");
        return;
    }

    alert("Oferta agregada al comparador.");
}

mostrarDetalle();
