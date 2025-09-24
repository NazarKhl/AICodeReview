import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Code2 } from 'lucide-react';
import { reviewService } from '../services/reviewService';

const ReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReview();
  }, [id]);

  const loadReview = async () => {
    try {
      const data = await reviewService.getReview(id);
      setReview(data);
    } catch {
      setError('Failed to load review');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error || !review) {
    return (
      <div className="no-results">
        <Code2 className="icon-large" />
        <p>{error || 'Review not found'}</p>
        <Link to="/history" className="btn-primary">
          <ArrowLeft className="icon-small" /> Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="review-detail container">
      <Link to="/history" className="back-link">
        <ArrowLeft className="icon-small" /> Back to History
      </Link>

      <div className="review-card">
        <div className="flex justify-between mb-6">
          <span className="tag">{review.language}</span>
          <div className="flex items-center gap-2">
            <Star className="icon-small text-yellow" />
            <span>{review.rating}/10</span>
            <Calendar className="icon-small" />
            <span>{new Date(review.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3>Code Snippet:</h3>
          <pre className="code-editor">{review.code_snippet}</pre>
        </div>

        <div>
          <h3>AI Review:</h3>
          <pre className="review-text">{review.review_result}</pre>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
