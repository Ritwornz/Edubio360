const contenedorComparador = document.getElementById("contenedorComparador");
const resumenComparacion = document.getElementById("resumenComparacion");
const preferenciasComparacion = document.getElementById("preferenciasComparacion");

function obtenerComparador() {
    return obtenerIdsComparador().map(function (id) {
        return ofertas.find(function (oferta) { return oferta.id === id; });
    }).filter(Boolean);
}

function formatearPrecio(valor) {
    return Number(valor).toLocaleString("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: Number(valor) % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

function duracionNumerica(oferta) {
    const numero = parseInt(oferta.duracion, 10);
    return Number.isFinite(numero) ? numero : Infinity;
}

function menorValor(comparador, propiedad) {
    return Math.min(...comparador.map(function (oferta) { return Number(oferta[propiedad]); }));
}

function opcionesUnicas(comparador, propiedad) {
    return [...new Set(comparador.map(function (oferta) { return oferta[propiedad]; }))].sort();
}

function renderizarPreferencias(comparador) {
    if (comparador.length < 2) {
        preferenciasComparacion.innerHTML = "";
        return;
    }

    const campos = [
        { id: "preferenciaSede", etiqueta: "Sede preferida", propiedad: "sede" },
        { id: "preferenciaJornada", etiqueta: "Jornada preferida", propiedad: "jornada" },
        { id: "preferenciaModalidad", etiqueta: "Modalidad preferida", propiedad: "modalidad" }
    ];

    preferenciasComparacion.innerHTML = `
        <div class="tarjeta preferencias-comparador">
            <h2>¿Qué se adapta mejor a ti?</h2>
            <p>Estas preferencias no declaran una institución como mejor. Solo muestran qué alternativa coincide más con lo que buscas.</p>
            <div class="grid-preferencias">
                ${campos.map(function (campo) {
                    const opciones = opcionesUnicas(comparador, campo.propiedad);
                    return `<label class="etiqueta" for="${campo.id}">${campo.etiqueta}<select class="campo" id="${campo.id}"><option value="">Sin preferencia</option>${opciones.map(function (opcion) { return `<option value="${opcion}">${opcion}</option>`; }).join("")}</select></label>`;
                }).join("")}
            </div>
            <div id="resultadoPreferencias" class="resultado-preferencias"></div>
        </div>
    `;

    campos.forEach(function (campo) {
        document.getElementById(campo.id).addEventListener("change", function () {
            evaluarPreferencias(comparador);
        });
    });
}

function evaluarPreferencias(comparador) {
    const preferencias = {
        sede: document.getElementById("preferenciaSede").value,
        jornada: document.getElementById("preferenciaJornada").value,
        modalidad: document.getElementById("preferenciaModalidad").value
    };
    const activas = Object.entries(preferencias).filter(function ([, valor]) { return valor; });
    const resultado = document.getElementById("resultadoPreferencias");

    if (!activas.length) {
        resultado.innerHTML = "";
        return;
    }

    const evaluadas = comparador.map(function (oferta) {
        const puntos = activas.filter(function ([propiedad, valor]) { return oferta[propiedad] === valor; }).length;
        return { oferta, puntos };
    });
    const mayor = Math.max(...evaluadas.map(function (item) { return item.puntos; }));

    resultado.innerHTML = evaluadas.map(function (item) {
        const destacada = item.puntos === mayor && mayor > 0 ? " coincidencia-destacada" : "";
        return `<p class="coincidencia${destacada}"><strong>${item.oferta.institucion}</strong>: coincide con ${item.puntos} de ${activas.length} preferencias.</p>`;
    }).join("");
}

function eliminarOferta(id) {
    guardarIdsComparador(obtenerIdsComparador().filter(function (actual) { return actual !== id; }));
    mostrarComparador();
}

function vaciarComparador() {
    vaciarComparadorStorage();
    mostrarComparador();
}

function mostrarComparador() {
    const comparador = obtenerComparador();

    if (!comparador.length) {
        resumenComparacion.innerHTML = "";
        preferenciasComparacion.innerHTML = "";
        contenedorComparador.innerHTML = '<div class="estado-vacio"><h2>No hay ofertas seleccionadas</h2><p>Agrega dos o tres ofertas de la misma carrera para comparar.</p><a href="catalogo.html" class="boton boton-primario">Ir al catálogo</a></div>';
        return;
    }

    const grupo = comparador[0].grupoComparacion;
    const menorMatricula = menorValor(comparador, "matricula");
    const menorArancel = menorValor(comparador, "arancel");
    const menorDuracion = Math.min(...comparador.map(duracionNumerica));
    const ids = comparador.map(function (oferta) { return oferta.id; }).join(",");

    resumenComparacion.innerHTML = `
        <div class="comparador-encabezado">
            <div><span class="badge">${grupo}</span><h2>Comparando ${comparador.length} alternativa${comparador.length === 1 ? "" : "s"}</h2></div>
            <div class="comparador-acciones"><a href="catalogo.html?carrera=${encodeURIComponent(grupo)}" class="boton boton-claro">Agregar otra alternativa</a><button type="button" class="boton boton-secundario" id="vaciarComparador">Vaciar comparador</button></div>
        </div>
        ${comparador.length >= 2 ? `<p class="nota-comparacion">Se resaltan los menores valores objetivos de matrícula, arancel y duración. Esto no significa que una institución sea mejor en términos generales.</p><a href="solicitud.html?comparacion=${ids}" class="boton boton-primario">Solicitar orientación sobre esta comparación</a>` : '<p>Agrega al menos otra alternativa del mismo grupo para ver diferencias.</p>'}
    `;

    document.getElementById("vaciarComparador").addEventListener("click", vaciarComparador);

    contenedorComparador.innerHTML = `<div class="tabla-responsive"><table class="tabla tabla-comparacion"><thead><tr><th>Criterio</th>${comparador.map(function (oferta) { return `<th>${oferta.institucion}<br><small>${oferta.carrera}</small></th>`; }).join("")}</tr></thead><tbody>
        <tr><th>Sede</th>${comparador.map(function (oferta) { return `<td>${oferta.sede}</td>`; }).join("")}</tr>
        <tr><th>Modalidad</th>${comparador.map(function (oferta) { return `<td>${oferta.modalidad}</td>`; }).join("")}</tr>
        <tr><th>Jornada</th>${comparador.map(function (oferta) { return `<td>${oferta.jornada}</td>`; }).join("")}</tr>
        <tr><th>Duración</th>${comparador.map(function (oferta) { return `<td class="${duracionNumerica(oferta) === menorDuracion ? "mejor-dato" : ""}">${oferta.duracion}</td>`; }).join("")}</tr>
        <tr><th>Matrícula</th>${comparador.map(function (oferta) { return `<td class="${Number(oferta.matricula) === menorMatricula ? "mejor-dato" : ""}">${formatearPrecio(oferta.matricula)}</td>`; }).join("")}</tr>
        <tr><th>Arancel</th>${comparador.map(function (oferta) { return `<td class="${Number(oferta.arancel) === menorArancel ? "mejor-dato" : ""}">${formatearPrecio(oferta.arancel)}</td>`; }).join("")}</tr>
        <tr><th>Cupos disponibles</th>${comparador.map(function (oferta) { return `<td>${oferta.cupos}${oferta.cupoCritico !== null && oferta.cupos <= oferta.cupoCritico ? '<br><span class="alerta-cupos">Últimos cupos</span>' : ""}</td>`; }).join("")}</tr>
        <tr><th>Acciones</th>${comparador.map(function (oferta) { return `<td><a href="detalle.html?id=${oferta.id}" class="boton boton-claro">Ver detalle</a><button type="button" class="boton boton-secundario quitar-comparador" data-id="${oferta.id}">Quitar</button></td>`; }).join("")}</tr>
    </tbody></table></div>`;

    document.querySelectorAll(".quitar-comparador").forEach(function (boton) {
        boton.addEventListener("click", function () { eliminarOferta(Number(boton.dataset.id)); });
    });

    renderizarPreferencias(comparador);
}

mostrarComparador();
