import React, { useState } from "react";
import './createapplication.scss';
import Header from "./header";
import Sidebar from "./sidebar";


import { useUser } from "./userContext";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import firebase from "./firebase";
import { useNavigate } from "react-router-dom";

const CreateApplication = () => {
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
    const [status, setStatus] = useState('Bewerbung gesendet');
    const [town, setTown] = useState('');
    const [source, setSource] = useState('');

    const { user } = useUser();
    const userID = user?.uid;
    const firestore = getFirestore(firebase);
    const navigate = useNavigate();

    const createNewApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Hallo');
        const application = newApplicationObject();
        console.log(application);
        const appCollaction = collection(firestore, `users/${userID}/applications`);
        await addDoc(appCollaction, application);
        setTimeout(() => {
navigate('/dashboard');
        }, 200);

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

            },
            status: {
                status: status,
                submitted: new Date().toISOString(),


            },

        }
    }


    return (

        <section className="main">
            <div className="sidebarContainer">
                <Sidebar />
            </div>
            <div className="content">
                <Header />
                <div className="component">
                    <section className="applicationContainer">
                        <div className="headline">
                            <h2>Bewerbung anlegen</h2>
                        </div>
                        <form className="applicationForm" onSubmit={createNewApplication}>
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
                                    <input type="text" placeholder="Arbeitsort" value={location} onChange={(e) => setLocation(e.target.value)} />
                                    <input type="text" placeholder="Link zu Stellenausschreibung" value={link} onChange={(e) => setLink(e.target.value)} />
                                    <input type="text" placeholder="Quelle (LinkedIn, Stepstone...etc)" value={source} onChange={(e) => setSource(e.target.value)} />
                                </div>
                            </div>
                            <div className="applicationBtnContainer">
                                <button type="submit">Bewerbung anlegen</button>
                            </div>

                        </form>


                    </section>

                </div>
            </div>

        </section>
    )
}
export default CreateApplication