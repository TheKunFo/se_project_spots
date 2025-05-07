import "./pages/index.css";
import Api from "./utils/Api.js";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "./scripts/validation.js";

// Profile elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Form elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const editSubmitButton = editModal.querySelector(".modal__submit-btn");

const deleteConfirmModal = document.querySelector("#confirm-delete");
console.log(deleteConfirmModal);
const deleteConfirmCloseBtn =
  deleteConfirmModal.querySelector(".modal__close-btn");

const CancelConfirmCloseBtn = deleteConfirmModal.querySelector(
  ".modal__cancel-button"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardSubmitButton = cardModal.querySelector(".modal__submit-btn");

// Preview
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close-btn");

// Card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// Change avatar functionality
const changeAvatarButton = document.querySelector(".profile__avatar-btn");
const changeAvatarModal = document.querySelector("#edit-avatar-modal");
const changeAvatarForm = changeAvatarModal.querySelector("#edit-avatar-form");
const avatarSubmitButton =
  changeAvatarModal.querySelector(".modal__submit-btn");
const changeAvatarClose = changeAvatarModal.querySelector(".modal__close-btn");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "d44cd1da-3eb5-4df7-b9ca-8d742a5da7d3",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    const profileAvatar = document.querySelector(".profile__avatar");
    profileAvatar.src = userInfo.avatar;

    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
    });
  })
  .catch(console.error);

function openModal(modal) {
  modal.classList.add("modal_opened");
  addEscapeListener(); // Add
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  removeEscapeListener(); // Remove
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  editSubmitButton.textContent = "Saving...";
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
      editSubmitButton.textContent = "Save";
    })
    .catch(console.error);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  cardSubmitButton.textContent = "Saving...";
  api
    .addNewCard(inputValues)
    .then((card) => {
      const cardElement = getCardElement(card);
      cardsList.prepend(cardElement);
      closeModal(cardModal);
      cardForm.reset();
      disableButton(evt.submitter, settings);
      cardSubmitButton.textContent = "Save";
    })
    .catch(console.error);
}

changeAvatarForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  avatarSubmitButton.textContent = "Saving...";
  // output as an object
  const data = Object.fromEntries(formData);
  api
    .editAvatar(data)
    .then(() => {
      const avatar = document.querySelector(".profile__avatar");
      avatar.src = data.avatar;
      closeModal(changeAvatarModal);
      avatarSubmitButton.textContent = "Save";
    })
    .catch(console.error);
});

let deleteListener = null;
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImgEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardImgEl.src = data.link;
  cardImgEl.alt = data.name;
  cardNameEl.textContent = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }
  cardLikeBtn.addEventListener("click", () => {
    if (cardLikeBtn.classList.contains("card__like-btn_liked")) {
      api.removeLike(data._id).catch(console.error);
    } else {
      api.addLike(data._id).catch(console.error);
    }
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });

  cardDeleteBtn.addEventListener("click", () => {
    const modal = document.querySelector("#confirm-delete");
    modal.classList.add("modal_opened");
    const button = modal.querySelector(".modal__confirm-button");
    deleteListener = () => {
      api
        .removeCard(data._id)
        .then(() => {
          cardElement.remove();
        })
        .catch(console.error);
      closeModal(modal);
    };
    button.addEventListener("click", deleteListener);
  });

  // Preview
  cardImgEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  return cardElement;
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});
console.log(CancelConfirmCloseBtn);
CancelConfirmCloseBtn.addEventListener("click", () => {
  console.log("dasdsad");
  closeModal(deleteConfirmModal);
});
deleteConfirmCloseBtn.addEventListener("click", () => {
  console.log("clicked close button");
  closeModal(deleteConfirmModal);
  const button = deleteConfirmModal.querySelector(".modal__confirm-button");
  button.removeEventListener("click", deleteListener);
});
cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

changeAvatarClose.addEventListener("click", () => {
  closeModal(changeAvatarModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

function closeModalByOverlay(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("click", closeModalByOverlay);
});

function closeModalByEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function addEscapeListener() {
  document.addEventListener("keydown", closeModalByEscape);
}

function removeEscapeListener() {
  document.removeEventListener("keydown", closeModalByEscape);
}

changeAvatarButton.addEventListener("click", () => {
  openModal(changeAvatarModal);
  disableButton(avatarSubmitButton, settings);
});

enableValidation(settings);
