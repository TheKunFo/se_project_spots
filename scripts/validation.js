const hideInputError = (formEl, inputEl, config) => {
  const errorElement = formEl.querySelector(`#${inputEl.id}-error`);
  errorElement.classList.remove(config.errorClass); // Hide error message
  inputEl.classList.remove(config.inputErrorClass); // Remove error styling from input
};
// Modify your showInputError function to make sure the error message is properly displayed
const showInputError = (formEl, inputEl, errorMsg, config) => {
  const errorElement = formEl.querySelector(`#${inputEl.id}-error`);
  errorElement.textContent = errorMsg; // Set the error message text
  errorElement.classList.add(config.errorClass); // Make error message visible
  inputEl.classList.add(config.inputErrorClass); // Add error styling to the input field
};

const toggleButtonState = (inputList, buttonElement) => {
  const isValid = inputList.every((input) => input.validity.valid);
  if (isValid) {
    buttonElement.removeAttribute("disabled");
  } else {
    buttonElement.setAttribute("disabled", true);
  }
};

// Reset validation errors when a modal is opened
const resetValidation = (modal) => {
  const formEl = modal.querySelector(".modal__form");
  const inputList = Array.from(formEl.querySelectorAll(".modal__input"));
  inputList.forEach((inputElement) => {
    hideInputError(formEl, inputElement);
  });
  formEl.querySelector(".modal__submit-btn").setAttribute("disabled", true);
};

// Mengubah fungsi enableValidation untuk menerima config dan meneruskannya ke setEventListener
const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListener(formEl, config);
  });
};

// Mengubah setEventListener untuk menerima config
const setEventListener = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement, config);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

const checkInputValidity = (formEl, inputEl, config) => {
  const errorMessage = inputEl.validationMessage;

  if (inputEl.type === "url" && !inputEl.validity.valid) {
    showInputError(formEl, inputEl, "Please enter a URL", config);
  } else if (inputEl.id === "add-card-name-input") {
    if (inputEl.value.length < 2) {
      showInputError(formEl, inputEl, "Please fill out this field", config);
    } else if (inputEl.value.length > 30) {
      showInputError(formEl, inputEl, "Please fill out this field", config);
    }
  } else if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, errorMessage, config);
  } else {
    hideInputError(formEl, inputEl, config);
  }
};
// Initialize validation listeners

const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};
enableValidation(settings);
