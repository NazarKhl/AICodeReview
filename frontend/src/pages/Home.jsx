import React, { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import ReviewResult from '../components/ReviewResult';
import { reviewService } from '../services/reviewService';

const Home = () => {
  const [currentReview, setCurrentReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (code, language) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await reviewService.submitReview(code, language);
      setCurrentReview(result);
    } catch (err) {
      setError(err.message || 'Failed to analyze code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="hero">
        <h1 className="hero-title">AI Code Review Assistant</h1>
        <p className="hero-subtitle">
          Get instant AI-powered code analysis using local Ollama Gemini
        </p>
      </div>

      <div className="code-review-container">
        <div className="code-editor-container">
          <CodeEditor onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
        
        <div className="review-result-container">
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--text-primary)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              borderLeft: '4px solid #ef4444'
            }}>
              {error}
            </div>
          )}
          <ReviewResult 
            review={currentReview?.review}
            rating={currentReview?.rating}
            timestamp={currentReview?.timestamp}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;