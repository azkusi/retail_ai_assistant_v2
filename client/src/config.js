import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDXjBvg6CNef3U-HxRvMNx-KAcSoFvTqO0",
  authDomain: "retail-assistant-demo.firebaseapp.com",
  projectId: "retail-assistant-demo",
  storageBucket: "retail-assistant-demo.appspot.com",
  messagingSenderId: "313091990397",
  appId: "1:313091990397:web:c15f21d94c815dbb9b2214"
  // measurementId: "G-6XKQKQRG0L"
});

  
  export const db = firebaseApp.firestore();

  export const auth = firebaseApp.auth();


 

