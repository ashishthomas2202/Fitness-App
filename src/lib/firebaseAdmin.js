import admin from "firebase-admin";

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "flexfit-7b489",
      private_key_id: "15dabdca4a13aa3bbeb27a31897fb8efd569ec95",
      private_key:
        "---BEGIN PRIVATE KEY-—-—-|\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDjbQkEAGdUIqX1\\ndoH0y8PggFED12F",
    }),
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth, admin };
