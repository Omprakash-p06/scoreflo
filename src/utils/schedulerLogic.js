/**
 * Smart Study Scheduler Logic
 * Generates an optimized study schedule based on subject priorities
 */

export function generateStudySchedule(subjects, daysLeft, dailyHours) {
    if (daysLeft <= 0 || subjects.length === 0) return null;

    let totalWeight = 0;
    const schedule = [];

    // Step 1: Calculate "Urgency Weight" for each subject
    const weightedSubjects = subjects.map(sub => {
        // Heuristic 1: Credits are the base multiplier (High credits = High priority)
        let weight = sub.credits * 10;

        // Heuristic 2: Damage Control (Low internals + High Credits = CRITICAL)
        // If internals are < 60% (e.g., < 30/50), boost priority massively
        const internalPercentage = (sub.internalMarks / 50) * 100;
        if (internalPercentage < 60) {
            weight *= 1.5; // Panic mode multiplier
        }

        // Heuristic 3: Scorable "Greed" (High internals + High Target = Finish Strong)
        // If they are already winning, ensure they don't choke.
        if (internalPercentage > 85 && ['O', 'A+'].includes(sub.desiredGrade)) {
            weight *= 1.2; // "Secure the bag" multiplier
        }

        totalWeight += weight;
        return { ...sub, weight, internalPercentage };
    });

    // Step 2: Distribute Time Intelligently
    const totalAvailableHours = daysLeft * dailyHours;

    // Sort by weight (Most critical first)
    weightedSubjects.sort((a, b) => b.weight - a.weight);

    weightedSubjects.forEach(sub => {
        const share = sub.weight / totalWeight;
        const allocatedHours = Math.round(share * totalAvailableHours);
        const hoursPerDay = (allocatedHours / daysLeft).toFixed(1);

        // Generate "AI Context" message
        let strategy = "Maintain pace.";
        let color = "#3b82f6"; // blue

        if (sub.internalPercentage < 60) {
            strategy = "🚨 DAMAGE CONTROL: You are behind. Focus on high-weight units immediately.";
            color = "#ef4444"; // red
        } else if (sub.weight > 60) {
            strategy = "💎 HIGH ROI: This is your top scoring subject. Master it for SGPA boost.";
            color = "#eab308"; // gold
        } else if (allocatedHours < 5) {
            strategy = "📉 Maintenance: Just review notes. Don't over-study.";
            color = "#6b7280"; // gray
        }

        if (allocatedHours > 0) {
            schedule.push({
                ...sub,
                allocatedHours,
                hoursPerDay,
                strategy,
                color
            });
        }
    });

    return { schedule, totalAvailableHours };
}
