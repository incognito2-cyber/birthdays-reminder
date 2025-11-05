// Твой Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDmMKjRwOagaEdWElMy98r8shtibk9LXNM",
  authDomain: "birthdays-reminder-4a1c1.firebaseapp.com",
  databaseURL: "https://birthdays-reminder-4a1c1-default-rtdb.firebaseio.com",
  projectId: "birthdays-reminder-4a1c1",
  storageBucket: "birthdays-reminder-4a1c1.firebasestorage.app",
  messagingSenderId: "23543078001",
  appId: "1:23543078001:web:32ffb8edaa9b729a864fd0",
  measurementId: "G-B9GC38FX9P"
};

firebase.initializeApp(firebaseConfig);

// Messaging
const messaging = firebase.messaging();
messaging.usePublicVapidKey("BMhjknZIvmmVFZf3tBlCuLf5VPxxdvrTLnUfFuCt9PPFlk-zy70xVEKIp8_E2zvrUemrH_l5BIU0Hd1I4JsU-HI");
