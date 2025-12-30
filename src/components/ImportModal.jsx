import { useState, useRef } from 'react';
import { FaFileImport, FaCheck, FaExclamationTriangle, FaCamera, FaSpinner } from 'react-icons/fa';
import Tesseract from 'tesseract.js';
import { parseBulkImport } from '../utils/sgpaLogic';
import styles from './ImportModal.module.css';

function ImportModal({ isOpen, onClose, onImport }) {
    const [text, setText] = useState('');
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef(null);

    const handleParse = () => {
        const result = parseBulkImport(text);
        setPreview(result.subjects);
        setErrors(result.errors);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsScanning(true);
        setErrors([]);
        try {
            const { data: { text: scannedText } } = await Tesseract.recognize(file, 'eng');
            const cleanText = scannedText.replace(/\|/g, ' ');
            setText(prev => prev + '\n' + cleanText);
        } catch (err) {
            setErrors(["Failed to scan image."]);
        } finally {
            setIsScanning(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleImport = () => {
        if (preview && preview.length > 0) {
            onImport(preview);
            handleClose();
        }
    };

    const handleClose = () => {
        setText('');
        setPreview(null);
        setErrors([]);
        setIsScanning(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2><FaFileImport /> Bulk Import</h2>
                    <button className="modal-close" onClick={handleClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        <button
                            className="btn secondary"
                            onClick={() => fileInputRef.current.click()}
                            disabled={isScanning}
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                        >
                            {isScanning ? <FaSpinner className="spin" /> : <FaCamera />}
                            {isScanning ? "Scanning..." : "Scan from Image"}
                        </button>
                    </div>
                    <div className="input-group">
                        <textarea
                            value={text}
                            onChange={(e) => { setText(e.target.value); setPreview(null); }}
                            placeholder="Paste subjects or scan image..."
                            rows={6}
                        />
                    </div>
                    {errors.length > 0 && (
                        <div className={styles.errors}>
                            <FaExclamationTriangle />
                            <div>{errors.map((e, i) => <div key={i}>{e}</div>)}</div>
                        </div>
                    )}
                    {preview && (
                        <div className={styles.preview}>
                            <h4>Preview ({preview.length})</h4>
                            <ul>{preview.map((s, i) => <li key={i}>{s.name} - {s.credits} cr</li>)}</ul>
                        </div>
                    )}
                    <div className={styles.actions}>
                        {!preview ? (
                            <button type="button" className="btn" onClick={handleParse} disabled={!text.trim() || isScanning}>
                                Parse
                            </button>
                        ) : (
                            <button type="button" className="btn" onClick={handleImport}>
                                <FaCheck /> Import
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImportModal;
