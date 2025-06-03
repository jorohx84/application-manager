import React, { useState } from "react";
import './header.scss';
import { useUser } from './userContext';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { saveToLocalStorage } from "./services/applicationService";

const Header = () => {
    const { user, firestoreUser, loading } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const userID = user?.uid
    const currentUser = firestoreUser;
    const auth = getAuth();
    const [burgerOpen, setburgerOpen] = useState(false);
    const navigateBack = () => {
        if (location.state?.from) {
            navigate(location.state.from);
        } else {
            navigate(-1);
        }
    }
    const navigateTo = (path: string) => {
        setburgerOpen(false);
        navigate(path);
    }

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
        localStorage.removeItem('watchlistFiltered');
        localStorage.removeItem('prioFilter');


    }

    const navigateAndSaveKey = () => {
        // localStorage.removeItem('currentfilter')
        // saveToLocalStorage('isfiltered', false);
        // saveToLocalStorage('detailsOpen', false);
        // saveToLocalStorage('currentApplicaton', null);
        setburgerOpen(false);
        navigate('/applications');
    }

    return (
        <section className="header">
            <div className="headerInner">
                <span>Bewerbungsmanager</span>
                <div className="linkContainer">
                    {(location.pathname !== `/login` && location.pathname !== '/signup' && location.pathname !== '/' && location.pathname !== '/imprint' && location.pathname !== '/legalnotice') && (
                        <nav >
                            <button className="logoutBtn" onClick={() => { navigateTo('/dashboard') }}>Dashboard</button>
                            <button className="logoutBtn" onClick={() => navigateAndSaveKey()} >Bewerbungen</button>
                            <button className="logoutBtn" onClick={() => { navigateTo('/watchlist') }}>Merkliste</button>
                            <button className="logoutBtn" onClick={logoutUser} >Logout</button>
                            <button className="createBtn" onClick={() => navigateTo('/createapplication')}>neue Bewerbung</button>
                        </nav>
                    )}

                    {(location.pathname === '/login' || location.pathname === '/') && (
                        <div className="signupLinkHeader">
                            <span>Noch keinen Account?</span>
                            <button onClick={() => navigate('/signup')}>Registrieren</button>
                        </div>
                    )}
                    {location.pathname === '/signup' && (
                        <Link className="headerLink" to="/login">zurück zum Login</Link>
                    )}



                </div>
                {(location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/imprint' && location.pathname !== '/legalnotice') && (
                    <div onClick={() => setburgerOpen(!burgerOpen)} className={`burger ${burgerOpen ? 'transformBurger' : 'resetBurger'}`}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                )}
                <div className={`respMenu ${burgerOpen ? 'transform' : ''}`}>
                    <div>
                        <button className="logoutBtn" onClick={() => { navigateTo('/dashboard') }}>Dashboard</button>
                        <button className="logoutBtn" onClick={() => { navigateAndSaveKey() }} >Bewerbungen</button>
                        <button className="logoutBtn" onClick={() => { navigateTo('/watchlist') }}>Merkliste</button>
                        <button className="logoutBtn" onClick={() => { logoutUser(); setburgerOpen(false) }} >Logout</button>

                    </div>

                </div>
                {(location.pathname === '/imprint' || location.pathname === '/legalnotice') && (
                    <button className="backBtn" onClick={navigateBack}>zurück</button>
                )}
            </div>
        </section>
    );
}

export default Header