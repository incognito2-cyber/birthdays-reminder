// firebase-messaging-sw.js
// Этот файл нужен только если реально используешь push-уведомления.
// Чтобы не было ошибок на GitHub Pages — оставляем безопасную заглушку.

self.addEventListener("install", () => {
  console.log("Service Worker установлен");
});

self.addEventListener("activate", () => {
  console.log("Service Worker активирован");
});

self.addEventListener("fetch", () => {
  // Безопасно игнорируем запросы Firebase Messaging
});
