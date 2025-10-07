const Frame = document.querySelector(".Projects-Frame");
const HAF = document.querySelectorAll(".hideAfterFullscreen");
const IFrame = document.querySelector(".Projects-IFrame");
const gameContainer = document.querySelector(".Projects-Container");
const searchBar = document.getElementById("GameSearchBar");

async function addGames() {
  try {
    // Paralel veri çekme
    const [cdnResponse, listResponse] = await Promise.all([
      fetch("./Hosting/CDN.json?hah").then((res) => res.json()),
      fetch("./Hosting/CDN.json?hah").then(async (res) => {
        const cdn = await res.json();
        return fetch(cdn + "list.json?cfa3ss").then((res) => res.json());
      }),
    ]);

    const cdn = cdnResponse;
    const games = listResponse;

    // Oyunları ada göre sıralama (eksikse boş string varsayılır)
    games.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    // Tek seferde DOM'a eklemek için DocumentFragment kullanımı
    const fragment = document.createDocumentFragment();

    games.forEach((game) => {
      const project = document.createElement("div");
      project.className = "Projects-Project";
      project.innerHTML = `
        <img src="${game.gameroot || ''}" loading="lazy" onerror="this.style.display='none';"/>
        <h2>${game.name || "Unknown"}</h2>
        <h4 style="display:none;">${game.name || "Unknown"}</h4>
      `;

      project.addEventListener("click", () => {
        console.log("acilis");
        show_preroll();

        HAF.forEach((element) => element.classList.add("hidden"));
        Frame.classList.remove("hidden");
        IFrame.src = `${cdn}${game.linksrc || ""}`;
      });

      fragment.appendChild(project);
    });

    gameContainer.appendChild(fragment); // Tek seferde DOM'a ekleme

  } catch (error) {
    console.error("Oyunları yüklerken hata oluştu:", error);
  }
}

Frame.querySelector(".Projects-FrameBar").addEventListener("click", (event) => {
  console.log("kapanis");

  if (event.target.id === "close") {
    HAF.forEach((element) => element.classList.remove("hidden"));
    Frame.classList.add("hidden");
    IFrame.src = "";
  } else if (event.target.id === "fullscreen") {
    const requestFullscreen =
      IFrame.requestFullscreen ||
      IFrame.webkitRequestFullscreen ||
      IFrame.msRequestFullscreen;
    requestFullscreen.call(IFrame);
  } else if (event.target.id === "link") {
    window.open(IFrame.src);
  }
});

searchBar.addEventListener("input", () => {
  const searchQuery = searchBar.value.trim().toLowerCase();
  const games = gameContainer.querySelectorAll(".Projects-Project");

  games.forEach((game) => {
    const gameName = game.querySelector("h4").innerText.trim().toLowerCase();
    game.classList.toggle("hidden", !gameName.includes(searchQuery));
  });
});

addGames();
