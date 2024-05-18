// Constants and variables
const URL = "https://api.nasa.gov/planetary/apod";
const API_KEY = "yB4JDNwsQjD2YGA4SiM5u4IIdrUGzwSIlm1eX9fu";
const count = 12;
let url = createRequestUrl(URL, API_KEY, {
  //count:count
  count,
});

const body = document.getElementById("body");
const navToggle = document.getElementById("nav-toggle");
const modalPopup = document.getElementById("modal-popup");
const modalPopupInner = document.querySelector(".modal-popup-inner");
const modalCloseBtn = modalPopup.querySelector(".modal-nav-toggle");
const sideBar = document.getElementById("aside");
const filters = document.querySelectorAll(".filter");
const main = document.getElementById("main");
const mainContainer = document.getElementById("main-container");
const footer = document.getElementById("footer");

// This is populated everytime getData() is called.
// This way, variable is global and new cards are always added to it.
let cards;
const pinnedItems =
  localStorage.getItem("pinnedItems") !== null
    ? [...JSON.parse(localStorage.getItem("pinnedItems"))]
    : [];

if (pinnedItems?.length) {
  loadPinnedItems();
}
let viewedItems =
  localStorage.getItem("viewedItems") !== null
    ? [...JSON.parse(localStorage.getItem("viewedItems"))]
    : [];

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

// Event listeners
const query = matchMedia("(max-width: 790px)");
query.addEventListener("change", () => {
  toggleActive(navToggle, "active", true);
  toggleActive(sideBar, "active", true);
  if ((body.style.overflow = "hidden")) {
    body.style.overflow = "visible";
  }
});
document.addEventListener("click", clickCallBack);
navToggle.addEventListener("click", function clkCalb() {
  toggleActive(navToggle);
  toggleActive(sideBar);
  if (window.innerWidth < "790") {
    toggleScroll(body, sideBar);
  }
});
modalCloseBtn.addEventListener("click", function clkCalb() {
  toggleActive(modalPopup);
  toggleScroll(body, modalPopup);
  modalPopupInner.innerHTML = "";
});

// Functions HTML creation

function loadPinnedItems() {
  pinnedItems.forEach((itemData) => {
    var html = createHtml(itemData, "pinned");
    mainContainer.insertAdjacentHTML("beforeend", html);
  });
}

function createRequestUrl(url, key, args) {
  var paramStr = "";
  Object.entries(args).forEach(function ([param, value]) {
    paramStr += `&${param}=${value}`;
  });
  return `${url}?api_key=${key}${paramStr}`;
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

////////////
////////////
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

////////////
////////////
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

////////////
////////////
// Helper functions

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

// Setup and initialize intersection observer
let options = {
  root: null,
  rootMargin: "0px",
  threshhold: 1,
};

function obsrvrCllbck(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      getData();
    }
  });
}

const observer = new IntersectionObserver(obsrvrCllbck, options);

////////////
////////////
// Make first request

async function getData() {
  // Pause Intersection Observer and filters click listener
  observer.unobserve(footer);

  //Show loading animation
  const loader = `<div class="loader-container"><div class="loader"></div></div>`;
  main.insertAdjacentHTML("beforeend", loader);

  // Make request
  try {
    // Get data from API
    const res = await fetch(url);
    const data = await res.json();
    if (!data || !data.length) {
      throw new Error("something went wrong");
    }
    // Make cards and show them on screen
    data.forEach((picData) => {
      const html = createHtml(picData);
      mainContainer.insertAdjacentHTML("beforeend", html);
    });

    // Remove loading animation
    document.querySelector(".loader-container").remove();

    // Refresh cards array
    cards = document.querySelectorAll(".card");

    // Check again for viewed items in local storage
    viewedItems =
      localStorage.getItem("viewedItems") !== null
        ? [...JSON.parse(localStorage.getItem("viewedItems"))]
        : [];

    if (viewedItems?.length) {
      loadViewedItems();
    }

    // Unpause Intersection Observer and filters click listener
    observer.observe(footer);
    filters.forEach((filter) => {
      filter.addEventListener("click", (e) => {
        filterItms(e);
      });
    });
  } catch (err) {
    const errorHtml = createErrorContainer(err);
    mainContainer.insertAdjacentHTML("afterbegin", errorHtml);
  }
}

getData();

// Make alien speech animation
const humanText = ["Hello there!", "I'm E. T.", "Let's connect!"];
const speechContainer = document.getElementById("speech-container");
const translateBtn = document.getElementById("translate");
const symbols = "∩⌠≡±∟¤×Ø▬○⌡•⦿∘┴⍎⍝⍠ˡ～ˠ⥷⭄⥑⥐⥏⥎⥍⥰☌⇊⇇⇈⇉°✳✣";
const symbolsLength = symbols.length;
let isTranslated = false;
translateBtn.addEventListener("click", translateText);

function createText() {
  const pars = [];
  humanText.forEach((text) => {
    pars.push(`<p>${text}</p>`);
  });

  speechContainer.innerHTML = pars.join("");
}

function makeTextAlien() {
  const pars = [];
  humanText.forEach((text) => {
    const l = text.length;
    let random_text = "";
    while (random_text.length < l) {
      random_text += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    pars.push(`<p>${random_text}</p>`);
  });

  speechContainer.innerHTML = pars.join("");
}

function translateText() {
  translateBtn.removeEventListener("click", translateText);

  const pars = speechContainer.querySelectorAll("p");
  const parsL = pars.length;
  for (let idx = 0; idx < parsL; idx++) {
    let fadeBuffer = [];
    let message = "";
    let completedLetters = 0;
    const lngth = humanText[idx].length;
    for (var i = 0; i < lngth; i++) {
      fadeBuffer.push({
        c: Math.floor(Math.random() * 18) + 1,
        l: humanText[idx].charAt(i),
      });
    }

    const intervalId = setInterval(() => {
      for (var i = 0; i < fadeBuffer.length; i++) {
        var fader = fadeBuffer[i];
        if (fader.c > 0) {
          do_cycles = true;
          fader.c--;
          message += symbols.charAt(Math.floor(Math.random() * symbols.length));
        } else {
          message += fader.l;
          completedLetters++;
        }
      }
      pars[idx].textContent = message;
      message = "";
      if (completedLetters >= fadeBuffer.length) {
        clearInterval(intervalId);
        translateBtn.addEventListener("click", translateText);
      } else {
        completedLetters = 0;
      }
    }, 100);
  }
}
createText();
makeTextAlien();

// Figure out if APIkey needs to be hidden.
// Maybe use userAgentData for responsive behaviour?

// Fix sidebar behaviour on mobile -> landscape.

// Refactor code:
// Make better toggling function for all use cases.
// Mutation observer. Where do I need it?
// Resize observer. Where do I need it?
// Check if body is better set as grid, to make sidebar behaviour with grid + css.
// Split JS into files
