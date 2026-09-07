const regiones = [
    {
        nombre: "Arica y Parinacota",
        comunas: ["Arica", "Camarones", "Putre", "General Lagos"]
    },
    {
        nombre: "Tarapacá",
        comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte"]
    },
    {
        nombre: "Antofagasta",
        comunas: ["Antofagasta", "Calama", "Tocopilla"]
    },
    {
        nombre: "Atacama",
        comunas: ["Copiapó", "Caldera", "Vallenar"]
    },
    {
        nombre: "Coquimbo",
        comunas: ["La Serena", "Coquimbo", "Ovalle"]
    },
    {
        nombre: "Valparaíso",
        comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio"]
    },
    {
        nombre: "Metropolitana de Santiago",
        comunas: ["Santiago", "Maipú", "Puente Alto", "Las Condes"]
    },
    {
        nombre: "Libertador General Bernardo O'Higgins",
        comunas: ["Rancagua", "San Fernando", "Rengo"]
    },
    {
        nombre: "Maule",
        comunas: ["Talca", "Curicó", "Linares"]
    },
    {
        nombre: "Ñuble",
        comunas: ["Chillán", "Chillán Viejo", "San Carlos"]
    },
    {
        nombre: "Biobío",
        comunas: [
            "Concepción",
            "Talcahuano",
            "San Pedro de la Paz",
            "Chiguayante",
            "Coronel",
            "Lota",
            "Hualpén",
            "Los Ángeles"
        ]
    },
    {
        nombre: "La Araucanía",
        comunas: ["Temuco", "Padre Las Casas", "Villarrica"]
    },
    {
        nombre: "Los Ríos",
        comunas: ["Valdivia", "La Unión", "Panguipulli"]
    },
    {
        nombre: "Los Lagos",
        comunas: ["Puerto Montt", "Osorno", "Castro"]
    },
    {
        nombre: "Aysén",
        comunas: ["Coyhaique", "Aysén", "Chile Chico"]
    },
    {
        nombre: "Magallanes y de la Antártica Chilena",
        comunas: ["Punta Arenas", "Puerto Natales", "Porvenir"]
    }
];

const selectRegion = document.getElementById("region");
const selectComuna = document.getElementById("comuna");

function cargarRegiones() {
    regiones.forEach(function (region, indice) {
        const opcion = document.createElement("option");

        opcion.value = indice;
        opcion.textContent = region.nombre;

        selectRegion.appendChild(opcion);
    });
}

function cargarComunas() {
    selectComuna.innerHTML =
        '<option value="">Seleccione una comuna</option>';

    const indiceRegion = selectRegion.value;

    if (indiceRegion === "") {
        selectComuna.disabled = true;
        return;
    }

    const comunas = regiones[indiceRegion].comunas;

    comunas.forEach(function (comuna) {
        const opcion = document.createElement("option");

        opcion.value = comuna;
        opcion.textContent = comuna;

        selectComuna.appendChild(opcion);
    });

    selectComuna.disabled = false;
}

selectRegion.addEventListener("change", cargarComunas);

cargarRegiones();