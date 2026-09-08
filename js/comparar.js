const contenedorComparador = document.getElementById("contenedorComparador");

function obtenerComparador() {
    const ids = obtenerIdsComparador();

    return ids
        .map(function (id) {
            return ofertas.find(function (oferta) {
                return oferta.id === id;
            });
        })
        .filter(Boolean);
}

function guardarComparador(comparador) {
    guardarIdsComparador(comparador.map(function (oferta) {
        return oferta.id;
    }));
}

function formatearPrecio(valor) {
    return valor.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP"
    });
}

function eliminarOferta(id) {
    let comparador = obtenerComparador();

    comparador = comparador.filter(function (oferta) {
        return oferta.id !== id;
    });

    guardarComparador(comparador);

    mostrarComparador();
}

function vaciarComparador() {
    guardarIdsComparador([]);

    mostrarComparador();
}

function mostrarComparador() {
    const comparador = obtenerComparador();

    if (comparador.length === 0) {
        contenedorComparador.innerHTML = `
            <div class="estado-vacio">
                <h2>No hay ofertas seleccionadas</h2>

                <p>
                    Agrega ofertas académicas desde el catálogo para comenzar a comparar.
                </p>

                <a
                    href="catalogo.html"
                    class="boton boton-primario"
                >
                    Ir al catálogo
                </a>
            </div>
        `;

        return;
    }

    let contenido = `
        <div class="comparador-acciones">
            <a
                href="catalogo.html"
                class="boton boton-claro"
            >
                Agregar más ofertas
            </a>

            <button
                type="button"
                class="boton boton-secundario"
                onclick="vaciarComparador()"
            >
                Vaciar comparador
            </button>
        </div>

        <div class="grid-comparador">
    `;

    comparador.forEach(function (oferta) {
        contenido += `
            <article class="tarjeta tarjeta-comparacion">

                <img
                    src="${oferta.imagen}"
                    alt="${oferta.carrera}"
                    class="oferta-imagen"
                >

                <div class="oferta-contenido">

                    <span class="badge">
                        ${oferta.area}
                    </span>

                    <h2 class="tarjeta-titulo">
                        ${oferta.carrera}
                    </h2>

                    <p>
                        <strong>Institución:</strong>
                        ${oferta.institucion}
                    </p>

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

                    <button
                        type="button"
                        class="boton boton-secundario"
                        onclick="eliminarOferta(${oferta.id})"
                    >
                        Quitar
                    </button>

                    <a href="solicitud.html?oferta=${oferta.id}" class="boton boton-primario">
                        Solicitar orientación
                    </a>

                </div>

            </article>
        `;
    });

    contenido += `</div>`;

    contenedorComparador.innerHTML = contenido;
}

mostrarComparador();
