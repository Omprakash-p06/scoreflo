import { useState, useMemo } from 'react';
import {
    FaBullseye,
    FaCalculator,
    FaStar,
    FaLightbulb,
    FaTasks,
    FaEquals,
    FaArrowLeft,
    FaArrowRight
} from 'react-icons/fa';
import {
    calculateSGPAFromGrades,
    calculateSGPAFromSEE,
    getRequiredSEE,
    suggestGradeCombinations,
    gradeMinMarks,
    nToGrade,
    calculateTotal
} from '../utils/sgpaLogic';
import styles from './StatsCard.module.css';

function StatsCard({ subjects, onUpdate }) {
    const [activeTab, setActiveTab] = useState('planner');
    const [desiredSGPA, setDesiredSGPA] = useState('8.0');
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const [showMarksResults, setShowMarksResults] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // SEE Simulator state
    const [seeMarks, setSeeMarks] = useState({});

    const handleSEEChange = (subjectId, value) => {
        const subject = subjects.find(s => s.id === subjectId);
        const maxSee = subject?.credits === 1 ? 50 : 100;
        let v = parseInt(value) || 0;
        if (v < 0) v = 0;
        if (v > maxSee) v = maxSee;
        setSeeMarks(prev => ({ ...prev, [subjectId]: v }));
    };

    // Calculate required SEE marks
    const requiredMarksData = useMemo(() => {
        return subjects.map(subj => {
            if (!subj.desiredGrade) {
                return { subject: subj, required: null };
            }
            const result = getRequiredSEE(subj.internalMarks, subj.credits, subj.desiredGrade);
            return {
                subject: subj,
                required: result.requiredSEE,
                maxSEE: result.maxSEE,
                achievable: result.achievable,
                minMarks: gradeMinMarks[subj.desiredGrade]
            };
        });
    }, [subjects]);

    // Grade suggestions
    const suggestions = useMemo(() => {
        const target = parseFloat(desiredSGPA);
        if (isNaN(target) || subjects.length === 0) return [];
        return suggestGradeCombinations(subjects, target);
    }, [subjects, desiredSGPA]);

    // SGPA from desired grades
    const { sgpa: sgpaFromGrades, breakdown } = useMemo(() => {
        return calculateSGPAFromGrades(subjects);
    }, [subjects]);

    // SGPA from SEE simulation
    const sgpaFromSEE = useMemo(() => {
        const subjectsWithSEE = subjects.map(s => ({
            ...s,
            seeMarks: seeMarks[s.id] ?? 0
        }));
        return calculateSGPAFromSEE(subjectsWithSEE);
    }, [subjects, seeMarks]);

    const handleShowMarks = () => {
        setShowMarksResults(true);
        setShowSuggestions(false);
    };

    const handleSuggestGrades = () => {
        setSuggestionIndex(0);
        setShowSuggestions(true);
        setShowMarksResults(false);
    };

    if (subjects.length === 0) {
        return null;
    }

    return (
        <div className={styles.statsCard}>
            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'planner' ? 'active' : ''}`}
                    onClick={() => setActiveTab('planner')}
                >
                    <FaBullseye />
                    Grade Planner
                </button>
                <button
                    className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
                    onClick={() => setActiveTab('simulator')}
                >
                    <FaCalculator />
                    SEE Simulator
                </button>
            </div>

            {activeTab === 'planner' && (
                <div className={styles.tabContent}>
                    <div className={styles.controls}>
                        <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
                            <label htmlFor="desiredSGPA">Desired SGPA</label>
                            <input
                                id="desiredSGPA"
                                type="number"
                                min="0"
                                max="10"
                                step="0.01"
                                value={desiredSGPA}
                                onChange={(e) => setDesiredSGPA(e.target.value)}
                                placeholder="e.g., 8.5"
                            />
                        </div>
                        <div className={styles.buttonGroup}>
                            <button className="btn secondary small" onClick={handleSuggestGrades}>
                                <FaLightbulb />
                                Suggest Grades
                            </button>
                            <button className="btn secondary small" onClick={handleShowMarks}>
                                <FaTasks />
                                Required SEE
                            </button>
                        </div>
                    </div>

                    {/* SGPA from Desired Grades */}
                    {breakdown.length > 0 && (
                        <div className={styles.sgpaResult}>
                            <div className={styles.sgpaHeader}>
                                <FaStar />
                                <span>SGPA with Desired Grades:</span>
                                <strong>{sgpaFromGrades.toFixed(2)}</strong>
                            </div>
                            <div className={styles.breakdown}>
                                {breakdown.map((item, idx) => (
                                    <span key={idx} className={styles.breakdownItem}>
                                        {item.name}: {item.grade} (−{item.deduction.toFixed(2)})
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Suggestions */}
                    {showSuggestions && (
                        <div className={styles.suggestions}>
                            {suggestions.length === 0 ? (
                                <div className={styles.noResults}>
                                    No valid grade combinations found for SGPA {desiredSGPA}. Try a different value.
                                </div>
                            ) : (
                                <>
                                    <div className={styles.suggestionHeader}>
                                        <FaLightbulb />
                                        Grade Combination for SGPA {desiredSGPA}
                                    </div>
                                    <div className={styles.gradeChips}>
                                        {suggestions[suggestionIndex]?.map((grade, idx) => {
                                            const gradeClass = grade.replace('+', 'plus');
                                            return (
                                                <div key={idx} className="grade-chip">
                                                    <span className="chip-label">{subjects[idx]?.name}:</span>
                                                    <span className={`chip-grade ${gradeClass}`}>{grade}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {suggestions.length > 1 && (
                                        <div className={styles.pagination}>
                                            <button
                                                className="btn secondary small"
                                                onClick={() => setSuggestionIndex(prev =>
                                                    (prev - 1 + suggestions.length) % suggestions.length
                                                )}
                                            >
                                                <FaArrowLeft />
                                                Previous
                                            </button>
                                            <span>
                                                {suggestionIndex + 1} of {suggestions.length}
                                            </span>
                                            <button
                                                className="btn secondary small"
                                                onClick={() => setSuggestionIndex(prev =>
                                                    (prev + 1) % suggestions.length
                                                )}
                                            >
                                                Next
                                                <FaArrowRight />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Required SEE Marks */}
                    {showMarksResults && (
                        <div className={styles.marksResults}>
                            <table className={styles.marksTable}>
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Target Grade</th>
                                        <th>Min Total</th>
                                        <th>Required SEE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requiredMarksData.map(({ subject, required, maxSEE, achievable, minMarks }) => (
                                        <tr key={subject.id}>
                                            <td>{subject.name}</td>
                                            <td>{subject.desiredGrade || '-'}</td>
                                            <td>{minMarks ?? '-'}</td>
                                            <td>
                                                {required !== null ? (
                                                    <span className={achievable ? '' : styles.notAchievable}>
                                                        {required}/{maxSEE}
                                                        {!achievable && ' (Not achievable)'}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'simulator' && (
                <div className={styles.tabContent}>
                    <p className={styles.description}>
                        Enter your expected SEE marks for each subject to calculate your final SGPA.
                    </p>

                    <table className={styles.seeTable}>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Credits</th>
                                <th>Internals</th>
                                <th>SEE Marks</th>
                                <th>Total (100)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map(subject => {
                                const maxSee = subject.credits === 1 ? 50 : 100;
                                const see = seeMarks[subject.id] ?? 0;
                                const total = calculateTotal(subject.internalMarks, see, subject.credits);
                                return (
                                    <tr key={subject.id}>
                                        <td>{subject.name}</td>
                                        <td>{subject.credits}</td>
                                        <td>{subject.internalMarks}/50</td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                max={maxSee}
                                                value={seeMarks[subject.id] ?? ''}
                                                onChange={(e) => handleSEEChange(subject.id, e.target.value)}
                                                placeholder={`/${maxSee}`}
                                                className={styles.seeInput}
                                            />
                                        </td>
                                        <td>{total}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className={styles.sgpaResult}>
                        <div className={styles.sgpaHeader}>
                            <FaEquals />
                            <span>Calculated SGPA:</span>
                            <strong style={{ color: 'var(--accent)' }}>{sgpaFromSEE.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StatsCard;
