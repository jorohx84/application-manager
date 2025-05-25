import React, { useState } from "react";
import './login.scss';
import { Link, useNavigate } from "react-router-dom";
import firebase from "./firebase";
import { signInWithEmailAndPassword, signInAnonymously, getAuth } from "firebase/auth";

const auth = getAuth();

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user
            const userID = user.uid
            console.log("Erfolgreich eingeloggt:", user, userID);
            navigate("/dashboard", { state: { uid: user.uid } });
        } catch (err: any) {
            console.error("Fehler beim Login", err.message)
        }
    }

    const guestLogin = async () => {
        try {
            const guestEmail = 'gast@mail.de';
            const guestPassword = 'demopassword123';
            const userCredential = await signInWithEmailAndPassword(auth, guestEmail, guestPassword);
            const user = userCredential.user;
            console.log("Als Gast eingeloggt", user.uid);
            navigate("/dashboard", { state: { uid: user.uid } });
        } catch (err: any) {
            console.error("Fehler beim Login", err.message)
        }
    }



    return (
        <section className="login">
            <div className="loginContainer">
                <h2>Anmelden</h2>
                <form onSubmit={loginUser}>
                    <input type="email" value={email} placeholder="E-Mail-Adresse" onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" value={password} placeholder="Passwort" onChange={(e) => setPassword(e.target.value)} required />
                   
                    <div className="loginBtns">
                        <button type="submit">Einloggen</button>
                        <button type="button" onClick={guestLogin}>Gäste-Login</button>
                    </div>

                </form>

            </div>

        </section>
    )
}
export default Login