// -------------------
// Validation Functions
// -------------------
// Hide error message
const hideInputError = (formEl, inputEl) => {
  const errorElement = formEl.querySelector(`#${inputEl.id}-error`);
  errorElement.classList.remove("modal__error_visible"); // Hide error message
  inputEl.classList.remove("modal__input_type_error"); // Remove error styling from input
};

// Modified checkInputValidity function for custom URL error message
const checkInputValidity = (formEl, inputEl) => {
  const errorMessage = inputEl.validationMessage;

  // Custom error for invalid URL (Image Link)
  if (inputEl.type === "url" && !inputEl.validity.valid) {
    showInputError(formEl, inputEl, "Masukkan URL yang valid"); // Display custom error message
  } else if (inputEl.id === "add-card-name-input") {
    // Caption validation
    if (inputEl.value.length < 2) {
      showInputError(formEl, inputEl, "Caption harus lebih dari 2 karakter");
    } else if (inputEl.value.length > 30) {
      showInputError(formEl, inputEl, "Caption harus kurang dari 30 karakter");
    }
  } else if (!inputEl.validity.valid) {
    // Default error message if validity fails
    showInputError(formEl, inputEl, errorMessage);
  } else {
    hideInputError(formEl, inputEl);
  }
};

// Modify your showInputError function to make sure the error message is properly displayed
const showInputError = (formEl, inputEl, errorMsg) => {
  const errorElement = formEl.querySelector(`#${inputEl.id}-error`);
  errorElement.textContent = errorMsg; // Set the error message text
  errorElement.classList.add("modal__error_visible"); // Make error message visible
  inputEl.classList.add("modal__input_type_error"); // Add error styling to the input field
};

// Toggle the state of the submit button based on the overall validity of the inputs
const toggleButtonState = (inputList, buttonElement) => {
  const isValid = inputList.every((input) => input.validity.valid);
  if (isValid) {
    buttonElement.removeAttribute("disabled");
  } else {
    buttonElement.setAttribute("disabled", true);
  }
};

// Set event listeners for each input in the form
const setEventListener = (formEl) => {
  const inputList = Array.from(formEl.querySelectorAll(".modal__input"));
  const buttonElement = formEl.querySelector(".modal__submit-btn");

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

// Enable validation for all forms
const enableValidation = () => {
  const formList = document.querySelectorAll(".modal__form");
  formList.forEach((formEl) => {
    setEventListener(formEl);
  });
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

// Initialize validation listeners
enableValidation();
