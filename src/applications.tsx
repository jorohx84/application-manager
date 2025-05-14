import React, { useEffect, useState } from "react";
import './applications.scss';
import Sidebar from "./sidebar";
import Header from "./header";
import fetchApplications from "./services/applicationService";
import { useUser } from "./userContext";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import firebase from "./firebase";


export const Applications = () => {
    const firestore = getFirestore(firebase);
    const [applications, setApplications] = useState<any[] | null>(null);
    const { user, loading } = useUser();
    const [currentApplicaton, setCurrentApplication] = useState<any | null>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [newStatus, setnewStatus] = useState('');
    const [appIndex, setappIndex] = useState(-1);
    const [isUpdate, setisUpdate] = useState(0);
    const [date, setDate] = useState('');
    useEffect(() => {
        if (loading) return;
        if (!user) return;
        const userID = user.uid;
        console.log(userID);
        const loadData = async () => {
            const data = await fetchApplications(userID);
            setApplications(data);
        };
        loadData();

    }, [loading, user, isUpdate]);

    const showDetails = (index: number) => {
        console.log(index);
        console.log(applications);
        if (applications) {
            const details = applications[index];
            console.log(details);
            setCurrentApplication(details);
        }
    }

    const formatDateGermanShort = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('de-DE', { month: 'long' });
        const year = date.getFullYear().toString().slice(-2);
        return `${day}. ${month} ${year}`;
    };

    const openOverlay = (index: number, event: React.MouseEvent) => {
        setOpenEdit(true);
        setappIndex(index)
        event.stopPropagation();
    }

    const editApp = async () => {

        console.log(openEdit);

        console.log(user?.uid);
        const userID = user?.uid
        const currentApp = applications?.[appIndex];
        console.log(currentApp);
        const appID = currentApp.id
        console.log(appID);

        console.log(appIndex);
        const appRef = doc(firestore, `users/${userID}/applications/${appID}`);
        await updateDoc(appRef, {
            "status.status": newStatus,
            "status.appointment": date,
        })
        setisUpdate(prev => prev + 1);
        setOpenEdit(false);


    }

    return (
        <section className="applications">
            <section className="main">
                <div className="sidebarContainer">
                    <Sidebar />
                </div>
                <div className="content">
                    <Header />
                    <div className="component">
                        <div className="filter">
                            <button>Alle</button>
                            <button>Gesendet</button>
                            <button>Rückmeldung</button>
                            <button>Interview</button>
                            <button>Vorstellungsgespräch</button>
                            <button>Absage</button>
                        </div>
                        <div className="componentHeadline">
                            <h2>Bewerbungen</h2>
                        </div>
                        <div className="applicationBoard">
                            <div className="applicationList">
                                {applications ? (
                                    applications.map((app, index) => (
                                        <div className="applicationCard" onClick={() => showDetails(index)} key={index}>
                                            <div className="cardContent">
                                                <div className="topper">
                                                    <p>{app.company.name}, {app.company.town}</p>
                                                    <span>gesendet am: {formatDateGermanShort(app.status.submitted)}</span>
                                                </div>
                                                <div className="positionDetails">
                                                    <span>{app.position.title}</span>
                                                    <span className="location">{app.position.location}</span>
                                                </div>
                                                <div className="status">
                                                    <p>Status: <b>{app.status.status}</b>  </p>
                                                    {(app.status.status === 'Interview' || app.status.status === 'Vorstellungsgespräch') && (
                                                        <span>Datum: {formatDateGermanShort(app.status.appointment)}</span>
                                                    )}

                                                    <button className="statusBtn" onClick={(e) => openOverlay(index, e)}><img src="./img/edit.svg" alt="" /></button>
                                                </div>

                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Lade Liste...</p>

                                )}
                            </div>
                            <div className="applicationDetails">
                                <h2>Informationen</h2>
                                <div className="companyInfos">
                                    <h3>{currentApplicaton?.company.name}</h3>
                                    <div className="adress">
                                        <span>{currentApplicaton?.company.street}</span>
                                        <div className="city">
                                            <span>{currentApplicaton?.company.areacode}</span>
                                            <span>{currentApplicaton?.company.town}</span>
                                        </div>
                                    </div>

                                    <div className="contact">
                                        <span>Kontakt: {currentApplicaton?.company.contactperson}</span>
                                        <span>Telefon: {currentApplicaton?.company.phone}</span>
                                        <span>E-Mail: {currentApplicaton?.company.email}</span>
                                        <span>Homepage: {currentApplicaton?.company.website}</span>
                                    </div>

                                </div>


                            </div>
                        </div>
                    </div>
                </div>

            </section>
            {openEdit && (
                <div className="overlay">
                    <div className="editContainer">
                        <h2>Status ändern</h2>
                        <div className="statusBtnContainer">
                            <button onClick={() => { setnewStatus('Eingang bestätigt') }}>Eingang bestätigt</button>
                            <button onClick={() => { setnewStatus('Interview') }}>Interview</button>
                            <button onClick={() => { setnewStatus('Vorstellungsgespräch') }}>Vorstellungsgespräch</button>
                            <button onClick={() => { setnewStatus('Absage') }}>Absage</button>
                            <button onClick={() => { setnewStatus('Zusage') }}>Zusage</button>
                        </div>

                        {(newStatus === 'Interview' || newStatus === 'Vorstellungsgespräch' )&& (
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        )}
                        <div className="editBtnContainer">
                            <button onClick={() => { setOpenEdit(false) }}>Abbrechen</button>
                            <button onClick={editApp}>Speichern</button>
                        </div>
                    </div>
                </div>

            )}

        </section>
    )
}