const posts = [
  {
    user: "Md. Ridwanul Islam Muntakim",
    avatar: "assets/riwnlmk.png",
    content: "I just created my online Shelf, a personal space where I keep track of all the books I am reading and the anime I am watching. It is a neat way to organize my favorite stories, discover new titles, and share my journey with others. I am excited to keep it updated and see how my collection grows.",
    date: "06 Sep 2025"
  }
];

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

function renderTimeline() {
  const timelinePanel = document.getElementById("timeline");
  timelinePanel.innerHTML = "";

  posts.slice().reverse().forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";

    const maxLength = 400;
    let truncated = post.content.length > maxLength;
    let shortText = truncated ? post.content.slice(0, maxLength) + "..." : post.content;

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
          textEl.textContent = post.content;
          btn.textContent = "See less";
        } else {
          textEl.textContent = shortText;
          btn.textContent = "See more";
        }
      });
    }

    timelinePanel.appendChild(card);
  });
}

updateSearchVisibility();
renderTimeline();