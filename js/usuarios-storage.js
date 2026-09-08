const CLAVE_USUARIOS = "usuariosEduBio";
const CLAVE_VERSION_USUARIOS = "versionUsuariosEduBio";
const VERSION_USUARIOS = "4";
const USUARIOS_DEMO = [
    { nombre: "Estudiante", apellidos: "Demo", correo: "estudiante@duoc.cl", run: "123456785", region: "Biobío", comuna: "Concepción", direccion: "Concepción", rol: "ESTUDIANTE", estado: "ACTIVO" },
    { nombre: "Orientador", apellidos: "Demo", correo: "orientador@duoc.cl", run: "111111111", region: "Biobío", comuna: "Talcahuano", direccion: "Talcahuano", rol: "ORIENTADOR", estado: "ACTIVO" },
    { nombre: "Administrador", apellidos: "Demo", correo: "admin@duoc.cl", run: "222222222", region: "Biobío", comuna: "Concepción", direccion: "Concepción", rol: "ADMINISTRADOR", estado: "ACTIVO" }
];

function normalizarUsuario(usuario) {
    const nombreCompleto = String(usuario.nombre || "").trim();
    const partes = nombreCompleto.split(/\s+/);
    const nombre = usuario.apellidos ? nombreCompleto : partes.shift() || "";
    const apellidos = usuario.apellidos || partes.join(" ");
    return {
        ...usuario,
        nombre,
        apellidos,
        correo: String(usuario.correo || "").trim().toLowerCase(),
        run: String(usuario.run || "").replace(/[.-]/g, "").toUpperCase(),
        rol: usuario.rol || "ESTUDIANTE",
        estado: usuario.estado || "ACTIVO"
    };
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios.map(normalizarUsuario)));
    localStorage.setItem(CLAVE_VERSION_USUARIOS, VERSION_USUARIOS);
}

function obtenerUsuarios() {
    try {
        const usuarios = JSON.parse(localStorage.getItem(CLAVE_USUARIOS));
        if (Array.isArray(usuarios)) {
            const correosDemo = {
                "estudiante@duocuc.cl": "estudiante@duoc.cl",
                "orientador@duocuc.cl": "orientador@duoc.cl",
                "admin@duocuc.cl": "admin@duoc.cl"
            };
            const normalizados = usuarios.map(function (usuario) {
                return normalizarUsuario({ ...usuario, correo: correosDemo[usuario.correo] || usuario.correo });
            });
            if (localStorage.getItem(CLAVE_VERSION_USUARIOS) !== VERSION_USUARIOS) guardarUsuarios(normalizados);
            return normalizados;
        }
    } catch {}

    const base = USUARIOS_DEMO.map(function (usuario) { return { ...usuario }; });
    guardarUsuarios(base);
    return base;
}

function buscarUsuario(correo) {
    return obtenerUsuarios().find(function (usuario) {
        return usuario.correo === String(correo || "").trim().toLowerCase();
    });
}

function actualizarUsuario(correo, cambios) {
    const clave = String(correo || "").trim().toLowerCase();
    const usuarios = obtenerUsuarios().map(function (usuario) {
        return usuario.correo === clave ? normalizarUsuario({ ...usuario, ...cambios, correo: usuario.correo }) : usuario;
    });
    guardarUsuarios(usuarios);
    return usuarios.find(function (usuario) { return usuario.correo === clave; });
}
