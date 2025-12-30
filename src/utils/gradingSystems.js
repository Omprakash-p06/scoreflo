/**
 * Grading Systems Configuration
 * Contains presets for Indian universities: VTU, PES, RVCE, IITs
 */

/**
 * All supported grading system presets
 */
export const GRADING_SYSTEMS = {
    // M S Ramaiah Institute of Technology (Default)
    MSRIT: {
        id: 'MSRIT',
        name: 'M S Ramaiah Institute of Technology',
        shortName: 'MSRIT',
        category: 'Karnataka',
        gradeScale: [
            { letter: 'O', point: 10, minMarks: 90, maxMarks: 100, description: 'Outstanding' },
            { letter: 'A+', point: 9, minMarks: 80, maxMarks: 89, description: 'Excellent' },
            { letter: 'A', point: 8, minMarks: 70, maxMarks: 79, description: 'Very Good' },
            { letter: 'B+', point: 7, minMarks: 60, maxMarks: 69, description: 'Good' },
            { letter: 'B', point: 6, minMarks: 55, maxMarks: 59, description: 'Above Average' },
            { letter: 'C', point: 5, minMarks: 50, maxMarks: 54, description: 'Average' },
            { letter: 'P', point: 4, minMarks: 40, maxMarks: 49, description: 'Pass' },
            { letter: 'F', point: 0, minMarks: 0, maxMarks: 39, description: 'Fail' },
        ],
        passingGrade: 'P',
        passingPoint: 4,
        percentageFormula: 'vtu', // (SGPA - 0.75) × 10
        specialGrades: ['NE', 'AU', 'AB', 'DX'],
    },

    // VTU 2021-2022 Scheme
    VTU_2021: {
        id: 'VTU_2021',
        name: 'VTU 2021-2022 Scheme',
        shortName: 'VTU 2021',
        category: 'Karnataka',
        gradeScale: [
            { letter: 'O', point: 10, minMarks: 90, maxMarks: 100, description: 'Outstanding' },
            { letter: 'A+', point: 9, minMarks: 80, maxMarks: 89, description: 'Excellent' },
            { letter: 'A', point: 8, minMarks: 70, maxMarks: 79, description: 'Very Good' },
            { letter: 'B+', point: 7, minMarks: 60, maxMarks: 69, description: 'Good' },
            { letter: 'B', point: 6, minMarks: 55, maxMarks: 59, description: 'Above Average' },
            { letter: 'C', point: 5, minMarks: 50, maxMarks: 54, description: 'Average' },
            { letter: 'P', point: 4, minMarks: 40, maxMarks: 49, description: 'Pass' },
            { letter: 'F', point: 0, minMarks: 0, maxMarks: 39, description: 'Fail' },
        ],
        passingGrade: 'P',
        passingPoint: 4,
        percentageFormula: 'vtu',
        specialGrades: ['NE', 'AU', 'AB', 'DX', 'PP'],
    },

    // VTU 2018 Scheme
    VTU_2018: {
        id: 'VTU_2018',
        name: 'VTU 2018 Scheme',
        shortName: 'VTU 2018',
        category: 'Karnataka',
        gradeScale: [
            { letter: 'O', point: 10, minMarks: 85, maxMarks: 100, description: 'Outstanding' },
            { letter: 'A', point: 9, minMarks: 80, maxMarks: 84, description: 'Excellent' },
            { letter: 'B', point: 8, minMarks: 75, maxMarks: 79, description: 'Very Good' },
            { letter: 'C', point: 7, minMarks: 65, maxMarks: 74, description: 'Good' },
            { letter: 'D', point: 6, minMarks: 60, maxMarks: 64, description: 'Fair' },
            { letter: 'E', point: 5, minMarks: 55, maxMarks: 59, description: 'Average' },
            { letter: 'P', point: 4, minMarks: 41, maxMarks: 54, description: 'Pass' },
            { letter: 'F', point: 0, minMarks: 0, maxMarks: 40, description: 'Fail' },
        ],
        passingGrade: 'P',
        passingPoint: 4,
        percentageFormula: 'vtu',
        specialGrades: ['NE', 'AU', 'AB', 'DX'],
    },

    // PES University Current
    PES: {
        id: 'PES',
        name: 'PES University',
        shortName: 'PES',
        category: 'Karnataka',
        gradeScale: [
            { letter: 'S', point: 10, minMarks: 90, maxMarks: 100, description: 'Outstanding' },
            { letter: 'A', point: 9, minMarks: 80, maxMarks: 89, description: 'Excellent' },
            { letter: 'B', point: 8, minMarks: 70, maxMarks: 79, description: 'Very Good' },
            { letter: 'C', point: 7, minMarks: 60, maxMarks: 69, description: 'Good' },
            { letter: 'D', point: 6, minMarks: 50, maxMarks: 59, description: 'Above Average' },
            { letter: 'E', point: 5, minMarks: 40, maxMarks: 49, description: 'Average' },
            { letter: 'F', point: 0, minMarks: 0, maxMarks: 39, description: 'Fail' },
        ],
        passingGrade: 'E',
        passingPoint: 5,
        percentageFormula: 'direct', // SGPA × 10
        specialGrades: ['PP'],
    },

    // RV College of Engineering
    RVCE: {
        id: 'RVCE',
        name: 'RV College of Engineering',
        shortName: 'RVCE',
        category: 'Karnataka',
        gradeScale: [
            { letter: 'S+', point: 10, minMarks: 90, maxMarks: 100, description: 'Outstanding' },
            { letter: 'S', point: 9, minMarks: 80, maxMarks: 89, description: 'Excellent' },
            { letter: 'A', point: 8, minMarks: 70, maxMarks: 79, description: 'Very Good' },
            { letter: 'B', point: 7, minMarks: 60, maxMarks: 69, description: 'Good' },
            { letter: 'C', point: 6, minMarks: 50, maxMarks: 59, description: 'Above Average' },
            { letter: 'D', point: 5, minMarks: 45, maxMarks: 49, description: 'Average' },
            { letter: 'E', point: 4, minMarks: 40, maxMarks: 44, description: 'Pass' },
            { letter: 'F', point: 0, minMarks: 0, maxMarks: 39, description: 'Fail' },
        ],
        passingGrade: 'E',
        passingPoint: 4,
        percentageFormula: 'vtu',
        specialGrades: ['PP'],
    },

    // IIT Bombay
    IIT_BOMBAY: {
        id: 'IIT_BOMBAY',
        name: 'IIT Bombay',
        shortName: 'IITB',
        category: 'IIT',
        terminology: { sgpa: 'SPI', cgpa: 'CPI' },
        gradeScale: [
            { letter: 'AP', point: 10, description: 'Excellent' },
            { letter: 'AA', point: 10, description: 'Excellent' },
            { letter: 'AB', point: 9, description: 'Very Good' },
            { letter: 'BB', point: 8, description: 'Good' },
            { letter: 'BC', point: 7, description: 'Fair' },
            { letter: 'CC', point: 6, description: 'Average' },
            { letter: 'CD', point: 5, description: 'Below Average' },
            { letter: 'DD', point: 4, description: 'Poor (Pass)' },
            { letter: 'FR', point: 0, description: 'Fail' },
        ],
        passingGrade: 'DD',
        passingPoint: 4,
        inputMode: 'letterGrade',
        percentageFormula: 'direct',
        specialGrades: ['DX', 'W', 'I', 'PP', 'NP'],
    },

    // IIT Delhi
    IIT_DELHI: {
        id: 'IIT_DELHI',
        name: 'IIT Delhi',
        shortName: 'IITD',
        category: 'IIT',
        gradeScale: [
            { letter: 'A', point: 10, description: 'Excellent' },
            { letter: 'A-', point: 9, description: 'Very Good' },
            { letter: 'B', point: 8, description: 'Good' },
            { letter: 'B-', point: 7, description: 'Fair' },
            { letter: 'C', point: 6, description: 'Average' },
            { letter: 'C-', point: 5, description: 'Below Average' },
            { letter: 'D', point: 4, description: 'Poor (Pass)' },
            { letter: 'E', point: 2, description: 'Very Poor' },
            { letter: 'F', point: 0, description: 'Fail' },
        ],
        passingGrade: 'D',
        passingPoint: 4,
        inputMode: 'letterGrade',
        percentageFormula: 'conservative', // SGPA × 9.5
        specialGrades: ['S', 'X', 'Z', 'I', 'W'],
    },

    // IIT Madras
    IIT_MADRAS: {
        id: 'IIT_MADRAS',
        name: 'IIT Madras',
        shortName: 'IITM',
        category: 'IIT',
        terminology: { sgpa: 'GPA', cgpa: 'CGPA' },
        gradeScale: [
            { letter: 'S', point: 10, description: 'Excellent' },
            { letter: 'A', point: 9, description: 'Very Good' },
            { letter: 'B', point: 8, description: 'Good' },
            { letter: 'C', point: 7, description: 'Average' },
            { letter: 'D', point: 6, description: 'Pass' },
            { letter: 'E', point: 4, description: 'Barely Pass' },
            { letter: 'U', point: 0, description: 'Fail' },
        ],
        passingGrade: 'E',
        passingPoint: 4,
        inputMode: 'letterGrade',
        percentageFormula: 'direct',
        specialGrades: ['P', 'F', 'W', 'I'],
    },

    // IIT Kharagpur
    IIT_KHARAGPUR: {
        id: 'IIT_KHARAGPUR',
        name: 'IIT Kharagpur',
        shortName: 'IITKGP',
        category: 'IIT',
        gradeScale: [
            { letter: 'EX', point: 10, minMarks: 90, maxMarks: 100, description: 'Excellent' },
            { letter: 'A', point: 9, minMarks: 80, maxMarks: 89, description: 'Very Good' },
            { letter: 'B', point: 8, minMarks: 70, maxMarks: 79, description: 'Good' },
            { letter: 'C', point: 7, minMarks: 60, maxMarks: 69, description: 'Fair' },
            { letter: 'D', point: 6, minMarks: 50, maxMarks: 59, description: 'Average' },
            { letter: 'P', point: 5, minMarks: 40, maxMarks: 49, description: 'Pass' },
            { letter: 'F', point: 0, minMarks: 0, maxMarks: 39, description: 'Fail' },
        ],
        passingGrade: 'P',
        passingPoint: 5,
        percentageFormula: 'direct',
        specialGrades: [],
    },

    // IIT Kanpur
    IIT_KANPUR: {
        id: 'IIT_KANPUR',
        name: 'IIT Kanpur',
        shortName: 'IITK',
        category: 'IIT',
        gradeScale: [
            { letter: 'A*', point: 10, minMarks: 90, maxMarks: 100, description: 'Outstanding' },
            { letter: 'A', point: 10, minMarks: 86, maxMarks: 89, description: 'Excellent' },
            { letter: 'B+', point: 9, minMarks: 76, maxMarks: 85, description: 'Very Good' },
            { letter: 'B', point: 8, minMarks: 66, maxMarks: 75, description: 'Good' },
            { letter: 'C+', point: 7, minMarks: 56, maxMarks: 65, description: 'Fair' },
            { letter: 'C', point: 6, minMarks: 46, maxMarks: 55, description: 'Average' },
            { letter: 'D', point: 4, minMarks: 36, maxMarks: 45, description: 'Pass' },
            { letter: 'E', point: 0, minMarks: 26, maxMarks: 35, description: 'Fail' },
            { letter: 'F', point: 0, minMarks: 0, maxMarks: 25, description: 'Fail' },
        ],
        passingGrade: 'D',
        passingPoint: 4,
        percentageFormula: 'direct',
        specialGrades: [],
    },

    // IIT Roorkee
    IIT_ROORKEE: {
        id: 'IIT_ROORKEE',
        name: 'IIT Roorkee',
        shortName: 'IITR',
        category: 'IIT',
        gradeScale: [
            { letter: 'A+', point: 10, description: 'Outstanding' },
            { letter: 'A', point: 9, description: 'Excellent' },
            { letter: 'A-', point: 8.5, description: 'Very Good' },
            { letter: 'B+', point: 8, description: 'Good' },
            { letter: 'B', point: 7, description: 'Above Average' },
            { letter: 'B-', point: 6.5, description: 'Average' },
            { letter: 'C+', point: 6, description: 'Below Average' },
            { letter: 'C', point: 5.5, description: 'Poor' },
            { letter: 'C-', point: 5, description: 'Very Poor' },
            { letter: 'D', point: 4, description: 'Pass' },
            { letter: 'F', point: 0, description: 'Fail' },
        ],
        passingGrade: 'D',
        passingPoint: 4,
        inputMode: 'letterGrade',
        percentageFormula: 'conservative',
        specialGrades: [],
    },

    // IIT Guwahati
    IIT_GUWAHATI: {
        id: 'IIT_GUWAHATI',
        name: 'IIT Guwahati',
        shortName: 'IITG',
        category: 'IIT',
        gradeScale: [
            { letter: 'AA', point: 10, description: 'Excellent' },
            { letter: 'AB', point: 9, description: 'Very Good' },
            { letter: 'BB', point: 8, description: 'Good' },
            { letter: 'BC', point: 7, description: 'Fair' },
            { letter: 'CC', point: 6, description: 'Average' },
            { letter: 'CD', point: 5, description: 'Below Average' },
            { letter: 'DD', point: 4, description: 'Pass' },
            { letter: 'F', point: 0, description: 'Fail' },
        ],
        passingGrade: 'DD',
        passingPoint: 4,
        inputMode: 'letterGrade',
        percentageFormula: 'direct',
        specialGrades: [],
    },
};

