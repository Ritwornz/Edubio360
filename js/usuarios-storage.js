const CLAVE_USUARIOS = "usuariosEduBio";
const USUARIOS_DEMO = [
    { nombre: "Estudiante Demo", correo: "estudiante@duocuc.cl", run: "12345678-5", region: "Biobío", comuna: "Concepción", rol: "ESTUDIANTE", estado: "ACTIVO" },
    { nombre: "Orientador Demo", correo: "orientador@duocuc.cl", run: "11111111-1", region: "Biobío", comuna: "Talcahuano", rol: "ORIENTADOR", estado: "ACTIVO" },
    { nombre: "Administrador Demo", correo: "admin@duocuc.cl", run: "22222222-2", region: "Biobío", comuna: "Concepción", rol: "ADMINISTRADOR", estado: "ACTIVO" }
];

function obtenerUsuarios() {
    try {
        const usuarios = JSON.parse(localStorage.getItem(CLAVE_USUARIOS));
        if (Array.isArray(usuarios)) return usuarios;
    } catch {}
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(USUARIOS_DEMO));
    return [...USUARIOS_DEMO];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function actualizarUsuario(correo, cambios) {
    const usuarios = obtenerUsuarios().map(function (usuario) {
        return usuario.correo === correo ? { ...usuario, ...cambios, correo: usuario.correo } : usuario;
    });
    guardarUsuarios(usuarios);
    return usuarios.find(function (usuario) { return usuario.correo === correo; });
}
