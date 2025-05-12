import React, { useState } from "react";
import './login.scss';
import { Link, useNavigate } from "react-router-dom";
import firebase from "./firebase";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth();

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const loginUser = async (e:React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user
            const userID = user.uid
            console.log("Erfolgreich eingeloggt:", user, userID);
            navigate("/dashboard", { state: { uid: user.uid } })
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
                    <Link to="/signup">Noch keine Account? Hier Registieren</Link>
                    <button type="submit">Einloggen</button>
                </form>

            </div>

        </section>
    )
}
export default Login