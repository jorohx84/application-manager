import { Children, createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, getDocs, getFirestore } from "firebase/firestore";
import firebase from "./firebase";


type userContextType = {
    user: User | null;
    users: { id: string; [key: string]: any }[]; 
    loading: boolean;
};

const userContext = createContext<userContextType | undefined>(undefined);
const firestore = getFirestore(firebase);

const getUsersFromFirestore = async () => {
    const usersCollection = collection(firestore, 'users');
    const userSnapshot = await getDocs(usersCollection);
    return userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

}



export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<{ id: string; [key: string]: any }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Benutzerdaten und Benutzerdatenbank laden
        const fetchUsersData = async () => {
            try {
                const allUsers = await getUsersFromFirestore(); // Zentrale Funktion verwenden
                setUsers(allUsers);
            } catch (error) {
                console.error("Fehler beim Abrufen der Benutzerdaten:", error);
            }
        };

        // Auth-Status überwachen
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                setLoading(false);
                console.log('User ist eingeloggt', firebaseUser);
            } else {
                setUser(null);
                setLoading(false);
                console.log('User ist ausgeloggt');
            }
        });

        fetchUsersData(); // Alle Benutzer abrufen
        return () => unsubscribe(); // Abmelden von der Auth-Überwachung
    }, []);

    return (
        <userContext.Provider value={{ user, users, loading }}>
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