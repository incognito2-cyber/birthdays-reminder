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
messaging.onBackgroundMessage(payload => {
  const { title, body, icon } = payload.notification;
  self.registration.showNotification(title, { body, icon });
});
