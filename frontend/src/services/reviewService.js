import axios from 'axios';

const API_BASE_URL = '/api';

class ReviewService {
  async submitReview(code, language) {
    const response = await axios.post(`${API_BASE_URL}/review`, {
      code,
      language
    });
    return response.data;
  }

  async getHistory() {
    const response = await axios.get(`${API_BASE_URL}/review/history`);
    return response.data;
  }

  async getReview(id) {
    const response = await axios.get(`${API_BASE_URL}/review/${id}`);
    return response.data;
  }

  async updateReview(id, updates) {
    const response = await axios.put(`${API_BASE_URL}/review/${id}`, updates);
    return response.data;
  }

  async deleteReview(id) {
    const response = await axios.delete(`${API_BASE_URL}/review/${id}`);
    return response.data;
  }
}

export const reviewService = new ReviewService();