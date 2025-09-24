import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Code2 } from 'lucide-react';
import { reviewService } from '../services/reviewService';

const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/[\*_#`]/g, '')
    .replace(/-{3,}/g, '')
    .replace(/^\s*[-*+]\s/gm, '• ')
    .replace(/\n{3,}/g, '\n\n');
};

const ReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
    loadReview();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'Inter, sans-serif', color:'#4b5563' }}>
        <p>Loading review...</p>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', fontFamily:'Inter, sans-serif', color: '#6b7280' }}>
        <Code2 style={{ width: 64, height: 64, margin: '0 auto 1rem' }} />
        <p>{error || 'Review not found'}</p>
        <Link 
          to="/history" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
            background: '#3b82f6',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 500,
            fontFamily:'Inter, sans-serif'
          }}
        >
          <ArrowLeft /> Back to History
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem', fontFamily:'Inter, sans-serif', color:'#111827' }}>
      <Link 
        to="/history" 
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          color: '#3b82f6', 
          marginBottom: '1.5rem',
          textDecoration: 'none',
          fontWeight: 500
        }}
      >
        <ArrowLeft /> Back to History
      </Link>

      <div 
        style={{
          background: '#ffffff',
          borderRadius: '1rem',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          transition:'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span 
            style={{
              background: '#dbeafe',
              color: '#1e40af',
              padding: '0.35rem 0.75rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow:'0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {review.language}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4b5563', fontSize:'0.9rem' }}>
            <Calendar /> <span>{new Date(review.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '0.75rem', fontWeight: 700, fontSize:'1.1rem' }}>Code Snippet:</h3>
          <pre 
            style={{
              background: '#f3f4f6',
              padding: '1rem',
              borderRadius: '0.75rem',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              fontFamily: 'Fira Code, monospace',
              fontSize:'0.95rem',
              color: '#111827',
              lineHeight:1.6
            }}
          >
            {review.code_snippet}
          </pre>
        </div>

        <div>
          <h3 style={{ marginBottom: '0.75rem', fontWeight: 700, fontSize:'1.1rem' }}>AI Review:</h3>
          <pre
            style={{
              background: '#f9fafb',
              padding: '1rem',
              borderRadius: '0.75rem',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8,
              fontSize:'0.95rem',
              color: '#374151',
              fontFamily:'Inter, sans-serif'
            }}
          >
            {cleanText(review.review_result)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
