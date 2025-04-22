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

const toggleButtonState = (inputList, buttonElement, config) => {
  // config should come here
  const isValid = inputList.every((input) => input.validity.valid);
  if (isValid) {
    buttonElement.removeAttribute("disabled");
    buttonElement.classList.remove(config.inactiveButtonClass); // use config
  } else {
    disableButton(buttonElement, config); // use disableButton here
  }
};

const disableButton = (buttonElement, config) => {
  buttonElement.setAttribute("disabled", true);
  buttonElement.classList.add(config.inactiveButtonClass); // use config
};

// Reset validation errors when a modal is opened
export const resetValidation = (formEl, inputList, config) => {
  inputList.forEach((inputElement) => {
    hideInputError(formEl, inputElement, config);
  });
  const buttonElement = formEl.querySelector(config.submitButtonSelector);
  disableButton(buttonElement, config);
};

// Mengubah fungsi enableValidation untuk menerima config dan meneruskannya ke setEventListener
export const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListener(formEl, config);
  });
};

// Mengubah setEventListener untuk menerima config
const setEventListener = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

const checkInputValidity = (formEl, inputEl, config) => {
  const errorMessage = inputEl.validationMessage;
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, errorMessage, config);
  } else {
    hideInputError(formEl, inputEl, config);
  }
};
// Initialize validation listeners

export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};
// enableValidation(settings);
