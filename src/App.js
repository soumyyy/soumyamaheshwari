import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import BrainSection from './components/BrainSection';
// import WorkInProgress from './components/WorkInProgress';
import DotGrid from './components/DotGrid';
// import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
// import TwitterFeed from './components/TwitterFeed';
import ProjectsDotGrid from './components/ProjectsDotGrid';
import RippleButton from './components/RippleButton';

function App() {
  const [showHello, setShowHello] = useState(false);
  const [hideHello, setHideHello] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [mainText, setMainText] = useState('');
  const [showMainText, setShowMainText] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [showAboutButton, setShowAboutButton] = useState(false);
  const textContainerRef = useRef(null);
  const lastScrollY = useRef(0);
  const brainSectionRef = useRef(null);

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
              open to work
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
        <RippleButton 
          className={`scroll-button ${showButton ? 'visible' : ''}`}
          onClick={() => document.getElementById('brain-section').scrollIntoView({ behavior: 'smooth' })}
        >
          inside my brain
        </RippleButton>
      </section>

      <section id="brain-section" className="brain-section">
        <BrainSection ref={brainSectionRef} />
        <RippleButton 
          className="scroll-button visible"
          onClick={() => document.getElementById('working-philosophy').scrollIntoView({ behavior: 'smooth' })}
        >
          working philosophy
        </RippleButton>
      </section>

      <section id="working-philosophy" className="dot-grid-section">
        <DotGrid />
        <button 
          className={`about-scroll-button ${showAboutButton ? 'visible' : ''}`}
          onClick={scrollToAbout}
        >
          about me
        </button>
      </section>

      <section className="about-section">
        <div className="intro-section">
          <p className="intro-text">
            I'm Soumya, an AI undergrad. I design, I build, and 
            I'm based out of India. I work at the intersection of AI, 
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

      <section className="projects-section">
        <ProjectsDotGrid />
        <div className="projects-container">
          <div className="projects-grid">
            <div className="section-header">
              <h2>projects</h2>
            </div>

            <div className="projects-items">
              <div className="project-item">
                <div className="project-info">
                  <h3 className="project-name">
                    <a href="https://github.com/soumyyy/Jarvis-V0" target="_blank" rel="noopener noreferrer">
                      Jarvis
                    </a>
                  </h3>
                  <span className="project-type">Personalized AI Assistant</span>
                </div>
                <p className="project-description">
                  Inspired from the Iron Man universe, Jarvis is my take on a personalized AI assistant. 
                  Built using NLP models and automation frameworks, it's designed to understand and respond 
                  to queries, execute commands, and integrate with various tools for enhanced productivity.
                </p>
              </div>

              <div className="project-item">
                <div className="project-info">
                  <h3 className="project-name">
                    <a href="https://github.com/soumyyy/Eclipse" target="_blank" rel="noopener noreferrer">
                      Eclipse
                    </a>
                  </h3>
                  <span className="project-type">A Conversational AI</span>
                </div>
                <p className="project-description">
                  Eclipse (Enhanced Cognitive Linguistic Interactive Personal Support Engine) is an 
                  AI-powered speech-to-text and text-to-speech chatbot designed for intuitive, 
                  human-like interactions. The project integrates GPT-based models and MySQL for 
                  memory persistence, ensuring a personalized user experience.
                </p>
              </div>

              <div className="project-item">
                <div className="project-info">
                  <h3 className="project-name">
                    <a href="https://github.com/soumyyy/SIH-BEL" target="_blank" rel="noopener noreferrer">
                      SIH-BEL
                    </a>
                  </h3>
                  <span className="project-type">Conversational Image Recognition Chatbot</span>
                </div>
                <p className="project-description">
                  Developed during the Smart India Hackathon (SIH) for Bharat Electronics Limited (BEL), 
                  this project combined YOLOv8 for object detection and Llama 3.1 for natural language 
                  processing to create a cutting-edge Conversational Image Recognition Chatbot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <WorkInProgress /> */}
      {/* <TwitterFeed /> */}

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <h2 className="footer-title">
            got something cool to build? I'm all ears
          </h2>
          <p className="footer-subtitle">
            If it's bold, ambitious, or slightly insane—I'm interested.
          </p>
          
          <div className="social-links">
            <a href="https://twitter.com/soumymaheshwri" target="_blank" rel="noopener noreferrer">
              <img src="social/X.png" alt="X (Twitter)" className="social-icon" />
            </a>
            <a href="https://github.com/soumyyy" target="_blank" rel="noopener noreferrer">
              <img src="social/Github.png" alt="GitHub" className="social-icon" />
            </a>
            <a href="https://linkedin.com/in/soumya-maheshwari-b194161a3/" target="_blank" rel="noopener noreferrer">
              <img src="social/Linkedin.png" alt="LinkedIn" className="social-icon" />
            </a>
            <a href="https://instagram.com/soumymaheshwari" target="_blank" rel="noopener noreferrer">
              <img src="social/Instagram.png" alt="Instagram" className="social-icon" />
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