/**
 * Calculation Breakdown Panel
 * Shows step-by-step SGPA calculation with credits
 */
import { useState } from 'react';
import { FaCalculator, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getCurrentSystem, sgpaToPercentage } from '../utils/gradingSystems';
import { getPointFromGrade } from '../utils/sgpaLogic';

/**
 * CalculationPanel Component
 * Displays detailed SGPA calculation breakdown
 */
export default function CalculationPanel({ subjects, sgpa }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const system = getCurrentSystem();

    // Calculate breakdown for each subject
    const subjectsWithGrades = subjects.filter((s) => s.desiredGrade);
    const totalCredits = subjectsWithGrades.reduce((sum, s) => sum + s.credits, 0);
    const totalPoints = subjectsWithGrades.reduce((sum, s) => {
        const point = getPointFromGrade(s.desiredGrade);
        return sum + s.credits * point;
    }, 0);

    if (subjectsWithGrades.length === 0) return null;

    return (
        <div
            style={{
                marginTop: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
            }}
        >
            {/* Toggle Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.15) 0%, rgba(132, 0, 255, 0.1) 100%)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#fff',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                }}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaCalculator style={{ color: '#8a2be2' }} />
                    Show Calculation
                </span>
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {/* Calculation Content */}
            {isExpanded && (
                <div style={{ padding: '16px 18px' }}>
                    {/* Step 1: Credits × Grade Points */}
                    <div
                        style={{
                            marginBottom: '16px',
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '0.75rem',
                                color: 'rgba(255, 255, 255, 0.5)',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}
                        >
                            Step 1: Credits × Grade Points
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {subjectsWithGrades.map((subj) => {
                                const point = getPointFromGrade(subj.desiredGrade);
                                const contribution = subj.credits * point;
                                return (
                                    <div
                                        key={subj.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '0.9rem',
                                            padding: '6px 10px',
                                            background: 'rgba(138, 43, 226, 0.08)',
                                            borderRadius: '6px',
                                        }}
                                    >
                                        <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                            {subj.name} ({subj.desiredGrade})
                                        </span>
                                        <span style={{ color: '#8a2be2', fontFamily: 'monospace' }}>
                                            {subj.credits} × {point} = <strong>{contribution}</strong>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Sum */}
                    <div
                        style={{
                            marginBottom: '16px',
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '0.75rem',
                                color: 'rgba(255, 255, 255, 0.5)',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}
                        >
                            Step 2: Sum of (Credits × Grade Points)
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '1rem',
                                fontFamily: 'monospace',
                            }}
                        >
                            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {subjectsWithGrades.map((s) => s.credits * getPointFromGrade(s.desiredGrade)).join(' + ')}
                            </span>
                            <span style={{ color: '#8a2be2' }}>=</span>
                            <strong style={{ color: '#00ff88', fontSize: '1.1rem' }}>{totalPoints}</strong>
                        </div>
                    </div>

                    {/* Step 3: Total Credits */}
                    <div
                        style={{
                            marginBottom: '16px',
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '0.75rem',
                                color: 'rgba(255, 255, 255, 0.5)',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}
                        >
                            Step 3: Total Credits
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '1rem',
                                fontFamily: 'monospace',
                            }}
                        >
                            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {subjectsWithGrades.map((s) => s.credits).join(' + ')}
                            </span>
                            <span style={{ color: '#8a2be2' }}>=</span>
                            <strong style={{ color: '#00ff88', fontSize: '1.1rem' }}>{totalCredits}</strong>
                        </div>
                    </div>

                    {/* Final SGPA Calculation */}
                    <div
                        style={{
                            padding: '14px',
                            background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(132, 0, 255, 0.15) 100%)',
                            borderRadius: '12px',
                            border: '1px solid rgba(138, 43, 226, 0.3)',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '0.75rem',
                                color: 'rgba(255, 255, 255, 0.5)',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}
                        >
                            Final SGPA
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                fontSize: '1.1rem',
                                fontFamily: 'monospace',
                            }}
                        >
                            <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                {totalPoints} ÷ {totalCredits}
                            </span>
                            <span style={{ color: '#8a2be2', fontSize: '1.2rem' }}>=</span>
                            <strong
                                style={{
                                    color: '#00ff88',
                                    fontSize: '1.5rem',
                                    textShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
                                }}
                            >
                                {sgpa.toFixed(2)}
                            </strong>
                        </div>

                        {/* Percentage */}
                        {system.percentageFormula && system.percentageFormula !== 'none' && (
                            <div
                                style={{
                                    marginTop: '12px',
                                    paddingTop: '12px',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                    textAlign: 'center',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '0.9rem',
                                }}
                            >
                                ≈ <strong style={{ color: '#fff' }}>{sgpaToPercentage(sgpa)}%</strong> (approx)
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
