# EduBío 360

Frontend académico para explorar, comparar y orientar decisiones sobre ofertas de Educación Superior en la Región del Biobío.

## Tecnologías

HTML5, CSS, JavaScript, LocalStorage, SessionStorage, Leaflet y OpenStreetMap.

## Ejecución

Abrir la carpeta con Visual Studio Code y ejecutar `index.html` mediante Live Server.

## Accesos de demostración

- Estudiante: `estudiante@duoc.cl` / `1234`
- Orientador: `orientador@duoc.cl` / `1234`
- Administrador: `admin@duoc.cl` / `1234`

## Flujo principal

El visitante puede explorar el catálogo, revisar detalles, comparar ofertas equivalentes entre instituciones y consultar el mapa. Para solicitar orientación debe iniciar sesión como estudiante. El orientador puede tomar solicitudes, aceptar o reprogramar la atención, registrar observaciones y finalizarla. El administrador gestiona usuarios, roles y ofertas académicas.

## Demostración de roles

Usa pestañas del mismo navegador y la misma dirección (incluido el puerto). Inicia sesión como estudiante en una y como orientador en otra: las solicitudes y notificaciones se actualizan entre ambas. Los datos se guardan en LocalStorage y las sesiones por pestaña en SessionStorage; no se comparten entre navegadores o equipos.

Las tarjetas de cada panel abren los listados correspondientes. Las solicitudes canceladas y atendidas se conservan, y los avisos leídos pueden consultarse nuevamente. El administrador puede revisar todas las solicitudes desde su panel; el orientador consulta el catálogo, toma solicitudes disponibles y gestiona las asignadas a su cuenta.
