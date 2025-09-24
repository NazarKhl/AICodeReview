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
      setError(err.message || 'Не вдалося проаналізувати код');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="hero">
        <h1 className="hero-title">AI Асистент Аналізу Коду</h1>
        <p className="hero-subtitle">
          Отримайте миттєвий AI-аналіз вашого коду з використанням локального Ollama Gemini
        </p>
      </div>

      <div className="code-review-container">
        <div className="code-editor-container">
          <CodeEditor onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
        
        <div className="review-result-container">
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'white',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1rem'
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