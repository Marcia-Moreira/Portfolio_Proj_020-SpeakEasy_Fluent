import { getListaById } from "./app.js";

const titulo = document.getElementById("titulo-lista");
const fraseAtualDiv = document.getElementById("frase-atual");
// Btn Play e Pause
const btnPlay = document.getElementById("play");
const btnPause = document.getElementById("pause");
// Velocidade do Ingles/Idioma Alvo
const rateInput = document.getElementById("rate");
const rateValue = document.getElementById("rate-value");
// Botões adicionais
const btnNext = document.getElementById("next");
const btnPrev = document.getElementById("prev");
const btnRepeat = document.getElementById("repeat");
const toggleTraducao = document.getElementById("toggle-traducao");

//* =====================================================
function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

let listaAtual = null;
let index = 0;
let isPlaying = false;
let audioAtivo = false;  // 🔥 NOVO: controle para não matar o áudio

//* =====================================================
//* FUNÇÃO CARREGAR LISTA
//* =====================================================
async function carregarLista() {
  const id = getIdFromURL();

  if (!id) {
    fraseAtualDiv.innerText = "Escolha uma lista primeiro.";
    return;
  }

  listaAtual = await getListaById(id);

  if (!listaAtual || !listaAtual.frases) {
    fraseAtualDiv.innerText = "Lista vazia.";
    return;
  }

  titulo.innerText = listaAtual.nome;
}

//* =====================================================
//* FUNÇÃO FALAR
//* =====================================================
function falar(texto, lang = "en-US") {
  return new Promise(resolve => {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = lang;

    // 👇 ESSA LINHA controla os dois (inglês e português)
    utterance.rate = parseFloat(rateInput.value);

    utterance.onend = resolve;

    speechSynthesis.speak(utterance);
  });
}

rateInput.addEventListener("input", () => {
  rateValue.textContent = rateInput.value + "x";
});

// 🔥 BLOCO QUE ALTERA FRASE 
toggleTraducao.addEventListener("change", () => {
  if (listaAtual && listaAtual.frases[index]) {
    const frase = listaAtual.frases[index];
    // Mantém o mesmo padrão sem classes
    if (toggleTraducao.checked) {
      fraseAtualDiv.innerHTML = `
        <div>${frase.idioma_alvo}</div>
        <div style="color: gray;">${frase.idioma_nativo}</div>
      `;
    } else {
      fraseAtualDiv.innerHTML = `
        <div>${frase.idioma_alvo}</div>
      `;
    }
  }
});

//! Verificar se podemos criar codigo que troca a frase DO BTN TOGGLE tipo exibe/não exibe

//* =====================================================
//* FUNÇÃO PLAYLOOP
//* =====================================================
async function playLoop() {
  if (!listaAtual) return;
  
  isPlaying = true;
  audioAtivo = true;
  
  while (isPlaying && audioAtivo) {
    const frase = listaAtual.frases[index];
    
    // Mesma lógica do tocarFrase
    if (toggleTraducao.checked) {
      fraseAtualDiv.innerHTML = `
        <div>${frase.idioma_alvo}</div>
        <div style="color: gray;">${frase.idioma_nativo}</div>
      `;
    } else {
      fraseAtualDiv.innerHTML = `
        <div>${frase.idioma_alvo}</div>
      `;
    }
    
    // Primeira vez em Idioma Alvo
    if (!isPlaying) break;
    await falar(frase.idioma_alvo, "en-US");
    
    if (!isPlaying) break;
    await delay(500);

    // Segunda vez em Idioma Alvo (repetição)
    if (!isPlaying) break;
    await falar(frase.idioma_alvo, "en-US");
    
    if (!isPlaying) break;
    await delay(500);

    // Terceira vez em Idioma Nativo (repetição)
    if (toggleTraducao.checked) {
      if (!isPlaying) break;
      await falar(frase.idioma_nativo, "pt-BR");
      if (!isPlaying) break;
      await delay(500);
    }
    
    // Quarta vez em Idioma Alvo (repetição final)
    if (!isPlaying) break;
    await falar(frase.idioma_alvo, "en-US");
    
    if (!isPlaying) break;
    await delay(1000);
    
    index = (index + 1) % listaAtual.frases.length;
  }
}

