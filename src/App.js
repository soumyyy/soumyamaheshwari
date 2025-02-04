import React, { useState, useEffect } from 'react';
import './App.css';

function Loader() {
  return (
    <div className="loader">
      <div className="dot dot1"></div>
      <div className="dot dot2"></div>
      <div className="dot dot3"></div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  // Simulate a loading delay of 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <p className="upcoming-text">Brother whatcha doing here?</p>
      </header>
    </div>
  );
}

export default App;