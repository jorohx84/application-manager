import React from "react";
import './header.scss';
import { useUser } from './userContext';

const Header = () => {
    const { user, users, loading } = useUser();
    console.log(users);
    const userID = user?.uid
    const currentUser = users.find(user => user.id === userID);
    console.log(currentUser);

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