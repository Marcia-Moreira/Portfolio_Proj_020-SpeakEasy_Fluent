import { getListaById } from "./app.js";

const titulo = document.getElementById("titulo-lista");
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

  titulo.innerText = lista.nome;

  if (!lista.frases || lista.frases.length === 0) {
    container.innerHTML = "<p>Sem frases ainda.</p>";
    return;
  }

  lista.frases.forEach(frase => {
    const div = document.createElement("div");
    div.classList.add("frase-card");

    div.innerHTML = `
      <div class="frase-en">${frase.idioma_alvo}</div>
      <div class="frase-pt">${frase.idioma_nativo}</div>
    `;

    container.appendChild(div);
  });
}

render();
