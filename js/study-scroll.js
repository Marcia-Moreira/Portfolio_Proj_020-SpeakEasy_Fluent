// ANTES
// import { getListById } from "./app.js";

// DEPOIS - SUBSTITUA por:
// ═══════════════════════════════════════════════════════════════
// STUDY-SCROLL.JS - VERSÃO COM SCROLL SUAVE (INTERPOLAÇÃO)
// ═══════════════════════════════════════════════════════════════

import { getAnyContentById, getContentIdFromURL, getContentTypeFromURL } from "./app.js";

// ═══════════════════════════════════════════════════════════════
// 1. ELEMENTOS DA PÁGINA
// ═══════════════════════════════════════════════════════════════
const container = document.getElementById("scroll-content");
const speedInput = document.getElementById("speed");
const togglePt = document.getElementById("toggle-pt");
const titulo = document.getElementById("titulo-lista");
const btnPlay = document.getElementById("playScroll");
const btnPause = document.getElementById("pauseScroll");
const btnReset = document.getElementById("resetScroll");

// ═══════════════════════════════════════════════════════════════
// 2. VARIÁVEIS DE CONTROLE
// ═══════════════════════════════════════════════════════════════
let listaAtual = null;
let indiceAtual = 0;          // Índice da frase atual (0 = primeira)
let offsetY = 0;              // Posição Y atual (em pixels)
let offsetDestino = 0;        // Posição Y destino (onde queremos chegar)
//! Linha ~15: mude o 90 => 100 para frases maiores, 70 para menores
// Altura de cada frase (ajuste depois)
// const ALTURA_FRASE = 90;
// 🔥 NO INÍCIO DO ARQUIVO, depois das variáveis
// Detecta se é mobile e ajusta a altura da frase
const isMobile = window.innerWidth < 768;
const ALTURA_FRASE = isMobile ? 75 : 90; // 75px no celular, 90px no desktop
let loopAtivo = false;
let ultimoFrame = 0;
let tempoAcumulado = 0;
let tempoPorFrase = 2.5;      // Segundos por frase (ajustável)
let animacaoIniciada = false; // Flag de controle

// ═══════════════════════════════════════════════════════════════
// 3. FUNÇÃO PARA CALCULAR VELOCIDADE
// ═══════════════════════════════════════════════════════════════
function atualizarVelocidade() {
  if (!listaAtual || !listaAtual.phrases || listaAtual.phrases.length === 0) {
    return;
  }
  
  const speed = Number(speedInput.value);
  
  // Speed: 1 = 0.5x | 50 = 1x | 100 = 1.5x
  const multiplicador = 0.5 + (speed / 100);
  
  // Pega a frase atual (ou a primeira se não tiver)
  const idx = Math.min(indiceAtual, listaAtual.phrases.length - 1);
  const fraseAtual = listaAtual.phrases[idx] || listaAtual.phrases[0];
  const tamanhoFrase = fraseAtual.target_text.length;
  
  // 🔥 Cálculo inteligente: frases curtas passam rápido, longas demoram mais
  // 0.3s por palavra + 1.2s fixo
  const tempoBase = (tamanhoFrase / 10) + 1.2;
  
  // Aplica a velocidade:
  //! Linha ~58: mude o 1.2 => +2.0 = mais lento | +0.5 = mais rápido
  tempoPorFrase = tempoBase / multiplicador;
  
  // Limites de segurança
  tempoPorFrase = Math.max(0.5, Math.min(8, tempoPorFrase));
  
  // Atualiza o display
  const display = document.getElementById("velocidade-display");
  if (display) display.textContent = `${speed}%`;
}

