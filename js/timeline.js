let posts = [];

async function loadPosts() {
  try {
    const res = await fetch("data/posts.json");
    posts = await res.json();
    renderTimeline();
  } catch (err) {
    console.error("Error loading posts:", err);
  }
}

function updateSearchVisibility() {
  const searchInput = document.getElementById("searchInput");
  const activeTab = document.querySelector(".tab.active").getAttribute("data-tab");
  if (activeTab === "timeline") {
    searchInput.style.display = "none";
  } else {
    searchInput.style.display = "block";
  }
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelector(".tab.active").classList.remove("active");
    tab.classList.add("active");
    updateSearchVisibility();
  });
});

function formatContent(text) {
  return text
    .replace(/  /g, ' &nbsp;')
    .replace(/\n/g, '<br>');
}

function renderTimeline() {
  const timelinePanel = document.getElementById("timeline");
  timelinePanel.innerHTML = "";

  posts.slice().reverse().forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";

    const maxLength = 400;
    let truncated = post.content.length > maxLength;

    let shortText = truncated
      ? formatContent(post.content.slice(0, maxLength)) + "..."
      : formatContent(post.content);

    card.innerHTML = `
      <div class="post-header">
        <img src="${post.avatar}" alt="${post.user}" class="post-avatar">
        <div class="post-userinfo">
          <span class="post-username">${post.user}</span>
          <span class="post-date">${post.date}</span>
        </div>
      </div>
      <div class="post-content">
        <p class="post-text">${shortText}</p>
        ${truncated ? `<button class="see-more-btn">See more</button>` : ""}
      </div>
    `;

    if (truncated) {
      const btn = card.querySelector(".see-more-btn");
      const textEl = card.querySelector(".post-text");
      let expanded = false;

      btn.addEventListener("click", () => {
        expanded = !expanded;
        if (expanded) {
          textEl.innerHTML = formatContent(post.content);
          btn.textContent = "See less";
        } else {
          textEl.innerHTML = shortText;
          btn.textContent = "See more";
        }
      });
    }

    timelinePanel.appendChild(card);
  });
}

updateSearchVisibility();
loadPosts();