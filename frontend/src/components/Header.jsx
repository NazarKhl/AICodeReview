import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, History, Sparkles } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Code Review', icon: Sparkles },
    { path: '/history', label: 'History', icon: History },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <Code2 className="logo-icon" />
          <span>AI Code Review</span>
        </Link>
        
        <nav className="nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;