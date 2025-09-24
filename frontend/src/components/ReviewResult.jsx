import React from 'react';
import { Star, Clock, Code2 } from 'lucide-react';

const ReviewResult = ({ review, rating, timestamp, isLoading }) => {
  if (isLoading) {
    return (
      <div className="review-result glass-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <h3>AI аналізує ваш код</h3>
            <p>Зачекайте, будь ласка<span className="loading-dots">...</span></p>
          </div>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="review-result glass-container">
        <div className="text-center" style={{padding: '3rem 2rem', color: 'rgba(255,255,255,0.7)'}}>
          <Code2 size={48} style={{margin: '0 auto 1rem', opacity: 0.5}} />
          <h3 style={{marginBottom: '0.5rem'}}>Чекаємо на код</h3>
          <p>Введіть код у редактор для отримання аналізу</p>
        </div>
      </div>
    );
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('uk-UA');
  };

  return (
    <div className="review-result glass-container" style={{padding: '2rem', height: '100%'}}>
      <div className="review-header">
        <div className="rating">
          <Star size={24} style={{fill: 'currentColor'}} />
          <span>{rating}/10</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)'}}>
          <Clock size={16} />
          <span style={{fontSize: '0.9rem'}}>{formatTimestamp(timestamp)}</span>
        </div>
      </div>
      
      <div className="review-content">
        <div className="review-text">{review}</div>
      </div>
    </div>
  );
};

export default ReviewResult;