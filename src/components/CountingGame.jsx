import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OwlTeacher from './OwlTeacher';

const toyEmojis = ['🧸', '🚗', '🪀', '🎠', '🎲', '🧩', '🪁', '🎯', '🏎️', '🎪'];
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
  let min, max;
  if (roundNum <= 2) { min = 2; max = 4; }
  else if (roundNum <= 4) { min = 3; max = 6; }
  else { min = 5; max = 8; }

  const count = min + Math.floor(Math.random() * (max - min + 1));
  const toys = [];
  for (let i = 0; i < count; i++) {
    toys.push({
      id: i,
      emoji: toyEmojis[Math.floor(Math.random() * toyEmojis.length)],
      x: 12 + Math.random() * 76,
      y: 8 + Math.random() * 65,
      rotation: -15 + Math.random() * 30,
      bounceDelay: (i * 0.25).toFixed(2),
    });
  }

  const choices = new Set([count]);
  while (choices.size < 3) {
    let wrong = count + (Math.random() > 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 2));
    if (wrong < 1) wrong = count + 2;
    if (wrong > 10) wrong = count - 2;
    choices.add(wrong);
  }

  return { count, toys, choices: shuffleArray([...choices]) };
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

const CountingGame = ({ student, onBack }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [tappedToys, setTappedToys] = useState(new Set());

  const roundData = useMemo(() => generateRound(round), [round]);

  const handleToyTap = useCallback((id) => {
    setTappedToys(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleAnswer = useCallback((num) => {
    if (feedback) return;
    if (num === roundData.count) {
      setFeedback('correct');
      setScore(s => s + 1);
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), 1200);
      setTimeout(() => {
        if (round >= TOTAL_ROUNDS) {
          setGameOver(true);
        } else {
          setRound(r => r + 1);
          setFeedback(null);
          setTappedToys(new Set());
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  }, [feedback, roundData.count, round]);

  if (gameOver) {
    return (
      <div className="game-container game-counting">
        <GameComplete student={student} score={score} onBack={onBack} />
      </div>
    );
  }

  return (
    <motion.div
      className="game-container game-counting"
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
          <p className="speech-text">Quanti giocattoli ci sono? 🧸</p>
          <div className="speech-bubble-arrow-down" />
        </motion.div>
        <div className="game-owl-mini">
          <OwlTeacher speaking={speaking} />
        </div>
      </div>

      {/* Toy field — CSS bounce, no framer-motion infinite */}
      <div className="counting-field" key={round}>
        {roundData.toys.map((toy) => (
          <motion.button
            key={`${round}-${toy.id}`}
            className={`counting-toy play-bounce ${tappedToys.has(toy.id) ? 'tapped' : ''}`}
            style={{
              left: `${toy.x}%`,
              top: `${toy.y}%`,
              animationDelay: `${toy.bounceDelay}s`,
            }}
            initial={{ scale: 0, rotate: toy.rotation }}
            animate={{ scale: 1, rotate: toy.rotation }}
            transition={{ delay: toy.id * 0.08, type: 'spring', stiffness: 300, damping: 15 }}
            whileTap={{ scale: 1.3 }}
            onClick={() => handleToyTap(toy.id)}
          >
            <span className="counting-toy-emoji">{toy.emoji}</span>
            {tappedToys.has(toy.id) && (
              <motion.span
                className="counting-toy-check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                ✓
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Answer buttons */}
      <div className="counting-answers">
        {roundData.choices.map((num, i) => (
          <motion.button
            key={`${round}-${num}`}
            className={`counting-answer-btn ${feedback === 'correct' && num === roundData.count ? 'correct' : ''}`}
            onClick={() => handleAnswer(num)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 250 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
          >
            {num}
          </motion.button>
        ))}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback === 'correct' && (
          <motion.div className="game-feedback" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, opacity: 0 }}>🎉</motion.div>
        )}
        {feedback === 'wrong' && (
          <motion.div className="game-feedback" initial={{ scale: 0 }} animate={{ scale: 1, x: [0, -10, 10, -10, 0] }} exit={{ scale: 0, opacity: 0 }}>🤔</motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CountingGame;
