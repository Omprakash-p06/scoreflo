/**
 * SGPA Calculation Logic
 * Supports multiple grading systems (VTU, PES, RVCE, IITs)
 * Uses standard SGPA formula: SGPA = Σ(Credits × GradePoints) / Σ(Credits)
 */

import { getCurrentSystem, marksToGrade as systemMarksToGrade, sgpaToPercentage } from './gradingSystems';

/**
 * Get grade mappings from current grading system
 */
function getGradeMappings() {
    const system = getCurrentSystem();
    const gradeToPoint = {};
    const pointToGrade = {};
    const gradeMinMarks = {};
    const allGrades = [];
    const passingGrades = [];

    system.gradeScale.forEach((grade) => {
        gradeToPoint[grade.letter] = grade.point;
        pointToGrade[grade.point] = grade.letter;
        if (grade.minMarks !== undefined) {
            gradeMinMarks[grade.letter] = grade.minMarks;
        }
        allGrades.push(grade.letter);
        if (grade.point >= system.passingPoint) {
            passingGrades.push(grade.letter);
        }
    });

    return { gradeToPoint, pointToGrade, gradeMinMarks, allGrades, passingGrades, system };
}

// Legacy exports for backward compatibility
export const gradeToN = {
    "O": 0, "A+": 1, "A": 2, "B+": 3, "B": 4, "C": 5, "P": 6, "F": 10
};
export const nToGrade = {
    0: "O", 1: "A+", 2: "A", 3: "B+", 4: "B", 5: "C", 6: "P", 10: "F"
};
export const allNValues = [0, 1, 2, 3, 4, 5, 6, 10];
export const passingNValues = [0, 1, 2, 3, 4, 5, 6];
export const passingGrades = ["O", "A+", "A", "B+", "B", "C", "P"];
export const gradeMinMarks = {
    "O": 90, "A+": 80, "A": 70, "B+": 60, "B": 50, "C": 45, "P": 40, "F": 0
};
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
 * NOTE: This is kept for backwards compatibility (e.g., SGPA calculation from SEE)
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

        // Include this grade if achievable
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
 * Get all achievable PASSING grades for a subject (excludes F)
 * Returns array of n values that are achievable based on internal marks
 */
function getAchievablePassingGrades(internal, credits) {
    const grades = [];
    const maxSEE = credits === 1 ? 50 : 100;

    // Check each grade from O to P (excluding F)
    for (const n of passingNValues) {
        const grade = nToGrade[n];
        const minMarks = gradeMinMarks[grade];

        let requiredSEE;
        if (credits === 1) {
            requiredSEE = minMarks - internal;
        } else {
            requiredSEE = (minMarks - internal) * 2;
        }

        // Only include if achievable (can score enough in SEE)
        if (requiredSEE <= maxSEE && requiredSEE >= 0) {
            grades.push(n);
        }
    }

    // Ensure at least P grade is included if the student has valid internal marks
    // P requires 40 total, so if internals >= 0 and we can score enough in SEE
    if (grades.length === 0) {
        const pRequired = credits === 1 ? (40 - internal) : (40 - internal) * 2;
        if (pRequired <= maxSEE && pRequired >= 0) {
            grades.push(6); // P grade
        }
    }

    return grades;
}

/**
 * Calculate the best and worst possible SGPA using passing grades only
 */
function getPassingSGPARange(subjects) {
    let minDeduction = 0;
    let maxDeduction = 0;

    subjects.forEach(subj => {
        const possibleGrades = getAchievablePassingGrades(subj.internalMarks, subj.credits);
        if (possibleGrades.length > 0) {
            const bestN = Math.min(...possibleGrades);
            const worstN = Math.max(...possibleGrades);
            minDeduction += 0.05 * subj.credits * bestN;
            maxDeduction += 0.05 * subj.credits * worstN;
        } else {
            // If no passing grades achievable, use P as worst case
            maxDeduction += 0.05 * subj.credits * 6;
        }
    });

    return {
        best: 10 - minDeduction,
        worst: Math.max(0, 10 - maxDeduction)
    };
}

/**
 * Calculate the best and worst possible SGPA given internal marks (including F)
 * NOTE: Kept for backwards compatibility
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
 * Calculate diversity score for a grade combination
 * Higher score = more variety in grade levels (shows trade-offs between subjects)
 */
