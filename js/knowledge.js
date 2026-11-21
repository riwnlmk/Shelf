let knowledgeItems = { technology: [], psychology: [] };
let filteredPosts = [];
let events = [];
let filteredEvents = [];
let activeTimelineView = "technology";

const PAGE_SIZE = 3;
let currentPage = 1;

async function loadPosts() {
  try {
    const [technologyResponse, psychologyResponse, eventsResponse] = await Promise.all([
      fetch("data/technology.json"),
      fetch("data/psychology.json"),
      fetch("data/events.json")
    ]);

    knowledgeItems.technology = await technologyResponse.json();
    knowledgeItems.psychology = await psychologyResponse.json();
    events = await eventsResponse.json();
    filteredPosts = knowledgeItems.technology;
    filteredEvents = events;

    const queryParams = new URLSearchParams(window.location.search);
    const eventId = queryParams.get("event");
    const categoryParam = Object.keys(knowledgeItems).find(key => queryParams.has(key));
    const categoryId = categoryParam ? queryParams.get(categoryParam) : null;
    const sharedId = eventId || categoryId;

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

    if (sharedId && sharedItem) {
      document.querySelectorAll(".timeline-subtab").forEach(button => {
        const active = button.dataset.timelineView === activeTimelineView;
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

        if (["post", "tech", "technology", "psychology", "event"].some(key => url.searchParams.has(key))) {
          ["post", "tech", "technology", "psychology", "event"].forEach(key => url.searchParams.delete(key));

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
    /\[\[quote\]\]([\s\S]*?)\[\[\/quote\]\]/gi,
    '<blockquote class="post-quote">$1</blockquote>'
  );

  text = text.replace(
    /&gt;&gt;([\s\S]+?)&lt;&lt;/g,
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
  const parameter = ["technology", "psychology", "event"].includes(itemType)
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