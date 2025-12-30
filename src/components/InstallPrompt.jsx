/**
 * PWA Install Prompt Component
 * Custom app-side install banner with liquid glass effect
 * Auto-updates when online and works offline
 */
import { useState, useEffect, useCallback } from 'react';
import { FaDownload, FaTimes, FaMobileAlt, FaSync } from 'react-icons/fa';

/**
 * Hook to manage PWA install prompt
 * Captures the beforeinstallprompt event for app-triggered installation
 * @returns {Object} Install state and handlers
 */
function useInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode)
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;

        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        // Capture the install prompt event (app-side trigger)
        const handleBeforeInstall = (event) => {
            // Prevent browser's default mini-infobar
            event.preventDefault();
            // Store the event for later use
            setDeferredPrompt(event);
            setIsInstallable(true);
        };

        // Listen for successful app installation
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    // Trigger app installation from our custom UI
    const installApp = useCallback(async () => {
        if (!deferredPrompt) {
            return false;
        }

        try {
            // Show native install prompt
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                setIsInstallable(false);
                setDeferredPrompt(null);
                return true;
            }
        } catch (error) {
            console.error('Install failed:', error);
        }
        return false;
    }, [deferredPrompt]);

    return { isInstallable, isInstalled, installApp };
}

/**
 * Liquid Glass Install Banner Component
 * Shows only when app is installable (not from browser, from app)
 */
export default function InstallPrompt() {
    const { isInstallable, isInstalled, installApp } = useInstallPrompt();
    const [isDismissed, setIsDismissed] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Online/Offline detection
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Listen for service worker updates
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (
                                newWorker.state === 'installed' &&
                                navigator.serviceWorker.controller
                            ) {
                                setUpdateAvailable(true);
                            }
                        });
                    }
                });
            });

            // Auto-check for updates when coming online
            const checkForUpdates = () => {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.update();
                });
            };

            window.addEventListener('online', checkForUpdates);
            return () => window.removeEventListener('online', checkForUpdates);
        }
    }, []);

    // Apply update by reloading
    const applyUpdate = useCallback(() => {
        setIsAnimating(true);
        setTimeout(() => {
            window.location.reload();
        }, 300);
    }, []);

    // Handle install button click
    const handleInstall = async () => {
        setIsAnimating(true);
        const success = await installApp();
        setIsAnimating(false);
        if (success) {
            setIsDismissed(true);
        }
    };

    // Handle dismiss with animation
    const handleDismiss = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsDismissed(true);
        }, 300);
    };

    // Don't render if installed, dismissed, or not installable
    if (isInstalled || (isDismissed && !updateAvailable) || (!isInstallable && !updateAvailable)) {
        return null;
    }

    // Liquid glass styles
    const glassStyles = {
        container: {
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: `translateX(-50%) ${isAnimating ? 'scale(0.95) translateY(10px)' : 'scale(1) translateY(0)'}`,
            opacity: isAnimating ? 0 : 1,
            // Liquid glass effect
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(24px) saturate(200%)',
            WebkitBackdropFilter: 'blur(24px) saturate(200%)',
            borderRadius: '20px',
            padding: '18px 24px',
            // Glass border with gradient
            border: '1px solid rgba(255, 255, 255, 0.15)',
            // Multi-layer shadow for depth
            boxShadow: `
        0 8px 32px rgba(132, 0, 255, 0.25),
        0 4px 16px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
        inset 0 -1px 0 0 rgba(255, 255, 255, 0.05)
      `,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            maxWidth: 'calc(100% - 32px)',
            width: 'auto',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        iconContainer: {
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.3) 0%, rgba(132, 0, 255, 0.2) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        },
        textContainer: {
            flex: 1,
            minWidth: 0,
        },
        title: {
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            margin: 0,
            letterSpacing: '-0.01em',
        },
        subtitle: {
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.85rem',
            margin: '4px 0 0 0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        installButton: {
            background: 'linear-gradient(135deg, #8a2be2 0%, #6b00cc 100%)',
            color: '#fff',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(138, 43, 226, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
        },
        closeButton: {
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
        },
        offlineBadge: {
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: 'linear-gradient(135deg, #ffaa00 0%, #ff8800 100%)',
            color: '#000',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(255, 170, 0, 0.4)',
        },
    };

    return (
        <div style={glassStyles.container}>
            {/* Update Available State */}
            {updateAvailable ? (
                <>
                    <div style={{ ...glassStyles.iconContainer, background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.3) 0%, rgba(0, 200, 100, 0.2) 100%)' }}>
                        <FaSync size={20} color="#00ff88" />
                    </div>
                    <div style={glassStyles.textContainer}>
                        <p style={glassStyles.title}>Update Available</p>
                        <p style={glassStyles.subtitle}>Refresh to get the latest features</p>
                    </div>
                    <button
                        onClick={applyUpdate}
                        style={{ ...glassStyles.installButton, background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)', color: '#003322' }}
                    >
                        <FaSync /> Refresh
                    </button>
                </>
            ) : (
                <>
                    {/* Install Prompt State */}
                    <div style={glassStyles.iconContainer}>
                        <FaMobileAlt size={22} color="#a64dff" />
                    </div>
                    <div style={glassStyles.textContainer}>
                        <p style={glassStyles.title}>Install ScoreFlo</p>
                        <p style={glassStyles.subtitle}>Add to home screen for quick access</p>
                    </div>
                    <button
                        onClick={handleInstall}
                        style={glassStyles.installButton}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(138, 43, 226, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(138, 43, 226, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                        }}
                    >
                        <FaDownload /> Install
                    </button>
                    <button
                        onClick={handleDismiss}
                        style={glassStyles.closeButton}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                        }}
                    >
                        <FaTimes size={14} />
                    </button>
                </>
            )}

            {/* Offline indicator badge */}
            {!isOnline && (
                <div style={glassStyles.offlineBadge}>
                    Offline
                </div>
            )}
        </div>
    );
}
