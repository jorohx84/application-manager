import { Children, createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";


type userContextType = {
    user: User | null;
    loading: boolean;
};

const userContext = createContext<userContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);  
                setLoading(false); 
                console.log('User ist eingeloggt', firebaseUser);
                
            }else{
                setUser(null);
                console.log('User ist ausgeloggt');
                
            }
     
        });
        return () => unsubscribe();
    }, []);
    return (
        <userContext.Provider value={{ user, loading }}>
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