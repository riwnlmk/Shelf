let knowledgeItems = { technology: [], ruqyah: [] };
let filteredPosts = [];
let events = [];
let filteredEvents = [];
let activeTimelineView = "technology";
let activeRuqyahView = "ayat";
let ruqyahAudioItems = [];
let filteredRuqyahAudioItems = [];
let sharedRecitationId = null;

const PAGE_SIZE = 3;
let currentPage = 1;

async function loadPosts() {
  try {
    const [technologyResponse, ruqyahResponse, eventsResponse, ruqyahAudioResponse] = await Promise.all([
      fetch("data/technology.json"),
      fetch("data/ruqyah.json"),
      fetch("data/events.json"),
      fetch("data/ruqyah-audio.json")
    ]);

    knowledgeItems.technology = await technologyResponse.json();
    knowledgeItems.ruqyah = await ruqyahResponse.json();
    events = await eventsResponse.json();
    ruqyahAudioItems = await ruqyahAudioResponse.json();
    filteredRuqyahAudioItems = ruqyahAudioItems;
    filteredPosts = knowledgeItems.technology;
    filteredEvents = events;

    const queryParams = new URLSearchParams(window.location.search);
    const eventId = queryParams.get("event");
    const recitationId = queryParams.get("recitation");
    sharedRecitationId = recitationId;
    filteredRuqyahAudioItems = recitationId
      ? ruqyahAudioItems.filter(item => String(item.id) === String(recitationId))
      : ruqyahAudioItems;
    const categoryParam = Object.keys(knowledgeItems).find(key => queryParams.has(key));
    const categoryId = categoryParam ? queryParams.get(categoryParam) : null;
    const sharedId = eventId || categoryId;

    if (recitationId) {
      activeTimelineView = "ruqyah";
      activeRuqyahView = "audio";
      filteredPosts = knowledgeItems.ruqyah;
    }

    let sharedItem = null;

    if (sharedId) {
      document
        .querySelectorAll(".tab")
        .forEach(t => t.classList.remove("active"));

      document
        .querySelectorAll(".panel")
        .forEach(p => p.classList.remove("active"));

      const targetTab = eventId ? "events" : "knowledge";
      document.querySelector(`.tab[data-tab="${targetTab}"]`)?.classList.add("active");
      document.getElementById(targetTab)?.classList.add("active");

      if (eventId) {
        sharedItem = events.find(item => String(item.id) === eventId);
        activeTimelineView = "events";
        filteredEvents = sharedItem ? [sharedItem] : [];
      } else {
        const requestedId = categoryId;
        const category = categoryParam || Object.keys(knowledgeItems).find(key =>
          knowledgeItems[key].some(item => String(item.id) === requestedId)
        ) || "technology";
        activeTimelineView = category;
        sharedItem = knowledgeItems[category].find(item => String(item.id) === requestedId);
        filteredPosts = sharedItem ? [sharedItem] : [];
      }
    }

    setupTimelineSubtabs();
    setupRuqyahSubtabs();
    const ruqyahTabs = document.getElementById("ruqyah-subtabs");
    if (ruqyahTabs) ruqyahTabs.hidden = activeTimelineView !== "ruqyah";

    if ((sharedId && sharedItem) || recitationId) {
      document.querySelectorAll(".timeline-subtab").forEach(button => {
        const active = button.dataset.timelineView === activeTimelineView;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
      });
    }

    if (recitationId) {
      document.querySelectorAll(".ruqyah-subtab").forEach(button => {
        const active = button.dataset.ruqyahView === "audio";
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
      });
    }

    renderTimeline();
  } catch (err) {
    console.error(
      "Error loading posts:",
      err
    );
  }
}

document
  .querySelectorAll(".tab")
  .forEach(tab => {
    tab.addEventListener("click", () => {
      const current =
        document.querySelector(".tab.active");

      if (current) {
        current.classList.remove("active");
      }

      tab.classList.add("active");

      const activeTab = tab.dataset.tab;

      if (activeTab === "knowledge" || activeTab === "events") {
        const url = new URL(window.location);

        if (["post", "tech", "technology", "event", "recitation"].some(key => url.searchParams.has(key))) {
          ["post", "tech", "technology", "event", "recitation"].forEach(key => url.searchParams.delete(key));
          sharedRecitationId = null;

          window.history.replaceState(
            {},
            "",
            url
          );
        }

        activeTimelineView = activeTab === "events" ? "events" : "technology";
        filteredPosts = knowledgeItems[activeTimelineView] || knowledgeItems.technology;
        filteredEvents = events;
        document.querySelectorAll(".timeline-subtab").forEach(button => {
          const active = button.dataset.timelineView === activeTimelineView;
          button.classList.toggle("active", active);
          button.setAttribute("aria-selected", String(active));
        });
        currentPage = 1;
        renderTimeline();
      }
    });
  });

