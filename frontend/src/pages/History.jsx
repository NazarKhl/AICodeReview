import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Calendar, Code2, Trash2, Edit, Search } from "lucide-react";
import { reviewService } from "../services/reviewService";
import {
  Card,
  Input,
  Button,
  Modal,
  Form,
  Empty,
  Spin,
  Tag,
  Typography,
  Space,
  message,
} from "antd";

const { Title } = Typography;

const History = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingReview, setEditingReview] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await reviewService.getHistory();
      setReviews(history);
    } catch (error) {
      console.error("Failed to load history:", error);
      message.error("Failed to load review history");
    } finally {
      setLoading(false);
    }
  };

  /** Видалення */
  const showDeleteModal = (id) => {
    setSelectedDeleteId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(selectedDeleteId);
    try {
      await reviewService.deleteReview(Number(selectedDeleteId));
      setReviews((prev) => prev.filter((r) => r.id !== Number(selectedDeleteId)));
      message.success("Review deleted successfully");
    } catch (error) {
      console.error("Failed to delete review:", error);
      message.error("Failed to delete review");
    } finally {
      setDeleteLoading(null);
      setDeleteModalVisible(false);
    }
  };

  /** Редагування */
  const handleEdit = (review) => {
    setEditingReview(review);
    setIsEditing(true);
    form.setFieldsValue({ title: review.language });
  };

  const handleSaveEdit = async () => {
    try {
      const values = await form.validateFields();
      setEditLoading(true);

      await reviewService.updateReview(Number(editingReview.id), {
        language: values.title,
      });

      setReviews((prev) =>
        prev.map((r) =>
          r.id === Number(editingReview.id) ? { ...r, language: values.title } : r
        )
      );

      setIsEditing(false);
      setEditingReview(null);
      form.resetFields();
      message.success("Review updated successfully");
    } catch (error) {
      if (error.errorFields) return;
      console.error("Failed to update review:", error);
      message.error("Failed to update review");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingReview(null);
    form.resetFields();
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review_result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="history-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <Spin size="large" tip="Loading reviews..." />
      </div>
    );
  }

  return (
    <div className="history-container" style={{ padding: "20px" }}>
      {/* Заголовок + пошук */}
      <div className="history-header" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", marginBottom: "20px" }}>
        <Title level={1} style={{ margin: 0, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Review History
        </Title>
        <Input
          prefix={<Search size={16} />}
          placeholder="Search reviews by language or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px" }}
          allowClear
        />
      </div>

      {/* Редагування */}
      <Modal
        title="Edit Review Title"
        open={isEditing}
        onOk={handleSaveEdit}
        onCancel={handleCancelEdit}
        confirmLoading={editLoading}
        okText="Save Changes"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Review Title"
            rules={[
              { required: true, message: "Please enter a title!" },
              { min: 1, message: "Title must not be empty!" },
            ]}
          >
            <Input placeholder="Enter review title..." size="large" maxLength={50} showCount />
          </Form.Item>
        </Form>
      </Modal>

      {/* Видалення */}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okType="danger"
        okText="Delete"
        cancelText="Cancel"
        confirmLoading={deleteLoading !== null}
      >
        Are you sure you want to delete this review? This action cannot be undone.
      </Modal>

      {/* Список відгуків */}
      {filteredReviews.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={searchTerm ? "No reviews match your search criteria" : "No reviews found"}
          style={{ margin: "100px 0" }}
        >
          {!searchTerm && (
            <Button type="primary" size="large">
              <Link to="/">Analyze Your First Code</Link>
            </Button>
          )}
        </Empty>
      ) : (
        <div className="reviews-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "20px" }}>
          {filteredReviews.map((review) => (
            <Card
              key={review.id}
              hoverable
              style={{ borderRadius: "12px", border: "1px solid #f0f0f0", cursor: "pointer", height: "100%" }}
              bodyStyle={{ padding: "20px", height: "100%" }}
            >
              <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "12px" }}>
                <Link to={`/review/${review.id}`} style={{ textDecoration: "none", color: "inherit", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <Tag color="blue" style={{ fontSize: "12px", fontWeight: "600", padding: "4px 8px", borderRadius: "6px" }}>
                      {review.language.toUpperCase()}
                    </Tag>
                    <Space size="small">
                    </Space>
                  </div>

                  <Space size="small" style={{ marginBottom: "12px", color: "#666" }}>
                    <Calendar size={14} />
                    <span style={{ fontSize: "12px" }}>
                      {new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </Space>

                  <div style={{ color: "#666", lineHeight: "1.5", fontSize: "14px", maxHeight: "60px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                    {review.review_result.substring(0, 150)}...
                  </div>
                </Link>

                <Space style={{ marginTop: "auto", justifyContent: "flex-end" }}>
                  <Button type="text" icon={<Edit size={14} />} onClick={() => handleEdit(review)} size="small">
                    Edit
                  </Button>
                  <Button type="text" danger icon={<Trash2 size={14} />} onClick={() => showDeleteModal(review.id)} loading={deleteLoading === review.id} size="small">
                    Delete
                  </Button>
                </Space>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
