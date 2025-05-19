import React, { useEffect, useState } from "react";
import './watchlist.scss';
import Header from "./header";
import { useNavigate } from "react-router-dom";
import { useUser } from "./userContext";
import { fetchWatchlist, formatDateGermanShort } from "./services/applicationService";
import firebase from "./firebase";
import { getFirestore, addDoc, doc, collection } from "firebase/firestore";


const Watchlist = () => {
    const navigate = useNavigate();
    const [advertisements, setadvertisements] = useState<any[] | null>(null);
    const [name, setName] = useState('');
    const [town, settown] = useState('');
    const [position, setposition] = useState('');
    const [posted, setposted] = useState('');
    const [prio, setprio] = useState('');
    const [location, setlocation] = useState('');
    const [link, setlink] = useState('');
    const [isOpen, setisOpen] = useState(false);
    const { user, loading } = useUser();
    const firestore = getFirestore(firebase);
    const [isUpdated, setisUpdated] = useState(0);

    useEffect(() => {
        if (loading) return;
        if (!user) return;
        const userID = user.uid;
        const loadData = async () => {
            const data = await fetchWatchlist(userID);
            setadvertisements(data);
        };
        loadData();
    }, [loading, user, isUpdated]);



    const newAdvertisement = async (e: React.FormEvent) => {
        e.preventDefault();
        const advertise = getAdvertisementObject();
        const userID = user?.uid;
        const collectionRef = collection(firestore, `users/${userID}/watchlist`);
        await addDoc(collectionRef, advertise);
        setisOpen(false);
        resetInputfields();
        setisUpdated(prev => prev + 1);
    }

    const resetInputfields = () => {
        setName('');
        settown('');
        setposition('');
        setlocation('');
        setposted('');
        setprio('');
        setlink('');
    }

    const getAdvertisementObject = () => {
        return {
            name: name,
            town: town,
            position: position,
            location: location,
            posted: posted,
            prio: prio,
            link: link,

        }
    }

    const exportAdvertisement = (index: number) => {
        const currentAdvertisement = advertisements?.[index];
        console.log(currentAdvertisement);

        navigate("/createapplication", { state: { adv: currentAdvertisement } })
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
                            <div className="watchlistBtns">
                                <button onClick={() => setisOpen(!isOpen)}>{isOpen ? 'Abbrechen' : 'Hinzufügen'}</button>
                            </div>
                            <div className="componentHeadline">
                                <h2>Merkliste</h2>
                            </div>
                            <div className="advertisementsList">
                                {advertisements ? advertisements.map((adv, index) => (
                                    <div className="listRow" key={index}>
                                        <div>
                                            <span>{adv.name}, {adv.town}</span>
                                            <span>|</span>
                                            <span>{adv.position}</span>
                                            <span>|</span>
                                            <span>{adv.location}</span>
                                            <span>|</span>
                                            <b>Ausschreibung eingestellt am: {formatDateGermanShort(adv.posted, 'notime')}</b>
                                        </div>


                                        <div>
                                            <a href={adv.link}>Infos</a>
                                            <button onClick={() => { exportAdvertisement(index) }}>jetzt bewerben</button>
                                        </div>


                                    </div>
                                )) : (
                                    <p>Lade Liste...</p>
                                )}

                            </div>


                            <form className={`inputfieldSlider ${isOpen ? 'transform' : ''}`} onSubmit={newAdvertisement}>
                                {/* <div className="closeBtnContainer">
                                    <button type="button" className="closeBtn" onClick={() => setisOpen(false)}><img src="./img/close_white.svg" alt="" /></button>
                                </div> */}
                                <input type="text" value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} />
                                <input type="text" value={town} placeholder="Stadt" onChange={(e) => settown(e.target.value)} />
                                <input type="text" value={position} placeholder="Position" onChange={(e) => setposition(e.target.value)} />
                                <div className="inputContainer">
                                    <span>Location</span>
                                    <div className="prioBtns">
                                        <button onClick={() => setlocation('Firma')} className={location === 'Firma' ? 'btnHighlight' : ''} type="button">Firma</button>
                                        <button onClick={() => setlocation('Remote')} className={location === 'Remote' ? 'btnHighlight' : ''} type="button">Remote</button>
                                        <button onClick={() => setlocation('Hybrid')} className={location === 'Hybrid' ? 'btnHighlight' : ''} type="button">Hybrid</button>
                                    </div>
                                </div>
                                <div className="inputContainer">
                                    <span>ausgeschrieben seit:</span>
                                    <input type="date" value={posted} onChange={(e) => setposted(e.target.value)} />
                                </div>
                                <div className="inputContainer">
                                    <span>Priorität</span>
                                    <div className="prioBtns">
                                        <button onClick={() => setprio('hoch')} className={prio === 'hoch' ? 'btnHighlight' : ''} type="button">Hoch</button>
                                        <button onClick={() => setprio('mittel')} className={prio === 'mittel' ? 'btnHighlight' : ''} type="button">Mittel</button>
                                        <button onClick={() => setprio('niedrig')} className={prio === 'niedrig' ? 'btnHighlight' : ''} type="button">Niedrig</button>
                                    </div>
                                </div>
                                <input type="text" value={link} placeholder="Link" onChange={(e) => setlink(e.target.value)} />
                                <div className="saveBtn">
                                    <button type="submit">Speichern</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </section>

        </section>
    )
}
export default Watchlist;