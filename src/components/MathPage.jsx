import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const floatingNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '+', '-', '×', '÷', '='];
const colors = ['#ff6b35', '#ff2d7b', '#7b2fff', '#00f0ff', '#00ff88', '#ffaa00', '#ff4757', '#2ed573'];

const MathPage = ({ onBack }) => {
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

      {/* Back button */}
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

      {/* Main content */}
      <div className="math-content">
        <motion.div
          className="math-hero-emoji"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 0.2 }}
        >
          🔢
        </motion.div>

        <motion.h1
          className="math-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Matematica
        </motion.h1>

        <motion.p
          className="math-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Impariamo i numeri giocando!
        </motion.p>

        {/* Number grid */}
        <motion.div
          className="math-number-grid"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, i) => (
            <motion.button
              key={num}
              className="math-number-btn"
              style={{
                '--btn-color': colors[i % colors.length],
              }}
              whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.9 + i * 0.08,
                type: 'spring',
                stiffness: 250,
                damping: 15,
              }}
            >
              {num}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MathPage;
