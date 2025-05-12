import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import firebase from "./firebase";
import './signup.scss';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import Login from './login';


const auth = getAuth(firebase);
const firestore = getFirestore(firebase);

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate=useNavigate();
    const createUser = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(name);
        console.log(email);
        console.log(password);

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Benutzer registriert:', userCredential.user);
                const user = userCredential.user;
                updateProfile(user, {
                    displayName: name,
                })

                    .then(() => {
                        console.log(user);
                        const userDocRef = doc(firestore, `users/${user.uid}`);
                        setDoc(userDocRef, {
                            name: name,
                            email: email,
                        })

                    })

                console.log(user);
                const userDocRef = doc(firestore, `users/${user.uid}`);
                setDoc(userDocRef, {
                    name: name,
                    email: email,
                })
                    .then(() => {
                        navigate('/login');
                    })


            })



    }
    return (
        <section>
            <div className='signupContainer'>
                <h2>Registrieren</h2>
                <form onSubmit={createUser}>
                    <input type="text" value={name} placeholder='Name' id='NAME' onChange={(e) => setName(e.target.value)} required />
                    <input type="email" value={email} placeholder='E-Mail Adresse' onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" value={password} placeholder='Passwort' onChange={(e) => setPassword(e.target.value)} required />
                    <div className='privacy'>
                        <input className='checkbox' type="checkbox" required />
                        <span>Ich stimme den <a href="">Datenschutzbestimmungen</a> zu</span>
                    </div>

                    <button type='submit'>Registrieren</button>
                </form>
            </div>
        </section>
    )
}
export default SignUp;