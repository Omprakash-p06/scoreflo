import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarCheck, FaClock, FaBook, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { generateStudySchedule } from '../utils/schedulerLogic';
import { analyzeFeasibility } from '../utils/sgpaLogic';
import AnimatedBackground from '../components/AnimatedBackground';
import styles from '../App.module.css';

export default function ExamPlanner() {
    const [subjects, setSubjects] = useState([]);
    const [examDate, setExamDate] = useState('');
    const [gapDays, setGapDays] = useState(2);
    const [dailyHours, setDailyHours] = useState(6);
    const [plan, setPlan] = useState(null);
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('sgpa_subjects');
        if (saved) {
            try {
                setSubjects(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse saved subjects:', e);
            }
        }
    }, []);

    // Calculate days until exam
    const getDaysUntilExam = () => {
        if (!examDate) return 0;
        const today = new Date();
        const exam = new Date(examDate);
        today.setHours(0, 0, 0, 0);
        exam.setHours(0, 0, 0, 0);
        return Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
    };

    // Calculate total exam duration based on subjects and gap
    const getTotalExamDuration = () => {
        if (subjects.length === 0) return 0;
        return subjects.length + (subjects.length - 1) * gapDays;
    };

    // Update analysis when inputs change
    useEffect(() => {
        if (subjects.length > 0 && examDate) {
            setAnalysis(analyzeFeasibility(subjects, examDate, dailyHours));
        }
    }, [subjects, examDate, dailyHours]);

    const handleGenerate = () => {
        const daysLeft = getDaysUntilExam();
        const result = generateStudySchedule(subjects, daysLeft, dailyHours);
        setPlan(result);
    };

    const daysLeft = getDaysUntilExam();
    const totalExamDays = getTotalExamDuration();

    return (
        <div className={styles.layout}>
            <AnimatedBackground particleCount={25} color="#8a2be2" />

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px', position: 'relative', zIndex: 2 }}>
                <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                    <Link to="/" className="btn secondary">
                        <FaArrowLeft /> Back to Dashboard
                    </Link>
                    <div>
                        <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', color: '#fff' }}>
                            <FaCalendarCheck style={{ color: '#8a2be2' }} /> Exam HQ
                        </h1>
                        <p style={{ margin: '5px 0 0', color: '#888' }}>Smart Study Scheduler</p>
                    </div>
                </header>

                {subjects.length === 0 ? (
                    <div className={styles.card} style={{ textAlign: 'center', padding: '40px' }}>
                        <FaBook style={{ fontSize: '3rem', color: '#8a2be2', marginBottom: '15px' }} />
                        <h3 style={{ color: '#fff' }}>No Subjects Found</h3>
                        <p style={{ color: '#888' }}>Add subjects on the Dashboard first, then come back here.</p>
                        <Link to="/" className="btn" style={{ marginTop: '15px' }}>
                            Go to Dashboard
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Reality Check Section */}
                        <div className={styles.card} style={{ marginBottom: '20px' }}>
                            <h3 style={{ color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaCalendarAlt style={{ color: '#8a2be2' }} /> Reality Check
                            </h3>
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
                                <div style={{ flex: 1, minWidth: '180px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '8px' }}>
                                        First Exam Date
                                    </label>
                                    <input
                                        type="date"
                                        value={examDate}
                                        onChange={(e) => setExamDate(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #333',
                                            background: '#1a1a1a',
                                            color: 'white',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '8px' }}>
                                        Gap Between Exams
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input
                                            type="number"
                                            value={gapDays}
                                            onChange={(e) => setGapDays(Math.max(0, Math.min(10, Number(e.target.value))))}
                                            min="0"
                                            max="10"
                                            style={{
                                                width: '80px',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: '1px solid #333',
                                                background: '#1a1a1a',
                                                color: 'white',
                                                fontSize: '1rem',
                                                textAlign: 'center'
                                            }}
                                        />
                                        <span style={{ color: '#888' }}>days</span>
                                    </div>
                                </div>
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '8px' }}>
                                        Max Study Hours: <b style={{ color: '#8a2be2' }}>{dailyHours}h</b>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="16"
                                        value={dailyHours}
                                        onChange={(e) => setDailyHours(parseInt(e.target.value))}
                                        style={{ width: '100%', accentColor: '#8a2be2', marginTop: '8px' }}
                                    />
                                </div>
                            </div>

                            {/* Stats Row */}
                            {examDate && (
                                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1, minWidth: '120px', padding: '12px', background: 'rgba(138, 43, 226, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8a2be2' }}>{daysLeft}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Days Left</div>
                                    </div>
                                    <div style={{ flex: 1, minWidth: '120px', padding: '12px', background: 'rgba(138, 43, 226, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8a2be2' }}>{subjects.length}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Subjects</div>
                                    </div>
                                    <div style={{ flex: 1, minWidth: '120px', padding: '12px', background: 'rgba(138, 43, 226, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8a2be2' }}>{totalExamDays}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Exam Duration</div>
                                    </div>
                                    <div style={{ flex: 1, minWidth: '120px', padding: '12px', background: 'rgba(138, 43, 226, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8a2be2' }}>{daysLeft * dailyHours}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Total Hours</div>
                                    </div>
                                </div>
                            )}

                            {/* Feasibility Status */}
                            {analysis && (
                                <div style={{
                                    backgroundColor: `${analysis.color}20`,
                                    border: `1px solid ${analysis.color}`,
                                    color: analysis.color,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    fontSize: '1rem'
                                }}>
                                    <strong>{analysis.status}</strong>: {analysis.message}
                                </div>
                            )}
                        </div>

                        {/* Generate Button */}
                        <div className={styles.card}>
                            <button
                                onClick={handleGenerate}
                                className="btn"
                                disabled={!examDate || daysLeft <= 0}
                                style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}
                            >
                                <FaChartLine /> Generate Optimized Strategy
                            </button>
                            {!examDate && (
                                <p style={{ color: '#888', textAlign: 'center', marginTop: '10px', marginBottom: 0 }}>
                                    Select an exam date to generate your study plan
                                </p>
                            )}
                        </div>

                        {plan && (
                            <div style={{ marginTop: '30px' }}>
                                <h2 style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FaBook style={{ color: '#8a2be2' }} /> Strategic Roadmap
                                </h2>
                                <p style={{ color: '#888', marginBottom: '20px' }}>
                                    Total Budget: <strong style={{ color: '#8a2be2' }}>{plan.totalAvailableHours} Hours</strong>
                                </p>

                                <div style={{ display: 'grid', gap: '15px' }}>
                                    {plan.schedule.map((item, index) => (
                                        <div
                                            key={item.id || index}
                                            className={styles.card}
                                            style={{
                                                borderLeft: `5px solid ${item.color}`,
                                                transition: 'transform 0.2s ease',
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                                <h3 style={{ margin: 0, color: '#fff' }}>{item.name}</h3>
                                                <span style={{
                                                    fontSize: '1.4em',
                                                    fontWeight: 'bold',
                                                    color: item.color,
                                                    background: `${item.color}20`,
                                                    padding: '5px 15px',
                                                    borderRadius: '20px'
                                                }}>
                                                    {item.hoursPerDay} hrs/day
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.9em', color: '#666', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                                <span>📚 Total: <strong style={{ color: '#aaa' }}>{item.allocatedHours} hours</strong></span>
                                                <span>⭐ Credits: <strong style={{ color: '#aaa' }}>{item.credits}</strong></span>
                                                <span>📊 Internals: <strong style={{ color: '#aaa' }}>{item.internalMarks}/50</strong></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
