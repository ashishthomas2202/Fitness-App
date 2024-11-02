// components/GlobalContextMenu.jsx
'use client';
import React, { useCallback, useState, useEffect } from "react";

export const GlobalContextMenu = () => {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let x = e.clientX;
      let y = e.clientY;

      if (x + 150 > viewportWidth) {
        x = viewportWidth - 150;
      }
      if (y + 150 > viewportHeight) {
        y = viewportHeight - 150;
      }

      setContextMenu({
        visible: true,
        x,
        y
      });
    }
  }, []);

  const handleCopyText = useCallback(() => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
    }
    setContextMenu({ visible: false, x: 0, y: 0 });
  }, []);

  const handleSearchText = useCallback(() => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedText)}`, '_blank');
    }
    setContextMenu({ visible: false, x: 0, y: 0 });
  }, []);

  const handleShareText = useCallback(() => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText && navigator.share) {
      navigator.share({
        text: selectedText,
      });
    }
    setContextMenu({ visible: false, x: 0, y: 0 });
  }, []);

  const handleClickOutside = useCallback(() => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  }, []);

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleContextMenu, handleClickOutside]);

  if (!contextMenu.visible) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        onClick={handleClickOutside}
      />
      <div
        className="fixed z-50 bg-white dark:bg-neutral-800 shadow-lg rounded-lg overflow-hidden min-w-[150px]"
        style={{
          top: `${contextMenu.y}px`,
          left: `${contextMenu.x}px`
        }}
      >
        <button
          onClick={handleCopyText}
          className="hover:bg-gray-100 dark:hover:bg-neutral-700 px-4 py-2 w-full text-left flex items-center gap-2 text-sm text-black dark:text-white"
        >
          📋 Copy
        </button>
        <hr className="border-gray-200 dark:border-neutral-700" />
        <button
          onClick={handleSearchText}
          className="hover:bg-gray-100 dark:hover:bg-neutral-700 px-4 py-2 w-full text-left flex items-center gap-2 text-sm text-black dark:text-white"
        >
          🔍 Search Google
        </button>
        {navigator.share && (
          <>
            <hr className="border-gray-200 dark:border-neutral-700" />
            <button
              onClick={handleShareText}
              className="hover:bg-gray-100 dark:hover:bg-neutral-700 px-4 py-2 w-full text-left flex items-center gap-2 text-sm text-black dark:text-white"
            >
              💌 Share
            </button>
          </>
        )}
      </div>
    </>
  );
};