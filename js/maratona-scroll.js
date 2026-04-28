import { getListas } from "./app.js";

const container = document.getElementById("scroll-content");
const speedInput = document.getElementById("speed");
const togglePt = document.getElementById("toggle-pt");
const titulo = document.getElementById("titulo-lista");
const progresso = document.getElementById("progresso");
const btnPlay = document.getElementById("playScroll");
const btnPause = document.getElementById("pauseScroll");
const btnReset = document.getElementById("resetScroll");

let todasListas = [];
let listaAtual = null;
let indiceListaAtual = 0;
let animacaoIniciada = false;

// =====================================================
async function carregarTodasListas() {
  todasListas = await getListas();
  if (!todasListas.length) {
    container.innerHTML = "<p>Nenhuma lista encontrada.</p>";
    return;
  }
  progresso.innerText = `${indiceListaAtual + 1}/${todasListas.length}`;
  await carregarLista(indiceListaAtual);
}

async function carregarLista(indice) {
  if (indice >= todasListas.length) {
    // Fim da maratona!
    container.innerHTML = "<h2 style='color:white; text-align:center;'>🏁 MARATONA CONCLUÍDA! 🎉</h2>";
    container.style.animation = "none";
    titulo.innerText = "🏁 Fim da Maratona!";
    return;
  }
  
  listaAtual = todasListas[indice];
  titulo.innerText = `📚 ${listaAtual.nome}  |  Maratona: ${indice + 1}/${todasListas.length}`;
  progresso.innerText = `${indice + 1}/${todasListas.length}`;
  render();
}

function render() {
  container.innerHTML = "";
  listaAtual.frases.forEach(frase => {
    const div = document.createElement("div");
    div.classList.add("scroll-item");
    div.innerHTML = `
      <div class="alvo">${frase.idioma_alvo}</div>
      ${togglePt.checked ? `<div class="nativo">${frase.idioma_nativo}</div>` : ""}
    `;
    container.appendChild(div);
  });
  
  animacaoIniciada = false;
  container.classList.remove("scroll-active");
  container.style.animation = "none";
  container.style.transform = "translateY(100%)";
}

function atualizarVelocidade() {
  const speed = Number(speedInput.value);
  let duration = 40 - (speed * 0.58);
  duration = Math.max(2, Math.min(50, duration));
  container.style.animationDuration = `${duration}s`;
}

function play() {
  if (!listaAtual) return;
  
  if (!animacaoIniciada) {
    const speed = Number(speedInput.value);
    let duration = 40 - (speed * 0.58);
    duration = Math.max(2, Math.min(50, duration));

    container.style.animation = "none";
    container.style.transform = "translateY(100%)";
    container.offsetHeight;
    container.style.animation = `scrollUp ${duration}s linear infinite`;
    container.classList.add("scroll-active");
    
    animacaoIniciada = true;
  } else {
    container.style.animationPlayState = "running";
  }
}

function pause() {
  if (animacaoIniciada) {
    container.style.animationPlayState = "paused";
  }
}

function reset() {
  container.style.animation = "none";
  container.classList.remove("scroll-active");
  container.style.transform = "translateY(100%)";
  container.offsetHeight;
  animacaoIniciada = false;
}

// 🔥 ESCUTA O FIM DA ANIMAÇÃO (quando todas frases passaram 1x)
function iniciarDetectorDeFim() {
  container.addEventListener("animationiteration", () => {
    // animationiteration acontece a cada ciclo completo
    // Quando uma lista termina, avança para a próxima
    if (animacaoIniciada) {
      avancarParaProximaLista();
    }
  });
}

async function avancarParaProximaLista() {
  // Para a animação atual
  container.style.animation = "none";
  container.classList.remove("scroll-active");
  animacaoIniciada = false;
  
  // Avança para próxima lista
  indiceListaAtual++;
  
  if (indiceListaAtual < todasListas.length) {
    await carregarLista(indiceListaAtual);
    // Auto-play da próxima lista
    play();
  } else {
    // Fim da maratona
    container.innerHTML = "<h2 style='color:white; text-align:center;'>🏁 MARATONA CONCLUÍDA! 🎉</h2>";
    container.style.animation = "none";
    titulo.innerText = "🏁 Fim da Maratona!";
  }
}

// Eventos
speedInput.addEventListener("input", atualizarVelocidade);
togglePt.addEventListener("change", () => {
  if (listaAtual) render();
});
btnPlay.addEventListener("click", play);
btnPause.addEventListener("click", pause);
btnReset.addEventListener("click", reset);

// Inicialização
carregarTodasListas();
iniciarDetectorDeFim();