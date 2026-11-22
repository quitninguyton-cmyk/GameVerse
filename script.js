
const gameList = document.getElementById("game-list");
const favoriteList = document.getElementById("favorite-list");
const searchInput = document.getElementById("search");

let favorites = JSON.parse(localStorage.getItem("gameverse-favorites") || "[]");

function renderGames(list, container) {
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No games found.</p>";
    return;
  }

  list.forEach(game => {
    const isFavorite = favorites.includes(game.id);

    const card = document.createElement("div");
    card.className = "game-card";

    const title = document.createElement("h3");
    title.textContent = game.emoji + " " + game.name;

    const description = document.createElement("p");
    description.textContent = game.description;

    const category = document.createElement("p");
    category.textContent = "Category: " + game.category;

    const playButton = document.createElement("button");
    playButton.textContent = "▶ Play Now";
    playButton.addEventListener("click", () => openGame(game));

    const favoriteButton = document.createElement("button");
    favoriteButton.textContent = isFavorite ? "⭐ Saved" : "☆ Favorite";
    favoriteButton.style.marginLeft = "8px";
    favoriteButton.addEventListener("click", () => toggleFavorite(game.id));

    card.append(title, description, category, playButton, favoriteButton);
    container.appendChild(card);
  });
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem("gameverse-favorites", JSON.stringify(favorites));
  refreshGames();
}

function refreshGames() {
  const search = searchInput.value.toLowerCase();

  const filtered = games.filter(game =>
    game.name.toLowerCase().includes(search) ||
    game.category.toLowerCase().includes(search)
  );

  renderGames(filtered, gameList);

  const savedGames = games.filter(game => favorites.includes(game.id));
  renderGames(savedGames, favoriteList);
}

function openGame(game) {
  window.location.href = "play.html?game=" + encodeURIComponent(game.type);
}

searchInput.addEventListener("input", refreshGames);

refreshGames();

