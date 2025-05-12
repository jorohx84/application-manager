import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import firebase from "./firebase";
import './signup.scss';
import { log } from 'console';


const auth = getAuth(firebase);

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signup = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(name);
        console.log(email);
        console.log(password);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Benutzer registriert:', userCredential.user );
            
        } catch {

        }



    }

    return (
        <section>
            <div className='signupContainer'>
                <h2>Registrieren</h2>
                <form onSubmit={signup}>
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
export default SignUp