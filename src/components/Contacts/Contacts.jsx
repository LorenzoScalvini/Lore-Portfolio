import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Contacts.module.css";
import githubLogo from "../../assets/Logos/GithubLogo.svg";
import linkedinLogo from "../../assets/Logos/linkedinLogo.svg";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

// Import delle 7 immagini (1 centrale + 6 orbitanti)
import imgContact1 from "../../assets/contact/ImgContact1.jpg";
import imgContact2 from "../../assets/contact/ImgContact2.jpg";
import imgContact3 from "../../assets/contact/ImgContact3.jpg";
import imgContact4 from "../../assets/contact/ImgContact4.jpg";
import imgContact5 from "../../assets/contact/ImgContact5.jpg";
import imgContact6 from "../../assets/contact/ImgContact6.jpg";
import imgContact7 from "../../assets/contact/ImgContact7.jpg";

const contactTexts = {
  subtitle: "Disponibile per nuove opportunità",
  description:
    "Programmatore / Web Developer: realizzo soluzioni web moderne, accessibili e performanti con tecnologie come React, TypeScript e Tailwind. Competenze in UI/UX, integrazione API.",
  buttonLinkedIn: "LinkedIn", 
  buttonGithub: "Github",
  linkedinUrl: "https://www.linkedin.com/in/lorenzo-scalvini-a2a68a31b/", 
  githubUrl: "https://github.com/LorenzoScalvini",
  email: "lorenzo.scalvini1704@gmail.com",
  phone: "+39 379 151 0526",
  contactTitle: "Contatti diretti"
};

export default function Contacts() {
  const handleGoToGitHub = () => {
    window.open(contactTexts.githubUrl, "_blank");
  };

  const handleGoToLinkedIn = () => { 
    window.open(contactTexts.linkedinUrl, "_blank");
  };

  return (
    <section className={styles.contactSection}>
      <div className={styles.content}>
        <div className={styles.profileContainer}>
          <div className={styles.planetsContainer}>
            {/* Pianeta centrale - contact 1 grande */}
            <div className={styles.centerPlanet}>
              <img 
                src={imgContact1} 
                alt="Contact 1" 
                className={styles.centerImage}
              />
            </div>
            
            {/* 6 pianeti orbitanti */}
            <div className={`${styles.orbitingPlanet} ${styles.planet2}`}>
              <img 
                src={imgContact2} 
                alt="Contact 2" 
                className={styles.planetImage}
              />
            </div>
            
            <div className={`${styles.orbitingPlanet} ${styles.planet3}`}>
              <img 
                src={imgContact3} 
                alt="Contact 3" 
                className={styles.planetImage}
              />
            </div>
            
            <div className={`${styles.orbitingPlanet} ${styles.planet4}`}>
              <img 
                src={imgContact4} 
                alt="Contact 4" 
                className={styles.planetImage}
              />
            </div>
            
            <div className={`${styles.orbitingPlanet} ${styles.planet5}`}>
              <img 
                src={imgContact5} 
                alt="Contact 5" 
                className={styles.planetImage}
              />
            </div>
            
            <div className={`${styles.orbitingPlanet} ${styles.planet6}`}>
              <img 
                src={imgContact6} 
                alt="Contact 6" 
                className={styles.planetImage}
              />
            </div>
            
            <div className={`${styles.orbitingPlanet} ${styles.planet7}`}>
              <img 
                src={imgContact7} 
                alt="Contact 7" 
                className={styles.planetImage}
              />
            </div>
          </div>
        </div>

        <div className={styles.textContent}>
          <span className={styles.subtitle}>{contactTexts.subtitle}</span>

          <div className={styles.description}>
            <p>{contactTexts.description}</p>
          </div>

          <div className={styles.contactInfo}>
            <h3 className={styles.contactTitle}>{contactTexts.contactTitle}</h3>
            <div className={styles.contactItems}>
              <a href={`mailto:${contactTexts.email}`} className={styles.contactItem}>
                <EnvelopeIcon className={styles.contactIcon} />
                <span>{contactTexts.email}</span>
              </a>
              <a href={`tel:${contactTexts.phone.replace(/\s/g, '')}`} className={styles.contactItem}>
                <PhoneIcon className={styles.contactIcon} />
                <span>{contactTexts.phone}</span>
              </a>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button
              onClick={handleGoToLinkedIn} 
              className={`${styles.button} ${styles.primaryButton}`}
            >
              <img src={linkedinLogo} alt="LinkedIn" className={styles.icon} /> 
              {contactTexts.buttonLinkedIn} 
            </button>

            <button
              onClick={handleGoToGitHub}
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              <img src={githubLogo} alt="GitHub" className={styles.icon} />
              {contactTexts.buttonGithub}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}