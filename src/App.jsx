import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RobotFace from './components/RobotFace';
import OrbitalMenu from './components/OrbitalMenu';
import ParticleField from './components/ParticleField';
import TypewriterText from './components/TypewriterText';
import MathPage from './components/MathPage';
import './App.css';

function App() {
  const [phase, setPhase] = useState(0);
  const [currentPage, setCurrentPage] = useState(null); // null = home
  const [robotExit, setRobotExit] = useState(null); // exit animation direction

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSubjectClick = useCallback((subject) => {
    // Start robot exit animation
    setRobotExit(subject);
    // After robot flies away, switch page
    setTimeout(() => {
      setCurrentPage(subject);
    }, 800);
  }, []);

  const handleBackHome = useCallback(() => {
    setCurrentPage(null);
    setRobotExit(null);
  }, []);

  const cssParticles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${8 + Math.random() * 12}s`,
      animationDelay: `${Math.random() * 10}s`,
      size: `${1 + Math.random() * 2}px`,
    }));
  }, []);

  const isHome = currentPage === null;

  return (
    <div className="app">
      {/* Canvas particle network — only on home */}
      <AnimatePresence>
        {isHome && phase >= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ position: 'fixed', inset: 0, zIndex: 1 }}
          >
            <ParticleField />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS floating particles — only on home */}
      {isHome && (
        <div className="css-particles">
          {cssParticles.map(p => (
            <div
              key={p.id}
              className="css-particle"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                animationDuration: p.animationDuration,
                animationDelay: p.animationDelay,
              }}
            />
          ))}
        </div>
      )}

      {/* ===== HOME PAGE ===== */}
      <AnimatePresence>
        {isHome && (
          <motion.div
            className="scene"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Orbital Menu */}
            <AnimatePresence>
              {phase >= 4 && !robotExit && (
                <motion.div
                  className="orbital-layer"
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    type: 'spring',
                    stiffness: 60,
                    damping: 18,
                  }}
                >
                  <OrbitalMenu onSubjectClick={handleSubjectClick} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Robot + text */}
            <div className="center-column">
              <AnimatePresence>
                {phase >= 2 && !robotExit && (
                  <motion.div
                    className="robot-container"
                    initial={{ opacity: 0, y: 60, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      y: -600,
                      x: 200,
                      rotate: 720,
                      scale: 0,
                      opacity: 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 100,
                      damping: 15,
                      exit: { duration: 0.7, ease: 'easeIn' },
                    }}
                  >
                    <RobotFace />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {phase >= 3 && !robotExit && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TypewriterText />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SUBJECT PAGES ===== */}
      <AnimatePresence>
        {currentPage === 'math' && (
          <MathPage onBack={handleBackHome} />
        )}
      </AnimatePresence>

      {/* Overlay effects */}
      {isHome && (
        <>
          <div className="scanline" />
          <div className="vignette" />
        </>
      )}
    </div>
  );
}

export default App;
