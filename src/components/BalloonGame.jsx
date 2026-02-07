import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OwlTeacher from './OwlTeacher';

const ballEmojis = ['⚽', '🏀', '🔴', '🟡', '🟢', '🔵', '🟣', '🟠', '⚾', '🎾'];
const TOTAL_ROUNDS = 5;

function generateRound(roundNum) {
  let min, max;
  if (roundNum <= 2) { min = 1; max = 3; }
  else if (roundNum <= 4) { min = 3; max = 5; }
  else { min = 4; max = 7; }
  const target = min + Math.floor(Math.random() * (max - min + 1));
  const totalBalls = target + 2 + Math.floor(Math.random() * 3);

  const balls = [];
  for (let i = 0; i < totalBalls; i++) {
    balls.push({
      id: i,
      emoji: ballEmojis[Math.floor(Math.random() * ballEmojis.length)],
      bounceDelay: (i * 0.2).toFixed(2),
    });
  }

  return { target, balls };
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
    return (
      <div className="game-container game-balloons">
        <GameComplete student={student} score={score} onBack={onBack} />
      </div>
    );
  }

  return (
    <motion.div
      className="game-container game-balloons"
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
          <p className="speech-text">
            Prendi <strong className="target-number">{roundData.target}</strong> palloni! ⚽
          </p>
          <div className="speech-bubble-arrow-down" />
        </motion.div>
        <div className="game-owl-mini">
          <OwlTeacher speaking={speaking} />
        </div>
      </div>

      {/* Ball grid — CSS bounce */}
      <div className="balloon-grid" key={round}>
        {roundData.balls.map((ball) => (
          <motion.button
            key={`${round}-${ball.id}`}
            className={`balloon-ball play-bounce ${selected.has(ball.id) ? 'selected' : ''}`}
            style={{ animationDelay: `${ball.bounceDelay}s` }}
            onClick={() => handleBallTap(ball.id)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: ball.id * 0.06, type: 'spring', stiffness: 300 }}
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
      </div>

      {/* Counter + check */}
      <div className="balloon-footer">
        <div className="balloon-counter">
          <span className="balloon-counter-current">{selected.size}</span>
          <span className="balloon-counter-sep">/</span>
          <span className="balloon-counter-target">{roundData.target}</span>
        </div>
        <motion.button
          className={`balloon-check-btn ${selected.size === roundData.target ? 'ready' : ''}`}
          onClick={handleCheck}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✓ Fatto!
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

export default BalloonGame;
