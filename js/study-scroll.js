// ANTES
// import { getListById } from "./app.js";

// DEPOIS - SUBSTITUA por:
import { getAnyContentById, getContentIdFromURL, getContentTypeFromURL } from "./app.js";

const container = document.getElementById("scroll-content");
const speedInput = document.getElementById("speed");
const togglePt = document.getElementById("toggle-pt");
const titulo = document.getElementById("titulo-lista");
const btnPlay = document.getElementById("playScroll");
const btnPause = document.getElementById("pauseScroll");
const btnReset = document.getElementById("resetScroll");

// 🔥 NOVO: controle se a animação já foi iniciada alguma vez
let animacaoIniciada = false;

// function getIdFromURL() {
//   const params = new URLSearchParams(window.location.search);
//   return params.get("id");
// }

//!DEPOIS - REMOVA essa função e use as do app.js ???

let listaAtual = null;

async function carregarLista() {
  const id = getContentIdFromURL();
  const type = getContentTypeFromURL();
  
  if (!id) {
    container.innerHTML = "<p>Escolha uma lista primeiro.</p>";
    return;
  }
  
  listaAtual = await getAnyContentById(id);
  
  if (!listaAtual || !listaAtual.phrases) {
    container.innerHTML = "<p>Conteúdo vazio.</p>";
    return;
  }
  
  // Título diferente conforme o tipo
  if (listaAtual.contentType === "series") {
    titulo.innerText = `📺 ${listaAtual.series_name} - ${listaAtual.name}`;
  } else if (listaAtual.contentType === "song") {
    titulo.innerText = `🎵 ${listaAtual.artist} - ${listaAtual.song_name}`;
  } else {
    titulo.innerText = `📚 ${listaAtual.name}`;
  }
  
  render();
}

function render() {
  container.innerHTML = "";
  listaAtual.phrases.forEach(frase => {
    const div = document.createElement("div");
    div.classList.add("scroll-item");
    div.innerHTML = `
      <div class="alvo">${frase.target_text}</div>
      ${togglePt.checked ? `<div class="nativo">${frase.native_text}</div>` : ""}
    `;
    container.appendChild(div);
  });
  
  // 🔥 NOVO: resetar o controle quando renderizar (toggle mudou)
  animacaoIniciada = false;
  container.classList.remove("scroll-active");
  container.style.animation = "none";
  //! container.style.transform = "translateY(100%)";
  // container.style.transform = "translateY(0)";
}

//! Alterado
function atualizarVelocidade() {
  if (!listaAtual) return;
  
  const speed = Number(speedInput.value);
  
  // 🔥 VELOCIDADE BASE: 30 caracteres por segundo
  // speed 1 = 0.5x (mais lento) | speed 100 = 2x (mais rápido)
  const multiplicador = 0.5 + (speed / 100);
  // speed 1 = 0.5 | speed 100 = 1.5
  
  // Calcula tempo total baseado nos caracteres de TODAS as frases
  let totalCaracteres = 0;
  listaAtual.phrases.forEach(frase => {
    totalCaracteres += frase.target_text.length;
  });
  
  // Tempo base = total caracteres / 30 caracteres por segundo
  let tempoBase = totalCaracteres / 30;
  
  // Aplica o multiplicador da velocidade
  let duration = tempoBase / multiplicador;
  
  // Limites: mínimo 2 segundos, máximo 90 segundos
  duration = Math.max(2, Math.min(90, duration));
  
  container.style.animationDuration = `${duration}s`;
}

speedInput.addEventListener("input", atualizarVelocidade);
togglePt.addEventListener("change", render);

carregarLista();

// 🟢 PLAY - inteligente
function play() {
  if (!animacaoIniciada) {
    const speed = Number(speedInput.value);
    
    // Mesmo cálculo da atualizarVelocidade
    const multiplicador = 0.5 + (speed / 100);
    
    let totalCaracteres = 0;
    listaAtual.phrases.forEach(frase => {
      totalCaracteres += frase.target_text.length;
    });
    
    let tempoBase = totalCaracteres / 30;
    let duration = tempoBase / multiplicador;
    duration = Math.max(2, Math.min(90, duration));

    container.style.animation = "none";
    container.offsetHeight;
    container.style.animation = `scrollUp ${duration}s linear infinite`;
    container.classList.add("scroll-active");
    
    animacaoIniciada = true;
  } else {
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
  //! container.style.transform = "translateY(100%)";
  // container.style.transform = "translateY(0)";
  container.offsetHeight;
  
  // 🔥 IMPORTANTE: reseta a flag para começar do fundo no próximo play
  animacaoIniciada = false;
}

btnPlay.addEventListener("click", play);
btnPause.addEventListener("click", pause);
btnReset.addEventListener("click", reset);