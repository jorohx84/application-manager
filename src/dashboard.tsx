import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from './userContext';


const Dashboard = () => {
    // const location = useLocation();
    // const userID = location.state?.uid;

    const { user, loading } = useUser();
    if (loading) return <p>Lade...</p>;
    if (!user) return <p>Kein Benutzer eingeloggt</p>;
    const userID = user.uid;
   
   
    return (

        <div>
            <p>Dashboard</p>
      
            
        </div>

    )

}
export default Dashboard