const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccountKeys.json");

if (serviceAccount) {
    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount)
    });
} else {
    firebase.initializeApp({
        credential: firebase.credential.cert({
            type: process.env.SERVICE_ACCOUNT_TYPE,
            project_id: process.env.SERVICE_ACCOUNT_PROJECT_ID,
            private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
            private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
            client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
            auth_uri: process.env.SERVICE_ACCOUNT_AUTH_URI,
            token_uri: process.env.SERVICE_ACCOUNT_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
            client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
            universe_domain: process.env.SERVICE_ACCOUNT_UNIVERSE_DOMAIN,
        }),
    });
}

module.exports = firebase;
