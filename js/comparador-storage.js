const CLAVE_COMPARADOR = "comparadorEduBio";
let errorComparador = "";

function obtenerIdsComparador() {
    try {
        const ids = JSON.parse(localStorage.getItem(CLAVE_COMPARADOR));
        if (!Array.isArray(ids)) return [];
        const validos = ids.map(Number).filter(function (id) {
            return Number.isInteger(id) && ofertas.some(function (oferta) { return oferta.id === id; });
        });
        if (validos.length !== ids.length) guardarIdsComparador(validos);
        return validos;
    } catch {
        return [];
    }
}

function guardarIdsComparador(ids) {
    localStorage.setItem(CLAVE_COMPARADOR, JSON.stringify(ids));
    if (typeof actualizarContadorSeleccion === "function") actualizarContadorSeleccion();
}

function obtenerErrorComparador() {
    return errorComparador;
}

function agregarOfertaAlComparador(id) {
    errorComparador = "";
    const oferta = ofertas.find(function (item) { return item.id === Number(id); });
    if (!oferta) {
        errorComparador = "inexistente";
        return false;
    }

    const ids = obtenerIdsComparador();
    if (ids.includes(oferta.id)) {
        errorComparador = "duplicado";
        return false;
    }

    if (ids.length >= 3) {
        errorComparador = "maximo";
        return false;
    }

    if (ids.length) {
        const primera = ofertas.find(function (item) { return item.id === ids[0]; });
        if (primera && primera.grupoComparacion !== oferta.grupoComparacion) {
            errorComparador = "grupo";
            return false;
        }
    }

    ids.push(oferta.id);
    guardarIdsComparador(ids);
    return true;
}

function vaciarComparadorStorage() {
    guardarIdsComparador([]);
}
