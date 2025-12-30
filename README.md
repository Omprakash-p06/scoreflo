# 🎓 ScoreFlo - Smart SGPA Calculator

A smart, interactive web tool to plan your semester, simulate results, and achieve your desired SGPA.  
Built for engineering students with a stunning glassmorphism design and animated UI!

![React](https://img.shields.io/badge/React-18-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite) ![PWA](https://img.shields.io/badge/PWA-Ready-green?logo=pwa)

---

## ✨ Features

### 📊 SGPA Calculator
- **Subject Management**: Add, edit, duplicate, and delete subjects
- **Grade Planner**: Enter your desired SGPA and get all possible grade combinations
- **SEE Simulator**: Input expected marks and calculate your final SGPA
- **Auto-Save**: Data persists in localStorage

### 📅 Exam HQ
- **Reality Check**: Set exam date and gap between exams
- **Smart Scheduler**: Get study hour allocations based on credits and internals
- **Feasibility Analysis**: See if your study plan is realistic

### 🎨 Premium UI
- **Glassmorphism Design**: Fluid glass panels with backdrop blur
- **Animated Background**: Floating purple particles
- **Glass Dock**: macOS-style navigation dock
- **PWA Support**: Install on Android/iOS, works offline

---

## 🎓 Grading Systems

### Currently Supported: VTU (M S Ramaiah Institute of Technology)

| Grade | Marks Range | Grade Points |
|-------|-------------|--------------|
| O     | 90-100      | 10           |
| A+    | 80-89       | 9            |
| A     | 70-79       | 8            |
| B+    | 60-69       | 7            |
| B     | 50-59       | 6            |
| C     | 45-49       | 5            |
| P     | 40-44       | 4            |
| F     | <40         | 0            |

**SGPA Formula**: `SGPA = Σ(Grade Points × Credits) / Σ(Credits)`

> 🔜 **Coming Soon**: Settings panel to choose from multiple grading systems (Anna University, Mumbai University, JNTU, etc.)

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite 6
- **Styling**: CSS Modules + Glassmorphism
- **Routing**: React Router DOM
- **Icons**: React Icons
- **PWA**: Vite PWA Plugin + Workbox
- **Deployment**: Netlify

---

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/Omprakash-p06/sgpa-calculator.git
cd sgpa-calculator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📁 Project Structure

```
scoreflo/
├── src/
│   ├── components/
│   │   ├── AnimatedBackground.jsx  # CSS particle background
│   │   ├── GlassDock.jsx           # Navigation dock
│   │   ├── InstallPrompt.jsx       # PWA install banner
│   │   ├── MagicCard.jsx           # Card with effects
│   │   ├── SubjectTable.jsx        # Subject data table
│   │   ├── StatsCard.jsx           # SGPA calculator
│   │   └── ...
│   ├── pages/
│   │   ├── Dashboard.jsx           # Main SGPA page
│   │   └── ExamPlanner.jsx         # Exam HQ page
│   ├── utils/
│   │   ├── sgpaLogic.js            # SGPA calculations
│   │   └── schedulerLogic.js       # Study scheduler
│   ├── App.jsx
│   └── index.css
├── netlify.toml
├── vite.config.js
└── package.json
```

---

## 🙋‍♂️ Contributing

Pull requests are welcome! For major changes, please open an issue first.

### Planned Features:
- [ ] Settings panel with grading system selection
- [ ] More university grading systems
- [ ] Export/Import data as JSON
- [ ] Dark/Light theme toggle

---

## ⭐ Show Your Support

If this helped you plan your semester, give it a ⭐ on [GitHub](https://github.com/Omprakash-p06/sgpa-calculator)!

---

Made with 💜 for engineering students | M S Ramaiah Institute of Technology
