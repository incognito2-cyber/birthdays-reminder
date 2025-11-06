const db = firebase.database();

const nameInput = document.getElementById("nameInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("birthdaysList");
const clearAllBtn = document.getElementById("clearAll");

// Добавление
function addBirthday() {
  const name = nameInput.value.trim();
  const date = dateInput.value;
  if (!name || !date) return;

  db.ref("birthdays").push({ name, date });
  nameInput.value = "";
  dateInput.value = "";
}

// Добавить по кнопке и Enter
addBtn.addEventListener("click", addBirthday);
[nameInput, dateInput].forEach(input => {
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") addBirthday();
  });
});

// Проверка, сегодня ли ДР
function isToday(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth()
  );
}

// Отображение списка
db.ref("birthdays").on("value", snapshot => {
  list.innerHTML = "";
  snapshot.forEach(child => {
    const key = child.key;
    const { name, date } = child.val();

    const li = document.createElement("li");
    const span = document.createElement("span");

    let text = `${name} — ${date}`;
    if (isToday(date)) text += " 🎉";

    span.textContent = text;

    const editBtn = document.createElement("button");
    editBtn.textContent = "✎";
    editBtn.style.background = "orange";
    editBtn.onclick = () => {
      const newName = prompt("Измени имя:", name);
      const newDate = prompt("Измени дату:", date);
      if (newName && newDate) {
        db.ref("birthdays").child(key).update({ name: newName, date: newDate });
      }
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.onclick = () => {
      if (confirm(`Удалить ${name}?`))
        db.ref("birthdays").child(key).remove();
    };

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
});

// Удалить всё
clearAllBtn.addEventListener("click", () => {
  if (confirm("Удалить весь список?")) db.ref("birthdays").remove();
});
