import React, { useEffect, useState } from "react";
import './watchlist.scss';
import Header from "./header";
import { useNavigate } from "react-router-dom";
import { useUser } from "./userContext";
import { fetchWatchlist, formatDateGermanShort, findSearchedData, saveToLocalStorage, getFromLocalStorage } from "./services/applicationService";
import firebase from "./firebase";
import { getFirestore, addDoc, doc, collection, deleteDoc, updateDoc } from "firebase/firestore";


const Watchlist = () => {
    const navigate = useNavigate();
    const [advertisements, setadvertisements] = useState<any[] | null>(null);
    const [baseAdverstisements, setbaseAdvertisements] = useState<any[] | null>(null);
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
    const [isEdit, setisEdit] = useState(false);
    const [advID, setadvID] = useState('');
    const [search, setsearch] = useState('');
    const [prioFilter, setprioFilter] = useState('');
    const [watchlistFiltered, setwatchlistFiltered] = useState(false);
    const [watchlistHeadline, setWatchlistHeadline] = useState('')

    useEffect(() => {
        if (loading) return;
        if (!user) return;
        const userID = user.uid;
        const loadData = async () => {
            const data = await fetchWatchlist(userID);
            // setadvertisements(data);
            setbaseAdvertisements(data);
        };
        loadData();
    }, [loading, user, isUpdated]);

    useEffect(() => {
        const priofilterData = getFromLocalStorage('prioFilter');
        if (priofilterData) {
            setprioFilter(priofilterData);
        };
        const filterKey = getFromLocalStorage('watchlistFiltered');
        if (filterKey) {
            setwatchlistFiltered(filterKey);
        };
    }, []);

    useEffect(() => {
        saveToLocalStorage('prioFilter', prioFilter);
        saveToLocalStorage('watchlistFiltered', watchlistFiltered);
    }, [prioFilter, watchlistFiltered]);

    useEffect(() => {
        if (watchlistFiltered) {
            filterAdvertisements(prioFilter);
            const headline = `Priortät: ${prioFilter.toUpperCase()}`
            setWatchlistHeadline(headline);
        } else {
            setadvertisements(baseAdverstisements);
            setWatchlistHeadline('Merkliste');
        }
    }, [baseAdverstisements]);


    const newAdvertisement = async (e: React.FormEvent) => {
        e.preventDefault();
        const advertise = getAdvertisementObject();
        const userID = user?.uid;
        if (isEdit) {
            const editRef = doc(firestore, `users/${userID}/watchlist/${advID}`);
            await updateDoc(editRef, advertise);
            setisEdit(false)
        } else {
            const collectionRef = collection(firestore, `users/${userID}/watchlist`);
            await addDoc(collectionRef, advertise);
        }
        setisOpen(false);
        resetInputfields();
        setisUpdated(prev => prev + 1);
        setwatchlistFiltered(false);
        setprioFilter('');
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


    const deleteAdvertisement = async (index: number) => {
        console.log(index);
        const currentAdvertisement = advertisements?.[index];
        console.log(currentAdvertisement);
        const advID = currentAdvertisement.id;
        console.log(advID);
        const userID = user?.uid;
        console.log(userID);
        const docRef = doc(firestore, `users/${userID}/watchlist/${advID}`);
        await deleteDoc(docRef);
        setisUpdated(prev => prev + 1)
    }

    const editAdvertisement = (index: number) => {
        setisEdit(true);
        const currentAdvertisement = advertisements?.[index];
        setadvID(currentAdvertisement.id);
        setValues(currentAdvertisement);
        setisOpen(true);
    }

    const setValues = (adv: any) => {
        setName(adv.name);
        settown(adv.town);
        setposition(adv.position);
        setlocation(adv.location);
        setposted(adv.posted);
        setprio(adv.prio);
        setlink(adv.link);
    }

    const findAdvertisement = (input: string) => {
        const headline = `Suche nach: ${input}`;
        setWatchlistHeadline(headline);
        if (input.length >= 3 && baseAdverstisements) {
            const filteredData = findSearchedData(input, baseAdverstisements);
            if (filteredData) {
                setadvertisements(filteredData)
            }
        } else {
            setadvertisements(baseAdverstisements);
            setWatchlistHeadline('Merkliste')
        }
    }

    const filterAdvertisements = (key: string) => {
        if (!baseAdverstisements) return
        setprioFilter(key);
        const headline = `Priorität: ${key.toUpperCase()}`
        setWatchlistHeadline(headline);
        setwatchlistFiltered(true);
        const filtered = baseAdverstisements.filter(adv => adv.prio === key);
        setadvertisements(filtered);
    }

    const removeFilter = () => {

        setprioFilter('');
        setwatchlistFiltered(false);
        setadvertisements(baseAdverstisements);
        setWatchlistHeadline('Merkliste')
    }

    return (
        <section className="applications">
            <section className="main">
                <div className="content">

                    <div className="component">
                        <div className="componentContent">
                            <div className="watchlistMenu">
                                <div className="watchlistFilterBtns">
                                    <button className={`highBtn ${prioFilter === 'hoch' ? 'btnHighActive' : ''}`} onClick={() => { filterAdvertisements('hoch') }}>Hoch</button>
                                    <button className={`mediumBtn ${prioFilter === 'mittel' ? 'btnMediumActive' : ''}`} onClick={() => { filterAdvertisements('mittel') }}>Mittel</button>
                                    <button className={`lowBtn ${prioFilter === 'niedrig' ? 'btnLowActive' : ''}`} onClick={() => { filterAdvertisements('niedrig') }}>Niedrig</button>
                                </div>
                                <div className="watchlistBtns">
                                    <button className="reloadBtn" onClick={() => { removeFilter() }}> <img src="./img/reload_blue.svg" alt="" /></button>
                                    <input className="searchInput" type="text" value={search} placeholder="Firmaname eingeben" onChange={(e) => { setsearch(e.target.value); findAdvertisement(e.target.value) }} />
                                    <button onClick={() => { setisOpen(!isOpen); setisEdit(false); resetInputfields() }}>{isOpen ? 'Abbrechen' : 'Hinzufügen'}</button>
                                </div>
                            </div>

                            <div className="componentHeadline">
                                {/* <h2>{watchlistFiltered ? `Priorität: ${prioFilter.toUpperCase()}` : 'Merkliste'}</h2> */}
                                <h2>{baseAdverstisements ? watchlistHeadline : ''}</h2>
                            </div>
                            <div className="advertisementsList">
                                {advertisements ? advertisements.map((adv, index) => (
                                    <div className="listRow" key={index}>
                                        <div>
                                            <div className={`prioFlag ${adv.prio === 'hoch' ? 'flagHigh' : adv.prio === 'mittel' ? 'flagMedium' : 'flagLow'}`}>
                                                {/* <span>{adv.prio}</span> */}
                                            </div>
                                            <span>{adv.name}, {adv.town}</span>
                                            <span>|</span>
                                            <span>{adv.position}</span>
                                            <span>|</span>
                                            <span>{adv.location}</span>
                                            <span>|</span>
                                            {adv.posted !== '' ? (
                                                <b>Ausschreibung vom: {formatDateGermanShort(adv.posted, 'notime')}</b>
                                            ) : (
                                                <span></span>
                                            )}
                                            {/* <div className={`prioFlag ${adv.prio === 'hoch' ? 'flagHigh' : adv.prio === 'mittel' ? 'flagMedium' : 'flagLow'}`}>
                                                <span>{adv.prio}</span>
                                            </div> */}
                                        </div>

                                        <div className="watchlistRowBtns">
                                            <a className="infoLink" href={adv.link} target="_blank">Stellenbeschreibung</a>
                                            <button onClick={() => { exportAdvertisement(index) }}>bewerben</button>
                                            <button className="editBtn" onClick={() => { editAdvertisement(index) }}><img src="./img/edit_blue.svg" alt="" /></button>
                                            <button onClick={() => { deleteAdvertisement(index) }} className="trashBtn"><img src="./img/trash_blue.svg" alt="" /></button>
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
                                        <button onClick={() => setprio('hoch')} className={` prioHigh ${prio === 'hoch' ? 'btnHighActive' : ''}`} type="button">Hoch</button>
                                        <button onClick={() => setprio('mittel')} className={`prioMedium ${prio === 'mittel' ? 'btnMediumActive' : ''}`} type="button">Mittel</button>
                                        <button onClick={() => setprio('niedrig')} className={`prioLow ${prio === 'niedrig' ? 'btnLowActive' : ''}`} type="button">Niedrig</button>
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