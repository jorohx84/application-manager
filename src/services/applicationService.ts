import { collection, getDocs, getFirestore } from "firebase/firestore";
import firebase from "../firebase"; 

const fetchApplications=async(userID:string)=>{
    const firestore=getFirestore(firebase);
    const appCollection=collection(firestore, `users/${userID}/applications`);
    const snapshot=await getDocs(appCollection);
    return snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
    }));
};
export default fetchApplications;