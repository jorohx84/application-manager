import React from "react";
import './header.scss';
import { useUser } from './userContext';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { saveToLocalStorage } from "./services/applicationService";

const Header = () => {
    const { user, firestoreUser, loading } = useUser();
    const navigate = useNavigate();
    const navigateTo = (path: string) => {
        console.log(path);
        navigate(path);
    }
    const location = useLocation();
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

    const navigateAndSaveKey = () => {
        // localStorage.removeItem('currentfilter')
        // saveToLocalStorage('isfiltered', false);
        // saveToLocalStorage('detailsOpen', false);
        // saveToLocalStorage('currentApplicaton', null);
        navigate('/applications');
    }

    return (
        <section className="header">
            <div className="headerInner">
                <span>Bewerbungsmanager</span>
                <div>
                    {(location.pathname !== '/login' && location.pathname !== '/signup') && (
                        <nav >
                            <Link className="link" to='/Dashboard'>Dashboard</Link>
                            <button className="logoutBtn" onClick={() => navigateAndSaveKey()} >Bewerbungen</button>
                            <Link className="link" to='/Watchlist'>Merkliste</Link>

                            <button className="logoutBtn" onClick={logoutUser} >Logout</button>
                            <button className="createBtn" onClick={() => navigateTo('/createapplication')}>neue Bewerbung</button>
                        </nav>
                    )}

                    {location.pathname==='/login' &&(
                         <Link className="headerLink" to="/signup">Noch keine Account? Hier Registieren</Link>
                    )}
                    {location.pathname==='/signup' &&(
                        <Link className="headerLink" to="/login">zurück zum Login</Link>
                    )}

                </div>

            </div>
        </section>
    );
}

export default Header