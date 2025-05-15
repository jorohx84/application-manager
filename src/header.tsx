import React from "react";
import './header.scss';
import { useUser } from './userContext';
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const { user, firestoreUser, loading } = useUser();
    const navigate = useNavigate();
    const navigateTo = (path: string) => {
        console.log(path);
        navigate(path);
    }

    const userID = user?.uid
    const currentUser = firestoreUser;

    return (
        <section className="header">
            <div className="headerInner">
                <span>Bewerbungsmanager</span>
                <nav >
                    
                   
                    <Link className="link" to='/Dashboard'>Dashboard</Link>
                    <Link className="link" to='/Applications'>Bewerbungen</Link>
                    <Link className="link" to='/Applications'>Logout</Link>
                    <button className="createBtn" onClick={() => navigateTo('/createapplication')}>neue Bewerbung</button>
                  
                </nav>
            </div>
        </section>
    );
}

export default Header