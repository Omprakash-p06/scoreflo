/**
 * Fluid Glass Dock Component
 * macOS-style navigation dock with glassmorphism effect
 */
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaGithub, FaCog } from 'react-icons/fa';
import SettingsModal from './SettingsModal';

/**
 * Navigation items configuration
 */
const navItems = [
    {
        path: '/',
        icon: FaHome,
        label: 'Dashboard',
    },
    {
        path: '/planner',
        icon: FaCalendarAlt,
        label: 'Exam HQ',
    },
];

/**
 * Glass Dock Navigation Component
 * Fixed at bottom with fluid glass effect
 */
export default function GlassDock() {
    const location = useLocation();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <>
            <nav
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    // Fluid glass effect
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(24px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(200%)',
                    borderRadius: '20px',
                    padding: '12px 20px',
                    // Glass border
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    // Multi-layer shadow for depth
                    boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 4px 16px rgba(132, 0, 255, 0.2),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 0 rgba(255, 255, 255, 0.05)
          `,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '12px 20px',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                // Active/inactive states
                                background: isActive
                                    ? 'linear-gradient(135deg, rgba(138, 43, 226, 0.4) 0%, rgba(132, 0, 255, 0.3) 100%)'
                                    : 'transparent',
                                boxShadow: isActive
                                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 12px rgba(138, 43, 226, 0.3)'
                                    : 'none',
                                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }
                            }}
                        >
                            <Icon
                                size={22}
                                style={{
                                    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                                    transition: 'all 0.25s ease',
                                    filter: isActive ? 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.8))' : 'none',
                                }}
                            />
                            <span
                                style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    marginTop: '4px',
                                    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                                    letterSpacing: '0.02em',
                                }}
                            >
                                {item.label}
                            </span>
                        </NavLink>
                    );
                })}

                {/* Divider */}
                <div
                    style={{
                        width: '1px',
                        height: '32px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        margin: '0 4px',
                    }}
                />

                {/* Settings button */}
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px',
                        borderRadius: '14px',
                        textDecoration: 'none',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <FaCog
                        size={20}
                        style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            transition: 'all 0.25s ease',
                        }}
                    />
                </button>

                {/* GitHub link */}
                <a
                    href="https://github.com/Omprakash-p06"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px',
                        borderRadius: '14px',
                        textDecoration: 'none',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <FaGithub
                        size={20}
                        style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            transition: 'all 0.25s ease',
                        }}
                    />
                </a>
            </nav>

            {/* Settings Modal */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
}