function calculateDiversityScore(grades, subjects) {
    const nValues = grades.map(g => gradeToN[g]);
    const credits = subjects.map(s => s.credits);

    // Calculate weighted standard deviation of n values
    const totalCredits = credits.reduce((a, b) => a + b, 0);
    const weightedMean = nValues.reduce((sum, n, i) => sum + n * credits[i], 0) / totalCredits;
    const variance = nValues.reduce((sum, n, i) =>
        sum + credits[i] * Math.pow(n - weightedMean, 2), 0) / totalCredits;

    return Math.sqrt(variance);
}

/**
 * Select a diverse subset of combinations avoiding too-similar ones
 */
function selectDiverseSubset(combinations, maxCount) {
    if (combinations.length <= maxCount) return combinations;

    const selected = [combinations[0]];

    for (let i = 1; i < combinations.length && selected.length < maxCount; i++) {
        const candidate = combinations[i];

        // Check if sufficiently different from already selected
        const isDifferent = selected.every(existing => {
            const differences = candidate.grades.filter(
                (g, idx) => g !== existing.grades[idx]
            ).length;
            return differences >= 2; // At least 2 subjects must differ
        });

        if (isDifferent) {
            selected.push(candidate);
        }
    }

    // If we couldn't find enough diverse combinations, fill with remaining
    if (selected.length < maxCount) {
        for (let i = 1; i < combinations.length && selected.length < maxCount; i++) {
            if (!selected.includes(combinations[i])) {
                selected.push(combinations[i]);
            }
        }
    }

    return selected;
}

/**
 * Suggest grade combinations for a desired SGPA
 * Uses MULTIPLE STRATEGIES to find diverse combinations showing real trade-offs
 * EXCLUDES F grades
 */
