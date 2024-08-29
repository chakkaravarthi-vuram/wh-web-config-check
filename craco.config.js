const GOOGLE_ANALYTICS_URL = 'https://www.googletagmanager.com/gtag/js';
const FIREBASE_APP_URL = 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js';
const FIREBASE_MESSAGING_URL = 'https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js';


module.exports = {
    devServer: {
        port: 8080,
        headers: () => {
            return {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
                'X-XSS-Protection': '1; mode=block',
                'X-Frame-Options': 'SAMEORIGIN',
                'Content-Security-Policy': `frame-ancestors 'self'; object-src 'none'; script-src 'self' ${GOOGLE_ANALYTICS_URL} ${FIREBASE_APP_URL} ${FIREBASE_MESSAGING_URL}; base-uri 'self'; form-action 'none';`,
            };
          },
    },
};