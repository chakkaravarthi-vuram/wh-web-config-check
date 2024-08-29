const GOOGLE_ANALYTICS_URL = 'https://www.googletagmanager.com/gtag/js';
const FIREBASE_APP_URL = 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js';
const FIREBASE_MESSAGING_URL = 'https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js';
const path = require('path');
const modules = require('./config/modules');

module.exports = {
    webpack: {
        resolve: {
            // Specify the root directory for module resolution
            alias: {
              ...(modules.webpackAliases || {}),
            },
            fallback: {
              stream: require.resolve("stream-browserify"),
              vm: require.resolve('vm-browserify'),
              process: require.resolve('process/browser'),
              util: require.resolve('util/'),
            }
          },
    },
    style: {
        sass: {
          loaderOptions: {
            additionalData: (content, loaderContext) => {
              // Check if the import is being made from within a particular path
              const currentPath = loaderContext.resourcePath;
              // Add custom logic if needed to alter the content dynamically
              return content;
            },
            sassOptions: {
              includePaths: [path.resolve(__dirname, 'src')], // Dynamic resolution of src folder
            },
          },
        },
      },
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