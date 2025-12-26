/**
 * SGPA Calculation Logic - Deduction Method
 * Formula: SGPA = 10 - Σ[(0.05 × credits) × n]
 * 
 * Based on VTU Engineering Grading System:
 * - Total marks per subject: 100 (50 internal + 50 SEE)
 * - Internal: CIE average (30) + Internal-Internal component (20) = 50 marks
 * - SEE: 100 mark paper / 2 = 50 marks (except 1-credit courses: 50/50)
 */

// Grade to penalty 'n' mapping
export const gradeToN = {
    "O": 0,    // 90-100
    "A+": 1,   // 80-89
    "A": 2,    // 70-79
    "B+": 3,   // 60-69
    "B": 4,    // 50-59
    "C": 5,    // 45-49
    "P": 6,    // 40-44
    "F": 10    // <40
};

// All n values and their corresponding grades (for suggestions)
// Note: F has n=10, so we need a special mapping
export const nToGrade = {
    0: "O",
    1: "A+",
    2: "A",
    3: "B+",
    4: "B",
    5: "C",
    6: "P",
    10: "F"
};

// All possible n values in order (for iteration)
export const allNValues = [0, 1, 2, 3, 4, 5, 6, 10];

// Minimum marks required for each grade
export const gradeMinMarks = {
    "O": 90,
    "A+": 80,
    "A": 70,
    "B+": 60,
    "B": 50,
    "C": 45,
    "P": 40,
    "F": 0
};

// All available grades
export const allGrades = ["O", "A+", "A", "B+", "B", "C", "P", "F"];

/**
 * Calculate total marks from internals and SEE
 * Note: If Credits = 1, SEE is out of 50 (no division)
 * Note: If Credits > 1, SEE is out of 100 (divide by 2)
 */
export function calculateTotal(internals, see, credits) {
    if (credits === 1) {
        return internals + see;
    }
    return internals + Math.round(see / 2);
}

/**
 * Get grade from total marks
 */
export function getGradeFromTotal(total) {
    if (total >= 90) return "O";
    if (total >= 80) return "A+";
    if (total >= 70) return "A";
    if (total >= 60) return "B+";
    if (total >= 50) return "B";
    if (total >= 45) return "C";
    if (total >= 40) return "P";
    return "F";
}

/**
 * Get penalty 'n' from total marks
 */
export function getNFromTotal(total) {
    if (total >= 90) return 0;
    if (total >= 80) return 1;
    if (total >= 70) return 2;
    if (total >= 60) return 3;
    if (total >= 50) return 4;
    if (total >= 45) return 5;
    if (total >= 40) return 6;
    return 10;
}

/**
 * Calculate SGPA from subjects with SEE marks
 * @param {Array} subjects - Array of subjects with seeMarks
 * @returns {number} SGPA value
 */
export function calculateSGPAFromSEE(subjects) {
    let deduction = 0;

    subjects.forEach(subj => {
        const see = subj.seeMarks ?? 0;
        const total = calculateTotal(subj.internalMarks, see, subj.credits);
        const n = getNFromTotal(total);
        deduction += 0.05 * subj.credits * n;
    });

    let sgpa = 10 - deduction;
    return Math.max(0, Math.min(10, sgpa));
}

/**
 * Calculate SGPA from desired grades
 * @param {Array} subjects - Array of subjects with desiredGrade
 * @returns {Object} { sgpa, breakdown }
 */
export function calculateSGPAFromGrades(subjects) {
    let deduction = 0;
    const breakdown = [];

    subjects.forEach(subj => {
        if (subj.desiredGrade && subj.desiredGrade in gradeToN) {
            const n = gradeToN[subj.desiredGrade];
            const subjDeduction = 0.05 * subj.credits * n;
            deduction += subjDeduction;
            breakdown.push({
                name: subj.name,
                credits: subj.credits,
                grade: subj.desiredGrade,
                n,
                deduction: subjDeduction
            });
        }
    });

    let sgpa = 10 - deduction;
    sgpa = Math.max(0, Math.min(10, sgpa));

    return { sgpa, breakdown };
}

/**
 * Calculate required SEE marks for a target grade
 * @returns {Object} { requiredSEE, maxSEE, achievable }
 */
export function getRequiredSEE(internals, credits, targetGrade) {
    const minMarks = gradeMinMarks[targetGrade];
    const maxSEE = credits === 1 ? 50 : 100;

    let requiredSEE;
    if (credits === 1) {
        requiredSEE = minMarks - internals;
    } else {
        requiredSEE = (minMarks - internals) * 2;
    }

    const achievable = requiredSEE <= maxSEE && requiredSEE >= 0;
    requiredSEE = Math.max(0, Math.min(requiredSEE, maxSEE));

    return { requiredSEE: Math.ceil(requiredSEE), maxSEE, achievable };
}

