const contenedorOfertas = document.getElementById("contenedorOfertas");
const busquedaCatalogo = document.getElementById("busquedaCatalogo");
const filtroCarrera = document.getElementById("filtroCarrera");
const filtroSede = document.getElementById("filtroSede");
const cantidadResultados = document.getElementById("cantidadResultados");

function formatearPrecio(valor) {
    return Number(valor).toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

function cargarFiltros() {
    const grupos = [...new Set(ofertas.map(function (oferta) { return oferta.grupoComparacion; }))].sort();
    const sedes = [...new Set(ofertas.map(function (oferta) { return oferta.sede; }))].sort();

    grupos.forEach(function (grupo) {
        const opcion = document.createElement("option");
        opcion.value = grupo;
        opcion.textContent = grupo;
        filtroCarrera.appendChild(opcion);
    });

    sedes.forEach(function (sede) {
        const opcion = document.createElement("option");
        opcion.value = sede;
        opcion.textContent = sede;
        filtroSede.appendChild(opcion);
    });

    const parametros = new URLSearchParams(window.location.search);
    const carrera = parametros.get("carrera");
    const sede = parametros.get("sede");
    if (carrera && grupos.includes(carrera)) filtroCarrera.value = carrera;
    if (sede && sedes.includes(sede)) filtroSede.value = sede;
}

function normalizar(valor) {
    return String(valor || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function obtenerOfertasFiltradas() {
    const texto = normalizar(busquedaCatalogo.value.trim());
    return ofertas.filter(function (oferta) {
        const coincideCarrera = !filtroCarrera.value || oferta.grupoComparacion === filtroCarrera.value;
        const coincideSede = !filtroSede.value || oferta.sede === filtroSede.value;
        const contenido = normalizar(`${oferta.carrera} ${oferta.grupoComparacion} ${oferta.institucion} ${oferta.sede} ${oferta.area}`);
        return coincideCarrera && coincideSede && (!texto || contenido.includes(texto));
    });
}

function mostrarMensajeComparador() {
    const error = obtenerErrorComparador();
    const mensajes = {
        duplicado: "Esta oferta ya está en el comparador.",
        maximo: "Puedes comparar hasta tres ofertas a la vez.",
        grupo: "Para una comparación útil, selecciona ofertas de la misma carrera o grupo.",
        inexistente: "La oferta seleccionada no está disponible."
    };
    alert(mensajes[error] || "No fue posible agregar la oferta.");
}

function agregarAComparar(id) {
    if (!agregarOfertaAlComparador(id)) {
        mostrarMensajeComparador();
        return;
    }
    const oferta = ofertas.find(function (item) { return item.id === Number(id); });
    const ids = obtenerIdsComparador();
    if (ids.length >= 2) {
        if (confirm(`${oferta.carrera} fue agregada. ¿Quieres comparar ahora?`)) {
            window.location.href = "comparar.html";
        }
    } else {
        alert("Oferta agregada. Selecciona otra alternativa de la misma carrera para comparar.");
    }
}

function mostrarOfertas() {
    const visibles = obtenerOfertasFiltradas();
    cantidadResultados.textContent = `${visibles.length} oferta${visibles.length === 1 ? "" : "s"} encontrada${visibles.length === 1 ? "" : "s"}`;

    if (!visibles.length) {
        contenedorOfertas.innerHTML = '<div class="estado-vacio"><h2>Sin resultados</h2><p>Prueba con otra carrera, institución o sede.</p></div>';
        return;
    }

    contenedorOfertas.innerHTML = visibles.map(function (oferta) {
        return `
            <article class="tarjeta tarjeta-oferta">
                <img src="${oferta.imagen}" alt="${oferta.carrera}" class="oferta-imagen">
                <div class="oferta-contenido">
                    <span class="badge">${oferta.grupoComparacion}</span>
                    <h2 class="tarjeta-titulo">${oferta.carrera}</h2>
                    <p class="tarjeta-texto">${oferta.institucion}</p>
                    <p><strong>Sede:</strong> ${oferta.sede}</p>
                    <p><strong>Modalidad:</strong> ${oferta.modalidad}</p>
                    <p><strong>Jornada:</strong> ${oferta.jornada}</p>
                    <p><strong>Duración:</strong> ${oferta.duracion}</p>
                    <p><strong>Arancel:</strong> ${formatearPrecio(oferta.arancel)}</p>
                    <div class="oferta-acciones">
                        <a href="detalle.html?id=${oferta.id}" class="boton boton-claro">Ver detalle</a>
                        <button type="button" class="boton boton-primario agregar-comparador" data-id="${oferta.id}">Agregar a comparar</button>
                    </div>
                </div>
            </article>
        `;
    }).join("");

    document.querySelectorAll(".agregar-comparador").forEach(function (boton) {
        boton.addEventListener("click", function () {
            agregarAComparar(Number(boton.dataset.id));
        });
    });
}

[busquedaCatalogo, filtroCarrera, filtroSede].forEach(function (control) {
    control.addEventListener(control.tagName === "INPUT" ? "input" : "change", mostrarOfertas);
});

document.getElementById("limpiarFiltros").addEventListener("click", function () {
    busquedaCatalogo.value = "";
    filtroCarrera.value = "";
    filtroSede.value = "";
    window.history.replaceState({}, "", "catalogo.html");
    mostrarOfertas();
});

cargarFiltros();
mostrarOfertas();
