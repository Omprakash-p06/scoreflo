import { useState } from 'react';
import { FaFileImport, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { parseBulkImport } from '../utils/sgpaLogic';
import styles from './ImportModal.module.css';

function ImportModal({ isOpen, onClose, onImport }) {
    const [text, setText] = useState('');
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState([]);

    const handleParse = () => {
        const result = parseBulkImport(text);
        setPreview(result.subjects);
        setErrors(result.errors);
    };

    const handleImport = () => {
        if (preview && preview.length > 0) {
            onImport(preview);
            setText('');
            setPreview(null);
            setErrors([]);
            onClose();
        }
    };

    const handleClose = () => {
        setText('');
        setPreview(null);
        setErrors([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>
                        <FaFileImport />
                        Bulk Import Subjects
                    </h2>
                    <button className="modal-close" onClick={handleClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <div className="input-group">
                        <label htmlFor="importText">
                            Paste subjects (one per line)
                        </label>
                        <textarea
                            id="importText"
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value);
                                setPreview(null);
                                setErrors([]);
                            }}
                            placeholder={`Format: Name Credits Internals\n\nExample:\nMaths 4 45\nPhysics 3 38\nChemistry 3 42`}
                        />
                    </div>

                    {errors.length > 0 && (
                        <div className={styles.errors}>
                            <FaExclamationTriangle />
                            <div>
                                {errors.map((err, i) => (
                                    <div key={i}>{err}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {preview && preview.length > 0 && (
                        <div className={styles.preview}>
                            <h4>Preview ({preview.length} subjects)</h4>
                            <ul>
                                {preview.map((s, i) => (
                                    <li key={i}>
                                        {s.name} - {s.credits} credits - {s.internalMarks}/50
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className={styles.actions}>
                        {!preview ? (
                            <button
                                type="button"
                                className="btn"
                                onClick={handleParse}
                                disabled={!text.trim()}
                            >
                                Parse
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="btn"
                                onClick={handleImport}
                                disabled={preview.length === 0}
                            >
                                <FaCheck />
                                Import {preview.length} Subject{preview.length > 1 ? 's' : ''}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImportModal;
