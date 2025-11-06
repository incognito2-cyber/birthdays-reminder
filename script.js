// Инициализация базы данных
const db = firebase.database();

// Проверяем, подключён ли Firebase Messaging (не обязательно)
let messaging;
try {
  messaging = firebase.messaging();
  messaging.usePublicVapidKey("BMhjknZIvmmVFZf3tBlCuLf5VPxxdvrTLnUfFuCt9PPFlk-zy70xVEKIp8_E2zvrUemrH_l5BIU0Hd1I4JsU-HI");
} catch (e) {
  console.warn("Firebase Messaging не активен:", e);
}

const nameInput = document.getElementById("nameInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("birthdaysList");
const clearAllBtn = document.getElementById("clearAll");

// ✅ Добавление дня рождения
function addBirthday() {
  const name = nameInput.value.trim();
  const date = dateInput.value.trim();

  if (!name || !date) {
    alert("Введите имя и дату!");
    return;
  }

  // Сохраняем в Firebase
  db.ref("birthdays").push({ name, date })
    .then(() => {
      nameInput.value = "";
      dateInput.value = "";
    })
    .catch(err => console.error("Ошибка добавления:", err));
}

// Кнопка "+"
addBtn.addEventListener("click", addBirthday);

// Добавление по Enter
[nameInput, dateInput].forEach(input => {
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") addBirthday();
  });
});

// ✅ Проверка — сегодня ли день рождения
function isToday(dateStr) {
  const today = new Date();
  const [year, month, day] = dateStr.split("-").map(Number);
  return today.getDate() === day && (today.getMonth() + 1) === month;
}

// ✅ Отображение списка
db.ref("birthdays").on("value", snapshot => {
  list.innerHTML = "";
  snapshot.forEach(child => {
    const { name, date } = child.val();
    const li = document.createElement("li");
    const text = document.createElement("span");

    if (isToday(date)) {
      text.textContent = `${name} — ${date} 🎉`;
      li.style.border = "2px solid #28a745";
      li.style.background = "#eaffea";
    } else {
      text.textContent = `${name} — ${date}`;
      li.style.border = "";
      li.style.background = "white";
    }

    const del = document.createElement("button");
    del.textContent = "✕";
    del.onclick = () => {
      if (confirm(`Удалить ${name}?`)) db.ref("birthdays").child(child.key).remove();
    };

    li.appendChild(text);
    li.appendChild(del);
    list.appendChild(li);
  });
});

// ✅ Удалить всё
clearAllBtn.addEventListener("click", () => {
  if (confirm("Удалить весь список дней рождений?")) {
    db.ref("birthdays").remove();
  }
});

// ✅ Уведомления (если активны)
if (messaging) {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      messaging.getToken().then(token => {
        console.log("FCM Token:", token);
      });
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
