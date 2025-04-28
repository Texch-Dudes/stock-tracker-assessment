var admin = require('firebase-admin');

var serviceAccount = require('../utils/alerts.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

var adminDb = admin.firestore();

module.exports = { adminDb };
