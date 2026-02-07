import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OwlTeacher from './OwlTeacher';

const dollEmojis = ['🎎', '👧', '💃', '🧝‍♀️', '🧚', '🎀', '👸', '🌸'];
const dollColors = ['#ff6b9d', '#c471ed', '#f7797d', '#fbc2eb', '#a18cd1', '#e8a0bf', '#ff9a9e', '#fad0c4'];
const TOTAL_ROUNDS = 5;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRound(roundNum) {
  // Start with 3 items, increase to 5
  const count = Math.min(3 + Math.floor((roundNum - 1) / 2), 5);

  // Create ordered numbers 1..count
  const numbers = Array.from({ length: count }, (_, i) => i + 1);

  // Shuffled version for display
  const shuffled = shuffleArray(numbers);

  // Pick random emoji + color for each
  const items = shuffled.map((num, i) => ({
    id: `${roundNum}-${num}`,
    number: num,
    emoji: dollEmojis[(num - 1) % dollEmojis.length],
    color: dollColors[(num - 1) % dollColors.length],
  }));

  return { count, items, correctOrder: numbers };
}

const SequenceGame = ({ student, onBack }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [placed, setPlaced] = useState([]); // numbers placed in order
  const [feedback, setFeedback] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const roundData = useMemo(() => generateRound(round), [round]);

  const nextExpected = placed.length + 1;

  const handleItemTap = useCallback((item) => {
    if (feedback === 'correct') return;

    if (item.number === nextExpected) {
      const newPlaced = [...placed, item.number];
      setPlaced(newPlaced);
      setWrongId(null);

      // Check if round complete
      if (newPlaced.length === roundData.count) {
        setFeedback('correct');
        setScore(s => s + 1);
        setSpeaking(true);
        setTimeout(() => setSpeaking(false), 1200);
        setTimeout(() => {
          if (round >= TOTAL_ROUNDS) {
            setGameOver(true);
          } else {
            setRound(r => r + 1);
            setPlaced([]);
            setFeedback(null);
          }
        }, 1500);
      }
    } else {
      // Wrong tap — shake
      setWrongId(item.id);
      setFeedback('wrong');
      setTimeout(() => {
        setWrongId(null);
        setFeedback(null);
      }, 600);
    }
  }, [feedback, nextExpected, placed, roundData.count, round]);

  if (gameOver) {
    const stars = score >= 4 ? 3 : score >= 2 ? 2 : 1;
    return (
      <motion.div
        className="game-container game-sequence"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="game-complete"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 12 }}
        >
          <OwlTeacher speaking={true} />
          <div className="game-complete-stars">
            {[1, 2, 3].map(s => (
              <motion.span
                key={s}
                className={`game-star ${s <= stars ? 'earned' : ''}`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + s * 0.2, type: 'spring', stiffness: 200 }}
              >
                {s <= stars ? '⭐' : '☆'}
              </motion.span>
            ))}
          </div>
          <motion.p
            className="game-complete-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            Bravo <strong>{student.name}</strong>! 🎉
            <br />
            Hai fatto {score} su {TOTAL_ROUNDS}!
          </motion.p>
          <motion.button
            className="game-back-btn"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            🏠 Torna ai giochi
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="game-container game-sequence"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="game-header">
        <motion.button
          className="game-exit-btn"
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ←
        </motion.button>
        <div className="game-progress">
          {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
            <div
              key={i}
              className={`game-progress-dot ${i < round - 1 ? 'done' : ''} ${i === round - 1 ? 'current' : ''}`}
            />
          ))}
        </div>
        <div className="game-score">⭐ {score}</div>
      </div>

      {/* Owl instruction */}
      <div className="game-owl-bar">
        <div className="game-owl-mini">
          <OwlTeacher speaking={speaking} />
        </div>
        <motion.div
          className="speech-bubble game-speech-mini"
          key={round}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          <p className="speech-text">Metti in fila le bambole! 🎎<br />Tocca 1, poi 2, poi 3...</p>
          <div className="speech-bubble-arrow arrow-left" />
        </motion.div>
      </div>

      {/* Placed slots at top */}
      <div className="sequence-slots">
        {roundData.correctOrder.map((num) => {
          const isPlaced = placed.includes(num);
          const item = roundData.items.find(it => it.number === num);
          return (
            <motion.div
              key={num}
              className={`sequence-slot ${isPlaced ? 'filled' : ''}`}
              style={{ '--slot-color': item.color }}
              layout
            >
              {isPlaced ? (
                <motion.div
                  className="sequence-slot-content"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <span className="sequence-slot-emoji">{item.emoji}</span>
                  <span className="sequence-slot-num">{num}</span>
                </motion.div>
              ) : (
                <span className="sequence-slot-placeholder">{num}</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Shuffled items to tap */}
      <AnimatePresence mode="wait">
        <motion.div
          className="sequence-items"
          key={round}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {roundData.items.map((item, i) => {
            const isPlaced = placed.includes(item.number);
            if (isPlaced) return null;
            return (
              <motion.button
                key={item.id}
                className={`sequence-item ${wrongId === item.id ? 'wrong-shake' : ''}`}
                style={{ '--item-color': item.color }}
                onClick={() => handleItemTap(item)}
                initial={{ scale: 0, y: 30 }}
                animate={{
                  scale: 1,
                  y: [0, -5, 0],
                }}
                transition={{
                  scale: { delay: i * 0.1, type: 'spring', stiffness: 250 },
                  y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                layout
              >
                <span className="sequence-item-emoji">{item.emoji}</span>
                <span className="sequence-item-num">{item.number}</span>
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {feedback === 'correct' && (
          <motion.div
            className="game-feedback correct"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            🎉
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SequenceGame;
