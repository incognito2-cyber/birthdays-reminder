importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyDmMKjRwOagaEdWElMy98r8shtibk9LXNM",
  authDomain: "birthdays-reminder-4a1c1.firebaseapp.com",
  projectId: "birthdays-reminder-4a1c1",
  messagingSenderId: "23543078001",
  appId: "1:23543078001:web:32ffb8edaa9b729a864fd0"
});

const messaging = firebase.messaging();

// Фоновое уведомление
messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title || "Напоминание о дне рождения!";
  const notificationOptions = {
    body: payload.notification.body || "Сегодня день рождения 🎉",
    icon: payload.notification.icon || "/icon.png"
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Получение сообщений из страницы
self.addEventListener("message", event => {
  if (event.data && event.data.type === "BIRTHDAY_NOTIFICATION") {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: event.data.icon || "/icon.png"
    });
  }
});
