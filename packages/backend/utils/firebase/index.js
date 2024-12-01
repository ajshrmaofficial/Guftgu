const firebase = require("firebase-admin");

function initializeFirebase() {
  try {
    let serviceAccount;
    try {
      serviceAccount = require("./serviceAccountKeys.json");
    } catch (error) {
      console.log('No service account file found, using environment variables');
    }

    if (serviceAccount) {
      firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount)
      });
    } else {
      // Validate required environment variables
      const requiredEnvVars = [
        'SERVICE_ACCOUNT_PROJECT_ID',
        'SERVICE_ACCOUNT_PRIVATE_KEY',
        'SERVICE_ACCOUNT_CLIENT_EMAIL'
      ];

      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
      if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
      }

      firebase.initializeApp({
        credential: firebase.credential.cert({
          type: process.env.SERVICE_ACCOUNT_TYPE || 'service_account',
          project_id: process.env.SERVICE_ACCOUNT_PROJECT_ID,
          private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
          private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/gm, "\n"),
          client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
          client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
          auth_uri: process.env.SERVICE_ACCOUNT_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
          token_uri: process.env.SERVICE_ACCOUNT_TOKEN_URI || 'https://oauth2.googleapis.com/token',
          auth_provider_x509_cert_url: process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
          client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
          universe_domain: process.env.SERVICE_ACCOUNT_UNIVERSE_DOMAIN || 'googleapis.com'
        })
      });
    }

    console.log('Firebase initialized successfully');
    return firebase;
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    throw error;
  }
}

const firebaseApp = initializeFirebase();
module.exports = firebaseApp;