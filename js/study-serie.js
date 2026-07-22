import { getSeries } from "./app.js";

function getModoFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("modo");
}

const modo = getModoFromURL();
const container = document.getElementById("listas");

async function renderSeries() {
  const series = await getSeries();

  series.forEach(serie => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `<strong>${serie.name}</strong>`;

    // card.addEventListener("click", () => {
    //   window.location.href = `study-detail.html?id=${lista.id}`;
    //   window.location.href = `mode-scroll.html?id=${lista.id}`;
    //   window.location.href = `mode-speak.html?id=${lista.id}`;
    // });

    // card.addEventListener("click", () => {
    //   if (modo === "audio") {
    //     window.location.href = `mode-speak.html?id=${serie.id}`;
    //   } else {
    //     // default = scroll
    //     window.location.href = `mode-scroll.html?id=${serie.id}`;
    //   }
    // });

    // 🔥 NOVO: Abre o popup em vez de ir direto pro modo
    card.addEventListener('click', function() {
      const id = serie.id;
      const type = serie.type || 'serie';
      const name = serie.series_name || serie.name || 'Item';
      
      window.location.href = `popup-method.html?id=${id}&type=${type}&name=${encodeURIComponent(name)}`;
    });

    // // 🔥 SUBSTITUA POR ISSO: Para abrir Popup
    // card.addEventListener('click', function() {
    //   const id = item.id;                    // ID do item
    //   const type = item.type || 'serie';      // Tipo (song, series, list)
    //   const name = item.song_name || item.series_name || item.name || 'Item';
      
    //   // 🔥 Abre o popup em vez do scroll
    //   window.location.href = `popup-method.html?id=${id}&type=${type}&name=${encodeURIComponent(name)}`;
    // });


    container.appendChild(card);
  });

  //* TESTES PARA VER SE ESTÁ PEGANDO O ID DA URL CORRETAMENTE:
// console.log("URL:", window.location.href);
// console.log("ID:", getIdFromURL());

// console.log("SERIE COMPLETA:", JSON.stringify(serie, null, 2));
console.log(serie)
}

renderSeries();

// window.location.href = `study-detail.html?id=${lista.id}`;
// window.location.href = `mode-speak.html?id=${lista.id}`;

const btnMaratona = document.getElementById("btnMaratonaScroll");
if (btnMaratona) {
  btnMaratona.addEventListener("click", () => {
    window.location.href = "mode-marathon.html";
  });
}

