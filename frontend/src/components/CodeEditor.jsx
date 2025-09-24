import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const CodeEditor = ({ onSubmit, isLoading }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const languages = [
    'javascript', 'python', 'java', 'cpp', 'csharp', 'php', 'ruby',
    'go', 'rust', 'typescript', 'html', 'css', 'sql'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim() && !isLoading) {
      onSubmit(code, language);
    }
  };

  const resetForm = () => {
    setCode('');
    setLanguage('javascript');
  };

  return (
    <div className="review-card">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Code Snippet</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="code-editor"
            rows={12}
            required
          />
        </div>

        <div className="flex space-x-4">
          <button type="submit" disabled={isLoading || !code.trim()} className="btn-primary">
            <Play className="icon-small" />
            <span>{isLoading ? 'Analyzing...' : 'Analyze Code'}</span>
          </button>

          <button type="button" onClick={resetForm} className="btn-secondary">
            <RotateCcw className="icon-small" />
            <span>Reset</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CodeEditor;
