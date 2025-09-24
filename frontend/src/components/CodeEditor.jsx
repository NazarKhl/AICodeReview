import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';

const CodeEditor = ({ onSubmit, isLoading }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const languages = [
    { name: 'JavaScript', value: 'javascript', mode: javascript },
    { name: 'Python', value: 'python', mode: python },
    { name: 'Java', value: 'java', mode: java },
    { name: 'C++', value: 'cpp', mode: cpp },
    { name: 'HTML', value: 'html', mode: html },
    { name: 'CSS', value: 'css', mode: css },
    { name: 'SQL', value: 'sql', mode: sql },
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

  const selectedLanguage = languages.find((l) => l.value === language);

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        maxWidth: '900px',
        margin: '2rem auto',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Language Selector */}
        <div style={{ marginBottom: '1rem' }}>
          <label
            style={{
              fontWeight: 600,
              marginBottom: '0.5rem',
              display: 'block',
              fontSize: '1rem',
            }}
          >
            Select Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Code Editor */}
        <div
          style={{
            marginBottom: '1.5rem',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #1e293b',
          }}
        >
          <CodeMirror
            value={code}
            height="400px"
            extensions={[selectedLanguage.mode()]}
            theme={oneDark}
            onChange={(value) => setCode(value)}
            style={{ fontSize: '0.95rem' }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            style={{
              flex: 1,
              minWidth: '140px',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              background: '#3b82f6',
              color: '#fff',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.background = '#2563eb')}
            onMouseLeave={(e) => !isLoading && (e.currentTarget.style.background = '#3b82f6')}
          >
            <Play size={16} />
            {isLoading ? 'Analyzing...' : 'Analyze Code'}
          </button>

          <button
            type="button"
            onClick={resetForm}
            style={{
              flex: 1,
              minWidth: '140px',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              background: '#f3f4f6',
              color: '#111827',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f3f4f6')}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default CodeEditor;
