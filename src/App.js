import React, { useEffect } from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga4';
import { I18nextProvider } from 'react-i18next';

import Cookies from 'universal-cookie';
import { HOME } from 'urls/RouteConstants';
import { store } from './Store';
import Route from './hoc/Route';
import ErrorBoundary from './components/error_boundary/ErrorBoundary';
import { getEncryptionDetailsThunk } from './axios/apiService/encryption.apiService';
import { GET_ENCRYPT_DETAILS } from './urls/ApiUrls';
import i18n from './language/config';
import { ThemeProvider } from './hoc/ThemeContext';
import { ROUTE_METHOD } from './utils/Constants';
import { isSatraGroup, routeNavigate } from './utils/UtilityFunctions';
import { PAC_URL_STRING } from './utils/strings/CommonStrings';

export const history = createBrowserHistory();

history.listen((location, action) => {
  console.log('send pageview', location, action);
  ReactGA.send('pageview', {
    page: window.location.pathname + window.location.search,
  });
});

function App() {
  useEffect(() => {
    if (
      process.env.REACT_APP_ENCRYPTION_ENABLED === '1' &&
      !localStorage.getItem('encryption_details')
    ) {
      getEncryptionDetailsThunk(GET_ENCRYPT_DETAILS);
    }
    ReactGA.initialize(
      window.location.host.includes('workhall.io') ||
        window.location.hostname.includes(PAC_URL_STRING)
        ? 'G-73N24816TW'
        : 'G-2NSNYQ24HH',
    );
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.title = 'My Page Title';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (isSatraGroup()) {
      link.href = '/satrafavicon.png';
      document.title = 'PACS';
    } else {
      link.href = '/favico.png';
      document.title = 'Workhall';
    }
  }, []);
  const cookies = new Cookies();
  window.addEventListener('storage', (event) => {
    console.log(
      'localstorage sessionstorage console',
      localStorage,
      sessionStorage,
      cookies,
    );
    if (event.key === 'csrf_token' && !event.oldValue && event.newValue) {
      routeNavigate(history, ROUTE_METHOD.PUSH, HOME);
      window.location.reload();
    }
  });
  return (
    <Provider store={store} data-test="app-component">
      <I18nextProvider i18n={i18n}>
        <Router history={history}>
          <ErrorBoundary>
            <ThemeProvider>
              <Route />
            </ThemeProvider>
          </ErrorBoundary>
        </Router>
      </I18nextProvider>
    </Provider>
  );
}
// Verify Jenkins build

export default App;