function setupTimelineSearch() {
  const input =
    document.getElementById("searchInput");

  if (!input) return;

  input.addEventListener("input", function () {
    const activeTab =
      document.querySelector(".tab.active")
        ?.dataset.tab;

    if (activeTab !== "knowledge" && activeTab !== "events") {
      return;
    }

    const filter = this.value
      .toLowerCase()
      .trim();

    if (activeTimelineView === "ruqyah" && activeRuqyahView === "audio") {
      const audioSource = sharedRecitationId
        ? ruqyahAudioItems.filter(item => String(item.id) === String(sharedRecitationId))
        : ruqyahAudioItems;
      filteredRuqyahAudioItems = filter
        ? audioSource.filter(item => [item.title, item.description].filter(Boolean).join(" ").toLowerCase().includes(filter))
        : audioSource;
      currentPage = 1;
      renderTimeline();
      return;
    }

    const source = activeTimelineView === "events" ? events : knowledgeItems[activeTimelineView] || [];

    if (!filter) {
      if (activeTimelineView === "events") {
        filteredEvents = source;
      } else {
        filteredPosts = source;
      }
      currentPage = 1;
      renderTimeline();
      return;
    }

    const filtered = source.filter(post => {
      const postText = [
        post.user,
        post.date,
        post.title,
        post.eventDate,
        post.eventCategory,
        post.designation,
        post.eventLocation,
        post.eventWith,
        ...(post.blocks || []).flatMap(block => [
          block.content,
          block.code
        ])
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return postText.includes(filter);
    });

    if (activeTimelineView === "events") {
      filteredEvents = filtered;
    } else {
      filteredPosts = filtered;
    }

    currentPage = 1;
    renderTimeline();
  });
}

function setupTimelineSubtabs() {
  document.querySelectorAll(".timeline-subtab").forEach(button => {
    button.addEventListener("click", () => {
      activeTimelineView = button.dataset.timelineView;
      if (activeTimelineView === "ruqyah") {
        filteredPosts = knowledgeItems.ruqyah;
        activeRuqyahView = "ayat";
        document.querySelectorAll(".ruqyah-subtab").forEach(item => {
          const active = item.dataset.ruqyahView === "ayat";
          item.classList.toggle("active", active);
          item.setAttribute("aria-selected", String(active));
        });
      }
      const ruqyahTabs = document.getElementById("ruqyah-subtabs");
      if (ruqyahTabs) ruqyahTabs.hidden = activeTimelineView !== "ruqyah";
      document.querySelectorAll(".timeline-subtab").forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      const query = document.getElementById("searchInput")?.value.trim().toLowerCase() || "";
      const source = activeTimelineView === "events" ? events : knowledgeItems[activeTimelineView] || [];
      const filtered = query ? source.filter(post => {
        const postText = [
          post.user, post.date, post.title, post.eventDate, post.eventCategory,
          post.designation, post.eventLocation, post.eventWith,
          ...(post.blocks || []).flatMap(block => [block.content, block.code])
        ].filter(Boolean).join(" ").toLowerCase();
        return postText.includes(query);
      }) : source;
      if (activeTimelineView === "events") {
        filteredEvents = filtered;
      } else {
        filteredPosts = filtered;
      }
      currentPage = 1;
      renderTimeline();
    });
  });
}

function setupRuqyahSubtabs() {
  document.querySelectorAll(".ruqyah-subtab").forEach(button => {
    button.addEventListener("click", () => {
      activeRuqyahView = button.dataset.ruqyahView;
      if (activeRuqyahView !== "audio") {
        const query = document.getElementById("searchInput")?.value.trim().toLowerCase() || "";
        filteredPosts = query
          ? knowledgeItems.ruqyah.filter(post => [post.user, post.date, post.title, ...(post.blocks || []).flatMap(block => [block.content, block.code])].filter(Boolean).join(" ").toLowerCase().includes(query))
          : knowledgeItems.ruqyah;
        const url = new URL(window.location.href);
        url.searchParams.delete("recitation");
        window.history.replaceState({}, "", url);
        sharedRecitationId = null;
      } else {
        const query = document.getElementById("searchInput")?.value.trim().toLowerCase() || "";
        const audioSource = sharedRecitationId
          ? ruqyahAudioItems.filter(item => String(item.id) === String(sharedRecitationId))
          : ruqyahAudioItems;
        filteredRuqyahAudioItems = query
          ? audioSource.filter(item => [item.title, item.description].filter(Boolean).join(" ").toLowerCase().includes(query))
          : audioSource;
      }
      document.querySelectorAll(".ruqyah-subtab").forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      currentPage = 1;
      renderTimeline();
    });
  });
}

function renderRuqyahAudio() {
  const panel = document.getElementById("ruqyah-audio-content");
  if (!panel) return;
  panel.innerHTML = "";
  const visibleAudioItems = filteredRuqyahAudioItems;
  if (!visibleAudioItems.length) {
    panel.innerHTML = '<p class="empty">No audio found.</p>';
    return;
  }

  const totalPages = Math.ceil(visibleAudioItems.length / PAGE_SIZE);
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageAudioItems = visibleAudioItems.slice(start, start + PAGE_SIZE);

  const waveformHeights = [7, 10, 13, 8, 17, 24, 13, 20, 29, 17, 12, 22, 31, 18, 12, 25, 16, 9, 20, 12, 7, 15, 10, 6, 12, 8, 5, 10, 7, 4];

  pageAudioItems.forEach(item => {
    const card = document.createElement("article");
    card.className = "post-card ruqyah-audio-card";

    const header = document.createElement("div");
    header.className = "post-header ruqyah-audio-card__header";

    const artwork = document.createElement("img");
    artwork.className = "post-avatar ruqyah-audio-card__artwork";
    artwork.src = "assets/icons/book/quran.svg";
    artwork.alt = "Quran";
    artwork.loading = "lazy";

    const content = document.createElement("div");
    content.className = "post-userinfo ruqyah-audio-card__content";

    const title = document.createElement("span");
    title.className = "post-username ruqyah-audio-card__title";
    title.textContent = item.title || "Ruqyah Audio";
    content.appendChild(title);

    if (item.description) {
      const description = document.createElement("span");
      description.className = "post-date ruqyah-audio-card__description";
      description.textContent = item.description;
      content.appendChild(description);
    }

    const options = document.createElement("div");
    options.className = "post-options ruqyah-audio-card__options";

    const menuButton = document.createElement("button");
    menuButton.className = "post-options-btn";
    menuButton.type = "button";
    menuButton.setAttribute("aria-label", "Audio options");
    menuButton.innerHTML = '<i class="fa-solid fa-ellipsis-vertical"></i>';

    const menu = document.createElement("div");
    menu.className = "post-options-menu";
    const shareButton = document.createElement("button");
    shareButton.type = "button";
    shareButton.innerHTML = '<i class="fa-solid fa-share"></i> Share';
    shareButton.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      shareRecitation(item.id);
    });
    menu.appendChild(shareButton);
    options.append(menuButton, menu);
    header.append(artwork, content, options);

    const controls = document.createElement("div");
    controls.className = "ruqyah-audio-card__controls";

    const playButton = document.createElement("button");
    playButton.className = "ruqyah-audio-card__play";
    playButton.type = "button";
    playButton.setAttribute("aria-label", `Play ${item.title || "Ruqyah audio"}`);
    playButton.innerHTML = '<i class="fa-solid fa-play"></i>';

    const trackArea = document.createElement("div");
    trackArea.className = "ruqyah-audio-card__track-area";

    const waveform = document.createElement("button");
    waveform.className = "ruqyah-audio-card__waveform";
    waveform.type = "button";
    waveform.setAttribute("aria-label", "Seek audio position");
    waveform.innerHTML = waveformHeights.map((height, barIndex) =>
      `<span class="ruqyah-audio-card__bar" style="height:${height}px" data-bar="${barIndex}"></span>`
    ).join("");

    const timeRow = document.createElement("div");
    timeRow.className = "ruqyah-audio-card__times";
    const currentTime = document.createElement("span");
    currentTime.textContent = "0:00";
    const duration = document.createElement("span");
    duration.textContent = "0:00";
    timeRow.append(currentTime, duration);
    trackArea.append(waveform, timeRow);
    controls.append(playButton, trackArea);

    const player = document.createElement("audio");
    player.preload = "none";
    player.src = item.src;
    player.setAttribute("aria-label", item.title || "Ruqyah audio player");

    const formatTime = seconds => {
      if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
      return `${mins}:${secs}`;
    };

    const updateProgress = () => {
      currentTime.textContent = formatTime(player.currentTime);
      if (Number.isFinite(player.duration)) duration.textContent = formatTime(player.duration);
      const progress = player.duration ? player.currentTime / player.duration : 0;
      waveform.querySelectorAll(".ruqyah-audio-card__bar").forEach((bar, barIndex) => {
        bar.classList.toggle("is-played", barIndex / waveformHeights.length < progress);
      });
    };

    const togglePlayback = () => {
      if (player.paused) {
        document.querySelectorAll("#ruqyah-audio-content audio").forEach(otherPlayer => {
          if (otherPlayer !== player) {
            otherPlayer.pause();
            const otherCard = otherPlayer.closest(".ruqyah-audio-card");
            const otherButton = otherCard?.querySelector(".ruqyah-audio-card__play");
            if (otherButton) {
              otherButton.innerHTML = '<i class="fa-solid fa-play"></i>';
              otherButton.setAttribute("aria-label", `Play ${otherPlayer.getAttribute("aria-label")}`);
              otherCard.classList.remove("is-playing");
            }
          }
        });
        player.play().catch(() => {});
      } else {
        player.pause();
      }
    };

    playButton.addEventListener("click", togglePlayback);
    waveform.addEventListener("click", event => {
      if (!Number.isFinite(player.duration) || player.duration <= 0) return;
      const bounds = waveform.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      player.currentTime = ratio * player.duration;
      updateProgress();
    });
    player.addEventListener("play", () => {
      playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
      playButton.setAttribute("aria-label", `Pause ${item.title || "Ruqyah audio"}`);
      card.classList.add("is-playing");
    });
    player.addEventListener("pause", () => {
      playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
      playButton.setAttribute("aria-label", `Play ${item.title || "Ruqyah audio"}`);
      card.classList.remove("is-playing");
    });
    player.addEventListener("loadedmetadata", updateProgress);
    player.addEventListener("timeupdate", updateProgress);
    player.addEventListener("ended", updateProgress);

    card.append(header, controls, player);
    panel.appendChild(card);
  });

  renderPagination(panel, totalPages);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatTextBlock(text) {
  text = escapeHtml(text);

  text = text.replace(
    /&quot;/g,
    '"'
  );

  text = text.replace(
    /`([^`]+)`/g,
    '<code class="inline-code">$1</code>'
  );

  text = text.replace(
    /&gt;&gt;([^]+?)&lt;&lt;/g,
    '<blockquote class="post-quote">$1</blockquote>'
  );

  return text
    .replace(/  /g, " &nbsp;")
    .replace(/\n/g, "<br>");
}

function getReadTime(post) {
  const text = (post.blocks || []).map(block => block.type === "code" ? block.code : block.content).filter(Boolean).join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

function renderTimeline() {
  const ruqyahTabs = document.getElementById("ruqyah-subtabs");
  if (ruqyahTabs) ruqyahTabs.hidden = activeTimelineView !== "ruqyah";
  const ayatPanel = document.getElementById("timeline-content");
  const audioPanel = document.getElementById("ruqyah-audio-content");
  if (ayatPanel) ayatPanel.hidden = activeTimelineView === "ruqyah" && activeRuqyahView === "audio";
  if (audioPanel) audioPanel.hidden = activeTimelineView !== "ruqyah" || activeRuqyahView !== "audio";
  if (activeTimelineView === "ruqyah" && activeRuqyahView === "audio") {
    renderRuqyahAudio();
    return;
  }
  const timelinePanel = document.getElementById(activeTimelineView === "events" ? "events-content" : "timeline-content");
  const currentItems = activeTimelineView === "events" ? filteredEvents : filteredPosts;
  timelinePanel.innerHTML = "";

  if (currentItems.length === 0) {
    timelinePanel.innerHTML = `<p class="empty">No ${activeTimelineView === "events" ? "events" : "posts"} found.</p>`;
    return;
  }

  const reversed = currentItems.slice().reverse();

  const totalPages =
    Math.ceil(reversed.length / PAGE_SIZE);

  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * PAGE_SIZE;

  const pagePosts =
    reversed.slice(start, start + PAGE_SIZE);

  pagePosts.forEach(post => {

      const card =
        document.createElement("div");

      card.className = "post-card";

      let headerHtml = `
