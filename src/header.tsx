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
        removeLocalStorage();
        signOut(auth);
        navigateTo('/login');
    }

    const removeLocalStorage = () => {
        localStorage.removeItem('isfiltered');
        localStorage.removeItem('currentFilter');
        localStorage.removeItem('currentApplicaton');
        localStorage.removeItem('detailsOpen');

    }

    const navigateWithState = (path: string) => {
        navigate(path, { state: { key: 'all', trigger: false } })
    }

    return (
        <section className="header">
            <div className="headerInner">
                <span>Bewerbungsmanager</span>
                <nav >


                    <Link className="link" to='/Dashboard'>Dashboard</Link>
                    <button className="logoutBtn" onClick={() => navigateWithState('/Applications')} >Bewerbungen</button>
                    <Link className="link" to='/Watchlist'>Merkliste</Link>

                    <button className="logoutBtn" onClick={logoutUser} >Logout</button>
                    <button className="createBtn" onClick={() => navigateTo('/createapplication')}>neue Bewerbung</button>

                </nav>
            </div>
        </section>
    );
}

export default Header