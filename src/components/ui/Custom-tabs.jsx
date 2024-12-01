// src/components/ui/custom-tabs.jsx
"use client";

import React from "react";

export function CustomTabs({ value, onValueChange, children }) {
  return (
    <div className="w-full">
      <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {React.Children.map(children, (child) => {
          if (child.type === CustomTabTrigger) {
            return React.cloneElement(child, {
              selected: child.props.value === value,
              onClick: () => onValueChange(child.props.value),
            });
          }
          return child;
        })}
      </div>
      {React.Children.map(children, (child) => {
        if (child.type === CustomTabContent && child.props.value === value) {
          return child;
        }
        return null;
      })}
    </div>
  );
}

export function CustomTabTrigger({ children, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md flex-1 transition-colors ${
        selected
          ? "bg-white dark:bg-gray-700 shadow-sm"
          : "hover:bg-gray-200 dark:hover:bg-gray-600"
      }`}
    >
      {children}
    </button>
  );
}

export function CustomTabContent({ children, value }) {
  return <div>{children}</div>;
}
