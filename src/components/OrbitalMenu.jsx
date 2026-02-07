import React from 'react';
import { motion } from 'framer-motion';

const menuItems = [
  {
    label: 'Dashboard',
    color: '#00f0ff',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Chat',
    color: '#7b2fff',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7b2fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
  },
  {
    label: 'Progetti',
    color: '#ff2d7b',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#ff2d7b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    label: 'Analisi',
    color: '#00ff88',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    color: '#ffaa00',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#ffaa00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    label: 'Profilo',
    color: '#ff6b35',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

const OrbitalMenu = () => {
  const itemCount = menuItems.length;

  return (
    <div className="orbital-wrapper">
      {/* Decorative orbital rings */}
      <div className="orbital-ring" />
      <div className="orbital-ring" />
      <div className="orbital-ring" />

      {/* Orbit path with items */}
      <div className="orbit-path">
        {menuItems.map((item, index) => {
          const angleDeg = (360 / itemCount) * index;
          const angleRad = (angleDeg * Math.PI) / 180;
          // Position items on circular path using percentage of parent
          const radius = 42; // percent
          const left = 50 + Math.sin(angleRad) * radius;
          const top = 50 - Math.cos(angleRad) * radius;

          return (
            <motion.div
              key={item.label}
              className="orbit-item"
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
              whileHover={{ scale: 1.2, zIndex: 100 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.1,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              <div className="orbit-item-inner">
                <div className="orbit-item-content">
                  <div className="orbit-item-icon" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <span className="orbit-item-label">{item.label}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OrbitalMenu;
