import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OwlTeacher from './OwlTeacher';

const ageGroups = [3, 4, 5, 6, 7, 8];
const ageColors = ['#ff6b35', '#ff2d7b', '#7b2fff', '#00f0ff', '#00ff88', '#ffaa00'];

const getDifficultyLabel = (age) => {
  if (age <= 4) return 'Piccoli Esploratori';
  if (age <= 6) return 'Giovani Matematici';
  return 'Super Matematici';
};

const SpeechBubble = ({ children }) => (
  <motion.div
    className="speech-bubble"
    initial={{ opacity: 0, scale: 0.8, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.8, y: -10 }}
    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
  >
    {children}
    <div className="speech-bubble-arrow" />
  </motion.div>
);

const MathOnboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  // step 0: greeting + ask name
  // step 1: ask age
  // step 2: confirmation + go
  const [name, setName] = useState('');
  const [age, setAge] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  // Simulate speaking animation
  useEffect(() => {
    setSpeaking(true);
    const t = setTimeout(() => setSpeaking(false), 1500);
    return () => clearTimeout(t);
  }, [step]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length > 0) {
      setStep(1);
    }
  };

  const handleAgeSelect = (selectedAge) => {
    setAge(selectedAge);
    setStep(2);
  };

  const handleStart = () => {
    onComplete({ name: name.trim(), age, difficulty: getDifficultyLabel(age) });
  };

  return (
    <motion.div
      className="onboarding"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="onboarding-scene">
        {/* Owl Teacher */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        >
          <OwlTeacher speaking={speaking} />
        </motion.div>

        {/* Speech bubble + interactive area */}
        <div className="onboarding-dialogue">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <SpeechBubble key="step0">
                <p className="speech-text">
                  Ciao! Sono il <strong>Prof. Gufo</strong>! 🦉
                  <br />
                  Come ti chiami?
                </p>
              </SpeechBubble>
            )}

            {step === 1 && (
              <SpeechBubble key="step1">
                <p className="speech-text">
                  Che bel nome, <strong>{name}</strong>! 🌟
                  <br />
                  Quanti anni hai?
                </p>
              </SpeechBubble>
            )}

            {step === 2 && (
              <SpeechBubble key="step2">
                <p className="speech-text">
                  Fantastico <strong>{name}</strong>! Hai <strong>{age} anni</strong>! 🎉
                  <br />
                  Sei un <strong>{getDifficultyLabel(age)}</strong>!
                  <br />
                  Pronto a divertirti con i numeri?
                </p>
              </SpeechBubble>
            )}
          </AnimatePresence>

          {/* Input areas */}
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.form
                key="input-name"
                className="onboarding-input-area"
                onSubmit={handleNameSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
              >
                <input
                  type="text"
                  className="onboarding-text-input"
                  placeholder="Scrivi il tuo nome..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  maxLength={20}
                />
                <motion.button
                  type="submit"
                  className="onboarding-submit-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={name.trim().length === 0}
                >
                  Ecco! 👋
                </motion.button>
              </motion.form>
            )}

            {step === 1 && (
              <motion.div
                key="input-age"
                className="onboarding-age-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
              >
                {ageGroups.map((a, i) => (
                  <motion.button
                    key={a}
                    className="age-btn"
                    style={{ '--age-color': ageColors[i] }}
                    onClick={() => handleAgeSelect(a)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.08, type: 'spring', stiffness: 250 }}
                  >
                    {a}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="input-start"
                className="onboarding-input-area"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  className="onboarding-start-btn"
                  onClick={handleStart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Iniziamo! 🚀
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default MathOnboarding;
