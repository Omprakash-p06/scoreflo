import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaCopy, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { allGrades } from '../utils/sgpaLogic';
import styles from './SubjectTable.module.css';

function SubjectTable({ subjects, onUpdate, onDelete, onDuplicate }) {
    const [editingCell, setEditingCell] = useState(null);

    const handleCellClick = (subjectId, field) => {
        setEditingCell({ id: subjectId, field });
    };

    const handleCellBlur = (subjectId, field, value) => {
        if (field === 'credits') {
            let v = parseInt(value);
            if (isNaN(v) || v < 1) v = 1;
            if (v > 6) v = 6;
            onUpdate(subjectId, { credits: v });
        } else if (field === 'internalMarks') {
            let v = parseInt(value);
            if (isNaN(v) || v < 0) v = 0;
            if (v > 50) v = 50;
            onUpdate(subjectId, { internalMarks: v });
        } else if (field === 'name') {
            onUpdate(subjectId, { name: value || 'Untitled' });
        } else if (field === 'desiredGrade') {
            onUpdate(subjectId, { desiredGrade: value });
        }
        setEditingCell(null);
    };

    const handleKeyDown = (e, subjectId, field, value) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCellBlur(subjectId, field, value);
        } else if (e.key === 'Escape') {
            setEditingCell(null);
        }
    };

    if (subjects.length === 0) {
        return (
            <div className={styles.emptyState}>
                No subjects added yet. Click "Add Subject" to begin.
            </div>
        );
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Subject Name</th>
                        <th>Credits</th>
                        <th>Internal Marks</th>
                        <th>Desired Grade</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <AnimatePresence mode="popLayout">
                    <tbody>
                        {subjects.map((subject) => (
                            <motion.tr
                                key={subject.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <EditableCell
                                    value={subject.name}
                                    isEditing={editingCell?.id === subject.id && editingCell?.field === 'name'}
                                    onClick={() => handleCellClick(subject.id, 'name')}
                                    onBlur={(value) => handleCellBlur(subject.id, 'name', value)}
                                    onKeyDown={(e, value) => handleKeyDown(e, subject.id, 'name', value)}
                                    type="text"
                                />
                                <EditableCell
                                    value={subject.credits}
                                    isEditing={editingCell?.id === subject.id && editingCell?.field === 'credits'}
                                    onClick={() => handleCellClick(subject.id, 'credits')}
                                    onBlur={(value) => handleCellBlur(subject.id, 'credits', value)}
                                    onKeyDown={(e, value) => handleKeyDown(e, subject.id, 'credits', value)}
                                    type="number"
                                    min={1}
                                    max={6}
                                />
                                <EditableCell
                                    value={subject.internalMarks}
                                    display={`${subject.internalMarks}/50`}
                                    isEditing={editingCell?.id === subject.id && editingCell?.field === 'internalMarks'}
                                    onClick={() => handleCellClick(subject.id, 'internalMarks')}
                                    onBlur={(value) => handleCellBlur(subject.id, 'internalMarks', value)}
                                    onKeyDown={(e, value) => handleKeyDown(e, subject.id, 'internalMarks', value)}
                                    type="number"
                                    min={0}
                                    max={50}
                                />
                                <EditableCell
                                    value={subject.desiredGrade || ''}
                                    display={subject.desiredGrade || '-'}
                                    isEditing={editingCell?.id === subject.id && editingCell?.field === 'desiredGrade'}
                                    onClick={() => handleCellClick(subject.id, 'desiredGrade')}
                                    onBlur={(value) => handleCellBlur(subject.id, 'desiredGrade', value)}
                                    onKeyDown={(e, value) => handleKeyDown(e, subject.id, 'desiredGrade', value)}
                                    type="select"
                                    options={['', ...allGrades]}
                                />
                                <td className={styles.actionsCell}>
                                    <button
                                        className={`btn icon-only small secondary ${styles.actionBtn}`}
                                        onClick={() => onDuplicate(subject.id)}
                                        title="Duplicate Subject"
                                    >
                                        <FaCopy />
                                    </button>
                                    <button
                                        className={`btn icon-only small danger ${styles.actionBtn}`}
                                        onClick={() => onDelete(subject.id)}
                                        title="Remove Subject"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </AnimatePresence>
            </table>
        </div>
    );
}

function EditableCell({
    value,
    display,
    isEditing,
    onClick,
    onBlur,
    onKeyDown,
    type,
    min,
    max,
    options
}) {
    const inputRef = useRef(null);
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            if (type !== 'select') {
                inputRef.current.select();
            }
        }
    }, [isEditing, type]);

    if (isEditing) {
        if (type === 'select') {
            return (
                <td className={styles.editingCell}>
                    <select
                        ref={inputRef}
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onBlur={() => onBlur(localValue)}
                        onKeyDown={(e) => onKeyDown(e, localValue)}
                        className={styles.inlineSelect}
                    >
                        {options.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt || '-'}
                            </option>
                        ))}
                    </select>
                </td>
            );
        }

        return (
            <td className={styles.editingCell}>
                <input
                    ref={inputRef}
                    type={type}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={() => onBlur(localValue)}
                    onKeyDown={(e) => onKeyDown(e, localValue)}
                    min={min}
                    max={max}
                    className={styles.inlineInput}
                />
            </td>
        );
    }

    return (
        <td
            className={styles.editableCell}
            onClick={onClick}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            {display ?? value}
        </td>
    );
}

export default SubjectTable;
