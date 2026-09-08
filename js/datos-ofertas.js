const CLAVE_OFERTAS = "ofertasEduBio";
const CLAVE_VERSION_OFERTAS = "versionOfertasEduBio";
const VERSION_OFERTAS = "6";

const OFERTAS_BASE = [
    { id: 1, codigo: "OF-001", carrera: "Ingeniería en Informática", grupoComparacion: "Ingeniería en Informática", institucion: "IP DUOC UC", sede: "Concepción", area: "Tecnología", modalidad: "Presencial", jornada: "Diurno", duracion: "8 semestres", matricula: 216000, arancel: 2190000, imagen: "img/ofertas/oferta-01-informatica-duoc.jpg" },
    { id: 2, codigo: "OF-002", carrera: "Ingeniería en Informática", grupoComparacion: "Ingeniería en Informática", institucion: "IP Santo Tomás", sede: "Concepción", area: "Tecnología", modalidad: "Presencial", jornada: "Diurno", duracion: "8 semestres", matricula: 89000, arancel: 1827000, imagen: "img/ofertas/oferta-02-informatica-santo-tomas.jpg" },
    { id: 3, codigo: "OF-003", carrera: "Ingeniería en Informática", grupoComparacion: "Ingeniería en Informática", institucion: "IP INACAP", sede: "Talcahuano", area: "Tecnología", modalidad: "Presencial", jornada: "Diurno", duracion: "8 semestres", matricula: 220000, arancel: 2066000, imagen: "img/ofertas/oferta-03-informatica-inacap.jpg" },
    { id: 4, codigo: "OF-004", carrera: "Enfermería", grupoComparacion: "Enfermería", institucion: "Universidad de Concepción", sede: "Concepción", area: "Salud", modalidad: "Presencial", jornada: "Diurno", duracion: "10 semestres", matricula: 120000, arancel: 4243207, imagen: "img/ofertas/oferta-04-enfermeria-udec.jpg" },
    { id: 5, codigo: "OF-005", carrera: "Enfermería", grupoComparacion: "Enfermería", institucion: "Universidad San Sebastián", sede: "Concepción", area: "Salud", modalidad: "Presencial", jornada: "Diurno", duracion: "10 semestres", matricula: 185300, arancel: 4643800, imagen: "img/ofertas/oferta-05-enfermeria-uss.jpg" },
    { id: 6, codigo: "OF-006", carrera: "Enfermería", grupoComparacion: "Enfermería", institucion: "Universidad Santo Tomás", sede: "Los Ángeles", area: "Salud", modalidad: "Presencial", jornada: "Diurno", duracion: "10 semestres", matricula: 134000, arancel: 3662000, imagen: "img/ofertas/oferta-06-enfermeria-ust.jpg" },
    { id: 7, codigo: "OF-007", carrera: "Psicología", grupoComparacion: "Psicología", institucion: "Universidad de Concepción", sede: "Concepción", area: "Ciencias Sociales", modalidad: "Presencial", jornada: "Diurno", duracion: "11 semestres", matricula: 120000, arancel: 4155549, imagen: "img/ofertas/oferta-07-psicologia-udec.jpg" },
    { id: 8, codigo: "OF-008", carrera: "Psicología", grupoComparacion: "Psicología", institucion: "Universidad San Sebastián", sede: "Concepción", area: "Ciencias Sociales", modalidad: "Presencial", jornada: "Diurno", duracion: "10 semestres", matricula: 185300, arancel: 4799100, imagen: "img/ofertas/oferta-08-psicologia-uss.jpg" },
    { id: 9, codigo: "OF-009", carrera: "Psicología", grupoComparacion: "Psicología", institucion: "Universidad Santo Tomás", sede: "Concepción", area: "Ciencias Sociales", modalidad: "Presencial", jornada: "Diurno", duracion: "10 semestres", matricula: 134000, arancel: 3987000, imagen: "img/ofertas/oferta-09-psicologia-ust.jpg" },
    { id: 10, codigo: "OF-010", carrera: "Ingeniería Comercial", grupoComparacion: "Ingeniería Comercial", institucion: "Universidad del Bío-Bío", sede: "Concepción", area: "Administración y Comercio", modalidad: "Presencial", jornada: "Diurno", duracion: "10 semestres", matricula: 105000, arancel: 3255000, imagen: "img/ofertas/oferta-10-comercial-ubb.jpg" },
    { id: 11, codigo: "OF-011", carrera: "Ingeniería Comercial", grupoComparacion: "Ingeniería Comercial", institucion: "Universidad de Concepción", sede: "Concepción", area: "Administración y Comercio", modalidad: "Presencial", jornada: "Diurno", duracion: "10 semestres", matricula: 120000, arancel: 4584271, imagen: "img/ofertas/oferta-11-comercial-udec.jpg" },
    { id: 12, codigo: "OF-012", carrera: "Ingeniería Comercial", grupoComparacion: "Ingeniería Comercial", institucion: "Universidad Católica de la Santísima Concepción", sede: "Concepción", area: "Administración y Comercio", modalidad: "Presencial", jornada: "Diurno", duracion: "10 semestres", matricula: 90000, arancel: 3325000, imagen: "img/ofertas/oferta-12-comercial-ucsc.jpg" },
    { id: 13, codigo: "OF-013", carrera: "Trabajo Social", grupoComparacion: "Trabajo Social", institucion: "Universidad Católica de la Santísima Concepción", sede: "Concepción", area: "Ciencias Sociales", modalidad: "Presencial", jornada: "Diurno", duracion: "9 semestres", matricula: 90000, arancel: 2488000, imagen: "img/ofertas/oferta-13-trabajo-social-ucsc.jpg" },
    { id: 14, codigo: "OF-014", carrera: "Trabajo Social", grupoComparacion: "Trabajo Social", institucion: "Universidad de Concepción", sede: "Concepción", area: "Ciencias Sociales", modalidad: "Presencial", jornada: "Diurno", duracion: "10 semestres", matricula: 120000, arancel: 3530746, imagen: "img/ofertas/oferta-14-trabajo-social-udec.jpg" },
    { id: 15, codigo: "OF-015", carrera: "Trabajo Social", grupoComparacion: "Trabajo Social", institucion: "Universidad Santo Tomás", sede: "Los Ángeles", area: "Ciencias Sociales", modalidad: "Presencial", jornada: "Diurno", duracion: "9 semestres", matricula: 134000, arancel: 2245000, imagen: "img/ofertas/oferta-15-trabajo-social-ust.jpg" },
    { id: 16, codigo: "OF-016", carrera: "Analista Programador", grupoComparacion: "Programación", institucion: "CFT INACAP", sede: "Talcahuano", area: "Tecnología", modalidad: "Presencial", jornada: "Diurno", duracion: "4 semestres", matricula: 220000, arancel: 2066000, imagen: "img/ofertas/oferta-16-programacion-inacap-talcahuano.jpg" },
    { id: 17, codigo: "OF-017", carrera: "Analista Programador", grupoComparacion: "Programación", institucion: "CFT INACAP", sede: "Los Ángeles", area: "Tecnología", modalidad: "Presencial", jornada: "Vespertino", duracion: "4 semestres", matricula: 220000, arancel: 1988000, imagen: "img/ofertas/oferta-17-programacion-inacap-los-angeles.jpg" },
    { id: 18, codigo: "OF-018", carrera: "Técnico Analista Programador", grupoComparacion: "Programación", institucion: "IP Dr. Virginio Gómez G.", sede: "Concepción", area: "Tecnología", modalidad: "Presencial", jornada: "Vespertino", duracion: "4 semestres", matricula: 144000, arancel: 1558000, imagen: "img/ofertas/oferta-18-programacion-virginio-gomez.jpg" },
    { id: 19, codigo: "OF-019", carrera: "Técnico en Automatización y Control Industrial", grupoComparacion: "Automatización", institucion: "IP AIEP", sede: "Concepción", area: "Tecnología", modalidad: "Presencial", jornada: "Vespertino", duracion: "5 semestres", matricula: 190000, arancel: 1840000, imagen: "img/ofertas/oferta-19-automatizacion-aiep.jpg" },
    { id: 20, codigo: "OF-020", carrera: "Técnico en Automatización y Robótica", grupoComparacion: "Automatización", institucion: "CFT INACAP", sede: "San Pedro de la Paz", area: "Tecnología", modalidad: "Presencial", jornada: "Diurno", duracion: "4 semestres", matricula: 220000, arancel: 2214000, imagen: "img/ofertas/oferta-20-robotica-inacap.jpg" },
    { id: 21, codigo: "OF-021", carrera: "Técnico Universitario en Automatización y Control", grupoComparacion: "Automatización", institucion: "Universidad Técnica Federico Santa María", sede: "Hualpén", area: "Tecnología", modalidad: "Presencial", jornada: "Diurno", duracion: "5 semestres", matricula: 186000, arancel: 2150000, imagen: "img/ofertas/oferta-21-automatizacion-usm.jpg" }
].map(function (oferta, indice) {
    return { ...oferta, cupos: [8, 24, 36, 12, 30][indice % 5], cupoCritico: 10 };
});

