const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.database();
const messaging = admin.messaging();

exports.sendBirthdayNotifications = functions.pubsub.schedule("0 9 * * *") // 9:00 UTC
  .timeZone("Europe/Baku")
  .onRun(async () => {
    const today = new Date();
    const month = today.getMonth()+1;
    const day = today.getDate();

    const snapshot = await db.ref("birthdays").once("value");
    const tokensSnapshot = await db.ref("tokens").once("value");
    if(!snapshot.exists() || !tokensSnapshot.exists()) return null;

    const tokens = Object.keys(tokensSnapshot.val());

    snapshot.forEach(child => {
      const { name, date } = child.val();
      const bday = new Date(date);
      if(bday.getDate()===day && bday.getMonth()===(month-1)) {
        const message = {
          notification: {
            title: "🎉 День рождения!",
            body: `${name} сегодня отмечает день рождения!`,
            icon: "/icon.png"
          },
          tokens: tokens
        };
        messaging.sendMulticast(message)
          .then(res => console.log("Отправлено:", res.successCount))
          .catch(err => console.error(err));
      }
    });
    return null;
  });
