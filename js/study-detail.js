import { getSerieById } from "./app.js";

const titulo = document.getElementById("titulo-lista");
// verificar phrases ou frases ok
const container = document.getElementById("frases");

function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function render() {
  const id = getIdFromURL();

  const serie = await getSerieById(id);

  if (!serie) {
    titulo.innerText = "Lista não encontrada";
    return;
  }

  titulo.innerText = serie.name;

  if (!serie.phrases || serie.phrases.length === 0) {
    container.innerHTML = "<p>Sem frases ainda.</p>";
    return;
  }

  serie.phrases.forEach(frase => {
    const div = document.createElement("div");
    div.classList.add("frase-card");

    div.innerHTML = `
      <div class="frase-en">${frase.target_text}</div>
      <div class="frase-pt">${frase.native_text}</div>
    `;

    container.appendChild(div);
  });
}

render();
