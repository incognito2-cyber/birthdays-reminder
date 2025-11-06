const nameInput = document.getElementById("nameInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("birthdaysList");
const clearAllBtn = document.getElementById("clearAll");

// Добавление дня рождения
function addBirthday() {
  const name = nameInput.value.trim();
  const date = dateInput.value;
  if (!name || !date) return;

  db.ref("birthdays").push({ name, date });
  nameInput.value = "";
  dateInput.value = "";
}

// Добавление по кнопке +
addBtn.addEventListener("click", addBirthday);

// Добавление по Enter
[nameInput, dateInput].forEach(input => {
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") addBirthday();
  });
});

// Отображение списка (с редактированием)
db.ref("birthdays").on("value", snapshot => {
  list.innerHTML = "";
  snapshot.forEach(child => {
    const { name, date } = child.val();
    const li = document.createElement("li");

    const nameInput = document.createElement("input");
    nameInput.value = name;
    nameInput.style.border = "none";
    nameInput.style.background = "transparent";
    nameInput.style.flex = "1";
    nameInput.style.fontSize = "16px";
    nameInput.style.outline = "none";

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = date;
    dateInput.style.border = "none";
    dateInput.style.background = "transparent";
    dateInput.style.fontSize = "16px";
    dateInput.style.outline = "none";

    // Кнопка сохранить ✅
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "✅";
    saveBtn.style.background = "seagreen";
    saveBtn.style.marginRight = "5px";
    saveBtn.onclick = () => {
      const newName = nameInput.value.trim();
      const newDate = dateInput.value;
      if (newName && newDate) {
        db.ref("birthdays").child(child.key).update({ name: newName, date: newDate });
      }
    };

    // Кнопка удалить ✕
    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.onclick = () => {
      if (confirm(`Удалить ${name}?`)) db.ref("birthdays").child(child.key).remove();
    };

    li.appendChild(nameInput);
    li.appendChild(dateInput);
    li.appendChild(saveBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
});

// Удалить всё
clearAllBtn.addEventListener("click", () => {
  if (confirm("Удалить весь список дней рождений?")) {
    db.ref("birthdays").remove();
  }
});

// --- Уведомления (новая безопасная версия) ---
if (messaging) {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      messaging
        .getToken({ vapidKey: "BMhjknZIvmmVFZf3tBlCuLf5VPxxdvrTLnUfFuCt9PPFlk-zy70xVEKIp8_E2zvrUemrH_l5BIU0Hd1I4JsU-HI" })
        .then(token => {
          console.log("FCM Token:", token);
        })
        .catch(err => console.warn("Ошибка получения токена:", err));
    }
  });

  messaging.onMessage(payload => {
    console.log("Получено уведомление:", payload);
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: payload.notification.icon
    });
  });
}