// ═══════════════════════════════════════════════════════════════
// 4. FUNÇÃO PRINCIPAL: RENDER (com interpolação suave)
// ═══════════════════════════════════════════════════════════════
function render() {
  // Limpa o container
  container.innerHTML = "";
  
  // Verifica se tem dados
  if (!listaAtual || !listaAtual.phrases || listaAtual.phrases.length === 0) {
    container.innerHTML = "<p style='color:white;text-align:center;padding:20px;'>Nenhuma frase encontrada</p>";
    return;
  }
  
  // 🔥 CALCULA O OFFSET DESTINO (baseado no índice atual)
  offsetDestino = -indiceAtual * ALTURA_FRASE;
  //* DEPOIS (com ajuste para começar no meio)
// const containerHeight = container.parentElement.clientHeight || 500;
// const meioContainer = containerHeight / 2 - ALTURA_FRASE / 2;
// offsetDestino = -indiceAtual * ALTURA_FRASE + meioContainer;
  
  // 🔥 INTERPOLAÇÃO: move suavemente em direção ao destino
  const diferenca = offsetDestino - offsetY;
  if (Math.abs(diferenca) > 0.1) {
    //! Linha ~70: mude o 0.09 => 0.05 = mais lento | 0.15 = mais rápido
    offsetY += diferenca * 0.09; // 9% a cada frame (ajuste para suavidade)
  } else {
    offsetY = offsetDestino;
  }
  
  // Calcula quantas frases cabem na tela
  const containerHeight = container.parentElement.clientHeight || 500;
  const frasesVisiveis = Math.ceil(containerHeight / ALTURA_FRASE) + 2;
  
  // 🔥 Calcula quais frases mostrar (fatia do array)
  const inicio = Math.max(0, Math.floor(indiceAtual - frasesVisiveis / 2));
  const fim = Math.min(listaAtual.phrases.length, inicio + frasesVisiveis);
  const frasesParaMostrar = listaAtual.phrases.slice(inicio, fim);
  
  // 🔥 Cria APENAS as frases visíveis
  frasesParaMostrar.forEach((frase, index) => {
    const div = document.createElement("div");
    div.classList.add("scroll-item");
    div.style.cssText = `
      height: ${ALTURA_FRASE}px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 5px 20px;
      position: absolute;
      left: 0;
      right: 0;
      box-sizing: border-box;
      will-change: transform;
    `;
    
    // 🔥 POSIÇÃO: baseada no índice REAL + offset suave
    const posicaoReal = (inicio + index);
    const yPos = posicaoReal * ALTURA_FRASE + offsetY;
    div.style.transform = `translateY(${yPos}px)`;
    
    // ═══════════════════════════════════════════════════════════
    // 🔥 ADICIONE AQUI AS 5 LINHAS MÁGICAS
    // ═══════════════════════════════════════════════════════════
    const containerHeight = container.parentElement.clientHeight || 500;
    const centro = containerHeight / 2;
    const distancia = Math.abs(yPos + ALTURA_FRASE/2 - centro);
    
    if (distancia < ALTURA_FRASE) {
      div.classList.add('destaque');
    } else if (distancia < ALTURA_FRASE * 2) {
      div.classList.add('proximo');
    }
    // ═══════════════════════════════════════════════════════════

    // Conteúdo da frase
    div.innerHTML = `
      <div class="alvo" style="font-size:22px;color:white;text-align:center;font-weight:bold;">${frase.target_text}</div>
      ${togglePt.checked ? `<div class="nativo" style="font-size:18px;color:#cccccc;text-align:center;">${frase.native_text}</div>` : ""}
    `;
    
    container.appendChild(div);
  });
}

// ═══════════════════════════════════════════════════════════════
// 5. FUNÇÃO PARA AVANÇAR UMA FRASE
// ═══════════════════════════════════════════════════════════════
function avancarFrase() {
  if (!listaAtual || !listaAtual.phrases) return;
  
  indiceAtual++;
  
  // Loop infinito: quando chega no fim, volta ao início
  if (indiceAtual >= listaAtual.phrases.length) {
    indiceAtual = 0;
  }
  
  // Atualiza a velocidade para a nova frase
  atualizarVelocidade();
  
  // 🔥 O render() vai ser chamado no loopAnimacao()
}

// ═══════════════════════════════════════════════════════════════
// 6. LOOP DE ANIMAÇÃO (requestAnimationFrame)
// ═══════════════════════════════════════════════════════════════
function loopAnimacao(timestamp) {
  if (!loopAtivo) return;
  
  // Calcula o delta de tempo
  const delta = (timestamp - ultimoFrame) / 1000;
  ultimoFrame = timestamp;
  
  // Acumula o tempo
  tempoAcumulado += delta;
  
  // 🔥 VERIFICA SE DEVE AVANÇAR A FRASE
  if (tempoAcumulado >= tempoPorFrase) {
    tempoAcumulado = 0;
    avancarFrase(); // Avança o índice
  }
  
  // 🔥 SEMPRE RENDERIZA (para animar o offset suave)
  render();
  
  // Continua o loop
  requestAnimationFrame(loopAnimacao);
}

