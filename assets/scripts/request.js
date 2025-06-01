"use strict";

const URL = "https://api.nasa.gov/planetary/apod";
const API_KEY = "yB4JDNwsQjD2YGA4SiM5u4IIdrUGzwSIlm1eX9fu";
const count = 12;
let url = createRequestUrl(URL, API_KEY, {
  //count:count
  count,
});

function createRequestUrl(url, key, args) {
  var paramStr = "";
  Object.entries(args).forEach(function ([param, value]) {
    paramStr += `&${param}=${value}`;
  });
  return `${url}?api_key=${key}${paramStr}`;
}

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
    // const errorHtml = createErrorContainer(err);
    // mainContainer.insertAdjacentHTML("afterbegin", errorHtml);
    console.log(err)
  }
}
