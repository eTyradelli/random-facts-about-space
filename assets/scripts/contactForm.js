"use strict";
const formFields = document.querySelectorAll(".form-user-input");
const submitBtn = document.getElementById("submit");

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

  let formCompleted = true;

  for (let field of formFields) {
    if (!field.value.trim().length) {
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
      console.log("Success!" + res.status);
    },
    (error) => {
      console.log("FAILED...", error);
    }
  );
}
