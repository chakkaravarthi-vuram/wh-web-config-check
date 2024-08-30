/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// // This a service worker file for receiving push notifitications.
// // See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
// importScripts('/__/firebase/init.js');
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js');
// import firebase from 'firebase'
importScripts('./firebaseConfig.js');
console.log('ocation check', location);
// Initialize the Firebase app in the service worker by passing the generated config
let firebaseConfigurations = null;

const domainName = location && location.href ?
location.href.substring(
  location.href.lastIndexOf('/', location.href.lastIndexOf('/') - 1) + 1,
) : '';
if (domainName.includes('localhost') || domainName.includes('workhall.dev')) {
  firebaseConfigurations = firebaseConfig.dev;
} else if (domainName.includes('onething.io') || domainName.includes('workhall.cloud')) {
  firebaseConfigurations = firebaseConfig.test;
} else if (domainName.includes('workhall.digital')) {
  firebaseConfigurations = firebaseConfig.staging;
} else if (domainName.includes('workhall.io' || window.location.hostname.includes('pacsticketing.machint.com'))) {
  firebaseConfigurations = firebaseConfig.production;
}
console.log('domainNamedomainName', firebaseConfigurations, domainName, domainName.includes('localhost') || domainName.includes('workhall.dev'));

firebase.initializeApp(firebaseConfigurations);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage((payload) => {
  console.log('onBackgroundMessageonBackgroundMessage', payload, location);
  let link = '';
  if (payload && payload.data && payload.data.click_action) {
    link = payload.data.click_action;
    const hostArray = location.host.split('');
    const redirectURLArray = payload.data.click_action.split('/');
    console.log('redirectURLArrayredirectURLArray', location, payload);
    link = (`${hostArray[1]}.${hostArray[2]}` === link || location.host.includes(link) ||
    (location.host.includes('localhost') && link === 'workhall.dev')) ? '' :
    payload.data.click_action.replace(`${redirectURLArray[0]}/`, '');
  }
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    tag: payload.msesageId,
    data: {
      click_action: link,
      tag: payload.msesageId,
    },
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  const { click_action } = event.notification.data;
  event.notification.close();
  if (click_action !== '') {
    event.waitUntil(clients.openWindow(click_action).then((windowClient) => {
    windowClient ? windowClient.focus() : null;
  }));
  } else {
    event.waitUntil(clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((clientList) => {
      if (clientList.length > 0) {
        const client = clientList[0];
        return client.focus();
      }
      return null;
    }));
  }
  return null;
});
