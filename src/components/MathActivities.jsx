import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import OwlTeacher from './OwlTeacher';

const activities = [
  {
    id: 'counting',
    items: ['🧸', '🚗', '🎲'],
    title: 'Conta!',
    bg: 'linear-gradient(135deg, #ff6b35, #ff9a5c)',
  },
  {
    id: 'balloons',
    items: ['⚽', '🏀', '🎾'],
    title: 'Prendi!',
    bg: 'linear-gradient(135deg, #7b2fff, #b388ff)',
  },
  {
    id: 'sequence',
    items: ['🎎', '🎀', '🌸'],
    title: 'In fila!',
    bg: 'linear-gradient(135deg, #ff2d7b, #ff6eb4)',
  },
  {
    id: 'compare',
    items: ['🐻', '🐰', '🦊'],
    title: 'Di più!',
    bg: 'linear-gradient(135deg, #00b894, #55efc4)',
  },
];

const MathActivities = ({ student, onSelectActivity }) => {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setSpeaking(true);
    const t = setTimeout(() => setSpeaking(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="activities-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Speech bubble ABOVE owl */}
      <div className="activities-header">
        <motion.div
          className="speech-bubble activities-speech"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
        >
          <p className="speech-text">
            Bene <strong>{student.name}</strong>! 🌟
            <br />
            A cosa vuoi giocare?
          </p>
          <div className="speech-bubble-arrow-down" />
        </motion.div>
        <motion.div
          className="activities-owl"
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        >
          <OwlTeacher speaking={speaking} />
        </motion.div>
      </div>

      {/* Activity cards grid */}
      <motion.div
        className="activities-grid"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        {activities.map((act, i) => (
          <motion.button
            key={act.id}
            className="activity-card"
            style={{ '--card-bg': act.bg }}
            onClick={() => onSelectActivity(act.id)}
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              delay: 0.6 + i * 0.12,
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="activity-card-emojis">
              {act.items.map((e, j) => (
                <span
                  key={j}
                  className="activity-card-emoji play-bounce"
                  style={{ animationDelay: `${j * 0.3}s` }}
                >
                  {e}
                </span>
              ))}
            </div>
            <span className="activity-card-title">{act.title}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MathActivities;
