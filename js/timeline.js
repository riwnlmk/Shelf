let posts = [];
let filteredPosts = [];

const PAGE_SIZE = 3;
let currentPage = 1;

async function loadPosts() {
  try {
    const res = await fetch("data/posts.json");

    posts = await res.json();
    filteredPosts = posts;

    const postId = new URLSearchParams(
      window.location.search
    ).get("post");

    if (postId) {
      document
        .querySelectorAll(".tab")
        .forEach(t => t.classList.remove("active"));

      document
        .querySelectorAll(".panel")
        .forEach(p => p.classList.remove("active"));

      const timelineTab = document.querySelector(
        '.tab[data-tab="timeline"]'
      );

      if (timelineTab) {
        timelineTab.classList.add("active");
      }

      const timelinePanel =
        document.getElementById("timeline");

      if (timelinePanel) {
        timelinePanel.classList.add("active");
      }

      const single = posts.find(
        p => p.id == postId
      );

      filteredPosts = single ? [single] : [];
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

      if (activeTab === "timeline") {
        const url = new URL(window.location);

        if (url.searchParams.has("post")) {
          url.searchParams.delete("post");

          window.history.replaceState(
            {},
            "",
            url
          );
        }

        filteredPosts = posts;

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

    if (activeTab !== "timeline") {
      return;
    }

    let filter = this.value
      .toLowerCase()
      .trim();

    filteredPosts = posts.filter(post =>
      post.blocks.some(block =>
        (
          block.type === "text" &&
          block.content
            .toLowerCase()
            .includes(filter)
        ) ||
        (
          block.type === "code" &&
          block.code
            .toLowerCase()
            .includes(filter)
        )
      )
    );

    currentPage = 1;

    renderTimeline();
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
    /`([^`]+)`/g,
    '<code class="inline-code">$1</code>'
  );

  return text
    .replace(/  /g, " &nbsp;")
    .replace(/\n/g, "<br>");
}

function renderTimeline() {
  const timelinePanel =
    document.getElementById("timeline");

  timelinePanel.innerHTML = "";

  if (filteredPosts.length === 0) {
    timelinePanel.innerHTML =
      `<p class="empty">No posts found.</p>`;

    return;
  }

  const reversed = filteredPosts.slice().reverse();

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
      ${post.date}
    </span>
  </div>

  <div class="post-options">
    <button class="post-options-btn">
      ⋮
    </button>

    <div class="post-options-menu">
      <button onclick="sharePost('${post.id}')">
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

      card.innerHTML =
        headerHtml +
        `
<div class="post-body">

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

  if (totalPages <= 1) return;

  const pagination =
    document.createElement("div");

  pagination.className = "pagination";

  const prevBtn =
    document.createElement("button");

  prevBtn.textContent = "Prev";

  prevBtn.style.display =
    currentPage === 1
      ? "none"
      : "inline-flex";

  prevBtn.addEventListener(
    "click",
    () => {

      if (currentPage > 1) {

        currentPage--;

        renderTimeline();
      }
    }
  );

  const nextBtn =
    document.createElement("button");

  nextBtn.textContent = "Next";

  nextBtn.style.display =
    currentPage >= totalPages
      ? "none"
      : "inline-flex";

  nextBtn.addEventListener(
    "click",
    () => {

      if (currentPage < totalPages) {

        currentPage++;

        renderTimeline();
      }
    }
  );

  pagination.appendChild(prevBtn);

  pagination.appendChild(nextBtn);

  timelinePanel.appendChild(pagination);
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

document.addEventListener("click", (e) => {

  if (
    e.target.classList.contains(
      "post-options-btn"
    )
  ) {

    const menu =
      e.target.nextElementSibling;

    menu.style.display =
      menu.style.display === "block"
        ? "none"
        : "block";

  } else {

    document
      .querySelectorAll(
        ".post-options-menu"
      )
      .forEach(m => {
        m.style.display = "none";
      });
  }
});

function sharePost(postId) {

  const url =
    `${window.location.origin}${window.location.pathname}?post=${postId}`;

  navigator.clipboard
    .writeText(url)
    .then(() => {

      showToast(
        "Link copied successfully"
      );

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