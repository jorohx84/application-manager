import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from './userContext';
import Header from "./header";
import Sidebar from "./sidebar";
import './dashboard.scss';
import fetchApplications from "./services/applicationService";

const Dashboard = () => {
    // const location = useLocation();
    // const userID = location.state?.uid;
    const [applications, setApplications] = useState<any[] | null>(null);
    const { user, loading } = useUser();


    useEffect(() => {
        if (loading) return
        if (!user) return
        const userID = user?.uid;
        const loadData = async () => {
            const data = await fetchApplications(userID);
            console.log(data);
            setApplications(data);
        };
        loadData();
    }, [loading]);




    return (

        <section className="main">
            <div className="sidebarContainer">
                <Sidebar />
            </div>
            <div className="content">
                <Header />
                <div className="component">

                    {applications ? (
                        applications.map((app) => (
                        <div key={app.id}>
                            <p>{app.company.name}</p>
                            <p></p>
                        </div>
                    ))
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>

        </section>

    )

}
export default Dashboard