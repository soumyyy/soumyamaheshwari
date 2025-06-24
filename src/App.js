import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import BrainSection from './components/BrainSection';
import DotGrid from './components/DotGrid';
import ProjectsDotGrid from './components/ProjectsDotGrid';
import RippleButton from './components/RippleButton';

function App() {
  const [showHello, setShowHello] = useState(false);
  const [hideHello, setHideHello] = useState(false);
  const [mainText, setMainText] = useState('');
  const [showMainText, setShowMainText] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const textContainerRef = useRef(null);
  const lastScrollY = useRef(0);
  const brainSectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollAnimationFrame = useRef();

  const hello = "Hello.";
  const mainContent = "I break things, fix them, and build cool stuff along the way.";

  useEffect(() => {
    const handleScroll = () => {
      if (scrollAnimationFrame.current) return;
      scrollAnimationFrame.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        setScrollProgress(scrolled);
        scrollAnimationFrame.current = null;
      });
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollAnimationFrame.current) {
        cancelAnimationFrame(scrollAnimationFrame.current);
      }
    };
  }, []);

  useEffect(() => {
    // Start animation immediately
    setTimeout(() => {
      setShowHello(true);
      
      setTimeout(() => {
        setHideHello(true);
        setShowMainText(true);
        setHeaderVisible(true);
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

  const handleEmailClick = () => {
    window.location.href = 'mailto:soumyamaheshwari1234@gmail.com';
  };

  const handleResumeClick = () => {
    window.open(`${window.location.origin}/SoumyaMaheshwari.pdf`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="App">
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      <header className={`header ${headerVisible ? 'visible' : 'hidden'}`}>
        <h1 className="brand-name">soumya maheshwari</h1>
      </header>

      <div className="header-buttons" style={{
        position: 'fixed',
        top: '20px',
        right: '40px',
        display: 'flex',
        gap: '15px',
        zIndex: 1000
      }}>
        <div className="flip-button-container">
          <button 
            className="flip-button"
            onClick={() => window.open('/blog', '_self')}
          >
            <div className="flip-button-inner">
              <div className="flip-button-front">
                blog
              </div>
              <div className="flip-button-back">
                read my thoughts
              </div>
            </div>
          </button>
        </div>

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
          onClick={() => document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' })}
        >
          about me
        </RippleButton>
      </section>

      <section id="about-section" className="about-section">
        <div className="intro-section">
          <p className="intro-text">
            I'm Soumya, an AI undergrad based out of India
            I design and I build, so you can say I work at the intersection of 
            tech and creative strategy. I'm naturally curious 
            about any and everything.
          </p>
          
          <p className="intro-text">
            I believe the problems that are worth solving don't come 
            with instructions they require experimenting, 
            questioning assumptions, and sometimes breaking 
            things and building them from ground up. I make sure my work is  
            a mix of intuition and iteration.
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
                Simplifying investing by developing personal finance
                tools that make managing money easier because finance 
                can't be a one for all solution.
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
                and complimentary services for the baby,
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
                  <span className="project-type">A conversational speech AI</span>
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
                    <a href="https://github.com/soumyyy" target="_blank" rel="noopener noreferrer">
                      PhotoCortex ~ (MVP testing)
                    </a>
                  </h3>
                  <span className="project-type">Photo analysis and organization platform</span>
                </div>
                <p className="project-description">
                  PhotoCortex is an AI-powered photo analysis and organization platform that helps you 
                  understand and explore your photo collection in new ways. It combines face, object, scene, text
                  detection with computer vision to provide insights about your images.
                </p>
              </div>

              <div className="project-item">
                <div className="project-info">
                  <h3 className="project-name">
                    <a href="https://github.com/soumyyy/StockPortfolio" target="_blank" rel="noopener noreferrer">
                      Personal Stock Portfolio
                    </a>
                  </h3>
                  <span className="project-type">A conversational speech AI</span>
                </div>
                <p className="project-description">
                A minimalistic, real-time stock portfolio tracker built with Next.js and inspired by Zerodha's Kite platform. 
                Track your stock market investments with live updates from Yahoo Finance couples with few convenience features.
                Built as a personal use project.
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
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <h2 className="footer-title">
            Got something cool to build - I'm all ears
          </h2>
          <p className="footer-subtitle">
            <a href="mailto:soumyamaheshwari1234@gmail.com" target="_blank" rel="noopener noreferrer">
            &lt;mail me&gt;
            </a>
          </p>
          
          <div className="social-links">
            <a href="https://twitter.com/soumymaheshwri" target="_blank" rel="noopener noreferrer">
              <img src="social/X.png" alt="X (Twitter)" className="social-icon" />
            </a>
            <a href="https://github.com/soumyyy" target="_blank" rel="noopener noreferrer">
              <img src="social/GitHub.png" alt="GitHub" className="social-icon" />
            </a>
            <a href="https://linkedin.com/in/soumya-maheshwari-b194161a3/" target="_blank" rel="noopener noreferrer">
              <img src="social/LinkedIn.png" alt="LinkedIn" className="social-icon" />
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

      {/* */}
      <button 
        className="blog-button"
        onClick={() => window.open('/blog', '_self')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Knowledge Pool
      </button>
    </div>
  );
}

export default App;