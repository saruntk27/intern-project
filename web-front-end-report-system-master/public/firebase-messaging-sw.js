/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "493075677564",
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  var obj = JSON.parse(payload.data.notification);
  var notificationTitle = obj.title;
  var notificationOptions = {
    body: obj.body,
    icon: obj.icon,
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

messaging.onMessage(function (payload) {
  return "AAAA"
});
