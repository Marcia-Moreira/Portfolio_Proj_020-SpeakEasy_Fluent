import { getListas } from "./app.js";

function getModoFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("modo");
}

const modo = getModoFromURL();
const container = document.getElementById("listas");

async function renderListas() {
  const listas = await getListas();

  listas.forEach(lista => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `<strong>${lista.nome}</strong>`;

    // card.addEventListener("click", () => {
    //   window.location.href = `study-detail.html?id=${lista.id}`;
    //   window.location.href = `study-scroll.html?id=${lista.id}`;
    //   window.location.href = `study-audio.html?id=${lista.id}`;
    // });

    card.addEventListener("click", () => {
      if (modo === "audio") {
        window.location.href = `study-audio.html?id=${lista.id}`;
      } else {
        // default = scroll
        window.location.href = `study-scroll.html?id=${lista.id}`;
      }
    });


    container.appendChild(card);
  });
}

renderListas();

// window.location.href = `study-detail.html?id=${lista.id}`;
// window.location.href = `study-audio.html?id=${lista.id}`;

const btnMaratona = document.getElementById("btnMaratonaScroll");
if (btnMaratona) {
  btnMaratona.addEventListener("click", () => {
    window.location.href = "maratona-scroll.html";
  });
}