// ═══════════════════════════════════════════════════════════════
// 7. FUNÇÕES DE CONTROLE: PLAY, PAUSE, RESET
// ═══════════════════════════════════════════════════════════════
function iniciarLoop() {
  if (loopAtivo) return;
  if (!listaAtual || !listaAtual.phrases || listaAtual.phrases.length === 0) {
    alert("Carregue uma lista primeiro!");
    return;
  }
  
  loopAtivo = true;
  animacaoIniciada = true;
  ultimoFrame = performance.now();
  tempoAcumulado = 0;
  
  // Garante que o tempoPorFrase tem um valor
  if (!tempoPorFrase || tempoPorFrase <= 0) {
    tempoPorFrase = 2.5;
  }
  
  // Inicia o loop
  requestAnimationFrame(loopAnimacao);
}

function pararLoop() {
  loopAtivo = false;
  animacaoIniciada = false;
}

function play() {
  if (loopAtivo) return;
  
  // Se não tem lista, carrega
  if (!listaAtual) {
    carregarLista();
    setTimeout(() => {
      if (listaAtual) iniciarLoop();
    }, 100);
    return;
  }
  
  // Se chegou no fim, volta ao início
  if (indiceAtual >= listaAtual.phrases.length) {
    indiceAtual = 0;
    render();
  }
  
  iniciarLoop();
  btnPlay.textContent = "▶️ Rodando...";
}

function pause() {
  if (loopAtivo) {
    pararLoop();
    btnPlay.textContent = "▶️ Continuar";
  }
}

function reset() {
  pararLoop();
  indiceAtual = 0;
  offsetY = 0;
  offsetDestino = 0;
  tempoAcumulado = 0;
  render();
  btnPlay.textContent = "▶️ Play";
}

// ═══════════════════════════════════════════════════════════════
// 8. CARREGAR LISTA DA URL
// ═══════════════════════════════════════════════════════════════
async function carregarLista() {
  const id = getContentIdFromURL();
  const type = getContentTypeFromURL();
  
  if (!id) {
    container.innerHTML = "<p style='color:white;text-align:center;padding:20px;'>Escolha uma lista primeiro.</p>";
    return;
  }
  
  listaAtual = await getAnyContentById(id);
  
  if (!listaAtual || !listaAtual.phrases) {
    container.innerHTML = "<p style='color:white;text-align:center;padding:20px;'>Conteúdo vazio.</p>";
    return;
  }
  
  // Título
  if (listaAtual.contentType === "series") {
    titulo.innerText = `📺 ${listaAtual.series_name} - ${listaAtual.name}`;
  } else if (listaAtual.contentType === "song") {
    titulo.innerText = `🎵 ${listaAtual.artist} - ${listaAtual.song_name}`;
  } else {
    titulo.innerText = `📚 ${listaAtual.name}`;
  }
  
  // Reseta os índices
  indiceAtual = 0;
  offsetY = 0;
  offsetDestino = 0;
  tempoAcumulado = 0;
  
  // Para o loop se estiver rodando
  if (loopAtivo) pararLoop();
  btnPlay.textContent = "▶️ Play";
  
  // Calcula velocidade inicial
  atualizarVelocidade();
  
  // Renderiza
  render();
}

// ═══════════════════════════════════════════════════════════════
// 9. EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════
speedInput.addEventListener("input", function() {
  atualizarVelocidade();
  // 🔥 Se estiver rodando, NÃO reinicia - só muda a velocidade
});

togglePt.addEventListener("change", function() {
  render(); // Re-renderiza com/sem português
});

btnPlay.addEventListener("click", play);
btnPause.addEventListener("click", pause);
btnReset.addEventListener("click", reset);

// ═══════════════════════════════════════════════════════════════
// 10. INICIALIZAÇÃO
// ═══════════════════════════════════════════════════════════════
carregarLista();

console.log("✅ Study Scroll carregado com sucesso!");
console.log(`📦 Altura da frase: ${ALTURA_FRASE}px`);