import React from 'react';
import { motion } from 'framer-motion';

const menuItems = [
  {
    id: 'math',
    label: 'Matematica',
    emoji: '🔢',
    color: '#ff6b35',
  },
  {
    id: 'italian',
    label: 'Italiano',
    emoji: '📖',
    color: '#7b2fff',
  },
  {
    id: 'science',
    label: 'Scienze',
    emoji: '🔬',
    color: '#00ff88',
  },
  {
    id: 'english',
    label: 'Inglese',
    emoji: '🇬🇧',
    color: '#00f0ff',
  },
  {
    id: 'art',
    label: 'Arte',
    emoji: '🎨',
    color: '#ff2d7b',
  },
  {
    id: 'music',
    label: 'Musica',
    emoji: '🎵',
    color: '#ffaa00',
  },
];

const OrbitalMenu = ({ onSubjectClick }) => {
  const itemCount = menuItems.length;

  return (
    <div className="orbital-wrapper">
      {/* Decorative orbital rings — only outer + mid */}
      <div className="orbital-ring" />
      <div className="orbital-ring" />

      {/* Orbit path with items on outermost ring */}
      <div className="orbit-path">
        {menuItems.map((item, index) => {
          const angleDeg = (360 / itemCount) * index;
          const angleRad = (angleDeg * Math.PI) / 180;
          const radius = 48;
          const left = 50 + Math.sin(angleRad) * radius;
          const top = 50 - Math.cos(angleRad) * radius;

          return (
            <motion.div
              key={item.id}
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
              onClick={() => onSubjectClick?.(item.id)}
            >
              <div className="orbit-item-inner">
                <div className="orbit-item-content">
                  <div className="orbit-item-emoji">{item.emoji}</div>
                  <span className="orbit-item-label" style={{ color: item.color }}>
                    {item.label}
                  </span>
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
