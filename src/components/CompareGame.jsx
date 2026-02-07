import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OwlTeacher from './OwlTeacher';

const animalEmojis = ['🐻', '🐰', '🦁', '🐸', '🐱', '🐶', '🐼', '🦊'];
const groupColors = ['#ff6b9d', '#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#0984e3'];
const TOTAL_ROUNDS = 5;

function generateRound(roundNum) {
  const emojiA = animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
  let emojiB = emojiA;
  while (emojiB === emojiA) {
    emojiB = animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
  }

  let min, max;
  if (roundNum <= 2) { min = 1; max = 4; }
  else if (roundNum <= 4) { min = 2; max = 6; }
  else { min = 3; max = 8; }

  let countA = min + Math.floor(Math.random() * (max - min + 1));
  let countB;
  do {
    countB = min + Math.floor(Math.random() * (max - min + 1));
  } while (countB === countA);

  const colorA = groupColors[Math.floor(Math.random() * groupColors.length)];
  let colorB = colorA;
  while (colorB === colorA) {
    colorB = groupColors[Math.floor(Math.random() * groupColors.length)];
  }

  return {
    groupA: { emoji: emojiA, count: countA, color: colorA, items: Array(countA).fill(emojiA) },
    groupB: { emoji: emojiB, count: countB, color: colorB, items: Array(countB).fill(emojiB) },
    correctSide: countA > countB ? 'A' : 'B',
  };
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

const CompareGame = ({ student, onBack }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const roundData = useMemo(() => generateRound(round), [round]);

  const handleGroupTap = useCallback((side) => {
    if (feedback) return;
    if (side === roundData.correctSide) {
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
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  }, [feedback, roundData.correctSide, round]);

  if (gameOver) {
    return (
      <div className="game-container game-compare">
        <GameComplete student={student} score={score} onBack={onBack} />
      </div>
    );
  }

  return (
    <motion.div
      className="game-container game-compare"
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
          <p className="speech-text">Chi ha <strong>di più</strong>? 🤔 Tocca il gruppo!</p>
          <div className="speech-bubble-arrow-down" />
        </motion.div>
        <div className="game-owl-mini">
          <OwlTeacher speaking={speaking} />
        </div>
      </div>

      {/* Two groups — CSS bounce on puppets */}
      <div className="compare-groups" key={round}>
        {/* Group A */}
        <motion.button
          className={`compare-group ${feedback === 'correct' && roundData.correctSide === 'A' ? 'winner' : ''} ${feedback === 'wrong' && roundData.correctSide !== 'A' ? 'wrong-shake' : ''}`}
          style={{ '--group-color': roundData.groupA.color }}
          onClick={() => handleGroupTap('A')}
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="compare-group-items">
            {roundData.groupA.items.map((emoji, i) => (
              <span
                key={i}
                className="compare-puppet play-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </motion.button>

        {/* VS */}
        <motion.div
          className="compare-vs"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          VS
        </motion.div>

        {/* Group B */}
        <motion.button
          className={`compare-group ${feedback === 'correct' && roundData.correctSide === 'B' ? 'winner' : ''} ${feedback === 'wrong' && roundData.correctSide !== 'B' ? 'wrong-shake' : ''}`}
          style={{ '--group-color': roundData.groupB.color }}
          onClick={() => handleGroupTap('B')}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="compare-group-items">
            {roundData.groupB.items.map((emoji, i) => (
              <span
                key={i}
                className="compare-puppet play-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </motion.button>
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

export default CompareGame;