/**
 * Get grading systems grouped by category
 * @returns {Object} Systems grouped by category
 */
export function getSystemsByCategory() {
    const categories = {};

    Object.values(GRADING_SYSTEMS).forEach((system) => {
        if (!categories[system.category]) {
            categories[system.category] = [];
        }
        categories[system.category].push(system);
    });

    return categories;
}

/**
 * Get the current grading system from localStorage
 * @returns {Object} Current grading system preset
 */
export function getCurrentSystem() {
    const systemId = localStorage.getItem('scoreflo_grading_system') || 'MSRIT';
    return GRADING_SYSTEMS[systemId] || GRADING_SYSTEMS.MSRIT;
}

/**
 * Save grading system preference
 * @param {string} systemId - System ID to save
 */
export function setCurrentSystem(systemId) {
    if (GRADING_SYSTEMS[systemId]) {
        localStorage.setItem('scoreflo_grading_system', systemId);
    }
}

/**
 * Convert marks to grade using the current system
 * @param {number} marks - Marks obtained (0-100)
 * @param {Object} system - Grading system to use (optional)
 * @returns {Object} Grade object with letter and points
 */
export function marksToGrade(marks, system = null) {
    const currentSystem = system || getCurrentSystem();

    // Handle letter grade input mode
    if (currentSystem.inputMode === 'letterGrade') {
        return null; // User should input grade directly
    }

    for (const grade of currentSystem.gradeScale) {
        if (grade.minMarks !== undefined && grade.maxMarks !== undefined) {
            if (marks >= grade.minMarks && marks <= grade.maxMarks) {
                return {
                    letter: grade.letter,
                    point: grade.point,
                    description: grade.description,
                };
            }
        }
    }

    // Default to fail
    const failGrade = currentSystem.gradeScale.find((g) => g.point === 0);
    return failGrade || { letter: 'F', point: 0, description: 'Fail' };
}

