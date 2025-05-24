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

const fetchWatchlist = async (userID: string) => {
    const firestore = getFirestore(firebase);
    const appCollection = collection(firestore, `users/${userID}/watchlist`);
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

const findSearchedData = (input: string, dataArray: any[]) => {
    const inputValue = input.toLowerCase();
    const filteredData = dataArray?.filter((adv: any) => adv?.name?.toLowerCase().includes(inputValue) || adv?.company?.name?.toLowerCase().includes(inputValue));
    return filteredData;
}

const saveToLocalStorage = (local: string, data: any) => {
    if (typeof data === 'string') {
        localStorage.setItem(local, data);
    } else {
        localStorage.setItem(local, JSON.stringify(data));
    }
}

const getFromLocalStorage = (local: string) => {
    const storedData = localStorage.getItem(local);
    if (storedData) {
        try {
            return JSON.parse(storedData);
        } catch(e) {
            return storedData;
        }
    }

}



export { fetchApplications, formatDateGermanShort, fetchWatchlist, findSearchedData, saveToLocalStorage, getFromLocalStorage };