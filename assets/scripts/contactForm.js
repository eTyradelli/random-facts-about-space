"use strict";

// Local constants
const formFields = document.querySelectorAll(".form-user-input");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const messageField = document.getElementById("message");
const submitBtn = document.getElementById("submit");
const thankYouMsg = document.getElementById("form-submit-success-message");
const sentErrorMsg = document.getElementById("form-submit-error-message");
let formCompleted;

// Form label behaviour
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

// Submit button behaviour
submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  formCompleted = undefined;

  // If user tried to submit form before and had missing-fields message show up, hide that message
  formFields.forEach((field) => {
    const msg = field.parentElement.querySelector(".error-message");
    toggleActive(msg, "active", true);
  });

  // All fields completed State

  validateForm();

  // If all is well, submit
  if (formCompleted === true) {
    sendMail();
    formCompleted = undefined;
  }
});

// Validation functions
function validateForm() {
  if (!nameField.value.trim().length) {
    setError(nameField, "Please, provide a name.");
  } else {
    removeError(nameField);
  }

  if (!emailField.value.trim().length) {
    setError(emailField, "Please, provide an email address.");
  } else if (!validEmail(emailField.value)) {
    setError(emailField, "This is not a valid email address.");
  } else {
    removeError(emailField);
  }

  if (!messageField.value.trim().length) {
    setError(messageField, "Please, provide a message.");
  } else {
    removeError(messageField);
  }

  if (formCompleted === undefined) {
    formCompleted = true;
  }
}

function setError(element, errorMsg) {
  const paragraph = element.parentElement.querySelector(".error-message");
  paragraph.textContent = errorMsg;
  toggleActive(paragraph, "active", false);
  formCompleted = false;
}

function removeError(element) {
  const paragraph = element.parentElement.querySelector(".error-message");
  toggleActive(paragraph, "active", true);
}

function validEmail(x) {
  const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return reg.test(x);
}

// Send function with messages for successful/not submission
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
