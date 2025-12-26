import { FaInfoCircle } from 'react-icons/fa';
import MagicCard from './MagicCard';
import styles from './GradeInfoCard.module.css';

function GradeInfoCard() {
    const grades = [
        { grade: 'O', range: '90-100', className: 'O' },
        { grade: 'A+', range: '80-89', className: 'Aplus' },
        { grade: 'A', range: '70-79', className: 'A' },
        { grade: 'B+', range: '60-69', className: 'Bplus' },
        { grade: 'B', range: '50-59', className: 'B' },
        { grade: 'C', range: '45-49', className: 'C' },
        { grade: 'P', range: '40-44', className: 'P' },
        { grade: 'F', range: '<40', className: 'F' }
    ];

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
                Grade System Info
            </h3>

            <div className={styles.gradeChips}>
                {grades.map(({ grade, range, className }) => (
                    <div key={grade} className="grade-chip">
                        <span className="chip-label">{grade}</span>
                        <span className={`chip-grade ${className}`}>{range}</span>
                    </div>
                ))}
            </div>

            <div className={styles.formula}>
                <strong>SGPA Formula:</strong>
                <span>SGPA = 10 − Σ[(0.05 × credits) × n]</span>
                <span className={styles.note}>
                    n is based on grade (O:0, A+:1, A:2, B+:3, B:4, C:5, P:6, F:10)
                </span>
            </div>
        </MagicCard>
    );
}

export default GradeInfoCard;
