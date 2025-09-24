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
As an expert senior software engineer and mentor, thoroughly analyze the following ${language} code snippet. 
Provide a detailed, constructive, and actionable review covering the following aspects:

1. **Code Quality and Style**:
   - Overall readability and clarity of the code
   - Logical structure and organization of functions/classes
   - Appropriateness of variable and function names
   - Consistency in naming conventions, indentation, and spacing
   - Use of comments where necessary

2. **Correctness and Potential Issues**:
   - Bugs, logical errors, or incorrect outputs
   - Edge cases that might break the code
   - Security vulnerabilities or unsafe practices
   - Performance bottlenecks or inefficient patterns

3. **Best Practices and Standards**:
   - Adherence to ${language} best practices and idioms
   - Use of modern language features if applicable
   - Maintainability and scalability considerations
   - Error handling and defensive programming

4. **Improvement Suggestions**:
   - Refactoring opportunities for cleaner or shorter code
   - Alternative approaches or algorithms for better efficiency
   - Suggestions for improving readability and maintainability
   - Guidance on naming, commenting, and structuring the code

5. **Mentor Notes**:
   - Friendly explanations of mistakes and how to avoid them
   - Advice on coding style, design patterns, and software engineering principles
   - Encouragement for improvement and learning tips

6. **Overall Assessment**:
   - Provide a score from 1 to 10, with reasoning for the rating
   - Highlight both strengths and weaknesses

**Code to review (${language}):**
\`\`\`${language}
${code}
\`\`\`

Please format the review clearly with numbered sections and subpoints. Include examples and suggestions where possible, and write in an educational, mentor-like tone.`;
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