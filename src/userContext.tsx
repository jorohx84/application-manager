import { Children, createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, getDocs, getDoc, getFirestore } from "firebase/firestore";
import firebase from "./firebase";

type FirestoreUser = {
    name: string;
    email: string;
    id: string;
}

type userContextType = {
    user: User | null;
    firestoreUser: FirestoreUser | null;
    loading: boolean;
};

const userContext = createContext<userContextType | undefined>(undefined);
const firestore = getFirestore(firebase);



export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [firestoreUser, setFirestoreUser] = useState<FirestoreUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Auth-Status überwachen
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                try {
                    const userDocRef = doc(firestore, "users", firebaseUser.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    setFirestoreUser({id:userDocSnap.id, ...userDocSnap.data()} as FirestoreUser)

                } catch { }
                setLoading(false);
                console.log('User ist eingeloggt', firebaseUser);
            } else {
                setUser(null);
                setLoading(false);
                console.log('User ist ausgeloggt');
            }
        });

        return () => unsubscribe(); // Abmelden von der Auth-Überwachung
    }, []);

    return (
        <userContext.Provider value={{ user, firestoreUser, loading }}>
            {children}
        </userContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(userContext);
    if (!context) {
        throw new Error("useUser muss innerhalb eines UserProviders verwendet werden");

    }
    return context;
}