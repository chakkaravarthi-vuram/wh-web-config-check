import React from 'react';
import { createRoot } from 'react-dom/client';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import '@workhall-pvt-lmt/wh-ui-library/dist/style.css';
import './index.css';
import * as Sentry from '@sentry/browser';
import { ENV_LIST } from 'urls/ApiUrls';
import App from './App';
import * as serviceWorker from './serviceWorker';

const host = window.location.hostname.substring(
  window.location.hostname.lastIndexOf(
    '.',
    window.location.hostname.lastIndexOf('.') - 1,
  ) + 1,
);
if ((process.env.NODE_ENV !== 'development') && (!host.includes(ENV_LIST.DEV_ENV))) {
  // Remove console in production build
  console.log = () => {};
}
if (host.includes(ENV_LIST.DEV_ENV)) {
  Sentry.init({
    dsn: 'https://27e4da787efa485cbf18aa856f3b0c5d@o4505390350139392.ingest.sentry.io/4505425818353665',
  });
} else if (host.includes(ENV_LIST.TEST_ENV)) {
  Sentry.init({
    dsn: 'https://2ae7425c6d624a318168d21c4013864c@o4505390350139392.ingest.sentry.io/4505390352564224',
  });
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
