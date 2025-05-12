import React from "react";
import { useLocation } from "react-router-dom";
import { useUser } from './userContext';

const Dashboard = () => {
    // const location = useLocation();
    // const userID = location.state?.uid;
    const { user, loading } = useUser();
    if (loading) return <p>Lade...</p>;
    if (!user) return <p>Kein Benutzer eingeloggt</p>;
    console.log(user.uid);
    console.log(user.uid);
    const userID = user.uid;

    return (

        <div>
            <p>Dashboard</p>
            <p>{userID}</p>
        </div>

    )

}
export default Dashboard