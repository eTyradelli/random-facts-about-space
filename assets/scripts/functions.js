// Functions HTML creation

function loadPinnedItems() {
  pinnedItems.forEach((itemData) => {
    var html = createHtml(itemData, "pinned");
    mainContainer.insertAdjacentHTML("beforeend", html);
  });
}

function createHtml(
  { title, url, explanation, copyright },
  pinned = "",
  viewed = ""
) {
  return `
    <div class='card ${pinned} ${viewed}' data-unique-url="${url}">
        <div class="card-top">
            <h2>${title}</h2>
            <div class="card-icons">
              <i class="fa-solid fa-thumbtack pin"></i>
              <i class="fa-solid fa-eye eye"></i>
            </div>
        </div>
        <div class="img-container">
        ${
          url.match("embed")
            ? `<iframe src="${url}"></iframe>`
            : `<img src="${url}" />`
        }
        </div>
        <div class="img-copyright">Media ©: <span>${
          !copyright ? "NASA" : copyright
        }</span></div>
        <div class='text-container'>
            <p class="card-explanation" clas>${
              explanation.slice(0, 120) + "..."
            }</p>
            <p class="card-explanation full" style="display:none">${explanation}</p>
        </div>
        <button class="read-more">Read more</button>
    </div>
    `;
}

function createPopupHtml({ title, url, explanation, copyright }) {
  return `
    <div class="card-top">
            <h2>${title}</h2>
        </div>
        <div class='img-container'>
        ${
          url.match("embed")
            ? `<iframe src="${url}"></iframe>`
            : `<img src="${url}" />`
        }
        </div>
        <div class="img-copyright">Img ©: ${
          !copyright ? "NASA" : copyright
        }</div>
        <div class='text-container'>
            <p class="card-explanation full"">${explanation}</p>
        </div>
    `;
}

function populatePopup(el) {
  const card = el.closest(".card");
  const title = card.querySelector("h2").textContent;
  const url = card.querySelector(".img-container > *").src;
  const copyright = card.querySelector(".img-copyright span").textContent;
  const explanation = card.querySelector(".card-explanation.full").textContent;
  const html = createPopupHtml({ title, url, explanation, copyright });
  modalPopupInner.insertAdjacentHTML("beforeend", html);
}

function createErrorContainer({ message }) {
  return `
	<div class='error-container'>
	   <h2>${message}</h2>
	</div>
	`;
}

// Handle Pin/Unpin (save cards in local storage)

function isPinned(el) {
  const itemUrl = el.closest(".card").dataset.uniqueUrl;
  const objIdx = pinnedItems.findIndex((obj) => obj.url === itemUrl);
  return objIdx;
}

function pinItem(el) {
  const idx = isPinned(el);
  if (idx === -1) {
    const pinnedCard = el.closest(".card");
    toggleActive(pinnedCard, "pinned");
    const title = pinnedCard.querySelector("h2").textContent;
    const url = pinnedCard.querySelector(".img-container > *").src;
    const explanation = pinnedCard.querySelector(
      ".card-explanation.full"
    ).textContent;
    let pinnedCardInfo = { title, url, explanation };
    pinnedItems.push(pinnedCardInfo);
    localStorage.setItem(`pinnedItems`, JSON.stringify(pinnedItems));
  } else {
    return;
  }
}

function unpinItem(el) {
  // toggleActive(el);
  const pinnedCard = el.closest(".card");
  toggleActive(pinnedCard, "pinned");
  const idx = isPinned(el);
  if (idx > -1) {
    pinnedItems.splice(idx, 1);
    localStorage.removeItem(`pinnedItems`);
    localStorage.setItem(`pinnedItems`, JSON.stringify(pinnedItems));
  } else {
    return;
  }
}

// Handle filters

function filterItms(e) {
  const el = e.target;
  // Make all filters inactive (CSS)
  filters.forEach((filter) => toggleActive(filter, "active", true));
  // Make clicked filter active (CSS)
  toggleActive(el);

  // Check which filter was clicked and decide which cards will be affected.
  if (el.classList.contains("filter-pinned")) {
    cards.forEach((card) => {
      card.classList.contains("pinned")
        ? (card.style.display = "grid")
        : (card.style.display = "none");
    });
    observer.unobserve(footer);
  } else if (el.classList.contains("filter-new")) {
    cards.forEach((card) => {
      !card.classList.contains("pinned")
        ? (card.style.display = "grid")
        : (card.style.display = "none");
    });
    observer.observe(footer);
  } else {
    cards.forEach((card) => {
      card.style.display = "grid";
    });
    observer.observe(footer);
  }
}

// Viewd item functions

function isViewed(el) {
  const itemUrl = el.closest(".card").dataset.uniqueUrl;
  const arrIdx = viewedItems.findIndex((el) => el === itemUrl);
  return arrIdx;
}

function setViewedItem(el) {
  const idx = isViewed(el);
  if (idx === -1) {
    const card = el.closest(".card");
    if (!card.classList.contains("viewed")) {
      toggleActive(card, "viewed");
    }
    const viewedUrl = card.dataset.uniqueUrl;
    viewedItems.push(viewedUrl);
    localStorage.removeItem(`viewedItems`);
    localStorage.setItem(`viewedItems`, JSON.stringify(viewedItems));
  } else {
    return;
  }
}

function loadViewedItems() {
  cards.forEach((card) => {
    viewedItems.forEach((item) => {
      if (card.dataset.uniqueUrl === item) {
        card.classList.add("viewed");
      }
    });
  });
}

// Other functions

function toggleActive(element, className = "active", isActive = "") {
  if (element.classList.contains(className) || isActive == true) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
}

function toggleScroll(element, isActiveEl) {
  if (
    isActiveEl.classList.contains("active") &&
    element.style.overflow == "visible"
  ) {
    element.style.overflow = "hidden";
  } else if (
    !isActiveEl.classList.contains("active") &&
    element.style.overflow == "hidden"
  ) {
    element.style.overflow = "visible";
  } else {
    return;
  }
}

function clickCallBack(e) {
  const el = e.target;
  if (
    el.classList.contains("pin") &&
    !el.closest(".card").classList.contains("pinned")
  ) {
    pinItem(el);
  } else if (
    el.classList.contains("pin") &&
    el.closest(".card").classList.contains("pinned")
  ) {
    unpinItem(el);
  } else if (el.classList.contains("read-more")) {
    toggleActive(modalPopup);
    toggleScroll(body, modalPopup);
    populatePopup(el);
    setViewedItem(el);
  } else {
    return;
  }
}
