const activitiesForm = document.getElementById("entries-form");
const activitiesContainer = document.getElementById("entries-container");
const allEntries = document.querySelectorAll(".entry");
const message = document.getElementById("message");

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

function clearForm() {
  document.getElementById("form-description").value = "";
  document.getElementById("form-value").value = "";
  document.getElementById("form-type").value = "+";
}

activitiesForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = document.getElementById("form-description").value;
  const value = document.getElementById("form-value").value;
  const type = document.getElementById("form-type").value;
  const time = getCurTime();

  if (description.trim() === "" || value.trim() === "" || isNaN(value)) {
    message.style.display = "block";
    setTimeout(() => {
      message.style.display = "none";
    }, 2500);
    return;
  }

  const markup = `
  <div class="entry">
    <h3>${description}</h3>
    <small>${time}</small>
    <span class="value ${
      type === "+" ? "income" : "expense"
    }-value">$${value}</span>
    <button class="delete-entry">X</button>
  </div>`;

  activitiesContainer.insertAdjacentHTML("afterbegin", markup);
  clearForm();
  document.getElementById("form-description").focus();
});
