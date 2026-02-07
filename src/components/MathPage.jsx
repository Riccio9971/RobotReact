import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MathOnboarding from './MathOnboarding';
import MathActivities from './MathActivities';
import CountingGame from './CountingGame';
import BalloonGame from './BalloonGame';
import SequenceGame from './SequenceGame';
import CompareGame from './CompareGame';

const floatingNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '+', '-', '×', '÷', '='];
const colors = ['#ff6b35', '#ff2d7b', '#7b2fff', '#00f0ff', '#00ff88', '#ffaa00', '#ff4757', '#2ed573'];

const MathPage = ({ onBack }) => {
  const [student, setStudent] = useState(null); // null = onboarding
  const [activity, setActivity] = useState(null); // null = activity selection

  const numbers = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      char: floatingNumbers[i % floatingNumbers.length],
      color: colors[i % colors.length],
      left: `${5 + Math.random() * 90}%`,
      top: `${5 + Math.random() * 90}%`,
      size: `${1.5 + Math.random() * 3}rem`,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 4,
      rotate: Math.random() * 360,
    }));
  }, []);

  const handleOnboardingComplete = (data) => {
    setStudent(data);
  };

  const handleSelectActivity = (actId) => {
    setActivity(actId);
  };

  const handleBackToActivities = () => {
    setActivity(null);
  };

  // Render the active game
  const renderGame = () => {
    const gameProps = { student, onBack: handleBackToActivities };
    switch (activity) {
      case 'counting': return <CountingGame key="counting" {...gameProps} />;
      case 'balloons': return <BalloonGame key="balloons" {...gameProps} />;
      case 'sequence': return <SequenceGame key="sequence" {...gameProps} />;
      case 'compare': return <CompareGame key="compare" {...gameProps} />;
      default: return null;
    }
  };

  return (
    <motion.div
      className="math-page"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating numbers background */}
      <div className="math-floating-numbers">
        {numbers.map(n => (
          <motion.span
            key={n.id}
            className="math-float-num"
            style={{
              left: n.left,
              top: n.top,
              fontSize: n.size,
              color: n.color,
            }}
            initial={{ opacity: 0, scale: 0, rotate: n.rotate }}
            animate={{
              opacity: [0, 0.3, 0.15, 0.3, 0],
              scale: [0, 1, 1.1, 1, 0],
              y: [0, -30, -15, -30, 0],
            }}
            transition={{
              duration: n.duration,
              delay: n.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {n.char}
          </motion.span>
        ))}
      </div>

      {/* Back button — only on activity selection, not during games */}
      {!activity && (
        <motion.button
          className="math-back-btn"
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          ← Torna a Robot
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {!student ? (
          <MathOnboarding key="onboarding" onComplete={handleOnboardingComplete} />
        ) : activity ? (
          renderGame()
        ) : (
          <MathActivities
            key="activities"
            student={student}
            onSelectActivity={handleSelectActivity}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MathPage;
