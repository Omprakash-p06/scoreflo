import { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { analyzeFeasibility } from '../utils/sgpaLogic';
import styles from './StatsCard.module.css';

function StudyPlanner({ subjects }) {
    const [examDate, setExamDate] = useState('');
    const [dailyLimit, setDailyLimit] = useState(4);
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        if (subjects.length > 0 && examDate) {
            setAnalysis(analyzeFeasibility(subjects, examDate, dailyLimit));
        }
    }, [subjects, examDate, dailyLimit]);

    return (
        <div className={styles.statsCard} style={{ marginBottom: '20px' }}>
            <div className={styles.header}>
                <h3 className={styles.title}><FaCalendarAlt /> Reality Check</h3>
            </div>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
                <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>
                        Exam Start Date
                    </label>
                    <input
                        type="date"
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '6px',
                            border: '1px solid #333',
                            background: '#1a1a1a',
                            color: 'white'
                        }}
                    />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>
                        Max Study Hours: <b>{dailyLimit}h</b>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="16"
                        value={dailyLimit}
                        onChange={(e) => setDailyLimit(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: '#8a2be2' }}
                    />
                </div>
            </div>
            {analysis && (
                <div style={{
                    backgroundColor: `${analysis.color}20`,
                    border: `1px solid ${analysis.color}`,
                    color: analysis.color,
                    padding: '10px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <strong>{analysis.status}</strong>: {analysis.message}
                </div>
            )}
        </div>
    );
}

export default StudyPlanner;
