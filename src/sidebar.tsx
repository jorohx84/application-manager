import React from "react";
import './sidebar.scss';
import { useUser } from "./userContext";
import { Link, useNavigate } from "react-router-dom";


const Sidebar = () => {

    const { user } = useUser();
    const navigate = useNavigate();
    const navigateTo = (path: string) => {
        console.log(path);
        navigate(path);
    }

    return (
        <section className="sidebar">
            <div className="sidebarlogo">
                <p>{user?.displayName}</p>
            </div>
            <div className="newBtnContainer">
                <button onClick={() => navigateTo('/createapplication')}>neue Bewerbung</button>
            </div>
            <div className="sidbarLinks">
               <Link className="link" to='/Dashboard'>Dashboard</Link>
               <Link className="link" to='/Applications'>Bewerbungen</Link>
            </div>
        </section>
    )
}
export default Sidebar