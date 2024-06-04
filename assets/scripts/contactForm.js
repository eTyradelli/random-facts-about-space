"use strict";
const formFields = document.querySelectorAll(".form-user-input");
const submitBtn = document.getElementById("submit");
const missingMsg = document.getElementById("form-submit-missing-message");
const thankYouMsg = document.getElementById("form-submit-success-message");
const sentErrorMsg = document.getElementById("form-submit-error-message");

formFields.forEach((field) => {
  field.addEventListener("focusin", function () {
    field.nextElementSibling.classList.add("focused-label");
  });

  field.addEventListener("focusout", function () {
    if (!this.value.trim().length) {
      field.nextElementSibling.classList.remove("focused-label");
    }
  });
});

submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  toggleActive(missingMsg, "active", true);

  let formCompleted = true;

  for (let field of formFields) {
    if (!field.value.trim().length) {
      toggleActive(missingMsg);
      console.log("Please fill in all form fields");
      formCompleted = false;
      break;
    }
  }

  if (formCompleted === true) {
    sendMail();
  }
});

function sendMail() {
  emailjs.sendForm("default_service", "template_space", "#contact-form").then(
    function (res) {
      resetForm();
      toggleActive(thankYouMsg);
      setTimeout(() => {
        toggleActive(thankYouMsg);
      }, 5000);
    },
    function (error) {
      resetForm();
      toggleActive(sentErrorMsg);
      setTimeout(() => {
        toggleActive(sentErrorMsg);
      }, 5000);
    }
  );
}

function resetForm() {
  formFields.forEach((field) => {
    field.value = "";
    field.nextElementSibling.classList.remove("focused-label");
  });
}
