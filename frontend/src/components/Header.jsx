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
    <header>
      <div className="container">
        <div className="flex items-center justify-between">
          <Link to="/" className="logo">
            <Code2 className="icon-large" />
            <span>AI Code Review</span>
          </Link>
          <nav className="flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={isActive ? 'active' : ''}
                >
                  <Icon className="icon-small" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
