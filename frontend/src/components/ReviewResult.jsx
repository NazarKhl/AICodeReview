import React from 'react';
import { Star, Clock, Code2 } from 'lucide-react';

const ReviewResult = ({ review, rating, timestamp, isLoading }) => {
  if (isLoading) {
    return (
      <div className="review-result-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <h3>AI is analyzing your code</h3>
            <p>Please wait while we process your code<span className="loading-dots">...</span></p>
          </div>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="review-result-container">
        <div className="empty-state">
          <Code2 className="empty-state-icon" />
          <h3>Waiting for code</h3>
          <p>Enter your code in the editor to get AI analysis</p>
        </div>
      </div>
    );
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US');
  };

  // Clean up the review text - remove markdown formatting
  const cleanReview = review
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1')    // Remove italic
    .replace(/#{1,6}\s?/g, '')      // Remove headers
    .replace(/`(.*?)`/g, '$1')      // Remove inline code
    .replace(/-{3,}/g, '')          // Remove horizontal rules
    .replace(/^\s*[-*+]\s/gm, '• ') // Convert lists to simple bullets
    .replace(/\n{3,}/g, '\n\n');    // Limit consecutive newlines

  return (
    <div className="review-result-container">
      <div className="review-header">
        <div className="rating">
          <Star size={20} style={{fill: 'currentColor'}} />
          <span>{rating}/10</span>
        </div>
        <div className="flex items-center gap-2" style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
          <Clock size={16} />
          <span>{formatTimestamp(timestamp)}</span>
        </div>
      </div>
      
      <div className="review-content">
        <div className="review-text">{cleanReview}</div>
      </div>
    </div>
  );
};

export default ReviewResult;