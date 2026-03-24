// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVheHQ7r7yZwKiDxpHmujgBWOM54UrDA8",
  authDomain: "ai-pocket-agent-28500.firebaseapp.com",
  projectId: "ai-pocket-agent-28500",
  storageBucket: "ai-pocket-agent-28500.firebasestorage.app",
  messagingSenderId: "521332938424",
  appId: "1:521332938424:web:cba4cdd9bc980c882d864d",
  measurementId: "G-QFTFH0ZT6G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firestoreDb=getFirestore(app);





