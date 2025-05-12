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

// Confirm
const confirmModal = document.getElementById("confirm-response");
const confirmTitle = document.getElementById("confirm-title");
const confirmMessage = document.getElementById("confirm-message");

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
const deleteConfirmCloseBtn =
  deleteConfirmModal.querySelector(".modal__close-btn");
const cancelDeleteBtn = deleteConfirmModal.querySelector(
  ".modal__cancel-button"
);
const confirmDeleteBtn = deleteConfirmModal.querySelector(
  ".modal__confirm-button"
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

// Change avatar
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
  addEscapeListener();
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  removeEscapeListener();
}

// Form handlers
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
      confirmTitle.textContent = "Edit Avatar";
      confirmMessage.textContent = "You have successfully Updated a Avatar";
      openModal(confirmModal);
      setTimeout(function () {
        closeModal(confirmModal);
      }, 2000);
    })
    .catch(console.error)
    .finally(() => {
      editSubmitButton.textContent = "Save";
    });
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
      confirmTitle.textContent = "New Post";
      confirmMessage.textContent = "You have successfully created a post";
      openModal(confirmModal);
      setTimeout(function () {
        closeModal(confirmModal);
      }, 2000);
    })
    .catch(console.error)
    .finally(() => {
      cardSubmitButton.textContent = "Save";
    });
}

changeAvatarForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  avatarSubmitButton.textContent = "Saving...";
  const data = Object.fromEntries(formData);
  api
    .editAvatar(data)
    .then(() => {
      const avatar = document.querySelector(".profile__avatar");
      avatar.src = data.avatar;
      closeModal(changeAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      avatarSubmitButton.textContent = "Save"; // Reset to default text
    });
});

// Card element generator
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
    const toggleLike = cardLikeBtn.classList.toggle("card__like-btn_liked");
    toggleLike
      ? api.addLike(data._id)
      : api.removeLike(data._id).catch(console.error);
  });

  cardDeleteBtn.addEventListener("click", () => {
    openModal(deleteConfirmModal);

    const confirmHandler = () => {
      api
        .removeCard(data._id)
        .then(() => {
          cardElement.remove();
          closeModal(deleteConfirmModal);
          showConfirm("Delete Post", "You have successfully deleted a post");
        })
        .catch(console.error)
        .finally(() => {
          confirmDeleteBtn.removeEventListener("click", confirmHandler);
        });
    };

    confirmDeleteBtn.addEventListener("click", confirmHandler);
  });

  cardImgEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  return cardElement;
}

// Helpers
function showConfirm(title, message) {
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;
  openModal(confirmModal);
  setTimeout(() => closeModal(confirmModal), 2000);
}

// Modal controls
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

editModalCloseBtn.addEventListener("click", () => closeModal(editModal));
cancelDeleteBtn.addEventListener("click", () => closeModal(deleteConfirmModal));
deleteConfirmCloseBtn.addEventListener("click", () =>
  closeModal(deleteConfirmModal)
);
cardModalButton.addEventListener("click", () => openModal(cardModal));
cardModalCloseBtn.addEventListener("click", () => closeModal(cardModal));
previewModalCloseButton.addEventListener("click", () =>
  closeModal(previewModal)
);
changeAvatarClose.addEventListener("click", () =>
  closeModal(changeAvatarModal)
);

// Overlay close
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

// Escape close
function closeModalByEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) closeModal(openedModal);
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

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

enableValidation(settings);
