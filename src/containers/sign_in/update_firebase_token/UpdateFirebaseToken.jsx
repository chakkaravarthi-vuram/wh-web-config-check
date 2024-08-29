import { firebaseConfig } from 'config/FirebaseConfig';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { updateFCMTokenApiThunk } from 'redux/actions/SignIn.Action';
import { store } from 'Store';
import { PAC_URL_STRING } from '../../../utils/strings/CommonStrings';

let firebaseConfigurations = null;
let vapidKey = null;
const domainURL = window.location.hostname.substring(
  window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.') - 1) + 1,
);
if (domainURL.includes('localhost') ||
domainURL.includes('workhall.dev')) {
  firebaseConfigurations = firebaseConfig.dev;
  vapidKey = firebaseConfig.devVapid;
} else if ((domainURL.includes('onething.io')) ||
(domainURL.includes('workhall.cloud'))) {
  firebaseConfigurations = firebaseConfig.test;
  vapidKey = firebaseConfig.testVapid;
} else if (domainURL.includes('workhall.digital')) {
  firebaseConfigurations = firebaseConfig.staging;
  vapidKey = firebaseConfig.stagingVapid;
} else if (domainURL.includes('workhall.io') || window.location.hostname.includes(PAC_URL_STRING)) {
  firebaseConfigurations = firebaseConfig.production;
  vapidKey = firebaseConfig.productionVapid;
}
const fapp = initializeApp(firebaseConfigurations);
const messaging = getMessaging(fapp);
export const requestForToken = async () => {
    getToken(messaging, {
        vapidKey: vapidKey,
  })
    .then((currentToken) => {
    if (currentToken) {
        console.log('Firebase Token2', currentToken);
        store.dispatch(updateFCMTokenApiThunk({ token: currentToken }));
        return currentToken;
    } else {
        // Show permission request UI
        console.log(
        'No registration token available. Request permission to generate one.',
        );
        // ...
        return null;
    }
    })
    .catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
    return null;
    });
    };

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
new Promise((resolve) => {
    window.onfocus = () => {
    onMessage(messaging, (payload) => {
    resolve(payload);
    });
  };
});
