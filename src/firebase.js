import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut} from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "minipos-d9d92.firebaseapp.com",
  projectId: "minipos-d9d92",
  storageBucket: "minipos-d9d92.firebasestorage.app",
  messagingSenderId: "481588556736",
  appId: "1:481588556736:web:922aa4c42a0b90fb990e25",
  measurementId: "G-FMXNHNPNEX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);
export {db}

export async function SignUpNewUser(email, password, username){
  try {
    localStorage.setItem('pendingUsername', username);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    alert("Sign Up Error: " + error.message); 
    throw e; 
  }
}

export async function LogOutUser(){
    try{
        await signOut(auth);
        console.log("User signed out successfully!");
    }catch(e){  
        alert("Sign Out Error: " + e.message); 
        throw e; 
    }
}

export function monitorAuthState(onLogin, onLogout){
    onAuthStateChanged(auth, (user) => {
        if(user){ onLogin(user); }
        else{ onLogout(); }
    })
}