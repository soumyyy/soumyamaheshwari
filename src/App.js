import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import BrainSection from './components/BrainSection';
import WorkInProgress from './components/WorkInProgress';
import DotGrid from './components/DotGrid';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

function App() {
  const [showHello, setShowHello] = useState(false);
  const [hideHello, setHideHello] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [mainText, setMainText] = useState('');
  const [showMainText, setShowMainText] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [showAboutButton, setShowAboutButton] = useState(false);
  const brainSectionRef = useRef(null);
  const lastScrollY = useRef(0);
  const textContainerRef = useRef(null);

  const hello = "Hello.";
  const mainContent = "I break things, fix them, and sometimes build cool stuff along the way.";

  useEffect(() => {
    // Start animation immediately
    setTimeout(() => {
      setShowHello(true);
      
      setTimeout(() => {
        setHideHello(true);
        setShowMainText(true);
        setHeaderVisible(true);
        setShowAboutButton(true);
        let mainIndex = 0;

        const typeText = () => {
          if (mainIndex <= mainContent.length) {
            setMainText(mainContent.slice(0, mainIndex));
            mainIndex++;
            
            // Center the text container after each character
            if (textContainerRef.current) {
              textContainerRef.current.style.width = 'auto';
            }
            
            if (mainIndex <= mainContent.length) {
              setTimeout(typeText, 20);
            } else {
              setShowButton(true);
            }
          }
        };

        typeText();
      }, 1000);
    }, 500);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToBrain = () => {
    if (brainSectionRef.current) {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:soumyamaheshwari1234@gmail.com';
  };

  const handleResumeClick = () => {
    window.open(`${window.location.origin}/resume.pdf`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="App">
      <header className={`header ${headerVisible ? 'visible' : 'hidden'}`}>
        <h1 className="brand-name">soumya maheshwari</h1>
      </header>

      <div className="flip-button-container">
        <button 
          className="flip-button"
          onClick={handleEmailClick}
        >
          <div className="flip-button-inner">
            <div className="flip-button-front">
              Open to Work
            </div>
            <div className="flip-button-back">
              soumyamaheshwari1234@gmail.com
            </div>
          </div>
        </button>
      </div>

      <section className="landing-section">
        <h2 className={`hello-text ${showHello ? 'fade-in' : ''} ${hideHello ? 'fade-out' : ''}`}>
          Hello
        </h2>
        <div ref={textContainerRef} className={`main-text ${showMainText ? 'fade-in' : ''}`}>
          {mainText}
          <span className="cursor">|</span>
        </div>
        <button 
          className={`scroll-button ${showButton ? 'visible' : ''}`}
          onClick={() => {
            const gridSection = document.querySelector('.dot-grid-container');
            if (gridSection) {
              gridSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          click to explore
        </button>
      </section>

      <div className="dot-grid-section">
        <DotGrid />
        <button 
          className={`about-scroll-button ${showAboutButton ? 'visible' : ''}`}
          onClick={scrollToAbout}
        >
          about me
        </button>
      </div>

      <section className="about-section">
        <div className="intro-section">
          <p className="intro-text">
            I'm Soumya, an AI undergrad. I design, I build, and 
            I'm based in India. I work at the intersection of AI, 
            design, and creative strategy. I'm naturally curious 
            about ideas that challenge the usual way of doing 
            things.
          </p>
          
          <p className="intro-text">
            I believe the most interesting problems don't come 
            with instructions—they require experimenting, 
            questioning assumptions, and sometimes, breaking 
            things to rebuild them better. My work is driven 
            by a mix of intuition and iteration.
          </p>
        </div>

        <div className="work-section">
          <div className="section-header">
            <h2>work</h2>
            <h2>details</h2>
          </div>

          <div className="work-items">
            <div className="work-item">
              <div className="work-info">
                <span className="work-type">Founder's Office</span>
                <h3 className="company-name">Komma Financial Technologies</h3>
              </div>
              <p className="work-description">
                Simplifying personal finance by developing digital 
                tools that make managing money easier and more 
                secure
              </p>
            </div>

            <div className="work-item">
              <div className="work-info">
                <span className="work-type">Founder's Office</span>
                <h3 className="company-name">BabyKavach</h3>
              </div>
              <p className="work-description">
                Building a suite of digital healthcare services to help 
                parents with vaccinations, manage medical records, 
                and complimentary services
              </p>
            </div>
          </div>
        </div>
      </section>

      <BrainSection ref={brainSectionRef} />
      <WorkInProgress />

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <h2 className="footer-title">
            If you've something cool to build I'd be all ears
          </h2>
          <p className="footer-subtitle">
            If it's bold, ambitious, or slightly insane—I'm interested.
          </p>
          
          <div className="social-links">
            <a href="https://twitter.com/soumymaheshwri" target="_blank" rel="noopener noreferrer">
              <img src="/X.png" alt="X (Twitter)" className="social-icon" />
            </a>
            <a href="https://github.com/soumyyy" target="_blank" rel="noopener noreferrer">
              <img src="/Github.png" alt="GitHub" className="social-icon" />
            </a>
            <a href="https://linkedin.com/in/soumya-maheshwari-b194161a3/" target="_blank" rel="noopener noreferrer">
              <img src="/Linkedin.png" alt="LinkedIn" className="social-icon" />
            </a>
            <a href="https://instagram.com/soumymaheshwari" target="_blank" rel="noopener noreferrer">
              <img src="/Instagram.png" alt="Instagram" className="social-icon" />
            </a>
          </div>

          <button className="resume-button" onClick={handleResumeClick}>
            resume
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;