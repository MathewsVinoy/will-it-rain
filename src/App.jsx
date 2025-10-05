import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoadingOverlay from './components/LoadingOverlay'
import './App.css'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const ResultsPage = lazy(() => import('./pages/ResultsPage'))

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingOverlay />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
