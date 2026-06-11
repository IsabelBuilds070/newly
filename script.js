const API_KEY = "10a7732fb97a4caa91a6c1a72d18ef51";

document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const grid = document.getElementById("grid");
  const status = document.getElementById("status");
  const catBtns = document.querySelectorAll(".cat-btn");

  fetchNews("general");

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return;
    searchNews(query);
  });

  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (!query) return;
      searchNews(query);
    }
  });

  catBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      catBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      fetchNews(btn.dataset.cat);
    });
  });

  async function fetchNews(category) {
    status.textContent = "Loading...";
    grid.innerHTML = "";
    try {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=20&apiKey=${API_KEY}`
      );
      const data = await res.json();
      if (data.status === "ok" && data.articles.length > 0) {
        status.textContent = "";
        renderNews(data.articles);
      } else {
        status.textContent = data.message || "No news found.";
      }
    } catch (err) {
      status.textContent = "Could not load news!";
    }
  }

  async function searchNews(query) {
    status.textContent = "Searching...";
    grid.innerHTML = "";
    catBtns.forEach(b => b.classList.remove("active"));
    try {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=20&sortBy=publishedAt&apiKey=${API_KEY}`
      );
      const data = await res.json();
      if (data.status === "ok" && data.articles.length > 0) {
        status.textContent = `Results for "${query}"`;
        renderNews(data.articles);
      } else {
        status.textContent = data.message || "No results found.";
      }
    } catch (err) {
      status.textContent = "Something went wrong.";
    }
  }

  function renderNews(articles) {
    grid.innerHTML = "";
    articles
      .filter(a => a.title && a.title !== "[Removed]")
      .forEach(article => {
        const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric"
        });
        const card = document.createElement("a");
        card.className = "news-card";
        card.href = article.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.innerHTML = `
          ${article.urlToImage
            ? `<img src="${article.urlToImage}" alt="${article.title}" />`
            : `<div class="no-image">📰</div>`
          }
          <div class="news-card-body">
            <span class="news-source">${article.source.name || "News"}</span>
            <p class="news-title">${article.title}</p>
            <p class="news-desc">${article.description || ""}</p>
            <div class="news-footer">
              <span class="news-date">${date}</span>
              <span class="read-more">Read More →</span>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });
  }

});