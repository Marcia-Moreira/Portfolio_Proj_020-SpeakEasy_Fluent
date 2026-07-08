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

    card.addEventListener("click", () => {
// study-song-speak.html
      if (modo === "audio") {

        // window.location.href = `mode-speak.html?id=${song.id}`;
        window.location.href = `mode-speak.html?type=song&id=${song.id}`;

      } else {

        // window.location.href = `mode-scroll.html?id=${song.id}`;
        window.location.href = `mode-scroll.html?type=song&id=${song.id}`;

      }

    });

    container.appendChild(card);

  });

}

renderSongs();

const btnMaratona = document.getElementById("btnMaratonaSong");

if(btnMaratona){

  btnMaratona.addEventListener("click",()=>{

      window.location.href="maratona-scroll.html";

  });

}