import { getListaById } from "./app.js";

const container = document.getElementById("scroll-content");
const speedInput = document.getElementById("speed");
const togglePt = document.getElementById("toggle-pt");
const titulo = document.getElementById("titulo-lista");
const btnPlay = document.getElementById("playScroll");
const btnPause = document.getElementById("pauseScroll");
const btnReset = document.getElementById("resetScroll");

// 🔥 NOVO: controle se a animação já foi iniciada alguma vez
let animacaoIniciada = false;

function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

let listaAtual = null;

async function carregarLista() {
  const id = getIdFromURL();
  if (!id) {
    container.innerHTML = "<p>Escolha uma lista primeiro.</p>";
    return;
  }
  listaAtual = await getListaById(id);
  if (!listaAtual || !listaAtual.frases) {
    container.innerHTML = "<p>Lista vazia.</p>";
    return;
  }
  titulo.innerText = listaAtual.nome;
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
  
  // 🔥 NOVO: resetar o controle quando renderizar (toggle mudou)
  animacaoIniciada = false;
  container.classList.remove("scroll-active");
  container.style.animation = "none";
  container.style.transform = "translateY(100%)";
}

//! Alterado
function atualizarVelocidade() {
  // const speed = speedInput.value;
  // const duration = Math.max(5, 40 - speed);
  const speed = Number(speedInput.value);
  // speed 1 = 40s | speed 100 = 2s
  let duration = 40 - (speed * 0.58);
  // Garante que não fique negativo nem muito lento
  duration = Math.max(2, Math.min(50, duration));
  container.style.animationDuration = `${duration}s`;
}

speedInput.addEventListener("input", atualizarVelocidade);
togglePt.addEventListener("change", render);

carregarLista();

// 🟢 PLAY - inteligente
function play() {
  if (!animacaoIniciada) {
    // PRIMEIRA VEZ: começa do fundo
    // const speed = speedInput.value;
    // const duration = Math.max(5, 40 - speed);
    const speed = Number(speedInput.value);
    let duration = 40 - (speed * 0.58);
    // Garante que não fique negativo nem muito lento
    duration = Math.max(2, Math.min(50, duration));

    container.style.animation = "none";
    container.style.transform = "translateY(100%)";
    container.offsetHeight;
    container.style.animation = `scrollUp ${duration}s linear infinite`;
    container.classList.add("scroll-active");
    
    animacaoIniciada = true;
  } else {
    // JÁ RODOU: só despausa (continua de onde parou)
    container.style.animationPlayState = "running";
  }
}

// 🟡 PAUSE - só pausa
function pause() {
  if (animacaoIniciada) {
    container.style.animationPlayState = "paused";
  }
}

// 🔄 RESET - para e volta ao início (fundo)
function reset() {
  container.style.animation = "none";
  container.classList.remove("scroll-active");
  container.style.transform = "translateY(100%)";
  container.offsetHeight;
  
  // 🔥 IMPORTANTE: reseta a flag para começar do fundo no próximo play
  animacaoIniciada = false;
}

btnPlay.addEventListener("click", play);
btnPause.addEventListener("click", pause);
btnReset.addEventListener("click", reset);