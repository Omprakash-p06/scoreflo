/**
 * Lightweight Animated Background Component
 * CSS-based particles with minimal GPU usage
 * Optimized for mobile and desktop performance
 */
import { useMemo } from 'react';

/**
 * Generate random particles with CSS animations
 * @param {number} count - Number of particles
 * @returns {Array} Particle configuration objects
 */
function generateParticles(count) {
    const particles = [];
    for (let i = 0; i < count; i++) {
        particles.push({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 20,
            duration: 15 + Math.random() * 20,
            size: 2 + Math.random() * 4,
            opacity: 0.1 + Math.random() * 0.3,
        });
    }
    return particles;
}

/**
 * Lightweight CSS-based particle background
 * Uses CSS animations instead of WebGL for better performance
 */
export default function AnimatedBackground({
    particleCount = 30,
    color = '#8a2be2',
}) {
    // Memoize particles to prevent re-generation
    const particles = useMemo(() => generateParticles(particleCount), [particleCount]);

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                zIndex: 0,
                pointerEvents: 'none',
                background: 'radial-gradient(ellipse at 50% 0%, rgba(138, 43, 226, 0.15) 0%, transparent 60%)',
            }}
        >
            {/* CSS Keyframes */}
            <style>
                {`
          @keyframes float-up {
            0% {
              transform: translateY(100vh) translateX(0) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-10vh) translateX(20px) scale(1);
              opacity: 0;
            }
          }
          
          @keyframes glow-pulse {
            0%, 100% {
              box-shadow: 0 0 4px ${color}, 0 0 8px ${color}40;
            }
            50% {
              box-shadow: 0 0 8px ${color}, 0 0 16px ${color}60;
            }
          }
        `}
            </style>

            {/* Particles */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.left}%`,
                        bottom: '-10px',
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        borderRadius: '50%',
                        background: color,
                        opacity: p.opacity,
                        animation: `float-up ${p.duration}s ${p.delay}s infinite linear, glow-pulse 3s ease-in-out infinite`,
                        willChange: 'transform, opacity',
                    }}
                />
            ))}

            {/* Gradient overlay for depth */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 0%, rgba(6, 0, 16, 0.3) 100%)',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
}
