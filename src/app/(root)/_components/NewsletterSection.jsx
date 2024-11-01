'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useCallback, useState } from "react";
import { useAccessibility } from "@/providers/AccessibilityProvider";

export const NewsletterSection = () => {
  const { speak } = useAccessibility();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY
      });
    }
  }, []);

  const handleSpeakSelected = useCallback(() => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      speak(selectedText);
    }
    setContextMenu({ visible: false, x: 0, y: 0 });
  }, [speak]);

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

  return (
    <>
      {/* Context Menu */}
      {contextMenu.visible && (
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
              onClick={handleSpeakSelected}
              className="hover:bg-gray-100 dark:hover:bg-neutral-700 px-4 py-2 w-full text-left flex items-center gap-2 text-sm"
            >
              🔊 Speak Text
            </button>
            <hr className="border-gray-200 dark:border-neutral-700" />
            <button
              onClick={handleCopyText}
              className="hover:bg-gray-100 dark:hover:bg-neutral-700 px-4 py-2 w-full text-left flex items-center gap-2 text-sm"
            >
              📋 Copy
            </button>
            <hr className="border-gray-200 dark:border-neutral-700" />
            <button
              onClick={handleSearchText}
              className="hover:bg-gray-100 dark:hover:bg-neutral-700 px-4 py-2 w-full text-left flex items-center gap-2 text-sm"
            >
              🔍 Search Google
            </button>
            {navigator.share && (
              <>
                <hr className="border-gray-200 dark:border-neutral-700" />
                <button
                  onClick={handleShareText}
                  className="hover:bg-gray-100 dark:hover:bg-neutral-700 px-4 py-2 w-full text-left flex items-center gap-2 text-sm"
                >
                  💌 Share
                </button>
              </>
            )}
          </div>
        </>
      )}

      <section 
        className="bg-gray-100 dark:bg-neutral-900 border-b border-violet-100 dark:border-neutral-950 py-10"
        onClick={handleClickOutside}
      >
        <div className="max-w-screen-xl mx-auto px-4 lg:flex lg:items-center">
          {/* Text Section */}
          <div 
            className="lg:w-1/2 select-text"
            onContextMenu={handleContextMenu}
          >
            <h2 className="text-4xl font-bold mb-4 cursor-text">
              Stay Updated with FlexFit
            </h2>
            <p className="text-lg mb-6 cursor-text">
              Subscribe to our newsletter and get the latest workout tips, expert
              guidance, and exclusive offers delivered straight to your inbox.
              Stay in the loop with everything FlexFit!
            </p>
          </div>

          {/* Form Section */}
          <div className="lg:w-1/2 bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg">
            <form>
              <div className="mb-4">
                <label htmlFor="email" className="block text-lg font-medium">
                  Email Address
                </label>
                <Input
                  type="email"
                  id="email"
                  required
                  placeholder="Your Email"
                  className="dark:bg-neutral-900 dark:border-neutral-800 dark:focus:ring-neutral-700"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-lg font-medium">
                  Name (Optional)
                </label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  className="dark:bg-neutral-900 dark:border-neutral-800 dark:focus:ring-neutral-700"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                className="w-full py-6"
              >
                Subscribe Now
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};