// Import the required Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpew8ODVHmmGndhZxQ3VK_CEurW0_EQyU",
  authDomain: "nift-movie-nigt-apc.firebaseapp.com",
  databaseURL: "https://nift-movie-nigt-apc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nift-movie-nigt-apc",
  storageBucket: "nift-movie-nigt-apc.appspot.com",
  messagingSenderId: "736122244542",
  appId: "1:736122244542:web:69d88050a26fc8391dbdef",
  measurementId: "G-GL1MBM6DW6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the database reference to be used later in your application
const database = getDatabase(app);

export { database, ref, set };
