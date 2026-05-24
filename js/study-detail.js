import { getListaById } from "./app.js";

const titulo = document.getElementById("titulo-lista");
// verificar phrases ou frases
const container = document.getElementById("frases");

function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function render() {
  const id = getIdFromURL();

  const lista = await getListaById(id);

  if (!lista) {
    titulo.innerText = "Lista não encontrada";
    return;
  }

  titulo.innerText = lista.name;

  if (!lista.phrases || lista.phrases.length === 0) {
    container.innerHTML = "<p>Sem frases ainda.</p>";
    return;
  }

  lista.phrases.forEach(frase => {
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
