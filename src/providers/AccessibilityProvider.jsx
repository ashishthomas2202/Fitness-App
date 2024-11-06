// src/providers/AccessibilityProvider.jsx
'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      
      const realisticVoices = availableVoices.filter(voice => 
        voice.lang.startsWith('en') && 
        !voice.name.toLowerCase().includes('bells') &&
        !voice.name.toLowerCase().includes('bad news') &&
        !voice.name.toLowerCase().includes('cellos') &&
        !voice.name.toLowerCase().includes('good news') &&
        (voice.name.includes('Microsoft') || 
         voice.name.includes('Google') || 
         voice.name.includes('Samantha') ||
         voice.name.includes('Daniel') ||
         voice.name.includes('Karen') ||
         voice.name.includes('Thomas') ||
         voice.name.includes('Victoria'))
      ).sort((a, b) => {
        const aQuality = a.name.includes('Microsoft') ? 3 : 
                        a.name.includes('Google') ? 2 : 
                        a.name.includes('Samantha') ? 1 : 0;
        const bQuality = b.name.includes('Microsoft') ? 3 : 
                        b.name.includes('Google') ? 2 : 
                        b.name.includes('Samantha') ? 1 : 0;
        return bQuality - aQuality;
      });

      setVoices(realisticVoices);
      
      if (realisticVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(realisticVoices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  const speak = useCallback((text) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else if (voices.length > 0) {
        utterance.voice = voices[0];
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    }
  }, [selectedVoice, voices]);

  useEffect(() => {
    let currentSelection = '';

    const handleTextSelection = () => {
      const selection = window.getSelection();
      currentSelection = selection?.toString().trim() || '';
    
      if (currentSelection) {
        let existingContainer = document.getElementById('speech-controls');
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
    
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
    
        let x = rect.left + window.scrollX + (rect.width / 2) - 75;
        let y = rect.top + window.scrollY - 50; 
        if (x < 10) x = 10; 
        if (x + 150 > viewportWidth) x = viewportWidth - 160;
    
        if (y < 10) {
          y = rect.bottom + window.scrollY + 10; 
        }
        if (y + 50 > viewportHeight) y = viewportHeight - 60; 
    
        if (!existingContainer) {
          const buttonContainer = document.createElement('div');
          buttonContainer.id = 'speech-controls';
          buttonContainer.className = 'fixed z-50 flex flex-col items-center gap-2';
          buttonContainer.style.left = `${x}px`;
          buttonContainer.style.top = `${y}px`;
    
          const speakButton = document.createElement('button');
          speakButton.id = 'speech-button';
          speakButton.innerHTML = '🔊';
          speakButton.className = 'bg-violet-500 hover:bg-violet-600 text-white rounded-full p-2 shadow-lg transition-all duration-300';
          speakButton.onclick = () => speak(currentSelection);
    
          const voiceSelect = document.createElement('select');
          voiceSelect.className = 'bg-white dark:bg-neutral-800 text-black dark:text-white text-sm rounded border border-gray-200 dark:border-neutral-700 p-1';
          voiceSelect.style.width = '150px';
          voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.selected = voice === selectedVoice;
            option.textContent = voice.name;
            voiceSelect.appendChild(option);
          });
    
          voiceSelect.onchange = (e) => {
            e.stopPropagation();
            setSelectedVoice(voices[e.target.value]);
            const button = document.getElementById('speech-button');
            if (button) {
              button.onclick = () => speak(currentSelection);
            }
          };
    
          buttonContainer.appendChild(speakButton);
          buttonContainer.appendChild(voiceSelect);
          document.body.appendChild(buttonContainer);
        } else {
          existingContainer.style.left = `${x}px`;
          existingContainer.style.top = `${y}px`;
          const button = existingContainer.querySelector('#speech-button');
          if (button) {
            button.onclick = () => speak(currentSelection);
          }
        }
      }
    };
    

    const handleClickOutside = (event) => {
      if (!event.target.closest('#speech-controls')) {
        const selection = window.getSelection();
        if (!selection?.toString()) {
          const container = document.getElementById('speech-controls');
          if (container) {
            container.remove();
          }
        }
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('click', handleClickOutside);

    document.addEventListener('selectionchange', () => {
      const selection = window.getSelection();
      if (!selection?.toString() && !document.activeElement?.closest('#speech-controls')) {
        const container = document.getElementById('speech-controls');
        if (container) {
          container.remove();
        }
      }
    });

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('selectionchange', () => {});
      const container = document.getElementById('speech-controls');
      if (container) {
        container.remove();
      }
    };
  }, [speak, voices, selectedVoice]);

  return (
    <AccessibilityContext.Provider value={{ speak, voices, selectedVoice, setSelectedVoice }}>
      {children}
    </AccessibilityContext.Provider>
  );
}