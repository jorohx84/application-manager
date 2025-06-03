import React, { useEffect } from "react";
import './imprint.scss';


export const Imprint = () => {
   
     useEffect(() => {
          window.scrollTo(0, 0)
      }, []);

    return (
        <section className="imprint">
            <div className="imprintContent">
                <h1>Impressum</h1>

                <h2>Angaben gemäß § 5 TMG</h2>
                <p>
                    maple Websolutions<br />
                    Inhaber: Johannes Roth<br />
                    Max-Seither-Ring 32<br />
                    76863 Herxheim<br />
                    Deutschland
                </p>

                <h2>Kontakt</h2>
                <p>
                    <a href="tel:+49 151 41292919"> Telefon: +49 151 41292919</a><br />
                    <a href="mailto:info@maple-websolutions.de">E-Mail: info@maple-websolutions.de</a>
                </p>

                <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                <p>
                    Johannes Roth<br />
                    Max-Seither-Ring 32<br />
                    76863 Herxheim
                </p>

                <h2>Haftungsausschluss</h2>
                <p>
                    Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
                    Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
                </p>

                <h2>Urheberrecht</h2>
                <p>
                    Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Web-App unterliegen dem deutschen Urheberrecht.
                    Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                    Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
           
            </div>
        </section>
    );
};
