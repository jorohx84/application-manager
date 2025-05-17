import React from "react";
import './header.scss';
import { useUser } from './userContext';
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";


const Header = () => {
    const { user, firestoreUser, loading } = useUser();
    const navigate = useNavigate();
    const navigateTo = (path: string) => {
        console.log(path);
        navigate(path);
    }

    const userID = user?.uid
    const currentUser = firestoreUser;
    const auth = getAuth();

    const logoutUser = () => {
        signOut(auth);
        navigateTo('/login');
    }

    return (
        <section className="header">
            <div className="headerInner">
                <span>Bewerbungsmanager</span>
                <nav >


                    <Link className="link" to='/Dashboard'>Dashboard</Link>
                    <Link className="link" to='/Applications'>Bewerbungen</Link>
                    <button className="logoutBtn" onClick={logoutUser} >Logout</button>
                    <button className="createBtn" onClick={() => navigateTo('/createapplication')}>neue Bewerbung</button>

                </nav>
            </div>
        </section>
    );
}

export default Header