/**
 * Get all possible grades for a subject (including F)
 * Returns array of n values that are theoretically possible
 */
function getAllPossibleGrades(internal, credits) {
    const grades = [];
    const maxSEE = credits === 1 ? 50 : 100;

    // Check each grade from O to F
    for (const n of allNValues) {
        const grade = nToGrade[n];
        const minMarks = gradeMinMarks[grade];

        let requiredSEE;
        if (credits === 1) {
            requiredSEE = minMarks - internal;
        } else {
            requiredSEE = (minMarks - internal) * 2;
        }

        // Include this grade if:
        // 1. It's achievable (can score high enough), OR
        // 2. It's a lower grade (can always score lower intentionally or fail)
        if (requiredSEE <= maxSEE) {
            grades.push(n);
        }
    }

    // F is always achievable (just score 0 in SEE)
    if (!grades.includes(10)) {
        grades.push(10);
    }

    return grades;
}

/**
 * Calculate the best and worst possible SGPA given internal marks
 */
function getSGPARange(subjects) {
    let minDeduction = 0;
    let maxDeduction = 0;

    subjects.forEach(subj => {
        const possibleGrades = getAllPossibleGrades(subj.internalMarks, subj.credits);
        const bestN = Math.min(...possibleGrades);
        const worstN = Math.max(...possibleGrades);
        minDeduction += 0.05 * subj.credits * bestN;
        maxDeduction += 0.05 * subj.credits * worstN;
    });

    return {
        best: 10 - minDeduction,
        worst: Math.max(0, 10 - maxDeduction)
    };
}

/**
 * Suggest grade combinations for a desired SGPA
 * Uses backtracking to find valid combinations
 * Includes ALL grades from O to F
 */
export function suggestGradeCombinations(subjects, desiredSGPA) {
    if (subjects.length === 0 || subjects.length > 12) return [];

    const suggestions = [];
    const tolerance = 0.15; // Allow 0.15 tolerance for matching SGPA

    // Check if the desired SGPA is achievable
    const range = getSGPARange(subjects);
    if (desiredSGPA > range.best + tolerance) {
        return []; // Desired SGPA is too high
    }
    if (desiredSGPA < range.worst - tolerance) {
        return []; // Desired SGPA is too low (shouldn't happen with F included)
    }

    // Pre-compute possible grades for each subject
    const possibleGradesPerSubject = subjects.map(subj =>
        getAllPossibleGrades(subj.internalMarks, subj.credits)
    );

    function backtrack(idx, currentCombo, currentDeduction) {
        if (idx === subjects.length) {
            const sgpa = 10 - currentDeduction;
            if (Math.abs(sgpa - desiredSGPA) <= tolerance) {
                suggestions.push([...currentCombo]);
            }
            return;
        }

        const possibleNs = possibleGradesPerSubject[idx];

        for (const n of possibleNs) {
            const deduction = 0.05 * subjects[idx].credits * n;
            const newDeduction = currentDeduction + deduction;

            currentCombo.push(nToGrade[n]);
            backtrack(idx + 1, currentCombo, newDeduction);
            currentCombo.pop();

            if (suggestions.length >= 50) return; // Limit results
        }
    }

    backtrack(0, [], 0);

    // Sort by how close to desired SGPA (closest first)
    suggestions.sort((a, b) => {
        const sgpaA = 10 - a.reduce((sum, grade, i) =>
            sum + 0.05 * subjects[i].credits * gradeToN[grade], 0);
        const sgpaB = 10 - b.reduce((sum, grade, i) =>
            sum + 0.05 * subjects[i].credits * gradeToN[grade], 0);
        return Math.abs(sgpaA - desiredSGPA) - Math.abs(sgpaB - desiredSGPA);
    });

    return suggestions;
}

/**
 * Parse bulk import text
 * Format: "Name Credits Internals" per line
 * Example: "Maths 4 45"
 */
export function parseBulkImport(text) {
    const lines = text.trim().split('\n');
    const subjects = [];
    const errors = [];

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // Match pattern: Name (can have spaces) Credits(number) Internals(number)
        const match = trimmed.match(/^(.+?)\s+(\d+)\s+(\d+)$/);

        if (match) {
            const name = match[1].trim();
            const credits = parseInt(match[2]);
            const internals = parseInt(match[3]);

            if (credits >= 1 && credits <= 6 && internals >= 0 && internals <= 50) {
                subjects.push({
                    id: Date.now() + Math.random() + index,
                    name,
                    credits,
                    internalMarks: internals,
                    desiredGrade: '',
                    seeMarks: undefined
                });
            } else {
                errors.push(`Line ${index + 1}: Invalid values`);
            }
        } else {
            errors.push(`Line ${index + 1}: Invalid format (expected: Name Credits Internals)`);
        }
    });

    return { subjects, errors };
}
