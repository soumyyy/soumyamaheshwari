import React, { useEffect } from 'react';
import './TwitterFeed.css';

const TwitterFeed = () => {
  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="twitter-section">
      <h2 className="twitter-title">recent thoughts</h2>
      <div className="twitter-container">
        <a
          class="twitter-timeline" 
          data-lang="en" 
          data-height="600" 
          data-theme="dark" 
          href="https://twitter.com/Soumymaheshwri?ref_src=twsrc%5Etfw">Tweets by Soumymaheshwri
        </a> 
        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        
      </div>
    </section>
  );
};

export default TwitterFeed; 