import {
  listasPadrao,
  seriesPadrao,
  songsPadrao
} from "./data.js";

// =========================
//! ROTEADOR UNIVERSAL
// =========================

export async function getAnyContentById(id) {
  // Tenta achar nos 3 tipos
  const list = await getListById(id);
  if (list) return { ...list, contentType: "list" };
  
  const serie = await getSerieById(id);
  if (serie) return { ...serie, contentType: "series" };
  
  const song = await getSongById(id);
  if (song) return { ...song, contentType: "song" };
  
  return null;
}

// =========================
//! EXTRAIR ID E TIPO DA URL
// =========================

export function getContentIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

export function getContentTypeFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("type") || "list"; // padrão é list
}

// =========================
// LISTAS
// =========================

export async function getLists() {
  try {
    const res = await fetch("../data/lists.json");

    if (!res.ok) {
      throw new Error("Erro ao carregar lists.json");
    }

    const data = await res.json();

    return data.lists || [];
  } catch (e) {
    return listasPadrao;
  }
}

export async function getListById(id) {
  const lists = await getLists();

  return lists.find(l => l.id === id);
}


// =========================
// SERIES
// =========================

export async function getSeries() {
  try {
    const res = await fetch("../data/series.json");

    if (!res.ok) {
      throw new Error("Erro ao carregar series.json");
    }

    const data = await res.json();

    return data.series || [];
  } catch (e) {
    return seriesPadrao;
  }
}

export async function getSerieById(id) {
  const series = await getSeries();

  return series.find(s => s.id === id);
}


// =========================
// SONGS
// =========================

export async function getSongs() {
  try {
    const res = await fetch("../data/songs.json");

    if (!res.ok) {
      throw new Error("Erro ao carregar songs.json");
    }

    const data = await res.json();

    return data.songs || [];
  } catch (e) {
    return songsPadrao;
  }
}

export async function getSongById(id) {
  const songs = await getSongs();

  return songs.find(s => s.id === id);
}

// TESTES PARA VER SE ESTÁ PEGANDO O ID DA URL CORRETAMENTE:
// console.log("URL:", window.location.href);
// console.log("ID:", getIdFromURL());
// console.log("URL ID:", id);
// console.log("SERIE ENCONTRADA:", serie);