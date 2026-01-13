/**
 * Grade Info Card Component
 * Dynamically displays grade scale based on selected grading system
 */
import { FaInfoCircle, FaCog } from 'react-icons/fa';
import MagicCard from './MagicCard';
import styles from './GradeInfoCard.module.css';
import { getCurrentSystem } from '../utils/gradingSystems';

function GradeInfoCard() {
    const system = getCurrentSystem();

    // Build grades array from current system
    const grades = system.gradeScale.map((grade) => {
        let range = '';
        if (grade.minMarks !== undefined && grade.maxMarks !== undefined) {
            if (grade.minMarks === 0) {
                range = `<${system.gradeScale.find(g => g.point > 0 && g.minMarks !== undefined)?.minMarks || 40}`;
            } else {
                range = `${grade.minMarks}-${grade.maxMarks}`;
            }
        } else {
            range = `${grade.point} pts`;
        }

        // Create className from letter (remove special chars)
        const className = grade.letter.replace(/[^a-zA-Z]/g, '') || 'default';

        return {
            grade: grade.letter,
            range,
            point: grade.point,
            className,
        };
    });

    // Get percentage formula description
    const getFormulaText = () => {
        switch (system.percentageFormula) {
            case 'vtu':
                return '(SGPA − 0.75) × 10';
            case 'direct':
                return 'SGPA × 10';
            case 'conservative':
                return 'SGPA × 9.5';
            default:
                return 'SGPA × 10';
        }
    };

    return (
        <MagicCard
            className={styles.card}
            enableTilt={true}
            enableMagnetism={true}
            enableParticles={false}
            clickEffect={true}
        >
            <h3 className={styles.title}>
                <FaInfoCircle />
                Grade System: {system.shortName || system.name}
            </h3>

            <div className={styles.gradeChips}>
                {grades.map(({ grade, range, point, className }) => (
                    <div key={grade} className="grade-chip">
                        <span className="chip-label">{grade}</span>
                        <span
                            className={`chip-grade ${className}`}
                            style={{
                                background: point === 0
                                    ? 'var(--grade-f)'
                                    : point >= 9
                                        ? 'var(--grade-o)'
                                        : point >= 7
                                            ? 'var(--grade-a)'
                                            : 'var(--grade-b)'
                            }}
                        >
                            {range}
                        </span>
                    </div>
                ))}
            </div>

            <div className={styles.formula}>
                <strong>SGPA Formula:</strong>
                <span>SGPA = Σ(Credits × Grade Points) / Σ(Credits)</span>
                <span className={styles.note}>
                    Percentage: {getFormulaText()}
                </span>
            </div>

            <div
                className={styles.systemBadge}
                style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: 'rgba(138, 43, 226, 0.15)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                <FaCog style={{ color: '#8a2be2' }} />
                <span>Change grading system in Settings (⚙️ in dock)</span>
            </div>
        </MagicCard>
    );
}

export default GradeInfoCard;
