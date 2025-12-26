# 🎓 Engineering SGPA Calculator

A smart, interactive web tool to plan your semester, simulate results, and achieve your desired SGPA.  
Built for VTU engineering students with a stunning dark purple theme and animated UI!

![SGPA Calculator Preview](https://img.shields.io/badge/React-18-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite) ![GSAP](https://img.shields.io/badge/GSAP-3-green?logo=greensock)

---

## ✨ Features

- **📚 Subject Management**: Add, edit, duplicate, and delete subjects with credits and internal marks
- **🎯 Grade Planner**: Enter your desired SGPA and get all possible grade combinations (including F!)
- **📊 Required SEE Calculator**: See exactly what SEE marks you need for each target grade
- **🧪 SEE Simulator**: Input expected SEE marks and instantly calculate your final SGPA
- **💾 Auto-Save**: Your data persists in localStorage - never lose your entries
- **📱 Responsive Design**: Works beautifully on desktop and mobile

### 🎨 Premium UI Features
- **Animated Squares Background**: Subtle diagonal-moving grid pattern
- **MagicBento Cards**: Panels with glow effects, particles, and tilt on hover
- **Global Spotlight**: Cursor-following light that illuminates nearby elements
- **Glass-morphism Design**: Modern translucent dark purple aesthetic

---

## 🖥️ Live Demo

**[Try it on Netlify →](https://sgpa-calculator2025.netlify.app/)**

---

## 📝 SGPA Formula (VTU)

> **SGPA = 10 − Σ[(0.05 × credits) × n]**

| Grade | Marks Range | n value |
|-------|------------|---------|
| O     | 90-100     | 0       |
| A+    | 80-89      | 1       |
| A     | 70-79      | 2       |
| B+    | 60-69      | 3       |
| B     | 50-59      | 4       |
| C     | 45-49      | 5       |
| P     | 40-44      | 6       |
| F     | <40        | 10      |

### Marks Breakdown (per subject = 100 marks)
- **Internal (50)**: CIE average (30) + Internal-Internal component (20)
- **External (50)**: SEE paper (100) ÷ 2 (except 1-credit courses)

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite 6
- **Styling**: CSS Modules + CSS Variables
- **Animations**: GSAP + Framer Motion
- **Icons**: React Icons
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
sgpa-calculator/
├── src/
│   ├── components/
│   │   ├── Squares.jsx          # Animated background
│   │   ├── MagicCard.jsx        # Card with glow/tilt effects
│   │   ├── GlobalSpotlight.jsx  # Cursor spotlight
│   │   ├── SubjectTable.jsx     # Main data table
│   │   ├── StatsCard.jsx        # Grade Planner & SEE Simulator
│   │   ├── GradeInfoCard.jsx    # Grade reference info
│   │   ├── AddSubjectModal.jsx  # Add subject form
│   │   └── ImportModal.jsx      # Bulk import
│   ├── utils/
│   │   └── sgpaLogic.js         # SGPA calculation engine
│   ├── App.jsx
│   ├── App.module.css
│   └── index.css                # Global styles & theme
├── index.html
├── package.json
├── vite.config.js
└── netlify.toml
```

---

## 🙋‍♂️ Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## ⭐ Show Your Support

If this helped you plan your semester, give it a ⭐ on [GitHub](https://github.com/Omprakash-p06/sgpa-calculator)!

---

Made with 💜 for engineering students
