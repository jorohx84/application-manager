import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from './userContext';


const Dashboard = () => {
    // const location = useLocation();
    // const userID = location.state?.uid;

    const { user, users, loading } = useUser();
    if (loading) return <p>Lade...</p>;
    if (!user) return <p>Kein Benutzer eingeloggt</p>;
    const userID = user.uid;
    const currentUser = users.find(user => user.id === userID);
   
    return (

        <div>
            <p>Dashboard</p>
            <p>{currentUser?.id}</p>
            <p>{currentUser?.name}</p>
            <p>{currentUser?.email}</p>
            {/* <p>{user.uid}</p>
            <p>{user.displayName}</p>
            <p>{user.email}</p> */}
            
        </div>

    )

}
export default Dashboard