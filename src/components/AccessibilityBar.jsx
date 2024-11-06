"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Settings2,
  ZoomIn,
  ZoomOut,
  Sun,
  WrapText,
  Eye,
  EyeOff,
} from "lucide-react";
import { IoAccessibilityOutline } from "react-icons/io5";

export default function AccessibilityBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(1);
  const [highlightColor, setHighlightColor] = useState("#ffeb3b");
  const [highContrast, setHighContrast] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const wasDragging = useRef(false);

  const colorOptions = [
    "#ffeb3b", // Yellow
    "#ff9800", // Orange
    "#ff5252", // Red
    "#76ff03", // Lime Green
    "#40c4ff", // Light Blue
    "#e040fb", // Purple
    "#ff80ab", // Pink
  ];

  // Initialize position and load saved preferences
  useEffect(() => {
    const savedPosition = localStorage.getItem("accessibility-button-position");
    const savedVisibility = localStorage.getItem(
      "accessibility-button-visible"
    );

    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    } else {
      setPosition({
        x: 16,
        y: window.innerHeight - 72,
      });
    }

    if (savedVisibility !== null) {
      setIsButtonVisible(savedVisibility === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "accessibility-button-position",
      JSON.stringify(position)
    );
  }, [position]);

  const onMouseDown = (e) => {
    if (isOpen) return;
    setIsDragging(true);
    wasDragging.current = false;
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  };

  const onMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      wasDragging.current = true;
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;

      const maxX = window.innerWidth - (buttonRef.current?.offsetWidth || 48);
      const maxY = window.innerHeight - (buttonRef.current?.offsetHeight || 48);

      setPosition({
        x: Math.max(0, Math.min(maxX, newX)),
        y: Math.max(0, Math.min(maxY, newY)),
      });
    },
    [isDragging]
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onClick = (e) => {
    if (!wasDragging.current) {
      setIsOpen(!isOpen);
    }
    wasDragging.current = false;
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  const getMenuPosition = () => {
    if (!buttonRef.current) return { bottom: "4rem", left: 0 };

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 200; // min-w-[200px] from our CSS
    const menuHeight = 300; // Approximate height of the menu

    const wouldOverflowRight = buttonRect.left + menuWidth > window.innerWidth;
    const closerToBottom = buttonRect.top > window.innerHeight / 2;

    const horizontalPosition = wouldOverflowRight ? { right: 0 } : { left: 0 };

    const verticalPosition = closerToBottom
      ? { bottom: "4rem" }
      : { top: "4rem" };

    return {
      ...horizontalPosition,
      ...verticalPosition,
    };
  };

  const toggleButtonVisibility = () => {
    const newVisibility = !isButtonVisible;
    setIsButtonVisible(newVisibility);
    localStorage.setItem(
      "accessibility-button-visible",
      newVisibility.toString()
    );
    if (!newVisibility) {
      setIsOpen(false);
    }
  };

  const adjustFontSize = (increment) => {
    setFontSize((prev) => {
      const newSize = prev + (increment ? 0.1 : -0.1);
      const clampedSize = Math.max(0.8, Math.min(1.5, newSize));
      document.documentElement.style.fontSize = `${clampedSize}rem`;
      return clampedSize;
    });
  };

  const highlightSelectedText = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!range.toString()) return;

    try {
      const selectedHighlight = range.commonAncestorContainer.parentElement;
      if (selectedHighlight?.classList.contains("custom-highlight")) {
        selectedHighlight.style.backgroundColor = highlightColor;
      } else {
        const span = document.createElement("span");
        span.className = "custom-highlight";
        span.style.backgroundColor = highlightColor;
        span.style.color = "black";
        range.surroundContents(span);
      }
      selection.removeAllRanges();
    } catch (e) {
      console.error("Highlighting error:", e);
    }
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.documentElement.style.filter = "contrast(1.4)";
    } else {
      document.documentElement.style.filter = "none";
    }
  };

  useEffect(() => {
    return () => {
      document.documentElement.style.fontSize = "";
      document.documentElement.style.filter = "none";
    };
  }, []);

  return (
    <>
      {!isButtonVisible && (
        <div
          className="fixed bottom-0 left-0 w-4 h-4 bg-transparent cursor-pointer z-50"
          onClick={toggleButtonVisibility}
          title="Show accessibility options"
        />
      )}

      {isButtonVisible && (
        <div
          ref={buttonRef}
          className="fixed z-50"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            touchAction: "none",
          }}
        >
          <button
            onMouseDown={onMouseDown}
            onClick={onClick}
            className={`bg-gradient-to-br from-indigo-400 to-indigo-600 text-white p-2 rounded-full shadow-lg transition-colors duration-300 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            aria-label="Accessibility Controls"
          >
            <div className="ring-1 rounded-full p-2 ring-white">
              <IoAccessibilityOutline className="w-6 h-6" />
            </div>
          </button>

          {isOpen && (
            <div
              className="absolute bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-gray-200 dark:border-neutral-800 p-4 min-w-[200px]"
              style={getMenuPosition()}
            >
              <div className="space-y-4">
                {/* Font Size Controls */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium dark:text-gray-200">
                    Font Size
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => adjustFontSize(false)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-700 dark:text-gray-200"
                      aria-label="Decrease font size"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => adjustFontSize(true)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-700 dark:text-gray-200"
                      aria-label="Increase font size"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Text Highlighter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-gray-200">
                      Text Highlighter
                    </span>
                    <button
                      onClick={highlightSelectedText}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-700 dark:text-gray-200"
                      aria-label="Highlight selected text"
                    >
                      <WrapText className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded transition-transform duration-200 ${
                          color === highlightColor
                            ? "ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-neutral-900 scale-110"
                            : "hover:scale-110"
                        }`}
                        style={{
                          backgroundColor: color,
                          opacity: 0.5,
                        }}
                        onClick={() => setHighlightColor(color)}
                        aria-label={`Select ${color} highlight color`}
                      />
                    ))}
                  </div>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium dark:text-gray-200">
                    High Contrast
                  </span>
                  <button
                    onClick={toggleHighContrast}
                    className={`p-1.5 rounded-lg transition-colors text-gray-700 dark:text-gray-200 ${
                      highContrast
                        ? "bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300"
                        : "hover:bg-gray-100 dark:hover:bg-neutral-800"
                    }`}
                    aria-label="Toggle high contrast"
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                </div>

                {/* Hide Button Option */}
                {/* <div className="flex items-center justify-between">
                  <span className="text-sm font-medium dark:text-gray-200">
                    Show Button
                  </span>
                  <button
                    onClick={toggleButtonVisibility}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-700 dark:text-gray-200"
                    aria-label="Toggle button visibility"
                  >
                    {isButtonVisible ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div> */}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
