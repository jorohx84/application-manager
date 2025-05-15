import React, { useEffect, useState } from "react";
import './applications.scss';
import Sidebar from "./sidebar";
import Header from "./header";
import { fetchApplications, formatDateGermanShort } from './services/applicationService';
import { useUser } from "./userContext";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import firebase from "./firebase";


export const Applications = () => {
    const firestore = getFirestore(firebase);
    const [applications, setApplications] = useState<any[] | null>(null);
    const [baseApplications, setbaseApplications] = useState<any[] | null>(null);
    const { user, loading } = useUser();
    const [currentApplicaton, setCurrentApplication] = useState<any | null>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [newStatus, setnewStatus] = useState('');
    const [appIndex, setappIndex] = useState(-1);
    const [isUpdate, setisUpdate] = useState(0);
    const [date, setDate] = useState('');
    const [openDropdown, setopenDropdown] = useState(false);
    const [headlineText, setheadlineText]=useState('Bewerbungen')


    useEffect(() => {
        if (loading) return;
        if (!user) return;
        const userID = user.uid;
        console.log(userID);
        const loadData = async () => {
            const data = await fetchApplications(userID);
            setApplications(data);
            setbaseApplications(data);
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



    const openOverlay = (index: number, event: React.MouseEvent) => {
        setOpenEdit(true);
        const currentApp = applications?.[index];
        setCurrentApplication(currentApp);

        event.stopPropagation();
    }

    const editApp = async () => {
        const userID = user?.uid
        const appID = currentApplicaton.id
        const appRef = doc(firestore, `users/${userID}/applications/${appID}`);
        await updateDoc(appRef, {
            "status.status": newStatus,
            "status.appointment": date,
        })
        setisUpdate(prev => prev + 1);
        setOpenEdit(false);


    }

    const changeStatus = (value: string, event: React.MouseEvent) => {
        setnewStatus(value);
        setopenDropdown(false);

        console.log(openDropdown);
        event.stopPropagation();

    }

    const filterApps = (key: string) => {
        setCurrentApplication(null)
        if (!baseApplications) return;
        if (key === 'all') {
            setApplications(baseApplications);
            setheadlineText('Bewerbungen')
            return
        }
        const filteredApps = baseApplications?.filter((app: any) => app.status.status === key);
        setApplications(filteredApps);
        setheadlineText(key)
    }




    return (
        <section className="applications">
            <section className="main">
                {/* <div className="sidebarContainer">
                    <Sidebar />
                </div> */}
                <div className="content">
                    <Header />
                    <div className="component">
                        <div className="componentContent">
                            <div className="filter">
                                <button onClick={() => filterApps('all')}>Alle</button>
                                <button onClick={() => filterApps('Bewerbung gesendet')}>Gesendet</button>
                                <button onClick={() => filterApps('Eingang bestätigt')}>Rückmeldung</button>
                                <button onClick={() => filterApps('Interview')}>Interview</button>
                                <button onClick={() => filterApps('Vorstellungsgespräch')}>Vorstellungsgespräch</button>
                                <button onClick={() => filterApps('Absage')}>Absage</button>
                            </div>
                            <div className="componentHeadline">
                                <h2>{headlineText}</h2>
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
                                                            <span>Datum: {formatDateGermanShort(app.status.appointment)} Uhr</span>
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
                                {currentApplicaton && (
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



                                )}

                            </div>
                        </div>
                    </div>
                </div>

            </section>
            {openEdit && (
                <div className="overlay">
                    <div className="editContainer">
                        <h2>Status ändern</h2>
                        <div className="companyHeader">
                            <span>{currentApplicaton.company.name}</span>
                            <span>{currentApplicaton.position.title}</span>
                        </div>

                        <div onClick={() => setopenDropdown(!openDropdown)} className="statusBtnContainer">
                            <span>{newStatus || 'Status ändern'} </span>
                            {openDropdown && (
                                <div className="statusDropdown">
                                    <button onClick={(e) => { changeStatus('Eingang bestätigt', e) }}>Eingang bestätigt</button>
                                    <button onClick={(e) => { changeStatus('Interview', e) }}>Interview</button>
                                    <button onClick={(e) => { changeStatus('Vorstellungsgespräch', e) }}>Vorstellungsgespräch</button>
                                    <button onClick={(e) => { changeStatus('Absage', e) }}>Absage</button>
                                    <button onClick={(e) => { changeStatus('Zusage', e) }}>Zusage</button>
                                </div>

                            )}


                        </div>


                        <input disabled={!(newStatus === 'Interview' || newStatus === 'Vorstellungsgespräch')} type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />

                        <div className="editBtnContainer">
                            <button onClick={() => { setOpenEdit(false); setDate(''); setnewStatus('') }}>Abbrechen</button>
                            <button onClick={() => { editApp(); setDate(''); setnewStatus('') }}>Speichern</button>
                        </div>
                    </div>
                </div>

            )}

        </section>
    )
}