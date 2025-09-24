const axios = require('axios');

class OllamaClient {
  constructor(baseURL = 'http://localhost:11434') {
    this.baseURL = baseURL;
  }

  async generateReview(code, language) {
    try {
      const prompt = this.buildPrompt(code, language);
      
      const response = await axios.post(`${this.baseURL}/api/generate`, {
        model: 'gemma3:4b',
        prompt: prompt,
        stream: false
      });

      return this.parseResponse(response.data.response);
    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw new Error('Failed to generate review');
    }
  }

  buildPrompt(code, language) {
    return `
As an expert code reviewer, analyze the following ${language} code snippet. Provide a comprehensive review covering:

1. Code Quality Assessment:
   - Code structure and organization
   - Readability and maintainability
   - Best practices adherence

2. Potential Issues:
   - Bugs or logical errors
   - Security vulnerabilities
   - Performance concerns

3. Improvements:
   - Specific suggestions for optimization
   - Alternative approaches if applicable
   - Code style recommendations

4. Overall Rating: Provide a score from 1-10

Code to review (${language}):
\`\`\`${language}
${code}
\`\`\`

Please provide your review in a structured format with clear sections.`;
  }

  parseResponse(response) {
    // Extract rating from response
    const ratingMatch = response.match(/Overall Rating:\s*(\d+)\/10/i);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : null;

    return {
      review: response,
      rating: rating
    };
  }
}

module.exports = OllamaClient;