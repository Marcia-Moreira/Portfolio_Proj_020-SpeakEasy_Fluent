import { listasPadrao } from "./data.js";

// =========================
// ACESSO A DADOS
// =========================

export async function getListas() {
  try {
    const res = await fetch("../data/frases.json");

    if (!res.ok) {
      throw new Error("Erro ao carregar JSON");
    }

    const data = await res.json();
    return data.listas || [];
  } catch (e) {
    return listasPadrao;
  }
}

export async function getListaById(id) {
  const listas = await getListas();
  return listas.find(l => l.id === id);
}
