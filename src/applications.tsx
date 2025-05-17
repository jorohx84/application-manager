import React, { useEffect, useState } from "react";
import './applications.scss';
import Sidebar from "./sidebar";
import Header from "./header";
import { fetchApplications, formatDateGermanShort } from './services/applicationService';
import { useUser } from "./userContext";
import { getFirestore, doc, updateDoc, deleteDoc } from "firebase/firestore";
import firebase from "./firebase";


export const Applications = () => {
    const firestore = getFirestore(firebase);
    const [applications, setApplications] = useState<any[] | null>(null);
    const [baseApplications, setbaseApplications] = useState<any[] | null>(null);
    const { user, loading } = useUser();
    const [currentApplicaton, setCurrentApplication] = useState<any | null>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [newStatus, setnewStatus] = useState('');
    const [isUpdate, setisUpdate] = useState(0);
    const [date, setDate] = useState('');
    const [openDropdown, setopenDropdown] = useState(false);
    const [headlineText, setheadlineText] = useState('Bewerbungen')
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [openEditInfos, setopenEditInfo] = useState(false);
    const [appIndex, setappIndex] = useState(-1);
    const [name, setName] = useState('');
    const [contactperson, setContactperson] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [areacode, setAreacode] = useState('');
    const [website, setWebsite] = useState('');
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [link, setLink] = useState('');
    const [salary, setSalary] = useState('');
    const [status, setStatus] = useState('Bewerbung gesendet');
    const [town, setTown] = useState('');
    const [source, setSource] = useState('');
    const [showFilter, setshowFilter] = useState(false);

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
        setappIndex(index);
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

    const editAppStatus = async () => {
        const userID = user?.uid
        const appID = currentApplicaton.id
        const appRef = doc(firestore, `users/${userID}/applications/${appID}`);
        const lastaction = new Date().toISOString()
        await updateDoc(appRef, {
            "status.status": newStatus,
            "status.appointment": date,
            "status.lastaction": lastaction,
        })
        currentApplicaton.status = {
            ...currentApplicaton.status,
            status: newStatus,
            appointment: date,
            lastaction: lastaction
        };
        setisUpdate(prev => prev + 1);
        setOpenEdit(false);


    }

    const changeStatus = (value: string, event: React.MouseEvent) => {
        setnewStatus(value);
        setopenDropdown(false);
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

    const openDeleteOverlay = () => {
        setDeleteOpen(true);
    }

    const deleteApp = async () => {
        const appID = currentApplicaton.id;
        const userID = user?.uid;
        const deleteRef = doc(firestore, `users/${userID}/applications/${appID}`);
        await deleteDoc(deleteRef);
        setisUpdate(prev => prev + 1);
        setCurrentApplication(null);
        setDeleteOpen(false)
    }

    const openEditInfosOverlay = () => {
        const currentApp = applications?.[appIndex];
        setCurrentApplication(currentApp);
        setName(currentApplicaton.company.name);
        setContactperson(currentApplicaton.company.contactperson);
        setEmail(currentApplicaton.company.email);
        setPhone(currentApplicaton.company.phone);
        setStreet(currentApplicaton.company.street);
        setAreacode(currentApplicaton.company.areacode);
        setTown(currentApplicaton.company.town);
        setWebsite(currentApplicaton.company.website);
        setTitle(currentApplicaton.position.title);
        setLocation(currentApplicaton.position.location);
        setLink(currentApplicaton.position.link);
        setSalary(currentApp.position.salary);
        setSource(currentApplicaton.position.source);
        setopenEditInfo(true);
        setStatus(currentApplicaton.status.status);
    }

    const newApplicationObject = () => {
        return {
            company: {
                name: name,
                contactperson: contactperson,
                email: email,
                phone: phone,
                street: street,
                areacode: areacode,
                town: town,
                website: website,

            },
            position: {
                title: title,
                location: location,
                link: link,
                source: source,
                salary: salary,
            },
            status: {
                status: status,
                appointment: currentApplicaton.status.appointment,
                submitted: currentApplicaton.status.submitted,
                lastaction: currentApplicaton.status.lastaction,

            },

        }
    }

    const saveEditedApp = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('los');
        const editedApp = newApplicationObject();
        console.log(editedApp);
        const userID = user?.uid;
        const appID = currentApplicaton.id;
        console.log(location);
        const editRef = doc(firestore, `users/${userID}/applications/${appID}`);
        await updateDoc(editRef, editedApp);
        setCurrentApplication(editedApp);
        setisUpdate(prev => prev + 1);
        setopenEditInfo(false);


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
                                <button className="filterBtn" onClick={() => setshowFilter(true)}><img src="./img/filter_white.svg" alt="" />Filter</button>
                            </div>

                            <div className={`filterSidebar ${showFilter ? 'transform' : ''} `}>
                                <div className="closeBtnContainer">
                                    <button onClick={()=>setshowFilter(false)} className="closeBtn"> <img src="./img/close_white.svg" alt="" /></button>
                                </div>
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
                                                        <span>gesendet am: {formatDateGermanShort(app.status.submitted, 'notime')}</span>
                                                    </div>
                                                    <div className="positionDetails">
                                                        <span>{app.position.title}</span>
                                                        <span className="location">{app.position.location}</span>
                                                    </div>
                                                    <div className="status">
                                                        <p>Status: <b>{app.status.status}</b>  </p>
                                                        {(app.status.status === 'Interview' || app.status.status === 'Vorstellungsgespräch') && (
                                                            <span>Datum: {formatDateGermanShort(app.status.appointment, 'widthtime')} Uhr</span>
                                                        )}
                                                        <div className="cardBtns">

                                                            <button className="statusBtn" onClick={(e) => openOverlay(index, e)}><img src="./img/edit.svg" alt="" /></button>

                                                        </div>
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
                                        <div className="detailsBtnContainer ">
                                            <h2>Informationen</h2>
                                            <div>
                                                <button className="statusBtn" onClick={openEditInfosOverlay}><img src="./img/edit.svg" alt="" /></button>
                                                <button className="statusBtn" onClick={(e) => openDeleteOverlay()}><img src="./img/trash.svg" alt="" /></button>
                                            </div>

                                        </div>

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
                                            <div className="appPosition">

                                                <h3>{currentApplicaton.position.title}</h3>
                                                <span>Ort: {currentApplicaton.position.location}</span>
                                                <span>Gehaltsvorstellung: {currentApplicaton.position.salary}</span>
                                                <div>
                                                    <b>Stellenbeschreibung:</b>
                                                    <a href={currentApplicaton.position.link} target="_blank">{currentApplicaton.position.link}</a>

                                                </div>
                                            </div>
                                            <div className="statusContainer">
                                                <div className="appointmentContainer">
                                                    <b>Status: {currentApplicaton.status.status}</b>
                                                    {currentApplicaton.status.status === 'Interview' || currentApplicaton.status.status === 'Vorstellungsgespräch' && (
                                                        <b>am {formatDateGermanShort(currentApplicaton.status.appointment, 'time')} Uhr</b>
                                                    )}

                                                </div>

                                                <span>Beworben am: {formatDateGermanShort(currentApplicaton.status.submitted, 'notime')}</span>
                                                <span>Letzter Kontakt: {formatDateGermanShort(currentApplicaton.status.lastaction, 'notime')}</span>
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
                            <button onClick={() => { editAppStatus(); setDate(''); setnewStatus('') }}>Speichern</button>
                        </div>
                    </div>
                </div>

            )}

            {deleteOpen && (
                <div className="overlay">
                    <div className="deleteContainer">
                        <h2>Bewerbung löschen?</h2>
                        <div className="companyDetailsContainer">
                            <h3>{currentApplicaton.company.name}</h3>
                            <h4>{currentApplicaton.position.title}</h4>
                        </div>

                        <div className="deleteBtnContainer">
                            <button onClick={() => setDeleteOpen(false)}>Nein</button>
                            <button onClick={(e) => deleteApp()}>Ja</button>
                        </div>
                    </div>
                </div>
            )}
            {openEditInfos && (
                <div className="overlay">
                    <div className="editContainer" >
                        <form className="applicationForm" onSubmit={saveEditedApp}>
                            <div className="inputfields">
                                <div className="companyData">
                                    <h3>Firma</h3>
                                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                    <input type="text" placeholder="Ansprechpartner" value={contactperson} onChange={(e) => setContactperson(e.target.value)} />
                                    <input type="email" placeholder="E-Mail-Adresse" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <input type="tel" placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    <input type="text" placeholder="Straße" value={street} onChange={(e) => setStreet(e.target.value)} />
                                    <input type="text" placeholder="Postleitzahl" value={areacode} onChange={(e) => setAreacode(e.target.value)} />
                                    <input type="text" placeholder="Ort" value={town} onChange={(e) => setTown(e.target.value)} />
                                    <input type="text" placeholder="Website-URL" value={website} onChange={(e) => setWebsite(e.target.value)} />


                                </div>

                                <div className="applicationData">
                                    <h3>Position</h3>
                                    <input type="text" placeholder="Stellenbezeichnung" value={title} onChange={(e) => setTitle(e.target.value)} />

                                    <div className="workLocationContainer">
                                        <span>Arbeitsort</span>
                                        <div>
                                            <button type="button" className={location === 'Firma' ? 'btnHighlight' : ''} onClick={() => setLocation('Firma')}>Firma</button>
                                            <button type="button" className={location === 'Remote' ? 'btnHighlight' : ''} onClick={() => setLocation('Remote')}>Remote</button>
                                            <button type="button" className={location === 'Hybrid' ? 'btnHighlight' : ''} onClick={() => setLocation('Hybrid')}>Hybrid</button>
                                        </div>

                                    </div>
                                    <input type="text" placeholder="Gehaltsvorstellung" value={salary} onChange={(e) => setSalary(e.target.value)} />
                                    <input type="text" placeholder="Link zu Stellenausschreibung" value={link} onChange={(e) => setLink(e.target.value)} />
                                    <input type="text" placeholder="Quelle (LinkedIn, Stepstone...etc)" value={source} onChange={(e) => setSource(e.target.value)} />
                                </div>
                            </div>
                            <div className="applicationBtnContainer">
                                <button type="button" onClick={() => setopenEditInfo(false)}>Abbrechen</button>
                                <button type="submit">Änderung speichern</button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}