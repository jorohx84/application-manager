import React from "react";
import './legalnotice.scss';

export const Legalnotice=()=>{
return(
    <section className="legalNotice">
  <h1>Datenschutzerklärung</h1>

  <h2>1. Einleitung</h2>
  <p>
    Wir freuen uns über Ihr Interesse an unserer Web-App zur Bewerbungsorganisation. Der Schutz Ihrer persönlichen Daten ist uns ein
    wichtiges Anliegen. Nachfolgend informieren wir Sie darüber, welche Daten bei der Nutzung der App erhoben und wie sie verarbeitet werden.
  </p>

  <h2>2. Verantwortliche Stelle</h2>
  <p>
    Max Mustermann<br />
    Musterstraße 1<br />
    12345 Musterstadt<br />
    E-Mail: kontakt@bewerbungsapp.de
  </p>

  <h2>3. Erhobene Daten</h2>
  <p>Bei Nutzung unserer App werden folgende personenbezogene Daten erhoben:</p>
  <ul>
    <li>Registrierungsdaten (E-Mail-Adresse, ggf. Name)</li>
    <li>Logindaten via Firebase Authentication</li>
    <li>Bewerbungsdaten, die Sie aktiv in die App eingeben (z. B. Firmenname, Bewerbungsstatus, Notizen)</li>
  </ul>

  <h2>4. Zweck der Datenverarbeitung</h2>
  <p>
    Die erhobenen Daten werden ausschließlich zur Bereitstellung und Verbesserung unserer App verwendet, insbesondere um Ihnen eine
    personalisierte Verwaltung Ihrer Bewerbungen zu ermöglichen.
  </p>

  <h2>5. Verwendung von Firebase</h2>
  <p>
    Unsere App nutzt Firebase, einen Dienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.
    Firebase stellt uns folgende Funktionen zur Verfügung:
  </p>
  <ul>
    <li>Benutzerauthentifizierung (Firebase Authentication)</li>
    <li>Datenbank zur Speicherung Ihrer Bewerbungsdaten (Cloud Firestore)</li>
  </ul>
  <p>
    Die Daten werden in der Regel auf Servern innerhalb der EU gespeichert. Eine Übermittlung in Drittländer (z. B. USA) kann nicht
    vollständig ausgeschlossen werden. Google verpflichtet sich zur Einhaltung der Standardvertragsklauseln gemäß Art. 46 DSGVO.
    Weitere Informationen finden Sie in der <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Firebase</a>.
  </p>

  <h2>6. Weitergabe der Daten</h2>
  <p>
    Eine Weitergabe Ihrer Daten an Dritte erfolgt nicht, es sei denn, dies ist gesetzlich vorgeschrieben oder zur
    Erfüllung vertraglicher Verpflichtungen notwendig.
  </p>

  <h2>7. Ihre Rechte</h2>
  <p>Sie haben jederzeit das Recht auf:</p>
  <ul>
    <li>Auskunft über die gespeicherten personenbezogenen Daten</li>
    <li>Berichtigung unrichtiger Daten</li>
    <li>Löschung Ihrer Daten ("Recht auf Vergessenwerden")</li>
    <li>Einschränkung der Verarbeitung</li>
    <li>Widerspruch gegen die Verarbeitung</li>
    <li>Datenübertragbarkeit</li>
  </ul>
  <p>
    Bitte kontaktieren Sie uns unter <strong>kontakt@bewerbungsapp.de</strong>, um eines dieser Rechte auszuüben.
  </p>

  <h2>8. Aufbewahrungsdauer</h2>
  <p>
    Ihre Daten werden gespeichert, solange Sie die App nutzen oder bis Sie eine Löschung beantragen.
  </p>

  <h2>9. Änderungen dieser Datenschutzerklärung</h2>
  <p>
    Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an aktuelle rechtliche Anforderungen anzupassen
    oder Änderungen der App umzusetzen. Die jeweils aktuelle Version finden Sie stets an dieser Stelle.
  </p>

  <p>Stand: Juni 2025</p>
</section>

)
}