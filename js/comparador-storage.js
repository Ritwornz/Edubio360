const CLAVE_COMPARADOR = "comparador";

function obtenerIdsComparador() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_COMPARADOR));

        if (!Array.isArray(datos)) {
            return [];
        }

        return [...new Set(datos
            .map(function (item) {
                return typeof item === "object" && item !== null ? item.id : item;
            })
            .map(Number)
            .filter(Number.isInteger))];
    } catch {
        localStorage.removeItem(CLAVE_COMPARADOR);
        return [];
    }
}

function guardarIdsComparador(ids) {
    localStorage.setItem(CLAVE_COMPARADOR, JSON.stringify(ids));
}

function agregarOfertaAlComparador(id) {
    const ids = obtenerIdsComparador();

    if (ids.includes(id)) {
        return false;
    }

    guardarIdsComparador([...ids, id]);
    return true;
}