function copiarOfertas(lista) {
    return lista.map(function (oferta, indice) {
        const cupos = Number(oferta.cupos);
        const cupoCritico = oferta.cupoCritico === null || oferta.cupoCritico === "" ? null : Number(oferta.cupoCritico);
        return {
            ...oferta,
            cupos: Number.isInteger(cupos) && cupos >= 0 ? cupos : [8, 24, 36, 12, 30][indice % 5],
            cupoCritico: cupoCritico === null || Number.isInteger(cupoCritico) && cupoCritico >= 0 ? cupoCritico : 10
        };
    });
}

function guardarOfertas(lista) {
    localStorage.setItem(CLAVE_OFERTAS, JSON.stringify(lista));
    localStorage.setItem(CLAVE_VERSION_OFERTAS, VERSION_OFERTAS);
}

function obtenerOfertas() {
    try {
        const guardadas = JSON.parse(localStorage.getItem(CLAVE_OFERTAS));
        if (Array.isArray(guardadas)) {
            const normalizadas = copiarOfertas(guardadas);
            if (localStorage.getItem(CLAVE_VERSION_OFERTAS) !== VERSION_OFERTAS) guardarOfertas(normalizadas);
            return normalizadas;
        }
    } catch {}
    const base = copiarOfertas(OFERTAS_BASE);
    guardarOfertas(base);
    return base;
}

function buscarOferta(id) {
    return obtenerOfertas().find(function (oferta) { return oferta.id === Number(id); });
}

function restaurarOfertasBase() {
    const base = copiarOfertas(OFERTAS_BASE);
    guardarOfertas(base);
    ofertas = base;
    return ofertas;
}

let ofertas = obtenerOfertas();
