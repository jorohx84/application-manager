import React, { useEffect, useState } from "react";
import './applications.scss';
import Sidebar from "./sidebar";
import Header from "./header";
import { fetchApplications, formatDateGermanShort, findSearchedData, saveToLocalStorage, getFromLocalStorage } from './services/applicationService';
import { useUser } from "./userContext";
import { getFirestore, doc, updateDoc, deleteDoc } from "firebase/firestore";
import firebase from "./firebase";
import { useLocation } from "react-router-dom";
import Footer from "./footer";

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
    const [headlineText, setheadlineText] = useState('')
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
    const [notes, setNotes] = useState('');
    const [search, setsearch] = useState('');
    const [isfiltered, setisFiltered] = useState(false);
    const [currentFilter, setcurrentFilter] = useState('');
    const [detailsOpen, setdetailsOpen] = useState(false);






    useEffect(() => {
        const filterKey = getFromLocalStorage('isfiltered');
        if (filterKey) {
            setisFiltered(filterKey)
        }
        const filterData = getFromLocalStorage('currentFilter');
        if (filterData) {
            setcurrentFilter(filterData);
        }
        const storedApplication = getFromLocalStorage('currentApplicaton');
        if (storedApplication) {
            setCurrentApplication(storedApplication);
        }
        const storedDetailsKey = getFromLocalStorage('detailsOpen');
        if (storedDetailsKey) {
            setdetailsOpen(storedDetailsKey);
        }
    }, []);


    useEffect(() => {
        saveToLocalStorage('isfiltered', isfiltered);
        saveToLocalStorage('currentFilter', currentFilter);

    }, [isfiltered, currentFilter]);


    useEffect(() => {
        saveToLocalStorage('currentApplicaton', currentApplicaton);
        saveToLocalStorage('detailsOpen', detailsOpen);
    }, [currentApplicaton, detailsOpen]);




    useEffect(() => {
        if (isfiltered) {
            filterApps(currentFilter)
        } else {
            setApplications(baseApplications);
            setheadlineText('Bewerbungen');
        }
    }, [baseApplications])


    useEffect(() => {
        if (loading) return;
        if (!user) return;
        const userID = user.uid;
        const loadData = async () => {
            const data = await fetchApplications(userID);
            setbaseApplications(data);

        };
        loadData();

    }, [loading, user, isUpdate]);


    const showDetails = (index: number) => {
        setdetailsOpen(true);
        setappIndex(index);
        if (applications) {
            const details = applications[index];
            setCurrentApplication(details);
        }
    }


    const openOverlay = (index: number, event: React.MouseEvent) => {
        setOpenEdit(true);
        const currentApp = applications?.[index];
        setnewStatus(currentApp.status.status);
        setDate(currentApp.status.appointment);
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
        if (isfiltered) {
            setdetailsOpen(false);
        }
        setisFiltered(true);
        setcurrentFilter(newStatus);
        filterApps(newStatus);
    }

    const changeStatus = (value: string, event: React.MouseEvent) => {
        setnewStatus(value);
        setopenDropdown(false);
        event.stopPropagation();
    }

    const filterApps = (key: string) => {
        if (!baseApplications) return;
        setcurrentFilter(key);
        const filteredApps = baseApplications?.filter((app: any) => app.status.status === key);
        setApplications(filteredApps);
        setheadlineText(key)
        setisFiltered(true);
    }

    const removeFilter = () => {
        setcurrentFilter('')
        setisFiltered(false);
        setApplications(baseApplications);
        setheadlineText('Bewerbungen');
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
        setDeleteOpen(false);
        setdetailsOpen(false);
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
        setNotes(currentApplicaton.notes);
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
            notes: notes,
        }
    }

    const saveEditedApp = async (e: React.FormEvent) => {
        e.preventDefault();
        const editedApp = newApplicationObject();
        const userID = user?.uid;
        const appID = currentApplicaton.id;
        const editRef = doc(firestore, `users/${userID}/applications/${appID}`);
        await updateDoc(editRef, editedApp);
        setCurrentApplication(editedApp);
        setisUpdate(prev => prev + 1);
        setopenEditInfo(false);

    }

    const findApplications = (input: string) => {

        if (input.length >= 3 && baseApplications) {
            setdetailsOpen(false);
            setheadlineText('Suche nach' + ' ' + '"' + input + '"');
            const filteredData = findSearchedData(input, baseApplications);
            if (filteredData) {
                setApplications(filteredData)
            }
        } else {
            setheadlineText('Bewerbungen')
            setApplications(baseApplications);
        }
    }


    return (
        <section className="applications">
            <section className="main">
                {/* <div className="sidebarContainer">
                    <Sidebar />
                </div> */}
                <div className="content">

                    <div className="component">
                        <div className="componentContent">
                            <div className="filter">
                                <div className="filterBtns">
                                    <button className={currentFilter === 'Bewerbung gesendet' ? 'btnHighlight' : ''} onClick={() => { filterApps('Bewerbung gesendet'); setdetailsOpen(false) }}>Gesendet</button>
                                    <button className={currentFilter === 'Eingang bestätigt' ? 'btnHighlight' : ''} onClick={() => { filterApps('Eingang bestätigt'); setdetailsOpen(false) }}>Eingang bestätigt</button>
                                    <button className={currentFilter === 'Interview' ? 'btnHighlight' : ''} onClick={() => { filterApps('Interview'); setdetailsOpen(false) }}>Interview</button>
                                    <button className={currentFilter === 'Vorstellungsgespräch' ? 'btnHighlight' : ''} onClick={() => { filterApps('Vorstellungsgespräch'); setdetailsOpen(false) }}>Vorstellungsgespräch</button>
                                    <button className={currentFilter === 'Absage' ? 'btnHighlight' : ''} onClick={() => { filterApps('Absage'); setdetailsOpen(false) }}>Absage</button>
                                </div>
                                <div className="menubar">
                                    <button disabled={!isfiltered} className={`resetBtn ${isfiltered ? '' : 'opacity'}`} onClick={() => removeFilter()}><img src="./img/reload_blue.svg" alt="" /></button>
                                    <input className="searchInput" type="text" value={search} placeholder="Firmaname eingeben" onChange={(e) => { setsearch(e.target.value); findApplications(e.target.value) }} />
                                    {/* <button className="filterBtn" onClick={() => setshowFilter(true)}><img src="./img/filter_blue.svg" alt="" />Filter</button> */}
                                </div>

                            </div>

                            <div className={`filterSidebar ${showFilter ? 'transform' : ''} `}>
                                <div className="closeBtnContainer">
                                    <button onClick={() => setshowFilter(false)} className="closeBtn"> <img src="./img/close_blue.svg" alt="" /></button>
                                </div>

                                <button className={currentFilter === 'Bewerbung gesendet' ? 'btnHighlight' : ''} onClick={() => { filterApps('Bewerbung gesendet'); setdetailsOpen(false) }}>Gesendet</button>
                                <button className={currentFilter === 'Eingang bestätigt' ? 'btnHighlight' : ''} onClick={() => { filterApps('Eingang bestätigt'); setdetailsOpen(false) }}>Eingang bestätigt</button>
                                <button className={currentFilter === 'Interview' ? 'btnHighlight' : ''} onClick={() => { filterApps('Interview'); setdetailsOpen(false) }}>Interview</button>
                                <button className={currentFilter === 'Vorstellungsgespräch' ? 'btnHighlight' : ''} onClick={() => { filterApps('Vorstellungsgespräch'); setdetailsOpen(false) }}>Vorstellungsgespräch</button>
                                <button className={currentFilter === 'Absage' ? 'btnHighlight' : ''} onClick={() => { filterApps('Absage'); setdetailsOpen(false) }}>Absage</button>
                            </div>



                            <div className="componentHeadline">
                                <h2>{applications ? headlineText : ''}</h2>
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
                                                        <p className="statusChanger" onClick={(e) => openOverlay(index, e)}><b>{app.status.status}</b>  </p>
                                                        {(app.status.status === 'Interview' || app.status.status === 'Vorstellungsgespräch') && (
                                                            <span>am: {formatDateGermanShort(app.status.appointment, 'widthtime')} Uhr</span>
                                                        )}


                                                    </div>

                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Lade Liste...</p>

                                    )}
                                </div>
                                {detailsOpen && applications && (
                                    <div className="applicationDetails">
                                        <div className="detailsBtnContainer ">
                                            <h2>Informationen</h2>
                                            <div>
                                                <button className="statusBtn" onClick={openEditInfosOverlay}><img src="./img/edit_blue.svg" alt="" /></button>
                                                <button className="statusBtn" onClick={(e) => openDeleteOverlay()}><img src="./img/trash_blue.svg" alt="" /></button>
                                            </div>

                                        </div>
                                        <div className="detailsDivider"></div>
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
                                                <span>Homepage</span>
                                                <a href={currentApplicaton?.company.website} target="_blank">{currentApplicaton?.company.website}</a>
                                            </div>
                                            <div className="appPosition">

                                                <h3>{currentApplicaton?.position.title}</h3>
                                                <span>Ort: {currentApplicaton?.position.location}</span>
                                                <span>Gehaltsvorstellung: {currentApplicaton?.position.salary}</span>
                                                <div>
                                                    <b>Stellenbeschreibung:</b>
                                                    <a href={currentApplicaton?.position.link} target="_blank">{currentApplicaton?.position.link}</a>

                                                </div>
                                            </div>
                                            <div className="statusContainer">
                                                <div className="appointmentContainer">
                                                    <b>Status: {currentApplicaton?.status.status}</b>
                                                    {(currentApplicaton?.status.status === 'Interview' || currentApplicaton?.status.status === 'Vorstellungsgespräch') && (
                                                        <b>am {formatDateGermanShort(currentApplicaton?.status.appointment, 'time')} Uhr</b>
                                                    )}

                                                </div>

                                                <span>Beworben am: {formatDateGermanShort(currentApplicaton?.status.submitted, 'notime')}</span>
                                                <span>Letzter Kontakt: {formatDateGermanShort(currentApplicaton?.status.lastaction, 'notime')}</span>
                                            </div>

                                            <div className="notesDetails">
                                                <span>Notizen:</span>
                                                <p>{currentApplicaton?.notes}</p>
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
                                    <div className="notesContainer">
                                        <span>Notizen:</span>
                                        <textarea name="notes" value={notes} placeholder="Notizen" onChange={(e) => setNotes(e.target.value)}></textarea>
                                    </div>
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