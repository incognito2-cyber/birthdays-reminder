const db = firebase.database();
const messaging = firebase.messaging();
messaging.usePublicVapidKey("BMhjknZIvmmVFZf3tBlCuLf5VPxxdvrTLnUfFuCt9PPFlk-zy70xVEKIp8_E2zvrUemrH_l5BIU0Hd1I4JsU-HI");

const nameInput = document.getElementById("nameInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("birthdaysList");

// Добавление дня рождения
function addBirthday() {
  const name = nameInput.value.trim();
  const date = dateInput.value;
  if (!name || !date) return;

  db.ref("birthdays").push({ name, date });
  nameInput.value = "";
  dateInput.value = "";
}

// Добавление по клику +
addBtn.addEventListener("click", addBirthday);

// Добавление по Enter
[nameInput, dateInput].forEach(input => {
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") addBirthday();
  });
});

// Отображение списка
db.ref("birthdays").on("value", snapshot => {
  list.innerHTML = "";
  snapshot.forEach(child => {
    const { name, date } = child.val();
    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = `${name} — ${date}`;

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

// 🔔 Push-уведомления
Notification.requestPermission().then(permission => {
  if (permission === "granted") {
    messaging.getToken().then(token => {
      console.log("FCM Token:", token);
    });
  }
});

// 🔥 Получение уведомлений
messaging.onMessage(payload => {
  console.log("Получено уведомление:", payload);
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon
  });
});
