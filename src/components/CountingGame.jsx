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
  // Gradually increase: rounds 1-2 → 2-4 toys, rounds 3-4 → 3-6, round 5 → 5-8
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
      x: 15 + Math.random() * 70,
      y: 10 + Math.random() * 60,
      rotation: -15 + Math.random() * 30,
      delay: i * 0.1,
    });
  }

  // Generate 3 choices: correct + 2 wrong (unique, 1-10 range)
  const choices = new Set([count]);
  while (choices.size < 3) {
    let wrong = count + (Math.random() > 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 2));
    if (wrong < 1) wrong = count + 2;
    if (wrong > 10) wrong = count - 2;
    choices.add(wrong);
  }

  return { count, toys, choices: shuffleArray([...choices]) };
}

const CountingGame = ({ student, onBack }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
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
    const stars = score >= 4 ? 3 : score >= 2 ? 2 : 1;
    return (
      <motion.div
        className="game-container game-counting"
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
      className="game-container game-counting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header: score + round */}
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

      {/* Owl asks */}
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
          <p className="speech-text">Quanti giocattoli ci sono? 🧸</p>
          <div className="speech-bubble-arrow arrow-left" />
        </motion.div>
      </div>

      {/* Toy field */}
      <AnimatePresence mode="wait">
        <motion.div
          className="counting-field"
          key={round}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {roundData.toys.map((toy) => (
            <motion.button
              key={toy.id}
              className={`counting-toy ${tappedToys.has(toy.id) ? 'tapped' : ''}`}
              style={{ left: `${toy.x}%`, top: `${toy.y}%` }}
              initial={{ scale: 0, rotate: toy.rotation }}
              animate={{
                scale: 1,
                rotate: toy.rotation,
                y: [0, -6, 0],
              }}
              transition={{
                scale: { delay: toy.delay, type: 'spring', stiffness: 300, damping: 15 },
                y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: toy.delay },
              }}
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
        </motion.div>
      </AnimatePresence>

      {/* Answer buttons */}
      <div className="counting-answers">
        {roundData.choices.map((num, i) => (
          <motion.button
            key={`${round}-${num}`}
            className={`counting-answer-btn ${
              feedback === 'correct' && num === roundData.count ? 'correct' : ''
            } ${feedback === 'wrong' && num !== roundData.count ? '' : ''}`}
            onClick={() => handleAnswer(num)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 250 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {num}
          </motion.button>
        ))}
      </div>

      {/* Feedback overlay */}
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
        {feedback === 'wrong' && (
          <motion.div
            className="game-feedback wrong"
            initial={{ scale: 0 }}
            animate={{ scale: 1, x: [0, -10, 10, -10, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            🤔
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CountingGame;
