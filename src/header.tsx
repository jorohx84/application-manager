import React from "react";
import './header.scss';
import { useUser } from './userContext';

const Header = () => {
    const { user, firestoreUser, loading } = useUser();
   

    const userID = user?.uid
const currentUser=firestoreUser;

    return (
        <section className="header">
            <div className="headerInner">
                <span>Bewerbungsmanager</span>
                <div>
                    <span>{currentUser?.name}</span>
                </div>
            </div>
        </section>
    );
}

export default Header