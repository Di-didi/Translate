import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDig-jk3KWaOZN4LYkfFdAg7aNaYsyluMU",
  authDomain: "translate-ccef2.firebaseapp.com",
  projectId: "translate-ccef2",
  storageBucket: "translate-ccef2.appspot.com",
  messagingSenderId: "914834924977",
  appId: "1:914834924977:web:10f21bf2e22e7773ecc990"
};

firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
const storage = firebase.storage();
const db = firebase.firestore();




export { auth, storage, db };
