import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaFileImport, FaGithub, FaInfoCircle, FaRocket } from 'react-icons/fa';
import SubjectTable from '../components/SubjectTable';
import AddSubjectModal from '../components/AddSubjectModal';
import ImportModal from '../components/ImportModal';
import StatsCard from '../components/StatsCard';
import GradeInfoCard from '../components/GradeInfoCard';
import Notification from '../components/Notification';
import PixelSnow from '../components/PixelSnow';
import MagicCard from '../components/MagicCard';
import GlobalSpotlight from '../components/GlobalSpotlight';
import styles from '../App.module.css';

const STORAGE_KEY = 'sgpa_subjects';

function Dashboard() {
    const [subjects, setSubjects] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const containerRef = useRef(null);

    // Load subjects from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setSubjects(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse saved subjects:', e);
            }
        }
    }, []);

    // Save subjects to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    }, [subjects]);

    // Show notification
    const showNotification = useCallback((message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    // Add subject(s)
    const addSubject = useCallback((subject) => {
        setSubjects(prev => [...prev, {
            ...subject,
            id: Date.now() + Math.random(),
            seeMarks: undefined
        }]);
        showNotification('Subject added successfully!', 'success');
    }, [showNotification]);

    // Add multiple subjects (bulk import)
    const addSubjects = useCallback((newSubjects) => {
        setSubjects(prev => [...prev, ...newSubjects]);
        showNotification(`${newSubjects.length} subject${newSubjects.length > 1 ? 's' : ''} imported!`, 'success');
    }, [showNotification]);

    // Add empty row
    const addEmptyRow = useCallback(() => {
        setSubjects(prev => [...prev, {
            id: Date.now() + Math.random(),
            name: 'New Subject',
            credits: 3,
            internalMarks: 0,
            desiredGrade: '',
            seeMarks: undefined
        }]);
        showNotification('Empty row added', 'info');
    }, [showNotification]);

    // Update subject
    const updateSubject = useCallback((id, updates) => {
        setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }, []);

    // Delete subject
    const deleteSubject = useCallback((id) => {
        setSubjects(prev => prev.filter(s => s.id !== id));
        showNotification('Subject removed', 'success');
    }, [showNotification]);

    // Duplicate subject
    const duplicateSubject = useCallback((id) => {
        const subject = subjects.find(s => s.id === id);
        if (subject) {
            setSubjects(prev => [...prev, {
                ...subject,
                id: Date.now() + Math.random(),
                name: `${subject.name} (Copy)`
            }]);
            showNotification('Subject duplicated', 'success');
        }
    }, [subjects, showNotification]);

    return (
        <div className={styles.layout}>
            <PixelSnow
                color="#8a2be2"
                speed={0.8}
                density={0.25}
                brightness={0.8}
                variant="round"
            />

            <GlobalSpotlight
                containerRef={containerRef}
                cardSelector=".magic-card"
                spotlightRadius={350}
            />

            <header className={styles.header}>
                <div className={styles.title}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(12px) saturate(1.8) brightness(1.1)',
                        WebkitBackdropFilter: 'blur(12px) saturate(1.8) brightness(1.1)',
                        borderRadius: '16px',
                        padding: '12px 20px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: `
                            inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
                            inset 0 -1px 0 0 rgba(255, 255, 255, 0.05),
                            0 8px 32px 0 rgba(138, 43, 226, 0.15)
                        `
                    }}>
                        <img
                            src="/scoreflo.png"
                            alt="ScoreFlo"
                            style={{
                                height: '180px',
                                filter: 'brightness(1.3) saturate(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))'
                            }}
                        />
                    </div>
                </div>
                <p className={styles.subtitle}>
                    Plan your semester, simulate results, and hit your target SGPA.
                </p>
                <div className={styles.headerActions}>
                    <Link to="/planner" className="btn">
                        <FaRocket /> Launch Exam HQ
                    </Link>
                    <a
                        href="https://github.com/Omprakash-p06/sgpa-calculator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn secondary"
                    >
                        <FaGithub /> GitHub
                    </a>
                </div>
            </header>

            <main className={styles.container} ref={containerRef}>
                <MagicCard
                    className={styles.card}
                    enableTilt={false}
                    enableMagnetism={true}
                    enableParticles={true}
                    clickEffect={true}
                >
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>
                            <FaInfoCircle />
                            My Semester Subjects
                        </h2>
                        <div className={styles.cardActions}>
                            <button className="btn small secondary" onClick={addEmptyRow}>
                                <FaPlus /> Add Empty Row
                            </button>
                            <button className="btn small secondary" onClick={() => setIsImportModalOpen(true)}>
                                <FaFileImport /> Bulk Import
                            </button>
                            <button className="btn" onClick={() => setIsAddModalOpen(true)}>
                                <FaPlus /> Add Subject
                            </button>
                        </div>
                    </div>

                    <SubjectTable
                        subjects={subjects}
                        onUpdate={updateSubject}
                        onDelete={deleteSubject}
                        onDuplicate={duplicateSubject}
                    />

                    <StatsCard subjects={subjects} onUpdate={updateSubject} />
                </MagicCard>

                <GradeInfoCard />
            </main>

            <AddSubjectModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={addSubject}
            />

            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={addSubjects}
            />

            <Notification notification={notification} />
        </div>
    );
}

export default Dashboard;
