const entriesForm = document.getElementById("entries-form");
const btn = document.getElementById("submit");
const message = document.getElementById("message");
const entriesContainer = document.getElementById("entries-container");
const reducedMotion =
  window.matchMedia("(prefers-reduced-motion)").matches ||
  window.matchMedia("(prefers-reduced-motion: reduced)").matches;
const prefLanguage = window.navigator.language;
let items;

function delayAnimation() {
  allEntries.forEach((entry, i) => {
    entry.style.animationDelay = `${i * 250}ms`;
  });
}

function getCurTime() {
  return new Date().toLocaleDateString(prefLanguage, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function blockButton() {
  btn.disabled = true;
  setTimeout(() => {
    setMessage(0, "");
    setTimeout(() => {
      btn.disabled = false;
    }, 250);
  }, 1500);
}

function setMessage(opacity, text) {
  message.style.opacity = opacity;
  setTimeout(() => {
    message.innerText = text;
  }, `${opacity === 0 ? 250 : 0}`);
}

function clearForm() {
  document.getElementById("form-description").value = "";
  document.getElementById("form-value").value = "";
  document.getElementById("form-type").value = "+";
  document.getElementById("form-description").focus();
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

function getEntriesFromLS() {
  items = localStorage.getItem("items");
  if (items) {
    items = JSON.parse(items);
  } else {
    items = [];
  }

  return items;
}

function addEntryToLS(desc, value, type, time) {
  items = getEntriesFromLS();

  items = [{ desc, value, type, time }, ...items];
  localStorage.setItem("items", JSON.stringify(items));
}

function renderEntry(desc, value, type, time, position) {
  const markup = generateMarkup(desc, value, type, time);
  entriesContainer.insertAdjacentHTML(position, markup);
}

function renderEntriesFromLS() {
  items = getEntriesFromLS();
  items.forEach(({ desc, value, type, time }) =>
    renderEntry(desc, value, type, time, "beforeend")
  );
}

function handleSubmit(e) {
  e.preventDefault();
  const desc = document.getElementById("form-description").value;
  const value = document.getElementById("form-value").value;
  const type = document.getElementById("form-type").value;
  const time = getCurTime();

  if (desc.trim() === "" || value.trim() === "" || isNaN(value) || value <= 0) {
    setMessage(1, "Please enter valid values");
    blockButton();

    return;
  } else {
    renderEntry(desc, value, type, time, "afterbegin");
    addEntryToLS(desc, value, type, time);
    clearForm();
  }
}

renderEntriesFromLS();
const allEntries = document.querySelectorAll(".entry");

!reducedMotion && delayAnimation();
document.getElementById("form-description").focus();

entriesForm.addEventListener("submit", handleSubmit);
