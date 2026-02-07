import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OwlTeacher from './OwlTeacher';

const ballEmojis = ['⚽', '🏀', '🔴', '🟡', '🟢', '🔵', '🟣', '🟠', '⚾', '🎾'];
const TOTAL_ROUNDS = 5;

function generateRound(roundNum) {
  // Target: how many balls the child must select
  let min, max;
  if (roundNum <= 2) { min = 1; max = 3; }
  else if (roundNum <= 4) { min = 3; max = 5; }
  else { min = 4; max = 7; }
  const target = min + Math.floor(Math.random() * (max - min + 1));

  // Total balls shown (always more than target)
  const totalBalls = target + 2 + Math.floor(Math.random() * 3);

  const balls = [];
  for (let i = 0; i < totalBalls; i++) {
    balls.push({
      id: i,
      emoji: ballEmojis[Math.floor(Math.random() * ballEmojis.length)],
      delay: i * 0.08,
      bounceDelay: Math.random() * 2,
    });
  }

  return { target, balls };
}

const BalloonGame = ({ student, onBack }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [feedback, setFeedback] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const roundData = useMemo(() => generateRound(round), [round]);

  const handleBallTap = useCallback((id) => {
    if (feedback) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, [feedback]);

  const handleCheck = useCallback(() => {
    if (feedback) return;

    if (selected.size === roundData.target) {
      setFeedback('correct');
      setScore(s => s + 1);
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), 1200);
      setTimeout(() => {
        if (round >= TOTAL_ROUNDS) {
          setGameOver(true);
        } else {
          setRound(r => r + 1);
          setSelected(new Set());
          setFeedback(null);
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  }, [feedback, selected.size, roundData.target, round]);

  if (gameOver) {
    const stars = score >= 4 ? 3 : score >= 2 ? 2 : 1;
    return (
      <motion.div
        className="game-container game-balloons"
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
      className="game-container game-balloons"
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

      {/* Owl + target number */}
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
          <p className="speech-text">
            Prendi <strong className="target-number">{roundData.target}</strong> palloni! ⚽
          </p>
          <div className="speech-bubble-arrow arrow-left" />
        </motion.div>
      </div>

      {/* Ball grid */}
      <AnimatePresence mode="wait">
        <motion.div
          className="balloon-grid"
          key={round}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {roundData.balls.map((ball) => (
            <motion.button
              key={ball.id}
              className={`balloon-ball ${selected.has(ball.id) ? 'selected' : ''}`}
              onClick={() => handleBallTap(ball.id)}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                y: [0, -8, 0],
              }}
              transition={{
                scale: { delay: ball.delay, type: 'spring', stiffness: 300 },
                y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: ball.bounceDelay },
              }}
              whileTap={{ scale: 1.2 }}
            >
              <span className="balloon-emoji">{ball.emoji}</span>
              {selected.has(ball.id) && (
                <motion.span
                  className="balloon-check"
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

      {/* Selected count + check button */}
      <div className="balloon-footer">
        <div className="balloon-counter">
          <span className="balloon-counter-current">{selected.size}</span>
          <span className="balloon-counter-sep">/</span>
          <span className="balloon-counter-target">{roundData.target}</span>
        </div>
        <motion.button
          className="balloon-check-btn"
          onClick={handleCheck}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            backgroundColor: selected.size === roundData.target ? '#00ff88' : '#ddd',
          }}
        >
          ✓ Fatto!
        </motion.button>
      </div>

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

export default BalloonGame;
