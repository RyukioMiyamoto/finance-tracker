const entriesForm = document.getElementById("entries-form");
const btn = document.getElementById("submit");
const message = document.getElementById("message");
const entriesContainer = document.getElementById("entries-container");
const allEntries = document.querySelectorAll(".entry");
const reducedMotion =
  window.matchMedia("(prefers-reduced-motion)").matches ||
  window.matchMedia("(prefers-reduced-motion: reduced)").matches;

function getCurTime() {
  const prefLanguage = window.navigator.language;
  return new Date().toLocaleDateString(prefLanguage, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function blockButton() {
  setMessage(1, "red", "Please enter valid values");
  btn.disabled = true;
  setTimeout(() => {
    setMessage(0, "none", "");
    btn.disabled = false;
  }, 1500);
}

function setMessage(opacity, color, text) {
  message.style.color = color;
  message.style.opacity = opacity;
  message.innerText = text;
}

function clearForm() {
  document.getElementById("form-description").value = "";
  document.getElementById("form-value").value = "";
  document.getElementById("form-type").value = "+";
}

function generateMarkup(desc, value, type, time) {
  return `<div class="entry">
    <h3>${desc}</h3>
    <small>${time}</small>
    <span class="value ${
      type === "+" ? "income" : "expense"
    }-value">$${value}</span>
    <button class="delete-entry">X</button>
  </div>`;
}

function delayAnimation() {
  allEntries.forEach((entry, i, array) => {
    entry.style.animationDelay = `${i * 250}ms`;
  });
}

entriesForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = document.getElementById("form-description").value;
  const value = document.getElementById("form-value").value;
  const type = document.getElementById("form-type").value;
  const time = getCurTime();

  if (
    description.trim() === "" ||
    value.trim() === "" ||
    isNaN(value) ||
    value <= 0
  ) {
    blockButton();
    return;
  } else {
    const markup = generateMarkup(description, value, type, time);
    entriesContainer.insertAdjacentHTML("afterbegin", markup);
    clearForm();
    document.getElementById("form-description").focus();
  }
});

!reducedMotion && delayAnimation();
document.getElementById("form-description").focus();
