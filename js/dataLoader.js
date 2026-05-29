(() => {

  const pageSize = 12;

  const currentPage = {
    books: 1,
    anime: 1
  };

  let books = [];
  let anime = [];

  function formatDate(d) {

    try {

      const dt = new Date(d);

      return dt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });

    } catch (e) {

      return d;
    }
  }

  function escapeHtml(s) {

    return String(s).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[m]));
  }

  function makeCard(item, type) {

    const el = document.createElement("article");

    el.className = "card";

    el.innerHTML = `
      <div class="thumb">
        <img src="${item.thumb}" alt="${escapeHtml(item.name)}">
      </div>

      <div class="meta">

        <div class="meta-header">
          <h3 class="title">${escapeHtml(item.name)}</h3>
          <div class="badge">${type}</div>
        </div>

        <div class="rating">
          ★ ${Number(item.rating).toFixed(1)}
        </div>

        <div class="dates">
          <div>
            Start:
            <strong>${formatDate(item.start)}</strong>
          </div>

          <div>
            End:
            <strong>${formatDate(item.end)}</strong>
          </div>
        </div>

        <button class="show-review">
          Show Review
        </button>

        <div class="review">
          ${escapeHtml(item.review || "No review yet.")}
        </div>

        <button class="share-btn">
          <i class="fa-solid fa-share"></i>
          Share
        </button>

      </div>
    `;

    const btn = el.querySelector(".show-review");

    const reviewDiv = el.querySelector(".review");

    btn.addEventListener("click", () => {

      const open = reviewDiv.style.display === "block";

      reviewDiv.style.display = open ? "none" : "block";

      btn.textContent = open
        ? "Show Review"
        : "Hide Review";
    });

    const thumbImg = el.querySelector(".thumb img");

    thumbImg.addEventListener("click", () => {

      const lightbox = document.getElementById("lightbox");

      const lightboxImg = lightbox.querySelector("img");

      lightboxImg.src = item.thumb;

      lightbox.classList.add("active");
    });

    const shareBtn = el.querySelector(".share-btn");

    shareBtn.addEventListener("click", () => {

      const url =
        `${window.location.origin}${window.location.pathname}?${type.toLowerCase()}=${item.id}`;

      navigator.clipboard.writeText(url)
        .then(() => {

          if (typeof showToast === "function") {
            showToast("Link copied successfully");
          }
        })
        .catch(() => {

          if (typeof showToast === "function") {
            showToast("Failed to copy");
          }
        });
    });

    return el;
  }

  function updateCounts() {

    const bookCount =
      document.getElementById("bookCount");

    const animeCount =
      document.getElementById("animeCount");

    if (bookCount) {
      bookCount.textContent = books.length;
    }

    if (animeCount) {
      animeCount.textContent = anime.length;
    }
  }

  function renderList(containerId, items, type) {

    const container =
      document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    if (!items || items.length === 0) {

      const e = document.createElement("div");

      e.className = "empty";

      e.textContent =
        `No ${type.toLowerCase()} yet.`;

      container.appendChild(e);

      updateCounts();

      return;
    }

    const page = currentPage[containerId];

    const start =
      (page - 1) * pageSize;

    const end = start + pageSize;

    const reversed = [...items].reverse();

    const pagedItems =
      reversed.slice(start, end);

    const grid = document.createElement("div");

    grid.className = "grid";

    pagedItems.forEach(it => {
      grid.appendChild(makeCard(it, type));
    });

    container.appendChild(grid);

    const controls =
      document.createElement("div");

    controls.className = "pagination";

    const prevBtn =
      document.createElement("button");

    prevBtn.textContent = "Previous";

    prevBtn.disabled = page === 1;

    prevBtn.onclick = () => {

      currentPage[containerId]--;

      renderList(containerId, items, type);
    };

    const nextBtn =
      document.createElement("button");

    nextBtn.textContent = "Next";

    nextBtn.disabled = end >= items.length;

    nextBtn.onclick = () => {

      currentPage[containerId]++;

      renderList(containerId, items, type);
    };

    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);

    container.appendChild(controls);

    updateCounts();
  }

  function activateTab(target) {

    document.querySelectorAll(".tab")
      .forEach(tab => {

        tab.classList.remove("active");

        tab.setAttribute(
          "aria-selected",
          "false"
        );
      });

    document.querySelectorAll(".panel")
      .forEach(panel => {

        panel.classList.remove("active");
      });

    const activeTab =
      document.querySelector(
        `.tab[data-tab="${target}"]`
      );

    if (activeTab) {

      activeTab.classList.add("active");

      activeTab.setAttribute(
        "aria-selected",
        "true"
      );
    }

    const activePanel =
      document.getElementById(target);

    if (activePanel) {

      activePanel.classList.add("active");
    }
  }

  function setupTabs() {

    document.querySelectorAll(".tab")
      .forEach(tab => {

        tab.addEventListener("click", () => {

          const target = tab.dataset.tab;

          activateTab(target);

          const url =
            new URL(window.location);

          url.search = "";

          window.history.replaceState(
            {},
            "",
            url
          );

          const input =
            document.getElementById("searchInput");

          if (input) {
            input.value = "";
          }

          if (target === "books") {
            renderList("books", books, "Book");
          }

          if (target === "anime") {
            renderList("anime", anime, "Anime");
          }
        });
      });
  }

  function setupSearch() {

    const input =
      document.getElementById("searchInput");

    if (!input) return;

    input.addEventListener("input", function () {

      const filter =
        this.value.toLowerCase().trim();

      const activeTab =
        document.querySelector(".tab.active")
          ?.dataset.tab;

      if (activeTab === "timeline") {
        return;
      }

      const items =
        activeTab === "books"
          ? books
          : anime;

      const filtered = items.filter(it => {

        return (
          it.name.toLowerCase().includes(filter)
        );
      });

      currentPage[activeTab] = 1;

      renderList(
        activeTab,
        filtered,
        activeTab === "books"
          ? "Book"
          : "Anime"
      );
    });
  }

  function loadData() {

    const params =
      new URLSearchParams(window.location.search);

    const bookId = params.get("book");

    const animeId = params.get("anime");

    fetch("data/books.json")
      .then(res => res.json())
      .then(data => {

        books = data;

        if (bookId) {

          activateTab("books");

          const single =
            books.find(b => b.id == bookId);

          renderList(
            "books",
            single ? [single] : [],
            "Book"
          );

        } else {

          renderList(
            "books",
            books,
            "Book"
          );
        }

        updateCounts();
      });

    fetch("data/anime.json")
      .then(res => res.json())
      .then(data => {

        anime = data;

        if (animeId) {

          activateTab("anime");

          const single =
            anime.find(a => a.id == animeId);

          renderList(
            "anime",
            single ? [single] : [],
            "Anime"
          );

        } else {

          renderList(
            "anime",
            anime,
            "Anime"
          );
        }

        updateCounts();
      });
  }

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      setupTabs();

      setupSearch();

      loadData();

      const lightbox =
        document.getElementById("lightbox");

      const closeBtn =
        lightbox.querySelector(".close-btn");

      lightbox.addEventListener("click", (e) => {

        if (e.target === lightbox) {

          lightbox.classList.remove("active");
        }
      });

      closeBtn.addEventListener("click", () => {

        lightbox.classList.remove("active");
      });
    }
  );

})();