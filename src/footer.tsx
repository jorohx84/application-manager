import React from "react";
import './footer.scss';
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <section className="footer">
            <div className="footerContent">
                <span>© Johannes Roth, 2025</span>
                <div className="legal">
                    <Link className="link" to='/'>Impressum</Link>
                    <Link className="link" to='/'>Datenschutz</Link>
                </div>
            </div>
        </section>
    )
}

export default Footer;