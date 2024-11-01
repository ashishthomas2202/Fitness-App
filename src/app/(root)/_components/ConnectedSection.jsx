'use client';
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useAccessibility } from "@/providers/AccessibilityProvider";

export const ConnectedSection = () => {
  const { speak } = useAccessibility();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

  // Handle right click
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

  // Handle speaking selected text
  const handleSpeakSelected = useCallback(() => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      speak(selectedText);
    }
    setContextMenu({ visible: false, x: 0, y: 0 });
  }, [speak]);

  // Handle copying text
  const handleCopyText = useCallback(() => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
    }
    setContextMenu({ visible: false, x: 0, y: 0 });
  }, []);

  // Handle searching text
  const handleSearchText = useCallback(() => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedText)}`, '_blank');
    }
    setContextMenu({ visible: false, x: 0, y: 0 });
  }, []);

  // Add handleShareText function
const handleShareText = useCallback(() => {
  const selectedText = window.getSelection()?.toString();
  if (selectedText && navigator.share) {
    navigator.share({
      text: selectedText,
    });
  }
  setContextMenu({ visible: false, x: 0, y: 0 });
}, []);

  // Hide context menu when clicking outside
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
        className="px-4 py-16 max-w-screen-2xl mx-auto flex flex-col gap-10 lg:flex-row items-center"
        onClick={handleClickOutside}
      >
        {/* Left - Image Section */}
        <div className="relative w-full min-h-[400px] max-h-[800px] lg:w-1/2 flex justify-center mb-10 lg:mb-0">
          <Image
            src="https://ik.imagekit.io/z1gqwes5lg/public/insights__cr4ajybkqp8i_large.jpg?updatedAt=1727906952301"
            alt="Sync Devices"
            className="object-cover max-w-full max-h-[400px] rounded-2xl shadow-sm"
            fill
          />
        </div>

        {/* Right - Text Section */}
        <div 
          className="w-full lg:w-1/2 text-center lg:text-left select-text"
          onContextMenu={handleContextMenu}
        >
          <h2 
            className="text-4xl lg:text-5xl font-bold mb-4 cursor-text"
          >
            Stay Connected, Anytime, Anywhere
          </h2>
          <p 
            className="text-lg lg:text-xl font-light mb-6 cursor-text"
          >
            Whether you&apos;re on iOS, Android, or using a wearable fitness
            tracker, FlexFit effortlessly syncs your fitness data across all
            devices. Monitor your progress on the go, from your smartphone to your
            FlexFit dashboard, without the hassle.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 mb-6">
            <div 
              className="bg-slate-100 dark:bg-neutral-800 p-2 w-fit mx-auto sm:mx-0 flex justify-center items-center gap-2 rounded-lg dark:text-white shadow-sm cursor-text"
              onContextMenu={handleContextMenu}
            >
              <img
                src="https://ik.imagekit.io/z1gqwes5lg/public/app-store.png?updatedAt=1727911323775"
                alt="Apple Watch"
                className="h-12 w-12 mr-2"
              />
              <div className="text-left">
                <h6 className="text-[10px]">GET IT ON</h6>
                <h3 className="text-lg">App Store</h3>
              </div>
            </div>
            <div 
              className="bg-slate-100 dark:bg-neutral-800 p-2 w-fit mx-auto sm:mx-0 flex justify-center items-center gap-2 rounded-lg dark:text-white shadow-sm cursor-text"
              onContextMenu={handleContextMenu}
            >
              <img
                src="https://ik.imagekit.io/z1gqwes5lg/public/app.png?updatedAt=1727911323824"
                alt="Google Fit"
                className="h-12 w-12"
              />
              <div className="text-left">
                <h6 className="text-[10px]">GET IT ON</h6>
                <h3 className="text-lg">Google Play</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};