<div class="post-header">
  <img
    src="${post.avatar}"
    alt="${post.user}"
    class="post-avatar"
  >

  <div class="post-userinfo">
    <span class="post-username">
      ${post.user}
    </span>

    <span class="post-date">
      ${post.date}${activeTimelineView !== "events" ? ` <span class="post-read-time">· ${getReadTime(post)} read</span>` : ""}
    </span>
  </div>

  <div class="post-options">
    <button class="post-options-btn">
      ⋮
    </button>

    <div class="post-options-menu">
      <button onclick="sharePost('${post.id}', '${activeTimelineView === "events" ? "event" : activeTimelineView}')">
        <i class="fa-solid fa-share"></i>
        Share
      </button>
    </div>
  </div>
</div>
`;

      const maxLength = 400;

      let totalLength = 0;
      let truncated = false;

      let fullBodyHtml = "";
      let shortBodyHtml = "";

      if (post.type === "event") {
        const eventIcon = post.eventIcon || "fa-heart";

        fullBodyHtml = `
<div class="event-card">
  <div class="event-icon" aria-hidden="true">
    <i class="fa-solid ${eventIcon} event-icon__main"></i>
    <i class="fa-solid ${eventIcon} event-icon__small"></i>
  </div>

  <h3 class="event-title">${escapeHtml(post.title)}</h3>

  <span class="event-date">${escapeHtml(post.eventDate)}</span>

  ${
    post.eventCategory === "Work" && post.designation
      ? `<span class="event-designation">${escapeHtml(post.designation)}</span>`
      : ""
  }

  ${
    post.eventLocation
      ? `
  <div class="event-location">
    <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
    <span>${escapeHtml(post.eventLocation)}</span>
  </div>
`
      : ""
  }

  ${
    post.eventWith
      ? `
  <div class="event-with">
    <i class="fa-solid fa-user-group" aria-hidden="true"></i>
    <span>With ${escapeHtml(post.eventWith)}</span>
  </div>
`
      : ""
  }

