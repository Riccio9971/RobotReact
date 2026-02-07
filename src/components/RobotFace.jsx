import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RobotFace = () => {
  const [blinking, setBlinking] = useState(false);

  // Blink every 3-5 seconds
  useEffect(() => {
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    };

    const interval = setInterval(() => {
      blink();
    }, 3000 + Math.random() * 2000);

    // Initial blink after appearing
    const initBlink = setTimeout(blink, 800);

    return () => {
      clearInterval(interval);
      clearTimeout(initBlink);
    };
  }, []);

  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        width="160"
        height="160"
        viewBox="-20 -50 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 30px rgba(0, 240, 255, 0.15))' }}
      >
        <defs>
          {/* Head gradient */}
          <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="50%" stopColor="#16162a" />
            <stop offset="100%" stopColor="#0f0f1e" />
          </linearGradient>

          {/* Eye glow */}
          <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Antenna glow */}
          <filter id="antennaGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Body shadow */}
          <filter id="bodyShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>

          {/* Chrome-like highlight */}
          <linearGradient id="chromeHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
          </linearGradient>

          {/* Ear gradient */}
          <linearGradient id="earGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1e38" />
            <stop offset="100%" stopColor="#12122a" />
          </linearGradient>
        </defs>

        {/* Glow beneath robot */}
        <ellipse cx="100" cy="175" rx="60" ry="8" fill="rgba(0, 240, 255, 0.06)" filter="url(#bodyShadow)" />

        {/* Antenna */}
        <line x1="100" y1="-5" x2="100" y2="-35" stroke="#2a2a4a" strokeWidth="3" strokeLinecap="round" />
        <motion.circle
          cx="100"
          cy="-40"
          r="7"
          fill="#7b2fff"
          filter="url(#antennaGlow)"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Ears / Side panels */}
        <rect x="-15" y="50" width="18" height="50" rx="6" fill="url(#earGrad)" stroke="#2a2a4a" strokeWidth="1" />
        <rect x="197" y="50" width="18" height="50" rx="6" fill="url(#earGrad)" stroke="#2a2a4a" strokeWidth="1" />
        {/* Ear LED indicators */}
        <motion.circle
          cx="-6" cy="65" r="2"
          fill="#00f0ff"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="-6" cy="75" r="2"
          fill="#7b2fff"
          animate={{ opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="-6" cy="85" r="2"
          fill="#ff2d7b"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="206" cy="65" r="2"
          fill="#00f0ff"
          animate={{ opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="206" cy="75" r="2"
          fill="#7b2fff"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="206" cy="85" r="2"
          fill="#ff2d7b"
          animate={{ opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Head */}
        <rect x="5" y="0" width="190" height="150" rx="35" fill="url(#headGrad)" stroke="#2a2a4a" strokeWidth="1.5" />
        {/* Chrome highlight overlay */}
        <rect x="5" y="0" width="190" height="150" rx="35" fill="url(#chromeHighlight)" />

        {/* Forehead decoration line */}
        <line x1="50" y1="25" x2="150" y2="25" stroke="rgba(0, 240, 255, 0.1)" strokeWidth="1" strokeLinecap="round" />

        {/* Eye sockets */}
        <rect x="25" y="45" width="60" height="45" rx="14" fill="#080818" />
        <rect x="115" y="45" width="60" height="45" rx="14" fill="#080818" />

        {/* Eyes */}
        <motion.g
          animate={blinking ? { scaleY: 0.1, originY: '67px' } : { scaleY: 1, originY: '67px' }}
          transition={{ duration: 0.08 }}
        >
          {/* Left eye */}
          <ellipse cx="55" cy="67" rx="20" ry="15" fill="#00f0ff" filter="url(#eyeGlow)" opacity="0.9" />
          <ellipse cx="55" cy="67" rx="14" ry="10" fill="#00d4e0" />
          <ellipse cx="55" cy="67" rx="7" ry="7" fill="#ffffff" opacity="0.9" />
          <ellipse cx="50" cy="62" rx="3" ry="2" fill="#ffffff" opacity="0.6" />

          {/* Right eye */}
          <ellipse cx="145" cy="67" rx="20" ry="15" fill="#00f0ff" filter="url(#eyeGlow)" opacity="0.9" />
          <ellipse cx="145" cy="67" rx="14" ry="10" fill="#00d4e0" />
          <ellipse cx="145" cy="67" rx="7" ry="7" fill="#ffffff" opacity="0.9" />
          <ellipse cx="140" cy="62" rx="3" ry="2" fill="#ffffff" opacity="0.6" />
        </motion.g>

        {/* Nose dot */}
        <circle cx="100" cy="100" r="3" fill="#2a2a4a" />

        {/* Mouth - friendly smile */}
        <motion.path
          d="M 60 118 Q 80 140 100 140 Q 120 140 140 118"
          stroke="#00f0ff"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          filter="url(#eyeGlow)"
          opacity="0.7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
        />
        {/* Smile fill glow */}
        <path
          d="M 60 118 Q 80 140 100 140 Q 120 140 140 118"
          stroke="none"
          fill="rgba(0, 240, 255, 0.03)"
        />

        {/* Chin decoration */}
        <circle cx="80" cy="140" r="1.5" fill="rgba(0, 240, 255, 0.2)" />
        <circle cx="100" cy="144" r="1.5" fill="rgba(0, 240, 255, 0.3)" />
        <circle cx="120" cy="140" r="1.5" fill="rgba(0, 240, 255, 0.2)" />

        {/* Circuit pattern decorations */}
        <g opacity="0.1" stroke="#00f0ff" strokeWidth="0.5" fill="none">
          <path d="M 30 30 L 40 30 L 40 35" />
          <path d="M 160 30 L 170 30 L 170 35" />
          <circle cx="40" cy="37" r="1.5" fill="#00f0ff" />
          <circle cx="170" cy="37" r="1.5" fill="#00f0ff" />
          <path d="M 25 130 L 35 130 L 35 125" />
          <path d="M 175 130 L 165 130 L 165 125" />
        </g>
      </svg>
    </motion.div>
  );
};

export default RobotFace;
