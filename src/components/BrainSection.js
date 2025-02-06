import React, { useState, useEffect, forwardRef } from 'react';
import ideas from '../data/ideas.json';
import './BrainSection.css';

const BrainSection = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Start initial sequence
          setIsVisible(true);
          
          // Start pulsing after initial appearance
          setTimeout(() => {
            setIsPulsing(true);
          }, 2000);
          
          // Show content after pulsing starts
          setTimeout(() => {
            setShowContent(true);
          }, 3000);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="brain-section">
      <div className="brain-content">
        <h2 className="brain-title">inside my brain</h2>
        <p className="brain-subtitle">
          Welcome to the part of the internet where my raw, unfiltered thoughts exist. 
          This isn't a structured blog or a polished portfolio—it's a space for the ideas 
          that keep me up at night, the crazy tech experiments I think of, the books that 
          push me in a spiral of thought and the questions I haven't figured out yet.
        </p>
      </div>

      <div className="brain-visualization">
        <div className="brain-container">
          <img 
            src="/brain.png" 
            alt="Digital brain" 
            className={`brain-image ${isVisible ? 'visible' : ''} ${isPulsing ? 'pulse' : ''}`} 
          />
          <div className={`ideas-container ${showContent ? 'visible' : ''}`}>
            {ideas.ideas.map((idea) => (
              <div 
                key={idea.id} 
                className={`idea-block ${idea.position} ${showContent ? 'visible' : ''}`}
              >
                <div className="idea-line"></div>
                <div className="idea-content">
                  <h3>{idea.title}</h3>
                  <p>{idea.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default BrainSection;