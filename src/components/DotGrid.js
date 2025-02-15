import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DotGrid.css';

const DotGrid = () => {
  const [dots, setDots] = useState([]);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  const animationStarted = useRef(false);
  const [isPastGrid, setIsPastGrid] = useState(false);

  const phases = [
    { id: 'thinkDifferent', text: 'think different' },
    { id: 'thinkBigger', text: 'think bigger' },
    { id: 'skipPerfect', text: 'skip the perfect plan. start. adjust. repeat' },
    { id: 'buildBreak', text: 'build, break, outgrow. then do it again' }
  ];

  const generateDots = useMemo(() => {
    const newDots = [];
    const spacing = 25;
    const rows = 20;
    const columns = 20;
    const centerX = columns / 2;
    const centerY = rows / 2;
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const xPos = x * spacing;
        const yPos = y * spacing;
        const distanceFromCenter = Math.hypot(x - centerX, y - centerY);

        newDots.push({
          id: `${x}-${y}`,
          x: xPos,
          y: yPos,
          originalX: xPos,
          originalY: yPos,
          distanceFromCenter,
          row: y,
          col: x,
          centerX,
          centerY,
          angle: Math.atan2(y - centerY, x - centerX),
        });
      }
    }
    return newDots;
  }, []);

  const dotVariants = useMemo(() => ({
    initial: {
      opacity: 0,
      scale: 0
    },
    animate: (dot) => {
      if (!currentPhase) {
        return {
          x: 0,
          y: 0,
          opacity: 0.7,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: "easeInOut"
          }
        };
      }

      switch (currentPhase) {
        case 'thinkDifferent':
          return {
            scale: 1,
            opacity: 0.7,
            x: Math.sin((dot.row - dot.col) * 0.5) * 20,
            y: Math.cos((dot.row + dot.col) * 0.5) * 20,
            transition: {
              duration: 0.8,
              ease: "easeInOut"
            }
          };

        case 'thinkBigger':
          return {
            scale: 1,
            opacity: 0.7,
            x: Math.cos(dot.angle) * (dot.distanceFromCenter * 4),
            y: Math.sin(dot.angle) * (dot.distanceFromCenter * 4),
            transition: {
              duration: 0.8,
              ease: "easeOut",
              type: "spring",
              stiffness: 120,
              damping: 12
            }
          };

        case 'skipPerfect':
          return {
            scale: 1,
            opacity: 0.7,
            x: Math.sin((dot.row + dot.col) * 0.5) * 30,
            y: Math.cos((dot.row - dot.col) * 0.5) * 30,
            transition: {
              duration: 1.2,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }
          };

        case 'buildBreak':
          const progress = (dot.angle + Math.PI) / (2 * Math.PI);
          return {
            scale: [1, 0],
            opacity: [0.7, 0],
            x: Math.cos(dot.angle) * 50,
            y: Math.sin(dot.angle) * 50,
            transition: {
              duration: 0.8,
              delay: progress * 0.3,
              ease: [0.4, 0, 0.2, 1]
            }
          };

        default:
          return {
            x: 0,
            y: 0,
            opacity: 0.7,
            scale: 1
          };
      }
    }
  }), [currentPhase]);

  const renderDot = useCallback((dot) => (
    <motion.div
      key={dot.id}
      className="dot"
      initial={dotVariants.initial}
      animate={dotVariants.animate(dot)}
      exit={{ opacity: 0, scale: 0 }}
      style={{
        left: `${dot.originalX}px`,
        top: `${dot.originalY}px`,
        willChange: 'transform, opacity'
      }}
    />
  ), [dotVariants]);

  useEffect(() => {
    setDots(generateDots);
  }, [generateDots]);

  const startInitialAnimation = useCallback(() => {
    const runSequence = async () => {
      setCurrentPhase(null);
      await new Promise(resolve => setTimeout(resolve, 300));

      for (const phase of phases) {
        setCurrentPhase(phase.id);
        await new Promise(resolve => setTimeout(resolve, 1800));
      }

      setCurrentPhase(null);
      setIsInitialAnimationComplete(true);
    };

    runSequence();
  }, [phases]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animationStarted.current) {
          setIsInView(true);
          animationStarted.current = true;
          startInitialAnimation();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [startInitialAnimation]);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setIsPastGrid(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isInView && !isInitialAnimationComplete) {
      setCurrentPhase(null);
      
      const timer = setTimeout(() => {
        setIsInitialAnimationComplete(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const playAnimation = (phase) => {
    if (!isInitialAnimationComplete) return;
    setCurrentPhase(phase);
    setTimeout(() => {
      if (currentPhase === phase) {
        setCurrentPhase(null);
      }
    }, 2000);
  };

  return (
    <div className="dot-grid-container" ref={sectionRef}>
      <div className="dot-grid-content">
        <div className="dot-grid-section">
          <div className="dot-grid">
            <AnimatePresence>
              {dots.map(renderDot)}
            </AnimatePresence>
          </div>
          {/* {isInitialAnimationComplete && ( 
            <button 
              className="about-scroll-button visible"
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              about me
            </button>
          )} */}
        </div>

        <div className="philosophy-section">
          <h2 className="philosophy-title">working philosophy</h2>
          <div className="philosophy-items">
            {phases.map((phase) => (
              <button
                key={phase.id}
                className={`phase-button ${currentPhase === phase.id ? 'active' : ''}`}
                onClick={() => {
                  if (isInitialAnimationComplete) {
                    setCurrentPhase(phase.id);
                  }
                }}
                disabled={!isInitialAnimationComplete}
              >
                {phase.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DotGrid); 