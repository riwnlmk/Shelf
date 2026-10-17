(() => {

  const pageSize = 12;

  const currentPage = {
    books: 1,
    anime: 1
  };

  let books = [];
  let anime = [];

  let allBooks = [];
  let allAnime = [];

  function formatDate(d) {

    try {

      const dt = new Date(d);

      return dt.toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "short",
          day: "numeric"
        }
      );

    } catch (e) {

      return d;
    }
  }

  function escapeHtml(s) {

    return String(s).replace(
      /[&<>"']/g,
      (m) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[m])
    );
  }

  function makeCard(item, type) {

    const el =
      document.createElement("article");

    el.className = "card";

    const progress = item.progress;
    const hasProgress =
      progress &&
      Number.isFinite(Number(progress.current)) &&
      Number.isFinite(Number(progress.total)) &&
      Number(progress.total) > 0 &&
      Number(progress.current) >= 0;

    const progressCurrent = hasProgress
      ? Math.min(Number(progress.current), Number(progress.total))
      : 0;
    const progressTotal = hasProgress
      ? Number(progress.total)
      : 0;
    const progressPercent = hasProgress
      ? Math.min(100, Math.max(0, (progressCurrent / progressTotal) * 100))
      : 0;
    const progressUnit = type === "Book" ? "Pages" : "Episodes";
    const progressIcon = type === "Book" ? "fa-book-open" : "fa-tv";
    const progressDateLabel = type === "Book" ? "Last Read" : "Last Watched";
    const progressMarkup = hasProgress ? `
  <div class="item-progress" aria-label="${progressCurrent} of ${progressTotal} ${progressUnit}">
    <div class="item-progress__details">
      <i class="fa-solid ${progressIcon} item-progress__icon" aria-hidden="true"></i>
      <span class="item-progress__count">${progressCurrent} / ${progressTotal} ${progressUnit}</span>
    </div>
    <div class="item-progress__track" role="progressbar"
      aria-valuemin="0" aria-valuemax="${progressTotal}" aria-valuenow="${progressCurrent}"
      aria-valuetext="${progressCurrent} of ${progressTotal} ${progressUnit}">
      <div class="item-progress__bar" style="--progress-value: ${progressPercent}%"></div>
    </div>
    ${progress.date ? `<div class="item-progress__date"><i class="fa-regular fa-calendar-check" aria-hidden="true"></i><span>${progressDateLabel} ${escapeHtml(formatDate(progress.date))}</span></div>` : ""}
  </div>` : "";

    el.innerHTML = `
<div class="thumb">
  <img
    src="${item.thumb}"
    alt="${escapeHtml(item.name)}"
  >
</div>

<div class="meta">

  <div class="meta-header">

    <h3 class="title">${escapeHtml(item.name)}</h3>

    <div class="badge">${type}</div>

  </div>

  ${hasProgress ? "" : `<div class="rating">★ ${Number(item.rating).toFixed(1)}</div>`}

  ${progressMarkup}

  <div class="dates">

    <div>
      Start:
      <strong>${formatDate(item.start)}</strong>
    </div>

    ${hasProgress ? "" : `<div>
      End:
      <strong>${formatDate(item.end)}</strong>
    </div>`}

  </div>

  ${hasProgress ? "" : `<button class="show-review">
    Show Review
  </button>`}

  <div class="review" style="display:none;">${escapeHtml(
    item.review || "No review yet."
  )}</div>

  <button class="share-btn">
    <i class="fa-solid fa-share"></i>
    Share
  </button>

</div>
`;

    const btn =
      el.querySelector(".show-review");

    const reviewDiv =
      el.querySelector(".review");

    if (btn) {
      btn.addEventListener(
        "click",
        () => {

          const open =
            reviewDiv.style.display ===
            "block";

          reviewDiv.style.display =
            open ? "none" : "block";

          btn.textContent = open
            ? "Show Review"
            : "Hide Review";
        }
      );
    }

    const thumbImg =
      el.querySelector(".thumb img");

    thumbImg.addEventListener(
      "click",
      () => {

        const lightbox =
          document.getElementById(
            "lightbox"
          );

        const lightboxImg =
          lightbox.querySelector("img");

        lightboxImg.src = item.thumb;

        lightbox.classList.add(
          "active"
        );
      }
    );

    const shareBtn =
      el.querySelector(".share-btn");

    shareBtn.addEventListener(
      "click",
      () => {

        const url =
          `${window.location.origin}${window.location.pathname}?${type.toLowerCase()}=${item.id}`;

        navigator.clipboard
          .writeText(url)
          .then(() => {

            if (
              typeof showToast ===
              "function"
            ) {

              showToast(
                "Link copied successfully"
              );
            }
          })
          .catch(() => {

            if (
              typeof showToast ===
              "function"
            ) {

              showToast(
                "Failed to copy"
              );
            }
          });
      }
    );

    return el;
  }

  function updateCounts() {

    const bookCount =
      document.getElementById(
        "bookCount"
      );

    const animeCount =
      document.getElementById(
        "animeCount"
      );

    if (bookCount) {
      bookCount.textContent =
        allBooks.length;
    }

    if (animeCount) {
      animeCount.textContent =
        allAnime.length;
    }
  }

  function renderPagination(
    container,
    items,
    type,
    containerId
  ) {

    const totalPages =
      Math.ceil(
        items.length / pageSize
      );

    if (totalPages <= 1) return;

    const pagination =
      document.createElement("div");

    pagination.className =
      "pagination";

    const prevBtn =
      document.createElement("button");

    prevBtn.textContent = "Prev";

    prevBtn.style.display =
      currentPage[containerId] === 1
        ? "none"
        : "inline-flex";

    prevBtn.addEventListener(
      "click",
      () => {

        if (
          currentPage[containerId] > 1
        ) {

          currentPage[containerId]--;

          renderList(
            containerId,
            items,
            type
          );
        }
      }
    );

    const nextBtn =
      document.createElement("button");

    nextBtn.textContent = "Next";

    nextBtn.style.display =
      currentPage[containerId] >=
      totalPages
        ? "none"
        : "inline-flex";

    nextBtn.addEventListener(
      "click",
      () => {

        if (
          currentPage[containerId] <
          totalPages
        ) {

          currentPage[containerId]++;

          renderList(
            containerId,
            items,
            type
          );
        }
      }
    );

    pagination.appendChild(prevBtn);

    pagination.appendChild(nextBtn);

    container.appendChild(
      pagination
    );
  }

  function renderList(
    containerId,
    items,
    type
  ) {

    const container =
      document.getElementById(
        containerId
      );

    if (!container) return;

    container.innerHTML = "";

    if (
      !items ||
      items.length === 0
    ) {

      const e =
        document.createElement("div");

      e.className = "empty";

      e.textContent =
        `No ${type.toLowerCase()} yet.`;

      container.appendChild(e);

      updateCounts();

      return;
    }

    const page =
      currentPage[containerId];

    const start =
      (page - 1) * pageSize;

    const end =
      start + pageSize;

    const orderedItems = containerId === "anime"
      ? [...items].sort((a, b) => Number(b.id) - Number(a.id))
      : [...items].reverse();

    const pagedItems =
      orderedItems.slice(start, end);

    const grid =
      document.createElement("div");

    grid.className = "grid";

    pagedItems.forEach(it => {

      grid.appendChild(
        makeCard(it, type)
      );
    });

    container.appendChild(grid);

    renderPagination(
      container,
      items,
      type,
      containerId
    );

    updateCounts();
  }

  async function loadData() {

    try {

      const booksRes =
        await fetch(
          "data/books.json"
        );

      const animeRes =
        await fetch(
          "data/anime.json",
          { cache: "no-store" }
        );

      allBooks =
        await booksRes.json();

      allAnime =
        await animeRes.json();

      books = [...allBooks];
      anime = [...allAnime];

      const params =
        new URLSearchParams(
          window.location.search
        );

      const bookId =
        params.get("book");

      const animeId =
        params.get("anime");

      if (bookId) {

        const singleBook =
          allBooks.find(
            item =>
              String(item.id) ===
              bookId
          );

        books = singleBook
          ? [singleBook]
          : [];

        document
          .querySelectorAll(".tab")
          .forEach(t =>
            t.classList.remove(
              "active"
            )
          );

        document
          .querySelectorAll(".panel")
          .forEach(p =>
            p.classList.remove(
              "active"
            )
          );

        document
          .querySelector(
            '[data-tab="books"]'
          )
          ?.classList.add(
            "active"
          );

        document
          .getElementById("books")
          ?.classList.add(
            "active"
          );
      }

      if (animeId) {

        const singleAnime =
          allAnime.find(
            item =>
              String(item.id) ===
              animeId
          );

        anime = singleAnime
          ? [singleAnime]
          : [];

        document
          .querySelectorAll(".tab")
          .forEach(t =>
            t.classList.remove(
              "active"
            )
          );

        document
          .querySelectorAll(".panel")
          .forEach(p =>
            p.classList.remove(
              "active"
            )
          );

        document
          .querySelector(
            '[data-tab="anime"]'
          )
          ?.classList.add(
            "active"
          );

        document
          .getElementById("anime")
          ?.classList.add(
            "active"
          );
      }

      renderList(
        "books",
        books,
        "Book"
      );

      renderList(
        "anime",
        anime,
        "Anime"
      );

    } catch (err) {

      console.error(
        "Failed to load data:",
        err
      );
    }
  }

  function setupTabs() {

    const tabs =
      document.querySelectorAll(
        ".tab"
      );

    const searchInput =
      document.getElementById(
        "searchInput"
      );

    tabs.forEach(tab => {

      tab.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(".tab")
            .forEach(t => {
              t.classList.remove(
                "active"
              );
            });

          document
            .querySelectorAll(".panel")
            .forEach(p => {
              p.classList.remove(
                "active"
              );
            });

          tab.classList.add(
            "active"
          );

          const target =
            tab.dataset.tab;

          const panel =
            document.getElementById(
              target
            );

          if (panel) {
            panel.classList.add(
              "active"
            );
          }

          if (searchInput) {
            searchInput.value = "";
          }

          currentPage.books = 1;
          currentPage.anime = 1;

          books = [...allBooks];
          anime = [...allAnime];

          renderList(
            "books",
            books,
            "Book"
          );

          renderList(
            "anime",
            anime,
            "Anime"
          );

          const url =
            new URL(window.location);

          url.searchParams.delete(
            "book"
          );

          url.searchParams.delete(
            "anime"
          );

          window.history.replaceState(
            {},
            "",
            url
          );
        }
      );
    });
  }

  function setupSearch() {

    const input =
      document.getElementById(
        "searchInput"
      );

    if (!input) return;

    input.addEventListener(
      "input",
      function () {

        const query =
          this.value
            .toLowerCase()
            .trim();

        const filteredBooks =
          allBooks.filter(item =>
            item.name
              .toLowerCase()
              .includes(query)
          );

        const filteredAnime =
          allAnime.filter(item =>
            item.name
              .toLowerCase()
              .includes(query)
          );

        currentPage.books = 1;
        currentPage.anime = 1;

        renderList(
          "books",
          filteredBooks,
          "Book"
        );

        renderList(
          "anime",
          filteredAnime,
          "Anime"
        );
      }
    );
  }

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      setupTabs();

      setupSearch();

      loadData();

      const lightbox =
        document.getElementById(
          "lightbox"
        );

      if (!lightbox) return;

      const closeBtn =
        lightbox.querySelector(
          ".close-btn"
        );

      lightbox.addEventListener(
        "click",
        (e) => {

          if (e.target === lightbox) {

            lightbox.classList.remove(
              "active"
            );
          }
        }
      );

      if (closeBtn) {

        closeBtn.addEventListener(
          "click",
          () => {

            lightbox.classList.remove(
              "active"
            );
          }
        );
      }
    }
  );

})();