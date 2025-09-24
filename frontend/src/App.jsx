import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import History from './pages/History';
import ReviewDetail from './pages/ReviewDetail';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-bg">
        <Header />
        <main className="container main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/review/:id" element={<ReviewDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
