import React, { useState, useMemo, useCallback, useRef } from 'react';
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
  const count = Math.min(3 + Math.floor((roundNum - 1) / 2), 5);
  const numbers = Array.from({ length: count }, (_, i) => i + 1);
  const shuffled = shuffleArray(numbers);

  const items = shuffled.map((num) => ({
    id: `${roundNum}-${num}`,
    number: num,
    emoji: dollEmojis[(num - 1) % dollEmojis.length],
    color: dollColors[(num - 1) % dollColors.length],
  }));

  return { count, items, correctOrder: numbers };
}

const GameComplete = ({ student, score, onBack }) => {
  const stars = score >= 4 ? 3 : score >= 2 ? 2 : 1;
  return (
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
      <p className="game-complete-text">
        Bravo <strong>{student.name}</strong>! 🎉<br />
        Hai fatto {score} su {TOTAL_ROUNDS}!
      </p>
      <motion.button
        className="game-back-btn"
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🏠 Torna ai giochi
      </motion.button>
    </motion.div>
  );
};

const SequenceGame = ({ student, onBack }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [wrongId, setWrongId] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timeoutsRef = useRef([]);

  const roundData = useMemo(() => generateRound(round), [round]);

  const handleItemTap = useCallback((item) => {
    if (transitioning) return;

    const nextExpected = placed.length + 1;

    if (item.number === nextExpected) {
      const newPlaced = [...placed, item.number];
      setPlaced(newPlaced);
      setWrongId(null);

      if (newPlaced.length === roundData.count) {
        setTransitioning(true);
        setScore(s => s + 1);
        setSpeaking(true);

        const t1 = setTimeout(() => setSpeaking(false), 1200);
        const t2 = setTimeout(() => {
          if (round >= TOTAL_ROUNDS) {
            setGameOver(true);
          } else {
            setRound(r => r + 1);
            setPlaced([]);
            setTransitioning(false);
          }
        }, 1500);

        timeoutsRef.current = [t1, t2];
      }
    } else {
      setWrongId(item.id);
      const t = setTimeout(() => setWrongId(null), 600);
      timeoutsRef.current = [t];
    }
  }, [placed, roundData.count, round, transitioning]);

  if (gameOver) {
    return (
      <div className="game-container game-sequence">
        <GameComplete student={student} score={score} onBack={onBack} />
      </div>
    );
  }

  return (
    <motion.div
      className="game-container game-sequence"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="game-header">
        <button className="game-exit-btn" onClick={onBack}>←</button>
        <div className="game-progress">
          {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
            <div key={i} className={`game-progress-dot ${i < round - 1 ? 'done' : ''} ${i === round - 1 ? 'current' : ''}`} />
          ))}
        </div>
        <div className="game-score">⭐ {score}</div>
      </div>

      {/* Speech above owl */}
      <div className="game-owl-section">
        <motion.div
          className="speech-bubble game-speech"
          key={round}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="speech-text">Metti in fila! 🎎 Tocca 1, poi 2, poi 3...</p>
          <div className="speech-bubble-arrow-down" />
        </motion.div>
        <div className="game-owl-mini">
          <OwlTeacher speaking={speaking} />
        </div>
      </div>

      {/* Target slots */}
      <div className="sequence-slots" key={`slots-${round}`}>
        {roundData.correctOrder.map((num) => {
          const isPlaced = placed.includes(num);
          const item = roundData.items.find(it => it.number === num);
          return (
            <div
              key={`${round}-slot-${num}`}
              className={`sequence-slot ${isPlaced ? 'filled' : ''}`}
              style={{ '--slot-color': item.color }}
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
            </div>
          );
        })}
      </div>

      {/* Tappable items — no AnimatePresence mode="wait", no layout */}
      <div className="sequence-items" key={`items-${round}`}>
        {roundData.items.map((item, i) => {
          const isPlaced = placed.includes(item.number);
          if (isPlaced) return null;
          return (
            <motion.button
              key={item.id}
              className={`sequence-item play-bounce ${wrongId === item.id ? 'wrong-shake' : ''}`}
              style={{ '--item-color': item.color, animationDelay: `${i * 0.25}s` }}
              onClick={() => handleItemTap(item)}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 250 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sequence-item-emoji">{item.emoji}</span>
              <span className="sequence-item-num">{item.number}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {transitioning && (
          <motion.div className="game-feedback" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, opacity: 0 }}>🎉</motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SequenceGame;
