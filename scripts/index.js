// Cards Data
const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// Select DOM elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Modal and Form elements for Edit Profile
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

// Modal and Form elements for Add Card
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const cardsList = document.querySelector(".cards__list");
const imageModal = document.querySelector("#image-modal");
const imageModalImage = imageModal.querySelector(".modal__image");

// Open and close modal functions
function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

// Event Listeners for opening modals
profileEditButton.addEventListener("click", () => {
  // Pre-fill the input fields with the current profile info
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
  resetValidation(editModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
  resetValidation(cardModal);
});

// Close modal buttons
editModalCloseBtn.addEventListener("click", () => closeModal(editModal));
cardModalCloseBtn.addEventListener("click", () => closeModal(cardModal));

// Close all modals when clicking on overlay or pressing Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) closeModal(openedModal);
  }
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

// Ensure each modal's close button works
document.querySelectorAll(".modal__close-btn").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const currentModal = event.target.closest(".modal");
    closeModal(currentModal);
  });
});

// Form submission for profile edit
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
  editFormElement.reset();
  editModal.querySelector(".modal__submit-btn").setAttribute("disabled", true);
}
editFormElement.addEventListener("submit", handleEditFormSubmit);

// Function to create a new card element
function createCardElement(data) {
  const cardTemplate = document.querySelector("#card-template");
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  // Like button toggle
  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });

  // Delete card
  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

  // Open image in modal
  cardImage.addEventListener("click", () => {
    imageModalImage.src = data.link;
    imageModalImage.alt = data.name;
    openModal(imageModal);
  });

  return cardElement;
}

// Add Card Functionality
function handleAddCardSubmit(evt) {
  evt.preventDefault();

  // Membuat card baru berdasarkan input form
  const newCard = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  // Membuat elemen card dan menambahkannya ke list
  const cardElement = createCardElement(newCard);
  cardsList.prepend(cardElement);

  // Menutup modal setelah pengiriman
  closeModal(cardModal);

  // Reset form
  cardForm.reset();

  // Menonaktifkan tombol "Simpan" setelah form disubmit
  cardModal.querySelector(".modal__submit-btn").setAttribute("disabled", true);
}
cardForm.addEventListener("submit", handleAddCardSubmit);

// Initial Cards Rendering
initialCards.forEach((cardData) => {
  const cardElement = createCardElement(cardData);
  cardsList.append(cardElement);
});
