// import admin from "firebase-admin";

// // const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// // if (!admin.apps.length) {
// //   admin.initializeApp({
// //     credential: admin.credential.cert(serviceAccount),
// //   });
// // }

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       type: "service_account",
//       project_id: "flexfit-7b489",
//       private_key_id: "15dabdca4a13aa3bbeb27a31897fb8efd569ec95",
//       client_email: "ashishthomas2202@gmail.com",
//       private_key:
//         "---BEGIN PRIVATE KEY-—-—-|\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDjbQkEAGdUIqX1\\ndoH0y8PggFED12F",
//     }),
//   });
// }

// const db = admin.firestore();
// const auth = admin.auth();

// export { db, auth, admin };

import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      // type: process.env.FIREBASE_TYPE,
      // project_id: process.env.FIREBASE_PROJECT_ID,
      // private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      // client_email: process.env.FIREBASE_CLIENT_EMAIL,
      // private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Ensure newlines are preserved
      type: "service_account",
      project_id: "flexfit-7b489",
      private_key_id: "11c8c75f10f6b648b488cd5af7a4e4d48bade80e",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCkt8DazMbQl1l3\nNjufiGxBmO8v1WKNgG0t6ddtCJBD1djrCtTvqHQ5Se2ouKOH3plb+0hyXOUZrP09\n1WKMxoL3KdZsZrFu8CSAo2oZsnWwzNxRdDz0a5WaPZM4abx80IDZliFiel2bZw0M\nnB/8O5PaFUzSPjFfCGcuLnUexYlLTp8eBmjy+FmYguh3IrjgQYsccKXjZXLEvx1u\nmkvYktwomVvwqtC3tmy9TRRqMVZGxvjksw8a/BEQuxb644z8gGO10FNKsMyKIfJs\nOgQgE6owhBZimSGNBVTaH65h12D3OxYwY+IgNIEyzclL+7QHciRgyUtJZxVmXVRn\n4RZ59MPHAgMBAAECggEAAWKGHZDRLxnGp8jt8WZtOpP1ltpdbMEiqdsoc4M560gV\n/cvmhGlPKNglRmDfBxppAav4LPX4+yFIM8fifzqACWHxqpGmdj9Qn0BAeRzV/nmK\ndKjchlWNOXHBFh1Vd1staibn+vL6bH8OTgfWAQHjOVcqgS4CrkDc1TeQxoR0pgxs\ntQgcnRRc87sySO2SrFJWGv2ct3B8nq65pnyvbOkgLFLN+/2pChsOTVOhuaKnjVH+\n2RaNUSynhFaxYqx0IDpsjVoakWT2P/rVSqJ1OsvK11C27cMQ2kg1gN3PrnglJ/kP\nUeelr1yX3YiK2/OEGOPJnnESdiAkfEB38Qu5ZLZYqQKBgQDfKSsAiQLrw/gc0795\nQ5V4WrpOzmjKYUWt4jKFb4D14xWRbr9ih70GUefE6Idd0dP1hcIAvKBazfUlSOWY\nlAgA09im35y7P5EmaTz1xHiyJLtPKnC94OdL6SE9h7gRg2wi3gi8Wg89wwaJ+7hF\niYIlt3MWOGielqe6rNS7MKDfYwKBgQC89PDx2XnUACWAxzqMUlSHOMiYkWhrci56\nmbkfVrGvtBoufl4syUBLwk78N51WyMoMn80XybJF1Bk8yrDsMWQLo96fLYDzlVRF\nhakGV2njjZ3rs78aGjOBtHLNpMXQjx66MOtd/Ncaff3jjljH+RzTWKNgpdpnwrjD\nTnwfnRQRTQKBgQCbbSPbKpITPRk4kq5AOjcHbUFnk9FeayNJuUpwrzmFiFTERvsb\nF+kqVq9y8HUfff3/edqmAro4pEvCXSQ0AZ4VXXb+uq2BqQNiWlev4NgjUvv2ZlvB\nk7vkngmdvkIQSJVvL2+sJ5mH7aZHQj+UhvJTbJLGfiE3mzxVAvzjJzpUewKBgATV\ny7iUlQ58tnj2ICRpEuqm5FMrHV3qfQ/8EQWhRUi2thjMeQJyX+fQYA8KKUeIOcta\n53edXKd2xvKMSTyyAtpdZhvyoSMahh6FTg7we7Ar9oeKgPBdDUZbZLioZ7tvfhzL\nlapBBwwRf0asZM8xK7Coyv11IQKYs/ujbX+tmE7dAoGAHO0lAB5zKl+H/066zlhL\nbUbNagLXIasIJwKkGSC9mHBRt+LfDuYJ+NOJBLYy+lpCEVnvThwih4G0rtVnlc4B\nexRqx8dAJY4+EPaQAFUTZX822nwkPuZ/uhG7KXWVOyjDIqXMsjjTR8qQ2JQJUMCd\n64WUUjgH+s89Sh4VOuEnKvw=\n-----END PRIVATE KEY-----\n",
      client_email:
        "firebase-adminsdk-tm095@flexfit-7b489.iam.gserviceaccount.com",
      client_id: "102182437445243316179",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tm095%40flexfit-7b489.iam.gserviceaccount.com",
      universe_domain: "googleapis.com",
    }),
  });
}

// const db = admin.firestore();
// const auth = admin.auth();

// export { db, auth, admin };

// Export the admin object
export const auth = admin.auth(); // Export the admin auth method
export const db = admin.firestore(); // Export Firestore if needed
export default admin;
