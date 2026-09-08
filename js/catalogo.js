const contenedorOfertas = document.getElementById("contenedorOfertas");

function formatearPrecio(valor) {
    return valor.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP"
    });
}

function mostrarOfertas() {
    contenedorOfertas.innerHTML = "";

    const sedeFiltrada = new URLSearchParams(window.location.search).get("sede");
    const ofertasVisibles = sedeFiltrada ? ofertas.filter(function (oferta) { return oferta.sede === sedeFiltrada; }) : ofertas;

    ofertasVisibles.forEach(function (oferta) {
        const tarjeta = document.createElement("article");

        tarjeta.classList.add("tarjeta", "tarjeta-oferta");

        tarjeta.innerHTML = `
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

                <p class="tarjeta-texto">
                    ${oferta.institucion}
                </p>

                <p>
                    <strong>Sede:</strong> ${oferta.sede}
                </p>

                <p>
                    <strong>Modalidad:</strong> ${oferta.modalidad}
                </p>

                <p>
                    <strong>Jornada:</strong> ${oferta.jornada}
                </p>

                <p>
                    <strong>Duración:</strong> ${oferta.duracion}
                </p>

                <p>
                    <strong>Arancel:</strong> ${formatearPrecio(oferta.arancel)}
                </p>

                <div class="oferta-acciones">

                    <a
                        href="detalle.html?id=${oferta.id}"
                        class="boton boton-claro"
                    >
                        Ver detalle
                    </a>

                    <button
                        type="button"
                        class="boton boton-primario"
                        onclick="agregarAComparar(${oferta.id})"
                    >
                        Agregar a comparar
                    </button>

                </div>

            </div>
        `;

        contenedorOfertas.appendChild(tarjeta);
    });
}

function agregarAComparar(id) {
    const ofertaSeleccionada = ofertas.find(function (oferta) {
        return oferta.id === id;
    });

    if (!ofertaSeleccionada) {
        alert("La oferta seleccionada no existe.");
        return;
    }

    if (!agregarOfertaAlComparador(id)) {
        alert("Esta oferta ya está en el comparador.");
        return;
    }

    alert("Oferta agregada al comparador.");
}

mostrarOfertas();
