/**
 * SGPA Calculation Logic
 * Supports multiple grading systems (VTU, PES, RVCE, IITs)
 * Uses standard SGPA formula: SGPA = Σ(Credits × GradePoints) / Σ(Credits)
 */

import { getCurrentSystem } from './gradingSystems';

/**
 * Get all available grades for the current system
 */
export function getAllGrades() {
    const system = getCurrentSystem();
    return system.gradeScale.map((g) => g.letter);
}

/**
 * Get passing grades for the current system
 */
export function getPassingGrades() {
    const system = getCurrentSystem();
    return system.gradeScale
        .filter((g) => g.point >= system.passingPoint)
        .map((g) => g.letter);
}

/**
 * Calculate total marks from internals and SEE
 * CIE: out of 50, SEE: 100 marks scaled to 50
 */
export function calculateTotal(internals, see, credits) {
    if (credits === 1) {
        return internals + see;
    }
    return internals + Math.round(see / 2);
}

/**
 * Get grade from total marks using current grading system
 */
export function getGradeFromTotal(total) {
    const system = getCurrentSystem();

    for (const grade of system.gradeScale) {
        if (grade.minMarks !== undefined && grade.maxMarks !== undefined) {
            if (total >= grade.minMarks && total <= grade.maxMarks) {
                return grade.letter;
            }
        }
    }

    const failGrade = system.gradeScale.find((g) => g.point === 0);
    return failGrade ? failGrade.letter : 'F';
}

/**
 * Get grade points from total marks
 */
export function getGradePointFromTotal(total) {
    const system = getCurrentSystem();
    const letter = getGradeFromTotal(total);
    const grade = system.gradeScale.find((g) => g.letter === letter);
    return grade ? grade.point : 0;
}

/**
 * Get grade points from grade letter
 */
export function getPointFromGrade(letter) {
    const system = getCurrentSystem();
    const grade = system.gradeScale.find((g) => g.letter === letter);
    return grade ? grade.point : 0;
}

/**
 * Check if subject passes MSRIT/VTU criteria
 * CIE >= 20/50, SEE >= 35/100, Total >= 40/100
 */
export function checkPassCriteria(internals, seeMarks, credits) {
    const system = getCurrentSystem();
    const isVTUType = system.id === 'MSRIT' || system.id.includes('VTU');

    if (!isVTUType) {
        return { passed: true, reason: null };
    }

    // CIE check
    if (internals < 20) {
        return { passed: false, reason: 'CIE < 20 (minimum required)' };
    }

    // SEE check (35/100 minimum for 100-mark paper)
    const seeMin = credits === 1 ? 18 : 35;
    if (seeMarks < seeMin) {
        return { passed: false, reason: `SEE < ${seeMin} (minimum required)` };
    }

    // Total check
    const total = calculateTotal(internals, seeMarks, credits);
    if (total < 40) {
        return { passed: false, reason: 'Total < 40 (minimum required)' };
    }

    return { passed: true, reason: null };
}

/**
 * Calculate SGPA from subjects with SEE marks
 * Standard Formula: Σ(Credit × GP) / Σ(Credit)
 */
export function calculateSGPAFromSEE(subjects) {
    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach((subj) => {
        const credit = parseFloat(subj.credits) || 0;
        const see = subj.seeMarks ?? 0;
        const total = calculateTotal(subj.internalMarks, see, credit);
        const point = getGradePointFromTotal(total);

        totalCredits += credit;
        totalPoints += credit * point;
    });

    if (totalCredits === 0) return 0;

    return Math.round((totalPoints / totalCredits) * 100) / 100;
}

/**
 * Calculate SGPA from desired grades
 */
export function calculateSGPAFromGrades(subjects) {
    let totalCredits = 0;
    let totalPoints = 0;
    const breakdown = [];

    subjects.forEach((subj) => {
        if (subj.desiredGrade) {
            const credit = parseFloat(subj.credits) || 0;
            const point = getPointFromGrade(subj.desiredGrade);

            totalCredits += credit;
            totalPoints += credit * point;

            // Calculate deduction for backward compatibility (10 - point) * credit * 0.05
            const deduction = (10 - point) * credit * 0.05;

            breakdown.push({
                name: subj.name,
                credits: credit,
                grade: subj.desiredGrade,
                point: point,
                n: 10 - point, // for backward compatibility
                deduction: deduction, // for StatsCard display
                contribution: credit * point,
            });
        }
    });

    if (totalCredits === 0) return { sgpa: 0, breakdown };

    const sgpa = Math.round((totalPoints / totalCredits) * 100) / 100;
    return { sgpa, breakdown };
}

/**
 * Calculate required SEE marks for a target grade
 */
