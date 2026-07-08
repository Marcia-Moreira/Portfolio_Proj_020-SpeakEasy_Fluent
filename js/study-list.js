import { getLists } from "./app.js";

function getModoFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("modo");
}

const modo = getModoFromURL();
const container = document.getElementById("listas");

async function renderListas() {
  const listas = await getLists();

  listas.forEach(lista => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `<strong>${lista.name}</strong>`;

    // card.addEventListener("click", () => {
    //   window.location.href = `study-detail.html?id=${lista.id}`;
    //   window.location.href = `mode-scroll.html?id=${lista.id}`;
    //   window.location.href = `mode-speak.html?id=${lista.id}`;
    // });

    card.addEventListener("click", () => {
      if (modo === "audio") {
        window.location.href = `mode-speak.html?id=${lista.id}`;
      } else {
        // default = scroll
        window.location.href = `mode-scroll.html?id=${lista.id}`;
      }
    });


    container.appendChild(card);
  });
}

renderListas();

// window.location.href = `study-detail.html?id=${lista.id}`;
// window.location.href = `mode-speak.html?id=${lista.id}`;

const btnMaratona = document.getElementById("btnMaratonaScroll");
if (btnMaratona) {
  btnMaratona.addEventListener("click", () => {
    window.location.href = "maratona-scroll.html";
  });
}