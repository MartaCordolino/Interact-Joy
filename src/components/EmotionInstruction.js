// src/components/EmotionInstruction.js
'use client';

import React, { useEffect } from 'react';
import usePlayAudio from './usePlayAudio';

export default function EmotionInstruction({ text }) {
  const speak = usePlayAudio();

  useEffect(() => {
    if (text) {
      speak(text);
    }
  }, [text, speak]);

  return (
    <div
      style={{
        textAlign: 'center',
        marginBottom: '1.5rem',
        backgroundColor: '#f2f2f2',
        padding: '1rem',
        borderRadius: '12px',
        color: '#333',
        maxWidth: '600px',
        margin: '0 auto',
      }}
      aria-live="polite"
    >
      <p
        style={{
          fontSize: '1.5rem',
          marginBottom: '1rem',
        }}
      >
        {text}
      </p>

      <button
        onClick={() => speak(text)}
        style={{
          fontSize: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
        aria-label="Repetir instrução"
        onMouseOver={(e) => (e.target.style.backgroundColor = '#005bb5')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#0070f3')}
      >
        🔁 Repetir
      </button>
    </div>
  );
}