export function getRequiredSEE(internals, credits, targetGrade) {
    const system = getCurrentSystem();
    const targetGradeObj = system.gradeScale.find((g) => g.letter === targetGrade);

    if (!targetGradeObj || targetGradeObj.minMarks === undefined) {
        return { requiredSEE: 0, maxSEE: 100, achievable: false };
    }

    const minMarks = targetGradeObj.minMarks;
    const maxSEE = credits === 1 ? 50 : 100;

    let requiredSEE;
    if (credits === 1) {
        requiredSEE = minMarks - internals;
    } else {
        requiredSEE = (minMarks - internals) * 2;
    }

    // MSRIT/VTU requires minimum SEE of 35/100
    const isVTUType = system.id === 'MSRIT' || system.id.includes('VTU');
    if (isVTUType) {
        const seeMin = credits === 1 ? 18 : 35;
        if (requiredSEE < seeMin) requiredSEE = seeMin;
    }

    const achievable = requiredSEE <= maxSEE && requiredSEE >= 0;
    requiredSEE = Math.max(0, Math.min(requiredSEE, maxSEE));

    return { requiredSEE: Math.ceil(requiredSEE), maxSEE, achievable };
}

/**
 * Suggest grade combinations for a desired SGPA
 */
export function suggestGradeCombinations(subjects, desiredSGPA) {
    if (subjects.length === 0) return [];

    const system = getCurrentSystem();
    const passingGrades = system.gradeScale
        .filter((g) => g.point >= system.passingPoint)
        .map((g) => g.letter);

    const results = [];
    const seen = new Set();
    const tolerance = 0.15;

    // Monte Carlo simulation
    for (let i = 0; i < 10000; i++) {
        const combo = subjects.map(() =>
            passingGrades[Math.floor(Math.random() * passingGrades.length)]
        );
        const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
        const totalPoints = subjects.reduce((sum, s, idx) => {
            const point = getPointFromGrade(combo[idx]);
            return sum + s.credits * point;
        }, 0);

        const sgpa = totalCredits ? totalPoints / totalCredits : 0;

        if (Math.abs(sgpa - desiredSGPA) <= tolerance) {
            const key = combo.join(',');
            if (!seen.has(key)) {
                seen.add(key);
                results.push(combo);
                if (results.length >= 30) break;
            }
        }
    }

    return results;
}

/**
 * Parse bulk import text
 */
export function parseBulkImport(text) {
    const lines = text.trim().split('\n');
    const subjects = [];
    const errors = [];

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;

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
                    seeMarks: undefined,
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

/**
 * Analyze feasibility of achieving desired grades
 */
export function analyzeFeasibility(subjects, examDate, maxDailyHours) {
    const today = new Date();
    const exam = new Date(examDate);
    today.setHours(0, 0, 0, 0);
    exam.setHours(0, 0, 0, 0);

    const diffTime = exam - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) {
        return { status: 'EXPIRED', message: 'Exam date is in the past!', color: '#9ca3af' };
    }

    const totalAvailableHours = daysLeft * maxDailyHours;
    let totalHoursNeeded = 0;

    subjects.forEach((sub) => {
        let multiplier = 1.0;
        const grade = sub.desiredGrade || 'B';
        if (['O', 'A+', 'S', 'S+'].includes(grade)) multiplier = 1.6;
        else if (['A', 'B+', 'B', 'C'].includes(grade)) multiplier = 1.2;
        else multiplier = 0.8;

        totalHoursNeeded += Math.round(sub.credits * 8 * multiplier);
    });

    const ratio = totalHoursNeeded / totalAvailableHours;
    const hoursPerDayNeeded = (totalHoursNeeded / daysLeft).toFixed(1);

    if (ratio > 2.0) {
        return { status: 'IMPOSSIBLE', color: '#ef4444', message: `Need ${hoursPerDayNeeded}h/day. Impossible.` };
    }
    if (ratio > 1.2) {
        return { status: 'OVERLOAD', color: '#f97316', message: `Warning: Need ${hoursPerDayNeeded}h/day.` };
    }
    if (ratio > 0.85) {
        return { status: 'TIGHT', color: '#eab308', message: `Tight schedule. ${hoursPerDayNeeded}h/day.` };
    }
    return { status: 'COMFORTABLE', color: '#22c55e', message: `Easy win. Only ${hoursPerDayNeeded}h/day.` };
}

// Backward compatibility exports
export const allGrades = ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'];
export const passingGrades = ['O', 'A+', 'A', 'B+', 'B', 'C', 'P'];

// Legacy grade mappings (for components still using old system)
export const gradeMinMarks = {
    O: 90,
    'A+': 80,
    A: 70,
    'B+': 60,
    B: 55,
    C: 50,
    P: 40,
    F: 0,
};

export const nToGrade = {
    0: 'O',
    1: 'A+',
    2: 'A',
    3: 'B+',
    4: 'B',
    5: 'C',
    6: 'P',
    10: 'F',
};

export const gradeToN = {
    O: 0,
    'A+': 1,
    A: 2,
    'B+': 3,
    B: 4,
    C: 5,
    P: 6,
    F: 10,
};
