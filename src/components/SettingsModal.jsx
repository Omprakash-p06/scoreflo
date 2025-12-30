/**
 * Settings Modal Component
 * Allows users to select their grading system
 */
import { useState, useEffect } from 'react';
import { FaTimes, FaCog, FaUniversity, FaCheck } from 'react-icons/fa';
import {
    GRADING_SYSTEMS,
    getSystemsByCategory,
    getCurrentSystem,
    setCurrentSystem,
} from '../utils/gradingSystems';

/**
 * Settings Modal with grading system selection
 */
export default function SettingsModal({ isOpen, onClose }) {
    const [selectedSystem, setSelectedSystem] = useState(getCurrentSystem().id);
    const [showGradeTable, setShowGradeTable] = useState(true);

    // Update selected system when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedSystem(getCurrentSystem().id);
        }
    }, [isOpen]);

    // Handle system change
    const handleSystemChange = (systemId) => {
        setSelectedSystem(systemId);
    };

    // Save settings
    const handleSave = () => {
        setCurrentSystem(selectedSystem);
        onClose();
        // Reload to apply changes
        window.location.reload();
    };

    if (!isOpen) return null;

    const systemsByCategory = getSystemsByCategory();
    const currentPreset = GRADING_SYSTEMS[selectedSystem];

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(6, 0, 16, 0.85)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '20px',
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                style={{
                    background: 'rgba(10, 0, 20, 0.9)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: '600px',
                    maxHeight: '85vh',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: `
            0 24px 48px rgba(0, 0, 0, 0.5),
            0 0 100px rgba(132, 0, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15)
          `,
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '20px 24px',
                        background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.3) 0%, rgba(132, 0, 255, 0.2) 100%)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <h2 style={{ margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FaCog /> Settings
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: '#fff',
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(85vh - 160px)' }}>
                    {/* Grading System Selection */}
                    <div style={{ marginBottom: '24px' }}>
                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#fff',
                                fontWeight: 600,
                                marginBottom: '12px',
                            }}
                        >
                            <FaUniversity /> Select Grading System
                        </label>

                        {/* Category Groups */}
                        {Object.entries(systemsByCategory).map(([category, systems]) => (
                            <div key={category} style={{ marginBottom: '16px' }}>
                                <div
                                    style={{
                                        fontSize: '0.8rem',
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        marginBottom: '8px',
                                    }}
                                >
                                    {category}
                                </div>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    {systems.map((system) => (
                                        <button
                                            key={system.id}
                                            onClick={() => handleSystemChange(system.id)}
                                            style={{
                                                background:
                                                    selectedSystem === system.id
                                                        ? 'linear-gradient(135deg, rgba(138, 43, 226, 0.4) 0%, rgba(132, 0, 255, 0.3) 100%)'
                                                        : 'rgba(255, 255, 255, 0.05)',
                                                border:
                                                    selectedSystem === system.id
                                                        ? '1px solid rgba(138, 43, 226, 0.5)'
                                                        : '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '12px',
                                                padding: '12px 16px',
                                                color: '#fff',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                transition: 'all 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedSystem !== system.id) {
                                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedSystem !== system.id) {
                                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                                }
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{system.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                                                    {system.gradeScale[0].letter} ({system.gradeScale[0].point}) → {system.passingGrade} ({system.passingPoint})
                                                </div>
                                            </div>
                                            {selectedSystem === system.id && (
                                                <FaCheck style={{ color: '#00ff88' }} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Grade Table Preview */}
                    {currentPreset && (
                        <div>
                            <button
                                onClick={() => setShowGradeTable(!showGradeTable)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#8a2be2',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    padding: '8px 0',
                                    marginBottom: '12px',
                                }}
                            >
                                {showGradeTable ? '▼' : '▶'} Grade Scale Preview
                            </button>

                            {showGradeTable && (
                                <div
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                    }}
                                >
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                <th style={{ padding: '8px', textAlign: 'left', color: 'rgba(255, 255, 255, 0.7)' }}>Grade</th>
                                                <th style={{ padding: '8px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>Points</th>
                                                {currentPreset.gradeScale[0].minMarks !== undefined && (
                                                    <th style={{ padding: '8px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>Marks</th>
                                                )}
                                                <th style={{ padding: '8px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.7)' }}>Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentPreset.gradeScale.map((grade, index) => (
                                                <tr
                                                    key={grade.letter}
                                                    style={{
                                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                                        background: grade.point === 0 ? 'rgba(255, 68, 102, 0.1)' : 'transparent',
                                                    }}
                                                >
                                                    <td style={{ padding: '10px 8px', color: '#fff', fontWeight: 600 }}>{grade.letter}</td>
                                                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#8a2be2', fontWeight: 600 }}>{grade.point}</td>
                                                    {grade.minMarks !== undefined && (
                                                        <td style={{ padding: '10px 8px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
                                                            {grade.minMarks}-{grade.maxMarks}
                                                        </td>
                                                    )}
                                                    <td style={{ padding: '10px 8px', textAlign: 'right', color: 'rgba(255, 255, 255, 0.6)' }}>{grade.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Percentage Formula */}
                                    <div
                                        style={{
                                            marginTop: '16px',
                                            padding: '12px',
                                            background: 'rgba(138, 43, 226, 0.1)',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        <strong style={{ color: '#8a2be2' }}>Percentage Formula: </strong>
                                        <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                            {currentPreset.percentageFormula === 'vtu' && '(SGPA - 0.75) × 10'}
                                            {currentPreset.percentageFormula === 'direct' && 'SGPA × 10'}
                                            {currentPreset.percentageFormula === 'conservative' && 'SGPA × 9.5'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    style={{
                        padding: '16px 24px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '12px',
                    }}
                >
                    <button
                        onClick={onClose}
                        className="btn secondary"
                        style={{ padding: '10px 20px' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn"
                        style={{ padding: '10px 24px' }}
                    >
                        Save & Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
