import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from './userContext';
import Header from "./header";
import Sidebar from "./sidebar";
import './dashboard.scss';
import { fetchApplications, fetchWatchlist, formatDateGermanShort } from './services/applicationService';
import Footer from "./footer";


const Dashboard = () => {
    // const location = useLocation();
    // const userID = location.state?.uid;
    const navigate = useNavigate();
    const [applications, setApplications] = useState<any[] | null>(null);
    const { user, loading } = useUser();
    const [sendCount, setsendCount] = useState(0);
    const [recieptCount, setrecieptCount] = useState(0);
    const [interviewCount, setinterviewCount] = useState(0);
    const [cancelCount, setcancelCount] = useState(0);
    const [jobInterviewCount, setjobInterviewCount] = useState(0);
    const [nextSteps, setnextSteps] = useState<any[] | null>(null);
    const [advertisements, setadvertisements] = useState<any[] | null>(null);

    useEffect(() => {
        if (loading) return
        if (!user) return
        const userID = user?.uid;
        const loadData = async () => {
            const data = await fetchApplications(userID);
            const watchData = await fetchWatchlist(userID);
            setadvertisements(watchData);
            console.log(data);
            setApplications(data);

        };
        loadData();
    }, [loading]);

    useEffect(() => {
        setDashboardCards();
        getNextSteps();
    }, [applications, advertisements])


    const countApps = (key: string) => {
        const countedApps = applications?.filter(app => app.status.status === key)
        const length = countedApps?.length
        if (key === 'Bewerbung gesendet' && length && sendCount != length) {
            setsendCount(length);
        }
        else if (key === 'Eingang bestätigt' && length && recieptCount != length) {
            setrecieptCount(length);
        }
        else if (key === 'Interview' && length && interviewCount != length) {
            setinterviewCount(length);
        }
        else if (key === 'Absage' && length && cancelCount != length) {
            setcancelCount(length);
        }
        else if (key === 'Vorstellungsgespräch' && length && jobInterviewCount != length) {
            setjobInterviewCount(length);
        }

    }

    const setDashboardCards = () => {
        countApps('Bewerbung gesendet');
        countApps('Eingang bestätigt');
        countApps('Interview');
        countApps('Vorstellungsgespräch');
        countApps('Absage');

    }




    const getNextSteps = () => {
        if (!applications || nextSteps != null) return;
        const filteredSteps = applications?.filter(app => app.status.status === 'Interview' || app.status.status === 'Vorstellungsgespräch');
        if (filteredSteps) {
            filteredSteps.sort((a, b) => {
                const dateA = new Date(a.status.appointment).getTime();
                const dateB = new Date(b.status.appointment).getTime();
                return dateA - dateB;
            });
            setnextSteps(filteredSteps);
        }

    }





    const navigateTo = (path: string) => {
        navigate(path);
    }

    const navigateWithState = (filterKey: string, triggerKey: boolean) => {
        console.log(filterKey);
        navigate('/applications', { state: { key: filterKey, trigger: true } })
    }

    return (

        <section className="main">
            {/* <div className="sidebarContainer">
                <Sidebar />
            </div> */}
            <div className="content">
           

                <div className="component">
                    <div className="componentContent">
                        {applications ? (
                            <div className="dashboard">

                                <div className="dashboardHeadline">
                                    <p>Hallo {user?.displayName},</p>
                                    <span>aktuell hast du {applications?.length} laufende {applications?.length === 1 ? 'Bewerbung' : 'Bewerbungen'}</span>
                                </div>
                                <div className="divider"></div>
                                <div className="dashboardCards">
                                    <div className="dashboardCard" onClick={() => { navigateWithState('Bewerbung gesendet', true) }}>
                                        <div className="count">
                                            <p>{sendCount}</p>
                                            <span>{sendCount === 1 ? 'Bewerbung' : 'Bewerbungen'}</span>
                                        </div>

                                        <h2>Gesendet</h2>
                                    </div>
                                    <div className="dashboardCard" onClick={() => { navigateWithState('Eingang bestätigt', true) }}>
                                        <div className="count">
                                            <p>{recieptCount}</p>
                                            <span>{recieptCount === 1 ? 'Bewerbung' : 'Bewerbungen'}</span>
                                        </div>

                                        <h2>bestätigt</h2>
                                    </div>
                                    <div className="dashboardCard" onClick={() => { navigateWithState('Interview', true) }}>
                                        <div className="count">
                                            <p>{interviewCount}</p>
                                            <span>{interviewCount === 1 ? 'Bewerbung' : 'Bewerbungen'}</span>
                                        </div>

                                        <h2>Interview</h2>
                                    </div>
                                    <div className="dashboardCard" onClick={() => { navigateWithState('Vorstellungsgespräch', true) }}>
                                        <div className="count">
                                            <p>{jobInterviewCount}</p>
                                            <span>{jobInterviewCount === 1 ? 'Bewerbung' : 'Bewerbungen'}</span>
                                        </div>

                                        <h2>Vorstellungsgespräch</h2>
                                    </div>
                                    <div className="dashboardCard" onClick={() => { navigateWithState('Absage', true) }}>
                                        <div className="count">
                                            <p>{cancelCount}</p>
                                            <span>{cancelCount === 1 ? 'Bewerbung' : 'Bewerbungen'}</span>
                                        </div>

                                        <h2>Absage</h2>
                                    </div>
                                </div>
                                <div className="overview">
                                    <div className="nextSteps" onClick={() => { navigateWithState('all', false) }}>
                                        <h2>Nächste Termine</h2>
                                        {nextSteps?.map((step, index) => (
                                            <div className="step" key={index}>
                                                <span>{formatDateGermanShort(step.status.appointment, 'time')} Uhr:</span>
                                                <b>{step.company.name} </b>
                                                <span> | {step.position.title} | </span>
                                                <span>{step.status.status},</span>

                                            </div>
                                        ))}
                                    </div>
                                    <div className="watchlist" onClick={() => navigateTo('/watchlist')}>
                                        <h2>Merkliste</h2>
                                        {advertisements?.map((adv, index) => (
                                            <div className="step" key={index}>
                                                <div className={`dot ${adv.prio === 'hoch' ? 'high' : adv.prio === 'mittel' ? 'medium' : 'low'}`}></div>
                                                <b>{adv.name} </b>
                                                <span>{adv.town} | </span>
                                                <span>{adv.position} - </span>
                                                <span>{adv.location}</span>


                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        ) : (<p>Lade Dashboard ...</p>)}



                    </div>
                </div>
         
            </div>

        </section>

    )

}
export default Dashboard