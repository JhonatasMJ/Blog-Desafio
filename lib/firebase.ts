import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyCnSFD56Go7yUZFMIvgeISQblLIY-FJ1-w",
  authDomain: "blog-ecaae.firebaseapp.com",
  projectId: "blog-ecaae",
  storageBucket: "blog-ecaae.firebasestorage.app",
  messagingSenderId: "542566894565",
  appId: "1:542566894565:web:ed41cf70675bb1a4223d0c",
  measurementId: "G-0PR8CP5LCJ",
}


const app = initializeApp(firebaseConfig)


export const auth = getAuth(app)
export const database = getDatabase(app)


export default app

