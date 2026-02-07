import { useState, useEffect } from 'react';

const TypewriterText = () => {
  const fullText = 'Ciao! Sono RoBot';
  const [text, setText] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowSubtitle(true), 400);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="typewriter-container">
      <div className="typewriter-title">
        {text}
        <span className="cursor" />
      </div>
      {showSubtitle && (
        <div className="typewriter-subtitle">
          Il tuo assistente futuristico
        </div>
      )}
    </div>
  );
};

export default TypewriterText;