</div>
`;
        shortBodyHtml = fullBodyHtml;
      } else {

      post.blocks.forEach(block => {

        let blockHtml = "";

        if (block.type === "text") {

          blockHtml = `
<div class="post-content">
  <p>
    ${formatTextBlock(block.content)}
  </p>
</div>
`;

          fullBodyHtml += blockHtml;

          if (!truncated) {

            if (
              totalLength +
              block.content.length <= maxLength
            ) {

              shortBodyHtml += blockHtml;

            } else {

              const remaining =
                maxLength - totalLength;

              if (remaining > 0) {

                shortBodyHtml += `
<div class="post-content">
  <p>
    ${formatTextBlock(
      block.content.slice(
        0,
        remaining
      )
    )}
  </p>
</div>
`;
              }

              truncated = true;
            }
          }

          totalLength += block.content.length;
        }

        else if (block.type === "code") {

          const escapedCode =
            escapeHtml(block.code);

          blockHtml = `
<div class="code-card">

  <div class="code-header">
    <span class="dot red"></span>
    <span class="dot yellow"></span>
    <span class="dot green"></span>

    <button
      class="copy-btn"
      onclick="copyCode(this)"
    >
      <i class="fas fa-copy"></i>
      Copy
    </button>
  </div>

  <pre><code class="language-${block.lang}">${escapedCode}</code></pre>

