import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import BrainSection from './components/BrainSection';
import WorkInProgress from './components/WorkInProgress';

function App() {
  const [showHello, setShowHello] = useState(false);
  const [hideHello, setHideHello] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [mainText, setMainText] = useState('');
  const [showMainText, setShowMainText] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const brainSectionRef = useRef(null);
  const lastScrollY = useRef(0);

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
        let mainIndex = 0;

        const typeText = () => {
          if (mainIndex <= mainContent.length) {
            setMainText(mainContent.slice(0, mainIndex));
            mainIndex++;
            
            if (mainIndex <= mainContent.length) {
              setTimeout(typeText, 50);
            } else {
              setShowButton(true);
            }
          }
        };

        typeText();
      }, 2000);
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

  return (
    <div className="App">
      <header className={`header ${headerVisible ? 'visible' : 'hidden'}`}>
        <h1 className="brand-name">soumya maheshwari</h1>
      </header>

      <div className="landing-section">
        <div className={`hello-text ${showHello ? 'fade-in' : ''} ${hideHello ? 'fade-out' : ''}`}>
          {hello}
        </div>
        <div className={`main-text ${showMainText ? 'fade-in' : ''}`}>
          {mainText}<span className="cursor">|</span>
        </div>
        <button 
          className={`scroll-button ${showButton ? 'visible' : ''}`}
          onClick={scrollToBrain}
        >
          explore my thoughts
        </button>
      </div>

      <BrainSection ref={brainSectionRef} />
      <WorkInProgress />
    </div>
  );
}

export default App;