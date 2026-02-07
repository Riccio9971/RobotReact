import { useRef, useEffect, useCallback } from 'react';

const PARTICLE_COUNT = 100;
const CONNECTION_DISTANCE = 130;
const MOUSE_RADIUS = 150;

const ParticleField = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null });
  const animFrameRef = useRef(null);

  const initParticles = useCallback((width, height) => {
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        hue: Math.random() > 0.8 ? 270 : 185, // mostly cyan, some purple
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
      particlesRef.current = initParticles(window.innerWidth, window.innerHeight);
    };

    const handleMouse = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Mouse repulsion
        if (mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            p.x += dx * force * 0.015;
            p.y += dy * force * 0.015;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.hue === 185
            ? `rgba(0, 240, 255, ${p.opacity})`
            : `rgba(123, 47, 255, ${p.opacity})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = 0.08 * (1 - dist / CONNECTION_DISTANCE);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Mouse connections
      if (mouse.x !== null) {
        for (let i = 0; i < particles.length; i++) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MOUSE_RADIUS) {
            const alpha = 0.12 * (1 - dist / MOUSE_RADIUS);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('mouseleave', handleMouseLeave);

    resize();
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ParticleField;
