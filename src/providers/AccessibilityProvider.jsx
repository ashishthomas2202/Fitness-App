// src/providers/AccessibilityProvider.jsx
'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const speak = useCallback((text) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return (
    <AccessibilityContext.Provider value={{ speak }}>
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