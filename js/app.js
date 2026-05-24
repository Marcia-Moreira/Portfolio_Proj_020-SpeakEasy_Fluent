import { listasPadrao } from "./data.js";

// =========================
// ACESSO A DADOS  
//! Verificar como trocar listas por lits do json, ou seja, como acessar o json e usar os dados dele
// =========================

export async function getListas() {
  try {
    const res = await fetch("../data/lists.json");

    if (!res.ok) {
      throw new Error("Erro ao carregar JSON");
    }

    const data = await res.json();
    return data.lists || [];
  } catch (e) {
    return listasPadrao;
  }
}
// Rever essa alteração
export async function getListaById(id) {
  const lists = await getListas();
  return lists.find(l => l.id === id);
}
