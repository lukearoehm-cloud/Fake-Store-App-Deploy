import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALpZearg6s1zfpMdv2ALP0FJsm6hyJUtc",
  authDomain: "fake-store-app-fc812.firebaseapp.com",
  projectId: "fake-store-app-fc812",
  storageBucket: "fake-store-app-fc812.firebasestorage.app",
  messagingSenderId: "82754417270",
  appId: "1:82754417270:web:ec0717ccab7b43af3fa557",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
