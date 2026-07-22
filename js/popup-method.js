// ═══════════════════════════════════════════════════════════════
// POPUP-METHOD.JS - Popup de escolha de modo
// ═══════════════════════════════════════════════════════════════

// 🔥 PEGA OS PARÂMETROS DA URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const type = params.get('type');
const name = params.get('name');

// 🔥 MOSTRA O NOME DO ITEM
const itemNameElement = document.getElementById('popup-item-name');
if (itemNameElement) {
  itemNameElement.textContent = name || 'Item selecionado';
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO: ESCOLHER MODO
// ═══════════════════════════════════════════════════════════════
function escolherModo(modo) {
  if (!id) {
    alert('Erro: ID não encontrado!');
    return;
  }
  
  // 🔥 MAPEIA MODO → PÁGINA CORRESPONDENTE
  // const paginas = {
  //   'scroll': '../templates/study-scroll.html',
  //   'cards': '../templates/study-audio.html',
  //   'maratona': '../templates/study-marathon.html'
  // };
  
  // 🔥 USA O CAMINHO COMPLETO A PARTIR DA RAIZ
  const paginas = {
    'scroll': '/templates/mode-scroll.html',    // ← barra no início
    // 'cards': '/templates/mode-speak.html',
    'speak': '/templates/mode-speak.html',
    'recall': '/templates/mode-recall.html',
    // 'marathon': '/templates/mode-marathon.html'
  };

  const paginaDestino = paginas[modo];
  
  if (!paginaDestino) {
    alert(`Modo "${modo}" ainda não implementado!`);
    return;
  }
  
  // 🔥 CONSTRÓI A URL
  const url = `${paginaDestino}?id=${id}&type=${type}`;
  
  // 🔥 REDIRECIONA
  window.location.href = url;
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO: FECHAR POPUP
// ═══════════════════════════════════════════════════════════════
function fecharPopup() {
  window.history.back();
}

// 🔥 EXPÕE AS FUNÇÕES PARA O HTML
window.escolherModo = escolherModo;
window.fecharPopup = fecharPopup;

console.log('✅ Popup de métodos carregado!');