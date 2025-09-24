import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Input, Button, Form } from 'antd';
import { Star, Calendar, Code2, Edit, Trash2 } from 'lucide-react';
import { reviewService } from '../services/reviewService';

const { confirm } = Modal;

const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/[\*_#`]/g, '')
    .replace(/-{3,}/g, '')
    .replace(/^\s*[-*+]\s/gm, '• ')
    .replace(/\n{3,}/g, '\n\n');
};

const History = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await reviewService.getHistory();
        setReviews(data);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const handleDelete = (id) => {
    confirm({
      title: 'Are you sure you want to delete this review?',
      okText: 'Yes',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await reviewService.deleteReview(id);
          setReviews(reviews.filter((r) => r.id !== id));
        } catch (err) {
          console.error('Failed to delete review:', err);
        }
      },
    });
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    form.setFieldsValue({ title: review.language });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await reviewService.renameReview(editingReview.id, values.title);
      setReviews(
        reviews.map((r) =>
          r.id === editingReview.id ? { ...r, language: values.title } : r
        )
      );
      setIsModalVisible(false);
      setEditingReview(null);
    } catch (err) {
      console.error('Failed to update review:', err);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingReview(null);
  };

  const filteredReviews = reviews.filter(
    (r) =>
      r.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.review_result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div
      className="history-page container"
      style={{
        padding: '2rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Review History</h1>
        <Input
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      {filteredReviews.length === 0 ? (
        <div className="no-results" style={{ textAlign: 'center', color: '#6b7280' }}>
          <Code2 className="icon-large" />
          <p>No reviews found</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            justifyContent: 'center',
          }}
        >
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="review-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
                borderRadius: '1rem',
                background: '#ffffff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
              }}
            >
              <Link
                to={`/review/${review.id}`}
                style={{ textDecoration: 'none', color: '#1f2937' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    {review.language}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#4b5563',
                    }}
                  >
                    <Star className="icon-small text-yellow" />
                    <span>{review.rating}/10</span>
                    <Calendar className="icon-small" />
                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <p style={{ whiteSpace: 'pre-wrap', color: '#374151', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {cleanText(review.review_result).substring(0, 250)}...
                </p>
              </Link>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', justifyContent: 'flex-end' }}>
                <Button
                  type="link"
                  icon={<Edit />}
                  onClick={() => handleEdit(review)}
                >
                  Edit
                </Button>
                <Button
                  type="link"
                  danger
                  icon={<Trash2 />}
                  onClick={() => handleDelete(review.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title="Edit Review"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default History;