</div>
`;

          fullBodyHtml += blockHtml;

          if (!truncated) {

            if (
              totalLength +
              block.code.length <= maxLength
            ) {

              shortBodyHtml += blockHtml;

            } else {

              truncated = true;
            }
          }

          totalLength += block.code.length;
        }

        else if (block.type === "image") {

          blockHtml = `
<div class="post-image">

  <img
    src="${block.src}"
    alt="Post Image"
  >

  ${
    block.caption
      ? `
<p class="caption">
  ${block.caption}
</p>
`
      : ""
  }

</div>
`;

          fullBodyHtml += blockHtml;

          if (!truncated) {
            shortBodyHtml += blockHtml;
          }
        }
      });
      }

      card.innerHTML =
        headerHtml +
        `
<div class="post-body">
  ${post.type !== "event" && post.title ? `<h3 class="knowledge-post-title">${escapeHtml(post.title)}</h3>` : ""}

  <div class="post-text">
    ${
      truncated
        ? shortBodyHtml
        : fullBodyHtml
    }
  </div>

  ${
    truncated
      ? `
<button class="see-more-btn">
  See more
</button>
`
      : ""
  }

</div>
`;

      if (truncated) {

        const btn =
          card.querySelector(".see-more-btn");

        const textEl =
          card.querySelector(".post-text");

        let expanded = false;

        btn.addEventListener("click", () => {

          expanded = !expanded;

          if (expanded) {

            textEl.innerHTML =
              fullBodyHtml;

            Prism.highlightAll();

            btn.textContent =
              "See less";

          } else {

            textEl.innerHTML =
              shortBodyHtml;

            Prism.highlightAll();

            btn.textContent =
              "See more";
          }
        });
      }

      timelinePanel.appendChild(card);

    });

  Prism.highlightAll();

  renderPagination(timelinePanel, totalPages);
}

function renderPagination(container, totalPages) {
  if (totalPages <= 1) return;

  const pagination = document.createElement("div");
  pagination.className = "pagination";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.style.display = currentPage === 1 ? "none" : "inline-flex";
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTimeline();
    }
  });

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.style.display = currentPage >= totalPages ? "none" : "inline-flex";
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTimeline();
    }
  });

  pagination.append(prevBtn, nextBtn);
  container.appendChild(pagination);
}

function copyCode(btn) {

  const code =
    btn
      .closest(".code-card")
      .querySelector("code")
      .innerText;

  navigator.clipboard
    .writeText(code)
    .then(() => {

      btn.innerHTML =
        '<i class="fas fa-check"></i> Copied';

      btn.classList.add("copied");

      setTimeout(() => {

        btn.innerHTML =
          '<i class="fas fa-copy"></i> Copy';

        btn.classList.remove("copied");

      }, 1500);
    });
}

document.addEventListener("click", event => {
  const optionsButton = event.target.closest(".post-options-btn");
  const clickedMenu = event.target.closest(".post-options-menu");

  if (optionsButton) {
    event.preventDefault();
    event.stopPropagation();
    const menu = optionsButton.nextElementSibling;
    const shouldOpen = menu && menu.style.display !== "block";
    document.querySelectorAll(".post-options-menu").forEach(item => {
      item.style.display = "none";
    });
    if (menu && shouldOpen) menu.style.display = "block";
    return;
  }

  if (!clickedMenu) {
    document.querySelectorAll(".post-options-menu").forEach(menu => {
      menu.style.display = "none";
    });
  }
});

function sharePost(itemId, itemType = "technology") {
  const parameter = ["technology", "ruqyah", "event"].includes(itemType)
    ? itemType
    : "technology";
  const url = `${window.location.origin}${window.location.pathname}?${parameter}=${itemId}`;

  navigator.clipboard
    .writeText(url)
    .then(() => {
      document.querySelectorAll(".post-options-menu").forEach(menu => {
        menu.style.display = "none";
      });
      showToast("Link copied successfully");
    })
    .catch(err => {

      console.error(
        "Failed to copy post link:",
        err
      );
    });
}


async function shareRecitation(itemId) {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("recitation", itemId);
  const link = url.toString();

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(link);
    } else {
      const field = document.createElement("textarea");
      field.value = link;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      if (!copied) throw new Error("Copy command failed");
    }
    document.querySelectorAll(".post-options-menu").forEach(menu => {
      menu.style.display = "none";
    });
    showToast("Link copied successfully");
  } catch (error) {
    console.error("Failed to copy recitation link:", error);
    showToast("Unable to copy link");
  }
}

function showToast(message) {

  const toast =
    document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

document.addEventListener("keydown", (e) => {

  const input =
    document.getElementById("searchInput");

  if (!input) return;

  const isTyping =
    document.activeElement.tagName === "INPUT" ||
    document.activeElement.tagName === "TEXTAREA";

  if (
    e.key === "/" &&
    !isTyping
  ) {

    e.preventDefault();

    input.focus();
  }
});

loadPosts();

setupTimelineSearch();