// CalorieDeficitPage.jsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import CalorieCalculator from "@/components/ui/CalorieCalculator";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useAccessibility } from "@/providers/AccessibilityProvider";

export default function CalorieDeficit() {
  const { data: session } = useSession();
  const { speak } = useAccessibility();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

  const fetchProfile = async () => {
    if (session && session.user) {
      const res = await axios
        .get("/api/userdata")
        .then((response) => {
          if (response?.data?.success) {
            setUser(response.data.data);
            return response.data.data;
          }
          return null;
        })
        .catch((error) => {
          return null;
        });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Context Menu Handlers
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[90vh]">
        <Loader2 className="w-16 h-16 animate-spin" />
      </div>
    );
  }

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
              className="hover:bg-gray-100 dark:hover:bg-neutral-700 px-4 py-2 w-full text-left flex items-center gap-2 text-sm dark:text-white"
            >
              🔊 Speak Text
            </button>
            <hr className="border-gray-200 dark:border-neutral-700" />
            <button
              onClick={handleCopyText}
              className="hover:bg-gray-100 dark:hover:bg-neutral-700 px-4 py-2 w-full text-left flex items-center gap-2 text-sm dark:text-white"
            >
              📋 Copy
            </button>
            <hr className="border-gray-200 dark:border-neutral-700" />
            <button
              onClick={handleSearchText}
              className="hover:bg-gray-100 dark:hover:bg-neutral-700 px-4 py-2 w-full text-left flex items-center gap-2 text-sm dark:text-white"
            >
              🔍 Search Google
            </button>
            {navigator.share && (
              <>
                <hr className="border-gray-200 dark:border-neutral-700" />
                <button
                  onClick={handleShareText}
                  className="hover:bg-gray-100 dark:hover:bg-neutral-700 px-4 py-2 w-full text-left flex items-center gap-2 text-sm dark:text-white"
                >
                  💌 Share
                </button>
              </>
            )}
          </div>
        </>
      )}

      <main 
  className="min-h-[90vh] select-text"
  onContextMenu={handleContextMenu}
  onClick={handleClickOutside}
>
  <div className="text-center mt-4 mb-6">
    <h1 className="text-2xl font-bold mb-2 cursor-text">
      Welcome to the <span className="bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">Calorie Deficit Calculator</span>
    </h1>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Calculate your personalized calorie targets to achieve your fitness goals
    </p>
  </div>
  
  <CalorieCalculator user={user} />
</main>
    </>
  );
}