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
            if (grade.point === 0) {
                // For fail grade, show "<{passing threshold}"
                // Find the lowest passing grade's minMarks
                const passingGrades = system.gradeScale.filter(g => g.point > 0 && g.minMarks !== undefined);
                const lowestPassing = passingGrades.reduce((min, g) => g.minMarks < min.minMarks ? g : min, passingGrades[0]);
                range = `<${lowestPassing?.minMarks || 40}`;
            } else {
                range = `${grade.minMarks}-${grade.maxMarks}`;
            }
        } else {
            range = `${grade.point} pts`;
        }

        // Map grade letter to CSS class
        // Handle special characters: + becomes "plus", - becomes "minus", * becomes "star"
        let className = grade.letter
            .replace(/\+/g, 'plus')
            .replace(/-/g, 'minus')
            .replace(/\*/g, 'star')
            .replace(/[^a-zA-Z]/g, '');

        // Map to standard color classes based on grade point
        // This ensures all grading systems get proper colors
        let colorClass = '';
        if (grade.point >= 10) colorClass = 'O';
        else if (grade.point >= 9) colorClass = 'Aplus';
        else if (grade.point >= 8) colorClass = 'A';
        else if (grade.point >= 7) colorClass = 'Bplus';
        else if (grade.point >= 6) colorClass = 'B';
        else if (grade.point >= 5) colorClass = 'C';
        else if (grade.point >= 4) colorClass = 'P';
        else colorClass = 'F';

        return {
            grade: grade.letter,
            range,
            point: grade.point,
            className: className || 'default',
            colorClass,
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
                {grades.map(({ grade, range, colorClass }) => (
                    <div key={grade} className="grade-chip">
                        <span className="chip-label">{grade}</span>
                        <span className={`chip-grade ${colorClass}`}>
                            {range}
                        </span>
                    </div>
                ))}
            </div>

            <div className={styles.formula}>
                <strong>SGPA Formula:</strong>
                <span>SGPA = Σ(Credits × Grade Points) / Σ(Credits)</span>
                {system.percentageFormula && system.percentageFormula !== 'none' && (
                    <span className={styles.note}>
                        Percentage (approx): {getFormulaText()}
                    </span>
                )}
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
