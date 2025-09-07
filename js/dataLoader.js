(() => {
  const pageSize = 12;
  const currentPage = { books: 1, anime: 1 };
  let books = [];
  let anime = [];

  function formatDate(d) {
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { return d; }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  function makeCard(item, type) {
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <div class="thumb"><img src="${item.thumb}" alt="${escapeHtml(item.name)}"></div>
      <div class="meta">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
          <h3 class="title">${escapeHtml(item.name)}</h3>
          <div class="badge">${type}</div>
        </div>
        <div class="rating">★ ${item.rating}</div>
        <div class="dates">
          <div>Start: <strong>${formatDate(item.start)}</strong></div>
          <div>End: <strong>${formatDate(item.end)}</strong></div>
        </div>
      </div>
    `;
    return el;
  }

  function updateCounts() {
    if(document.getElementById("bookCount")) document.getElementById("bookCount").textContent = books.length;
    if(document.getElementById("animeCount")) document.getElementById("animeCount").textContent = anime.length;
  }

  function renderList(containerId, items, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (!items || items.length === 0) {
      const e = document.createElement('div');
      e.className = 'empty';
      e.textContent = `No ${type.toLowerCase()} yet.`;
      container.appendChild(e);
      updateCounts();
      return;
    }
    const page = currentPage[containerId];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const reversed = [...items].reverse();
    const pagedItems = reversed.slice(start, end);
    const grid = document.createElement('div');
    grid.className = 'grid';
    pagedItems.forEach(it => grid.appendChild(makeCard(it, type)));
    container.appendChild(grid);

    const controls = document.createElement('div');
    controls.className = "pagination";
    controls.style.display = "flex";
    controls.style.justifyContent = "center";
    controls.style.marginTop = "15px";
    controls.style.gap = "10px";
    const prevBtn = document.createElement('button');
    prevBtn.textContent = "Previous";
    prevBtn.disabled = page === 1;
    prevBtn.onclick = () => {
      currentPage[containerId]--;
      renderList(containerId, items, type);
    };
    const nextBtn = document.createElement('button');
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

  function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        document.querySelectorAll('.tab').forEach(x => {
          x.classList.remove('active');
          x.setAttribute('aria-selected','false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected','true');
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById(target).classList.add('active');
        if(target === 'books') renderList('books', books, 'Book');
        if(target === 'anime') renderList('anime', anime, 'Anime');
      });
    });
  }

  function setupSearch() {
    const input = document.getElementById("searchInput");
    if(!input) return;
    input.addEventListener("keyup", function() {
      let filter = this.value.toLowerCase();
      let activeTab = document.querySelector(".tab.active").getAttribute("data-tab");
      let items = (activeTab === "books" ? books : anime);
      let filtered = items.filter(it => it.name.toLowerCase().includes(filter));
      currentPage[activeTab] = 1;
      renderList(activeTab, filtered, activeTab === "books" ? "Book" : "Anime");
    });
  }

  function loadData() {
    fetch('data/books.json')
      .then(res => res.json())
      .then(data => { books = data; updateCounts(); renderList('books', books, 'Book'); })
      .catch(err => console.error('Error loading books:', err));

    fetch('data/anime.json')
      .then(res => res.json())
      .then(data => { anime = data; updateCounts(); })
      .catch(err => console.error('Error loading anime:', err));
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupSearch();
    loadData();
  });
})();