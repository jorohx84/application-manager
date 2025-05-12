import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: "AIzaSyDOBeIvXt-PrzOTAsn8MAu0vzKZonA33lQ",
    authDomain: "application-manager-2f299.firebaseapp.com",
    projectId: "application-manager-2f299",
    storageBucket: "application-manager-2f299.firebasestorage.app",
    messagingSenderId: "166167497662",
    appId: "1:166167497662:web:9d5f9edb6e0d219b67c7ef"
  };

  const firebase = initializeApp(firebaseConfig);

  export default firebase