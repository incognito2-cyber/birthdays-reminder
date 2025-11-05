const db = firebase.database();
const list = document.getElementById("birthday-list");
const form = document.getElementById("birthday-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value;

  if (name && date) {
    db.ref("birthdays").push({ name, date });
    form.reset();
  }
});

db.ref("birthdays").on("value", (snapshot) => {
  list.innerHTML = "";
  snapshot.forEach((child) => {
    const data = child.val();
    const li = document.createElement("li");
    li.textContent = `${data.name} — ${data.date}`;
    list.appendChild(li);
  });
});

// Разрешение на уведомления
Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    console.log("Уведомления разрешены");
  }
});

// Проверка дней рождений раз в день
setInterval(() => {
  const today = new Date().toISOString().slice(5, 10);
  db.ref("birthdays").once("value").then((snapshot) => {
    snapshot.forEach((child) => {
      const data = child.val();
      if (data.date.slice(5, 10) === today) {
        showBirthdayNotification(data.name);
      }
    });
  });
}, 60 * 60 * 1000); // проверка каждый час

function showBirthdayNotification(name) {
  if (Notification.permission === "granted") {
    new Notification("🎂 Сегодня день рождения!", {
      body: `${name} празднует сегодня 🎉`,
      icon: "https://cdn-icons-png.flaticon.com/512/3448/3448599.png"
    });
  }
}
