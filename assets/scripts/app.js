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

// function isViewed(el) {
//   const itemUrl = el.closest(".card").dataset.uniqueUrl;
//   const arrIdx = viewedItems.findIndex((el) => el === itemUrl);
//   return arrIdx;
// }

// function setViewedItem(el) {
//   const idx = isViewed(el);
//   if (idx === -1) {
//     const card = el.closest(".card");
//     if (!card.classList.contains("viewed")) {
//       toggleActive(card, "viewed");
//     }
//     const viewedUrl = card.dataset.uniqueUrl;
//     viewedItems.push(viewedUrl);
//     localStorage.removeItem(`viewedItems`);
//     localStorage.setItem(`viewedItems`, JSON.stringify(viewedItems));
//   } else {
//     return;
//   }
// }

// function loadViewedItems() {
//   cards.forEach((card) => {
//     viewedItems.forEach((item) => {
//       if (card.dataset.uniqueUrl === item) {
//         card.classList.add("viewed");
//       }
//     });
//   });
// }

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
translateBtn.addEventListener("click", translateText);

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

getData();
