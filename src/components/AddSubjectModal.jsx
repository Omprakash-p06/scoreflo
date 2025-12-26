import { useState, useRef, useEffect } from 'react';
import { FaPlusCircle, FaPlus, FaCheck } from 'react-icons/fa';
import { allGrades } from '../utils/sgpaLogic';
import styles from './AddSubjectModal.module.css';

function AddSubjectModal({ isOpen, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [credits, setCredits] = useState(null);
    const [internalMarks, setInternalMarks] = useState('');
    const [desiredGrade, setDesiredGrade] = useState('');
    const nameInputRef = useRef(null);

    // Focus name input when modal opens
    useEffect(() => {
        if (isOpen && nameInputRef.current) {
            setTimeout(() => nameInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const resetForm = () => {
        setName('');
        setCredits(null);
        setInternalMarks('');
        setDesiredGrade('');
    };

    const isValid = () => {
        return name.trim() && credits && !isNaN(parseInt(internalMarks));
    };

    const handleSubmit = (closeAfter = true) => {
        if (!isValid()) return;

        const internal = parseInt(internalMarks);
        if (internal < 0 || internal > 50) return;
        if (credits < 1 || credits > 6) return;

        onAdd({
            name: name.trim(),
            credits,
            internalMarks: internal,
            desiredGrade
        });

        resetForm();

        if (closeAfter) {
            onClose();
        } else {
            // Focus name input for next entry
            setTimeout(() => nameInputRef.current?.focus(), 50);
        }
    };

    const handleAddAndNext = () => {
        handleSubmit(false);
    };

    const handleFinish = () => {
        handleSubmit(true);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isValid()) {
                handleAddAndNext();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>
                        <FaPlusCircle />
                        Add New Subject
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <div className="input-group">
                        <label htmlFor="subjectName">Subject Name</label>
                        <input
                            ref={nameInputRef}
                            id="subjectName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Engineering Mathematics"
                        />
                    </div>

                    <div className="input-group">
                        <label>Credits (Select One)</label>
                        <div className="credit-chips">
                            {[1, 2, 3, 4, 5, 6].map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`credit-chip ${credits === c ? 'selected' : ''}`}
                                    onClick={() => setCredits(c)}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="internalMarks">Internal Marks (out of 50)</label>
                        <input
                            id="internalMarks"
                            type="number"
                            min="0"
                            max="50"
                            value={internalMarks}
                            onChange={(e) => setInternalMarks(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g., 38"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="desiredGrade">Desired Grade (Optional)</label>
                        <select
                            id="desiredGrade"
                            value={desiredGrade}
                            onChange={(e) => setDesiredGrade(e.target.value)}
                        >
                            <option value="">Select Grade</option>
                            {allGrades.map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className="btn secondary"
                            onClick={handleAddAndNext}
                            disabled={!isValid()}
                        >
                            <FaPlus />
                            Add & Next
                        </button>
                        <button
                            type="button"
                            className="btn"
                            onClick={handleFinish}
                            disabled={!isValid()}
                        >
                            <FaCheck />
                            Finish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddSubjectModal;
