const db = firebase.database();

const nameInput = document.getElementById("nameInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("birthdaysList");
const clearAllBtn = document.getElementById("clearAll");

// Добавление нового дня рождения
function addBirthday() {
  const name = nameInput.value.trim();
  const date = dateInput.value;
  if (!name || !date) return;

  db.ref("birthdays").push({ name, date });
  nameInput.value = "";
  dateInput.value = "";
}

// Кнопка "+" и Enter
addBtn.addEventListener("click", addBirthday);
[nameInput, dateInput].forEach(input => {
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") addBirthday();
  });
});

// Проверка, сегодня ли день рождения
function isToday(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);
  return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
}

// Отправка уведомления через сервис-воркер
function sendBirthdayNotification(name) {
  if (Notification.permission === "granted" && "serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.active.postMessage({
        type: "BIRTHDAY_NOTIFICATION",
        title: "Сегодня день рождения!",
        body: `${name} празднует день рождения 🎉`,
        icon: "/icon.png"
      });
    });
  }
}

// Отображение списка
db.ref("birthdays").on("value", snapshot => {
  list.innerHTML = "";
  snapshot.forEach(child => {
    const key = child.key;
    const { name, date } = child.val();

    const li = document.createElement("li");

    // Имя (inline редактирование)
    const nameSpan = document.createElement("span");
    nameSpan.textContent = name;
    nameSpan.style.cursor = "pointer";
    nameSpan.onclick = () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = nameSpan.textContent;
      nameSpan.replaceWith(input);
      input.focus();

      input.addEventListener("blur", () => {
        const newName = input.value.trim();
        if (newName) {
          db.ref("birthdays").child(key).update({ name: newName });
          input.replaceWith(nameSpan);
          nameSpan.textContent = newName;
        } else {
          input.replaceWith(nameSpan);
        }
      });

      input.addEventListener("keypress", e => {
        if (e.key === "Enter") input.blur();
      });
    };

    // Дата (inline редактирование)
    const dateSpan = document.createElement("span");
    dateSpan.textContent = date;
    dateSpan.style.marginLeft = "10px";
    dateSpan.style.cursor = "pointer";
    dateSpan.onclick = () => {
      const input = document.createElement("input");
      input.type = "date";
      input.value = dateSpan.textContent;
      dateSpan.replaceWith(input);
      input.focus();

      input.addEventListener("blur", () => {
        const newDate = input.value;
        if (newDate) {
          db.ref("birthdays").child(key).update({ date: newDate });
          input.replaceWith(dateSpan);
          dateSpan.textContent = newDate;
        } else {
          input.replaceWith(dateSpan);
        }
      });

      input.addEventListener("keypress", e => {
        if (e.key === "Enter") input.blur();
      });
    };

    // Галочка 🎉 если сегодня
    const checkSpan = document.createElement("span");
    checkSpan.style.marginLeft = "10px";
    checkSpan.textContent = isToday(date) ? "🎉" : "";
    if (isToday(date)) sendBirthdayNotification(name);

    // Кнопка удаления
    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.onclick = () => {
      if (confirm(`Удалить ${name}?`)) db.ref("birthdays").child(key).remove();
    };

    li.appendChild(nameSpan);
    li.appendChild(dateSpan);
    li.appendChild(checkSpan);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
});

// Удалить весь список
clearAllBtn.addEventListener("click", () => {
  if (confirm("Удалить весь список?")) db.ref("birthdays").remove();
});

// Регистрация service worker для уведомлений
Notification.requestPermission().then(permission => {
  if (permission === "granted" && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("firebase-messaging-sw.js");
  }
});
