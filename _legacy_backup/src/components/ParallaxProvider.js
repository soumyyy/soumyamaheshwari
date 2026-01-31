import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParallaxProvider = ({ children }) => {
  useEffect(() => {
    // Smooth scroll setup
    const smoother = gsap.utils.toArray('.parallax-section');
    smoother.forEach((section) => {
      const depth = section.dataset.speed || 0.5;
      gsap.to(section, {
        y: () => (section.offsetHeight * depth),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return <>{children}</>;
};

export default ParallaxProvider;
