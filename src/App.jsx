import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import FloorplanEditor from './pages/FloorplanEditor'
import Gallery from './pages/Gallery'
import Manufacturers from './pages/Manufacturers'
import DealerDirectory from './pages/DealerDirectory'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminPanel from './pages/AdminPanel'
import InboxSystem from './components/inbox/InboxSystem'
import UserProfile from './pages/UserProfile'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen transition-all duration-300">
            <Header />
            <Navigation />
            <motion.main
              className="pt-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/editor" element={<FloorplanEditor />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/manufacturers" element={<Manufacturers />} />
                <Route path="/dealers" element={<DealerDirectory />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/inbox" element={<InboxSystem />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/notifications" element={<div className="p-8 text-center"><h1>Notifications Coming Soon</h1></div>} />
                <Route path="/help" element={<div className="p-8 text-center"><h1>Help & Support Coming Soon</h1></div>} />
              </Routes>
            </motion.main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App