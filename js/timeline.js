let posts = [];
let filteredPosts = [];

async function loadPosts() {
  try {
    const res = await fetch("data/posts.json");
    posts = await res.json();
    filteredPosts = posts;
    renderTimeline();
  } catch (err) {
    console.error("Error loading posts:", err);
  }
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const current = document.querySelector(".tab.active");
    if (current) current.classList.remove("active");
    tab.classList.add("active");

    const activeTab = tab.dataset.tab;

    if (activeTab === "timeline") {
      setupTimelineSearch();
    }
  });
});

function setupTimelineSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  input.onkeyup = null;

  input.onkeyup = function () {
    let filter = this.value.toLowerCase();
    filteredPosts = posts.filter(post =>
      post.blocks.some(block =>
        (block.type === "text" && block.content.toLowerCase().includes(filter)) ||
        (block.type === "code" && block.code.toLowerCase().includes(filter))
      )
    );
    renderTimeline();
  };
}

function formatTextBlock(text) {
  return text.replace(/  /g, " &nbsp;").replace(/\n/g, "<br>");
}

function renderTimeline() {
  const timelinePanel = document.getElementById("timeline");
  timelinePanel.innerHTML = "";

  if (filteredPosts.length === 0) {
    timelinePanel.innerHTML = `<p class="empty">No posts found.</p>`;
    return;
  }

  filteredPosts.slice().reverse().forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";

    let headerHtml = `
      <div class="post-header">
        <img src="${post.avatar}" alt="${post.user}" class="post-avatar">
        <div class="post-userinfo">
          <span class="post-username">${post.user}</span>
          <span class="post-date">${post.date}</span>
        </div>
      </div>
    `;

    const maxLength = 400;
    let totalLength = 0;
    let truncated = false;
    let fullBodyHtml = "";
    let shortBodyHtml = "";

    post.blocks.forEach(block => {
      let blockHtml = "";
      if (block.type === "text") {
        blockHtml = `<div class="post-content"><p>${formatTextBlock(block.content)}</p></div>`;
        fullBodyHtml += blockHtml;
        if (!truncated) {
          if (totalLength + block.content.length <= maxLength) {
            shortBodyHtml += blockHtml;
          } else {
            const remaining = maxLength - totalLength;
            if (remaining > 0) {
              shortBodyHtml += `<div class="post-content"><p>${formatTextBlock(
                block.content.slice(0, remaining)
              )}</p></div>`;
            }
            truncated = true;
          }
        }
        totalLength += block.content.length;
      } else if (block.type === "code") {
        blockHtml = `
          <div class="code-card">
            <div class="code-header">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
              <button class="copy-btn" onclick="copyCode(this)">
                <i class="fas fa-copy"></i> Copy
              </button>
            </div>
            <pre><code class="language-${block.lang}">${block.code}</code></pre>
          </div>
        `;
        fullBodyHtml += blockHtml;
        if (!truncated) {
          if (totalLength + block.code.length <= maxLength) {
            shortBodyHtml += blockHtml;
          } else {
            truncated = true;
          }
        }
        totalLength += block.code.length;
      }
    });

    card.innerHTML =
      headerHtml +
      `
      <div class="post-body">
        <div class="post-text">${truncated ? shortBodyHtml : fullBodyHtml}</div>
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
          textEl.innerHTML = fullBodyHtml;
          Prism.highlightAll();
          btn.textContent = "See less";
        } else {
          textEl.innerHTML = shortBodyHtml;
          Prism.highlightAll();
          btn.textContent = "See more";
        }
      });
    }

    timelinePanel.appendChild(card);
  });

  Prism.highlightAll();
}

function copyCode(btn) {
  const code = btn.closest(".code-card").querySelector("code").innerText;
  navigator.clipboard.writeText(code).then(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Copied';
    btn.classList.add("copied");
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
      btn.classList.remove("copied");
    }, 1500);
  });
}

loadPosts();
setupTimelineSearch();