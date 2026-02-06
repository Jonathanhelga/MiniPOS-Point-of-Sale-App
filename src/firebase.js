import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

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
export const db = getFirestore(app);
export const auth = getAuth(app);

export async function registerUser(email, password, username) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await setDoc(doc(db, "users", user.uid), {
        username: username,
        tax_rate: 0,
        invoice_prefix: "INV-",
        printer_size: 80,
        created_at: new Date().toISOString(),
        ownerId: user.uid
    });
    return user;
}

export async function loginUser(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("humm I believe the user haven't made any account yet.");
        return;
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