/**
 * Get grade point from letter grade
 * @param {string} letter - Letter grade
 * @param {Object} system - Grading system to use (optional)
 * @returns {number} Grade points
 */
export function letterToPoint(letter, system = null) {
    const currentSystem = system || getCurrentSystem();
    const grade = currentSystem.gradeScale.find((g) => g.letter === letter);
    return grade ? grade.point : 0;
}

/**
 * Calculate percentage from SGPA
 * @param {number} sgpa - SGPA value
 * @param {Object} system - Grading system to use (optional)
 * @returns {number} Percentage
 */
export function sgpaToPercentage(sgpa, system = null) {
    const currentSystem = system || getCurrentSystem();

    switch (currentSystem.percentageFormula) {
        case 'vtu':
            return Math.round(((sgpa - 0.75) * 10) * 100) / 100;
        case 'direct':
            return Math.round((sgpa * 10) * 100) / 100;
        case 'conservative':
            return Math.round((sgpa * 9.5) * 100) / 100;
        default:
            return Math.round((sgpa * 10) * 100) / 100;
    }
}

/**
 * Get classification based on CGPA
 * @param {number} cgpa - CGPA value
 * @param {Object} system - Grading system to use (optional)
 * @returns {string} Classification
 */
export function getClassification(cgpa, system = null) {
    const currentSystem = system || getCurrentSystem();

    if (currentSystem.category === 'IIT') {
        if (cgpa >= 8.0) return 'Excellent';
        if (cgpa >= 7.0) return 'Very Good';
        if (cgpa >= 6.0) return 'Good';
        if (cgpa >= 5.0) return 'Average';
        if (cgpa >= 4.0) return 'Pass';
        return 'Fail';
    }

    // VTU/RVCE/MSRIT classification
    if (cgpa >= 7.75) return 'First Class with Distinction';
    if (cgpa >= 6.75) return 'First Class';
    if (cgpa >= 5.75) return 'Second Class';
    if (cgpa >= 4.0) return 'Pass Class';
    return 'Fail';
}

export default GRADING_SYSTEMS;
