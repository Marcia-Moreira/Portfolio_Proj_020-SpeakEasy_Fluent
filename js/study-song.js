import { getSongs } from "./app.js";

function getModoFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("modo");
}

const modo = getModoFromURL();
const container = document.getElementById("songs");

async function renderSongs() {

  const songs = await getSongs();

  songs.forEach(song => {

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <strong>🎵 ${song.name}</strong><br>
      <small>${song.artist}</small>
    `;

    // card.addEventListener("click", () => {
    // // study-song-speak.html
    //   if (modo === "audio") {

    //     // window.location.href = `mode-speak.html?id=${song.id}`;
    //     window.location.href = `mode-speak.html?type=song&id=${song.id}`;

    //   } else {

    //     // window.location.href = `mode-scroll.html?id=${song.id}`;
    //     window.location.href = `mode-scroll.html?type=song&id=${song.id}`;

    //   }

    // });

    // // 🔥 SUBSTITUA POR ISSO:
    // card.addEventListener('click', function() {
    //   const id = item.id;                    // ID do item
    //   const type = item.type || 'song';      // Tipo (song, serie, list)
    //   const name = item.song_name || item.series_name || item.name || 'Item';
      
    //   // 🔥 Abre o popup em vez do scroll
    //   window.location.href = `popup-method.html?id=${id}&type=${type}&name=${encodeURIComponent(name)}`;
    // });

    card.addEventListener('click', function() {
    // 🔥 USA O NOME QUE ESTÁ NO forEach
    const id = song.id;  // ← se for "musica"
    const type = song.type || 'song';
    const name = song.song_name || song.name || 'Música';
    
    window.location.href = `popup-method.html?id=${id}&type=${type}&name=${encodeURIComponent(name)}`;
  });

    container.appendChild(card);

  });

}

renderSongs();

const btnMaratona = document.getElementById("btnMaratonaSong");

if(btnMaratona){

  btnMaratona.addEventListener("click",()=>{

      window.location.href="mode-marathon.html";

  });

}