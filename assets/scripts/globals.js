"use strict";

// Header
const navToggle = document.getElementById("nav-toggle");

// Modal for data cards
const modalPopup = document.getElementById("modal-popup");
const modalPopupInner = document.querySelector(".modal__inner");
const modalCloseBtn = modalPopup.querySelector(".modal__nav-toggle");

// Main
const body = document.getElementById("body");
const filters = document.querySelectorAll(".filter");
const pinnedCount = document.querySelector("sup");
const main = document.getElementById("main");
const mainContainer = document.getElementById("main-container");
const pinnedContainer = document.getElementById("pinned-container");

// Sidebar
const sideBar = document.getElementById("aside");
const speechContainer = document.getElementById("speech-container");
const translateBtn = document.getElementById("translate");

// Sidebar contact form
const sideBarMain = document.getElementById("aside-main");
const sideBarContactForm = document.getElementById("aside-contact-form");

// Footer
const footer = document.getElementById("footer");
