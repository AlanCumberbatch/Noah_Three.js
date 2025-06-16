import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import TriangleDemo from './demos/Triangle'
import CubeDemo from './demos/Cube'
import SphereDemo from './demos/Sphere'
import TorusDemo from './demos/Torus'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/triangle" replace />} />
          <Route path="/triangle" element={<TriangleDemo />} />
          <Route path="/cube" element={<CubeDemo />} />
          <Route path="/sphere" element={<SphereDemo />} />
          <Route path="/torus" element={<TorusDemo />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
