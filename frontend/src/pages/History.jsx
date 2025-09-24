import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Code2 } from 'lucide-react';
import { reviewService } from '../services/reviewService';

const History = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await reviewService.getHistory();
      setReviews(history);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(r =>
    r.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.review_result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="history-page container">
      <div className="flex justify-between items-center mb-8">
        <h1>Review History</h1>
        <input
          type="text"
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredReviews.length === 0 ? (
        <div className="no-results">
          <Code2 className="icon-large" />
          <p>No reviews found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredReviews.map((review) => (
            <Link key={review.id} to={`/review/${review.id}`} className="review-card">
              <div className="flex justify-between mb-3">
                <span className="tag">{review.language}</span>
                <div className="flex items-center gap-2">
                  <Star className="icon-small text-yellow" />
                  <span>{review.rating}/10</span>
                  <Calendar className="icon-small" />
                  <span>{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <p>{review.review_result.substring(0, 200)}...</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
