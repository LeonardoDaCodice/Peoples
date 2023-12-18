// Import the functions you need from the SDKs you need
//import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth"; // Aggiungi questa riga per importare il modulo auth
import AsyncStorage from '@react-native-async-storage/async-storage';  // Aggiunto questa riga
import { initializeApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtHvUOOf4DD-kOzpwAfVsxgK0adGtg2-I",
  authDomain: "project-app-48411.firebaseapp.com",
  projectId: "project-app-48411",
  storageBucket: "project-app-48411.appspot.com",
  messagingSenderId: "346787910626",
  appId: "1:346787910626:web:3bc1ab9b4cf32f52ec5fbb",
  measurementId: "G-2NZQ0LE2LB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//const analytics = getAnalytics(app);

// Inizializza Firebase Auth con AsyncStorage come persistenza
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export { auth }; // Esporta il modulo auth
