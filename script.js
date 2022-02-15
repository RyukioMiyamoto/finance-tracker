const balanceValue = document.querySelector("span.balance");
const entriesForm = document.getElementById("entries-form");
const btn = document.getElementById("submit");
const message = document.getElementById("message");
const entriesContainer = document.getElementById("entries-container");
const emptyContainer = document.querySelector(".empty-container");
const reducedMotion =
  window.matchMedia("(prefers-reduced-motion)").matches ||
  window.matchMedia("(prefers-reduced-motion: reduced)").matches;
const prefLanguage = window.navigator.language;
let items;
let expenses;
let incomes;
let balance;

function delayAnimation() {
  allEntries.forEach((entry, i) => {
    entry.style.animationDelay = `${i * 250}ms`;
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

function getCurTime() {
  return new Date().toLocaleDateString(prefLanguage, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function generateMarkup(desc, value, type, time, id) {
  return `<div class="entry" data-id="${id}">
    <h3>${desc}</h3>
    <small>${time}</small>
    <span class="value ${type === "+" ? "income" : "expense"}-value">$${Number(
    value
  ).toLocaleString(prefLanguage)}</span>
    <button class="delete-entry">❌</button>
  </div>`;
}

function getEntriesFromLS() {
  items = localStorage.getItem("items");
  items = JSON.parse(items) || [];
  return items;
}

function renderEntriesFromLS() {
  items = getEntriesFromLS();
  items.forEach(({ desc, value, type, time, id }) => {
    renderEntry(desc, value, type, time, "beforeend", id);
    getBalance();
  });
}

function checkNoEntries() {
  if (items.length === 0)
    setTimeout(() => {
      emptyContainer.classList.add("show");
    }, 250);
  else emptyContainer.classList.remove("show");
}

function getEntriesSum(type) {
  items = getEntriesFromLS();
  const entries = items.filter((item) => item.type === type);
  const entriesTotal = entries.reduce((acc, i) => acc + Number(i.value), 0);

  return entriesTotal;
}

function getBalance() {
  expenses = getEntriesSum("-");
  incomes = getEntriesSum("+");
  balance = incomes - expenses;
  balanceValue.innerHTML = `${balance >= 0 ? "" : "-"}$${Math.abs(
    balance
  ).toLocaleString(prefLanguage)}`;
  if (balance > 0) {
    balanceValue.classList.add("balance-positive");
    balanceValue.classList.remove("balance-negative");
  } else if (balance < 0) {
    balanceValue.classList.add("balance-negative");
    balanceValue.classList.remove("balance-positive");
  } else {
    balanceValue.classList.remove("balance-positive");
    balanceValue.classList.remove("balance-negative");
  }
}

function renderEntry(desc, value, type, time, position, id) {
  const markup = generateMarkup(desc, value, type, time, id);
  entriesContainer.insertAdjacentHTML(position, markup);
}

function addEntryToLS(desc, value, type, time, id) {
  items = getEntriesFromLS();

  items = [{ desc, value, type, time, id }, ...items];
  localStorage.setItem("items", JSON.stringify(items));
}

function clearForm() {
  document.getElementById("form-description").value = "";
  document.getElementById("form-value").value = "";
  document.getElementById("form-type").value = "+";
  document.getElementById("form-description").focus();
}

function handleSubmit(e) {
  e.preventDefault();
  const desc = document.getElementById("form-description").value;
  const value = document.getElementById("form-value").value;
  const type = document.getElementById("form-type").value;
  const time = getCurTime();
  const id = `entry-${items.length + 1}`;
  const tagPattern = new RegExp("[<>]", "g");
  const specialCharPattern = new RegExp("[+*?^$.[]{}()|/]", "g");

  if (
    desc.trim() === "" ||
    value.trim() === "" ||
    desc.match(tagPattern) ||
    value.match(specialCharPattern) ||
    isNaN(value) ||
    value <= 0 ||
    (type === "-" && value.includes("+")) ||
    (type === "+" && value.includes("-"))
  ) {
    setMessage(1, "Please enter valid values");
    blockButton();
    return;
  } else {
    renderEntry(desc, value, type, time, "afterbegin", id);
    addEntryToLS(desc, value, type, time, id);
    clearForm();
    getBalance();
    checkNoEntries();
  }
}

function handleClick(e) {
  const operator = e.target.closest("button");
  if (!operator) return;
  const entryContainer = e.target.parentElement;
  const toDeleteItem = items.find(
    (item) => item.id === entryContainer.getAttribute("data-id")
  );
  const index = items.indexOf(toDeleteItem);
  items.splice(index, 1);
  entryContainer.classList.add("deleted");
  setTimeout(() => {
    entryContainer.remove();
    localStorage.setItem("items", JSON.stringify(items));
    getBalance();
  }, 300);
  checkNoEntries();
}

renderEntriesFromLS();
checkNoEntries();
const allEntries = document.querySelectorAll(".entry");
!reducedMotion && delayAnimation();
document.getElementById("form-description").focus();

entriesForm.addEventListener("submit", handleSubmit);
entriesContainer.addEventListener("click", handleClick);
