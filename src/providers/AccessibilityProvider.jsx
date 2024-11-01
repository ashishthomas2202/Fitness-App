// src/providers/AccessibilityProvider.jsx
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode'; // Adjust the import path as needed

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [theme, toggleTheme] = useDarkMode();

  const speak = useCallback((text) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return (
    <AccessibilityContext.Provider 
      value={{ 
        speak,
        theme,
        toggleTheme
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};