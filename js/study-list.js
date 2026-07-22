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
    // REVER
    card.innerHTML += `<br><small>${lista.label || lista.name}</small>`;

    // card.addEventListener("click", () => {
    //   window.location.href = `study-detail.html?id=${lista.id}`;
    //   window.location.href = `mode-scroll.html?id=${lista.id}`;
    //   window.location.href = `mode-speak.html?id=${lista.id}`;
    // });

    // card.addEventListener("click", () => {
    //   if (modo === "audio") {
    //     window.location.href = `mode-speak.html?id=${lista.id}`;
    //   } else {
    //     // default = scroll
    //     window.location.href = `mode-scroll.html?id=${lista.id}`;
    //   }
    // });

    // // 🔥 SUBSTITUA POR ISSO: Para abrir Popup
    // card.addEventListener('click', function() {
    //   const id = item.id;                    // ID do item
    //   const type = item.type || 'list';      // Tipo (song, series, list)
    //   const name = item.song_name || item.series_name || item.name || 'Item';
      
    //   // 🔥 Abre o popup em vez do scroll
    //   window.location.href = `popup-method.html?id=${id}&type=${type}&name=${encodeURIComponent(name)}`;
    // });

    card.addEventListener('click', function() {
    // 🔥 USA O NOME QUE ESTÁ NO forEach
    const id = lista.id;  // ← se for "item"
    const type = lista.type || 'lista';
    const name = lista.name || lista.title || 'Lista';
    // const label = lista.label || 'Lista';

    window.location.href = `popup-method.html?id=${id}&type=${type}&name=${encodeURIComponent(name)}`;
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
    // REVER
    window.location.href = "mode-marathon.html";
  });
}

//! REVER não funciona

// const btnMaratona = document.getElementById("btnMaratonaScroll");
// if (btnMaratona) {
//   btnMaratona.addEventListener("click", () => {
//     abrirPopupMaratona();  // ← Abre o popup de escolha!
//   });
// }