//* =====================================================
//* FUNÇÃO DELAY
//* =====================================================
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// BTN Play:
btnPlay.addEventListener("click", () => {
  if (!isPlaying) {
    audioAtivo = true;
    // speechSynthesis.cancel();
    // 🔥 FORÇA PARAR QUALQUER ÁUDIO RODANDO
    playLoop();
  }
});

// BTN Pause:
btnPause.addEventListener("click", () => {
  isPlaying = false;
  audioAtivo = false;
  speechSynthesis.cancel();
  // Pequeno delay para reiniciar o sistema
  setTimeout(() => {
    speechSynthesis.resume();
  }, 100);
});

carregarLista();

//* =====================================================
//* FUNÇÃO TOCAR FRASE (para os botões de controle manual)
//* =====================================================
async function tocarFrase(frase) {
  // Volta ao HTML simples, sem classes
  if (toggleTraducao.checked) {
    fraseAtualDiv.innerHTML = `
      <div>${frase.idioma_alvo}</div>
      <div style="color: gray;">${frase.idioma_nativo}</div>
    `;
  } else {
    fraseAtualDiv.innerHTML = `
      <div>${frase.idioma_alvo}</div>
    `;
  }
  // Primeira vez Idioma Alvo
  await falar(frase.idioma_alvo, "en-US");
  await delay(300);

  // Segunda vez Idioma Alvo
  await falar(frase.idioma_alvo, "en-US");
  await delay(300);
  
  // Primeira vez Idioma Nativo
  if (toggleTraducao.checked) {
    await falar(frase.idioma_nativo, "pt-BR");
    await delay(300);
  }
  
  // Terceira vez Idioma Alvo
  await falar(frase.idioma_alvo, "en-US");
}

//* =====================================================
//* Botão Anterior / Prev  Erro Esta repetindo a anterior 2x
//* =====================================================
btnPrev.addEventListener("click", async () => {
  if (!listaAtual) return;
  
  // Interrompe o loop atual
  const estavaRodando = isPlaying;
  isPlaying = false;
  
  // Aguarda o áudio atual terminar naturalmente
  await delay(200);
  
  // Volta a frase
  index = (index - 1 + listaAtual.frases.length) % listaAtual.frases.length;
  
  // Toca a nova frase
  const frase = listaAtual.frases[index];
  await tocarFrase(frase);
  
  // Retoma o loop se estava rodando
  if (estavaRodando) {
    isPlaying = true;
    playLoop();
  }
});

//* =====================================================
//* Botão Repetir / Repeat OK
//* =====================================================
btnRepeat.addEventListener("click", async () => {
  if (!listaAtual) return;
  
  // Interrompe o loop atual
  const estavaRodando = isPlaying;
  isPlaying = false;
  
  // Aguarda o áudio atual terminar naturalmente
  await delay(200);
  
  // Toca a frase atual sem cancel
  const frase = listaAtual.frases[index];
  await tocarFrase(frase);
  
  // Retoma o loop se estava rodando
  if (estavaRodando) {
    isPlaying = true;
    playLoop();
  }
});

//* =====================================================
//* Botão Próxima / Next  ! Parece OK
//* =====================================================
btnNext.addEventListener("click", async () => {
  if (!listaAtual) return;
  
  // Interrompe o loop atual
  const estavaRodando = isPlaying;
  isPlaying = false;
  
  // Aguarda o áudio atual terminar naturalmente
  await delay(200);
  
  // Avança a frase
  index = (index + 1) % listaAtual.frases.length;
  
  // Toca a nova frase
  const frase = listaAtual.frases[index];
  await tocarFrase(frase);
  
  // Retoma o loop se estava rodando
  if (estavaRodando) {
    isPlaying = true;
    playLoop();
  }
});

//* =====================================================

