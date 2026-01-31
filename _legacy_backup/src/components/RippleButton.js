import React, { useState, useEffect } from 'react';

const RippleButton = ({ children, onClick, className = '', ...props }) => {
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = useState(false);

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 300);
    } else {
      setIsRippling(false);
    }
  }, [coords]);

  useEffect(() => {
    if (!isRippling) setCoords({ x: -1, y: -1 });
  }, [isRippling]);

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`ripple-button ${className}`}
      onClick={handleClick}
      {...props}
    >
      {isRippling && (
        <span
          className="ripple"
          style={{
            left: coords.x + 'px',
            top: coords.y + 'px'
          }}
        />
      )}
      {children}
    </button>
  );
};

export default RippleButton; 