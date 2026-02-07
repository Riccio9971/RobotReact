import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RobotFace from './components/RobotFace';
import OrbitalMenu from './components/OrbitalMenu';
import ParticleField from './components/ParticleField';
import TypewriterText from './components/TypewriterText';
import './App.css';

function App() {
  const [phase, setPhase] = useState(0);
  // phase 0: darkness
  // phase 1: particles appear
  // phase 2: robot appears
  // phase 3: text types
  // phase 4: orbital menu appears

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3500),
    ];
    return () => timers.forEach(clearTimeout);
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

  return (
    <div className="app">
      {/* Canvas particle network */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            style={{ position: 'fixed', inset: 0, zIndex: 1 }}
          >
            <ParticleField />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS floating particles */}
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

      {/* Main content */}
      <div className="content-wrapper">
        {/* Robot Face */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              className="robot-container"
              initial={{ opacity: 0, y: 60, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
                duration: 1.2,
              }}
            >
              <RobotFace />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome text */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <TypewriterText />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orbital Menu */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 80,
                damping: 20,
                duration: 1.5,
              }}
            >
              <OrbitalMenu />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay effects */}
      <div className="scanline" />
      <div className="vignette" />
    </div>
  );
}

export default App;