export function suggestGradeCombinations(subjects, desiredSGPA) {
    if (subjects.length === 0 || subjects.length > 12) return [];

    const tolerance = 0.15;

    // Check if the desired SGPA is achievable with passing grades
    const range = getPassingSGPARange(subjects);
    if (desiredSGPA > range.best + tolerance) {
        return [];
    }
    if (desiredSGPA < range.worst - tolerance) {
        return [];
    }

    // Pre-compute achievable passing grades for each subject
    const possibleGradesPerSubject = subjects.map(subj =>
        getAchievablePassingGrades(subj.internalMarks, subj.credits)
    );

    // Store all found combinations with a Set for deduplication
    const combinationSet = new Set();
    const allCombinations = [];

    // Helper to add a combination if valid
    function addCombination(grades) {
        const key = grades.join(',');
        if (combinationSet.has(key)) return;

        const sgpa = 10 - grades.reduce((sum, grade, i) =>
            sum + 0.05 * subjects[i].credits * gradeToN[grade], 0);

        if (Math.abs(sgpa - desiredSGPA) <= tolerance) {
            combinationSet.add(key);
            allCombinations.push({ grades: [...grades], sgpa });
        }
    }

    // Strategy 1: Best grades first (original approach - limited)
    function exploreFromBest() {
        const found = [];
        function backtrack(idx, combo, deduction) {
            if (found.length >= 30) return;
            if (idx === subjects.length) {
                const sgpa = 10 - deduction;
                if (Math.abs(sgpa - desiredSGPA) <= tolerance) {
                    found.push([...combo]);
                }
                return;
            }
            // Try grades from best to worst
            for (const n of possibleGradesPerSubject[idx]) {
                combo.push(nToGrade[n]);
                backtrack(idx + 1, combo, deduction + 0.05 * subjects[idx].credits * n);
                combo.pop();
                if (found.length >= 30) return;
            }
        }
        backtrack(0, [], 0);
        found.forEach(grades => addCombination(grades));
    }

    // Strategy 2: Worst passing grades first
    function exploreFromWorst() {
        const found = [];
        function backtrack(idx, combo, deduction) {
            if (found.length >= 30) return;
            if (idx === subjects.length) {
                const sgpa = 10 - deduction;
                if (Math.abs(sgpa - desiredSGPA) <= tolerance) {
                    found.push([...combo]);
                }
                return;
            }
            // Try grades from worst to best (reversed)
            const reversedNs = [...possibleGradesPerSubject[idx]].reverse();
            for (const n of reversedNs) {
                combo.push(nToGrade[n]);
                backtrack(idx + 1, combo, deduction + 0.05 * subjects[idx].credits * n);
                combo.pop();
                if (found.length >= 30) return;
            }
        }
        backtrack(0, [], 0);
        found.forEach(grades => addCombination(grades));
    }

    // Strategy 3: Middle grades first (balanced approach)
    function exploreFromMiddle() {
        const found = [];
        function backtrack(idx, combo, deduction) {
            if (found.length >= 30) return;
            if (idx === subjects.length) {
                const sgpa = 10 - deduction;
                if (Math.abs(sgpa - desiredSGPA) <= tolerance) {
                    found.push([...combo]);
                }
                return;
            }
            // Start from middle grade, then alternate outward
            const grades = possibleGradesPerSubject[idx];
            const midIdx = Math.floor(grades.length / 2);
            const orderedNs = [];
            for (let i = 0; i < grades.length; i++) {
                const offset = Math.floor((i + 1) / 2) * (i % 2 === 0 ? 1 : -1);
                const actualIdx = midIdx + offset;
                if (actualIdx >= 0 && actualIdx < grades.length && !orderedNs.includes(grades[actualIdx])) {
                    orderedNs.push(grades[actualIdx]);
                }
            }
            // Fill any missing
            grades.forEach(n => { if (!orderedNs.includes(n)) orderedNs.push(n); });

            for (const n of orderedNs) {
                combo.push(nToGrade[n]);
                backtrack(idx + 1, combo, deduction + 0.05 * subjects[idx].credits * n);
                combo.pop();
                if (found.length >= 30) return;
            }
        }
        backtrack(0, [], 0);
        found.forEach(grades => addCombination(grades));
    }

    // Strategy 4: Force variation in high-internal subjects
    // This specifically targets the "fixated O grades" problem
    function exploreWithForcedVariation() {
        // Find subjects that have multiple grade options and high internals
        const subjectsWithOptions = subjects.map((subj, idx) => ({
            idx,
            options: possibleGradesPerSubject[idx].length,
            credits: subj.credits,
            internals: subj.internalMarks
        })).filter(s => s.options > 1).sort((a, b) => b.credits - a.credits);

        // For each high-option subject, try forcing it to a non-best grade
        for (const variedSubj of subjectsWithOptions.slice(0, 5)) {
            const grades = possibleGradesPerSubject[variedSubj.idx];
            // Skip the best grade (index 0), try others
            for (let forceIdx = 1; forceIdx < grades.length && forceIdx < 4; forceIdx++) {
                const forcedN = grades[forceIdx];
                const found = [];

                function backtrack(idx, combo, deduction) {
                    if (found.length >= 10) return;
                    if (idx === subjects.length) {
                        const sgpa = 10 - deduction;
                        if (Math.abs(sgpa - desiredSGPA) <= tolerance) {
                            found.push([...combo]);
                        }
                        return;
                    }

                    let gradesToTry = possibleGradesPerSubject[idx];
                    if (idx === variedSubj.idx) {
                        gradesToTry = [forcedN]; // Force this specific grade
                    }

                    for (const n of gradesToTry) {
                        combo.push(nToGrade[n]);
                        backtrack(idx + 1, combo, deduction + 0.05 * subjects[idx].credits * n);
                        combo.pop();
                        if (found.length >= 10) return;
                    }
                }
                backtrack(0, [], 0);
                found.forEach(grades => addCombination(grades));
            }
        }
    }

    // Strategy 5: Random sampling with different subject orderings
    function exploreWithShuffledOrder() {
        for (let attempt = 0; attempt < 3; attempt++) {
            // Create shuffled subject order
            const order = subjects.map((_, i) => i);
            for (let i = order.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [order[i], order[j]] = [order[j], order[i]];
            }

            const found = [];
            function backtrack(orderIdx, combo, deduction) {
                if (found.length >= 20) return;
                if (orderIdx === subjects.length) {
                    // Reorder combo back to original subject order
                    const reordered = new Array(subjects.length);
                    order.forEach((origIdx, i) => {
                        reordered[origIdx] = combo[i];
                    });
                    const sgpa = 10 - deduction;
                    if (Math.abs(sgpa - desiredSGPA) <= tolerance) {
                        found.push(reordered);
                    }
                    return;
                }

                const origIdx = order[orderIdx];
                const grades = possibleGradesPerSubject[origIdx];
                // Alternate starting point based on attempt
                const startIdx = attempt % grades.length;
                const reorderedGrades = [...grades.slice(startIdx), ...grades.slice(0, startIdx)];

                for (const n of reorderedGrades) {
                    combo.push(nToGrade[n]);
                    backtrack(orderIdx + 1, combo, deduction + 0.05 * subjects[origIdx].credits * n);
                    combo.pop();
                    if (found.length >= 20) return;
                }
            }
            backtrack(0, [], 0);
            found.forEach(grades => addCombination(grades));
        }
    }

    // Run all strategies
    exploreFromBest();
    exploreFromWorst();
    exploreFromMiddle();
    exploreWithForcedVariation();
    exploreWithShuffledOrder();

    // Score and sort combinations
    const scoredCombinations = allCombinations.map(combo => ({
        ...combo,
        diversityScore: calculateDiversityScore(combo.grades, subjects)
    }));

    // Sort primarily by diversity, then by closeness to SGPA
    scoredCombinations.sort((a, b) => {
        // Primary: higher diversity is better (shows more trade-offs)
        const diversityDiff = b.diversityScore - a.diversityScore;
        if (Math.abs(diversityDiff) > 0.1) return diversityDiff;

        // Secondary: closer to desired SGPA
        return Math.abs(a.sgpa - desiredSGPA) - Math.abs(b.sgpa - desiredSGPA);
    });

    // Select diverse subset - require at least 3 different grades
    const selected = [];
    for (const combo of scoredCombinations) {
        if (selected.length >= 50) break;

        const isDifferent = selected.every(existing => {
            const differences = combo.grades.filter(
                (g, idx) => g !== existing.grades[idx]
            ).length;
            return differences >= 3; // At least 3 subjects must differ
        });

        if (selected.length === 0 || isDifferent) {
            selected.push(combo);
        }
    }

    // If not enough diverse ones, relax the constraint
    if (selected.length < 20) {
        for (const combo of scoredCombinations) {
            if (selected.length >= 50) break;
            if (!selected.includes(combo)) {
                const isDifferent = selected.every(existing => {
                    const differences = combo.grades.filter(
                        (g, idx) => g !== existing.grades[idx]
                    ).length;
                    return differences >= 2;
                });
                if (isDifferent) {
                    selected.push(combo);
                }
            }
        }
    }

    return selected.map(c => c.grades);
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

/**
 * Analyze feasibility of achieving desired grades based on available time
 * @param {Array} subjects - Array of subjects with desiredGrade
 * @param {string} examDate - Exam start date string
 * @param {number} maxDailyHours - Maximum study hours per day
 * @returns {Object} { status, message, color }
 */
export function analyzeFeasibility(subjects, examDate, maxDailyHours) {
    const today = new Date();
    const exam = new Date(examDate);
    today.setHours(0, 0, 0, 0);
    exam.setHours(0, 0, 0, 0);

    const diffTime = exam - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) {
        return { status: "EXPIRED", message: "Exam date is in the past!", color: "#9ca3af" };
    }

    const totalAvailableHours = daysLeft * maxDailyHours;
    let totalHoursNeeded = 0;

    subjects.forEach(sub => {
        let multiplier = 1.0;
        const grade = sub.desiredGrade || 'B';
        if (['O', 'A+'].includes(grade)) multiplier = 1.5;
        if (['P', 'E'].includes(grade)) multiplier = 0.5;
        totalHoursNeeded += Math.round((sub.credits * 8) * multiplier);
    });

    const ratio = totalHoursNeeded / totalAvailableHours;
    const hoursPerDayNeeded = (totalHoursNeeded / daysLeft).toFixed(1);

    if (ratio > 2.0) {
        return { status: "IMPOSSIBLE", color: "#ef4444", message: `Need ${hoursPerDayNeeded}h/day. Impossible.` };
    }
    if (ratio > 1.2) {
        return { status: "OVERLOAD", color: "#f97316", message: `Warning: Need ${hoursPerDayNeeded}h/day.` };
    }
    if (ratio > 0.85) {
        return { status: "TIGHT", color: "#eab308", message: `Tight schedule. ${hoursPerDayNeeded}h/day.` };
    }
    return { status: "COMFORTABLE", color: "#22c55e", message: `Easy win. Only ${hoursPerDayNeeded}h/day.` };
}
