if (window.location.protocol === "file:") {
    const contenedorVideo = document.querySelector(".video-responsive");
    const enlaceVideo = document.createElement("a");
    const imagenVideo = document.createElement("img");
    const textoVideo = document.createElement("span");

    enlaceVideo.href = "https://www.youtube.com/watch?v=OorkqA3RuFg";
    enlaceVideo.target = "_blank";
    enlaceVideo.rel = "noopener noreferrer";
    enlaceVideo.className = "video-alternativo";
    enlaceVideo.setAttribute("aria-label", "Ver video sobre cómo elegir una carrera en YouTube");

    imagenVideo.src = "https://img.youtube.com/vi/OorkqA3RuFg/hqdefault.jpg";
    imagenVideo.alt = "Cómo saber qué carrera elegir";

    textoVideo.textContent = "Ver video en YouTube";

    enlaceVideo.append(imagenVideo, textoVideo);
    contenedorVideo.replaceChildren(enlaceVideo);
}
