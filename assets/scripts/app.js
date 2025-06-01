"use strict";

// This is populated everytime getData() is called.
let cards;
// const pinnedItems =
//   localStorage.getItem("pinnedItems") !== null
//     ? [...JSON.parse(localStorage.getItem("pinnedItems"))]
//     : [];

// if (pinnedItems?.length) {
//   loadPinnedItems();
// }
const pinnedItems =
  localStorage.getItem("pinnedItems") !== null
    ? [...JSON.parse(localStorage.getItem("pinnedItems"))]
    : [];
    
loadPinnedItems();

let viewedItems =
  localStorage.getItem("viewedItems") !== null
    ? [...JSON.parse(localStorage.getItem("viewedItems"))]
    : [];

// Event listeners
const query = matchMedia("(max-width: 790px)");
query.addEventListener("change", () => {
  toggleActive(navToggle, "active", true);
  toggleActive(sideBar, "active", true);
  if (body.style.overflow === "hidden") {
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

getData();
