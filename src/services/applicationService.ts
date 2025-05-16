import { collection, getDocs, getFirestore } from "firebase/firestore";
import firebase from "../firebase";

const fetchApplications = async (userID: string) => {
    const firestore = getFirestore(firebase);
    const appCollection = collection(firestore, `users/${userID}/applications`);
    const snapshot = await getDocs(appCollection);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};


const formatDateGermanShort = (dateString: string, time: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('de-DE', { month: 'long' });
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    if (time === 'notime') {
        return `${day}. ${month} ${year}`;
    } else {
        return `${day}. ${month} ${year}, ${hours}:${minutes}`;
    }

};
export { fetchApplications, formatDateGermanShort };