/**
 * ScoreFlo App - Main Router Configuration
 * @description Routes for Dashboard and Exam Planner pages
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import ExamPlanner from './pages/ExamPlanner';
import GlassDock from './components/GlassDock';
import InstallPrompt from './components/InstallPrompt';

/**
 * Main App component with routing
 * @returns {JSX.Element} App with routes, glass dock, and PWA install prompt
 */
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/planner" element={<ExamPlanner />} />
            </Routes>
            <GlassDock />
            <InstallPrompt />
        </BrowserRouter>
    );
}

export default App;
