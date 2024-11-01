"use client";
import React, { useState, useCallback } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Image from "next/image";
import { useAccessibility } from "@/providers/AccessibilityProvider";

export const LearnSection = () => {
  // All states grouped at the top
  const { speak } = useAccessibility();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = [
    {
      title: "Personalized Plans",
      description:
        "Tailored workout and nutrition plans based on your individual goals, fitness level, and lifestyle. Whether you're looking to build muscle, lose weight, or improve your endurance, FlexFit creates a program just for you.",
      image:
        "https://ik.imagekit.io/z1gqwes5lg/public/Deadline%203D%20Model.png?updatedAt=1727475500588",
      highlight: true,
    },
    {
      title: "Expert Guidance",
      description:
        "Access professional guidance and support from certified trainers right from your phone or computer. Train at your convenience, with video tutorials and real-time tips that help you stay on track.",
      image:
        "https://ik.imagekit.io/z1gqwes5lg/public/A%20Female%20Customer%20Service%20Person%20Sits%20In%20Front%20Of%20The%20Phone%20And%20Provides%20Online%20Consultation%203D%20Illustration.png?updatedAt=1727475500773",
    },
    {
      title: "Track Your Progress",
      description:
        "Our built-in tracking tools monitor your workouts, nutrition, and milestones. Visualize your progress with detailed analytics, making it easy to see improvements and stay motivated.",
      image:
        "https://ik.imagekit.io/z1gqwes5lg/public/Growth.png?updatedAt=1727475500641",
    },
    {
      title: "Community Support",
      description:
        "Join a supportive community of like-minded individuals who share tips, celebrate progress, and help each other stay motivated on their fitness journeys.",
      image:
        "https://ik.imagekit.io/z1gqwes5lg/public/Social%20Media%20Core%20Services%20Video%203D%20Animation.png?updatedAt=1727481093335",
    },
    {
      title: "Flexible Scheduling",
      description:
        "Fit your workout into your lifestyle with customizable schedules that adapt to your availability. Whether you prefer morning runs or late-night lifts, FlexFit works around your timetable.",
      image:
        "https://ik.imagekit.io/z1gqwes5lg/public/Time.png?updatedAt=1727481093343",
    },
    {
      title: "Real-Time Feedback",
      description:
        "Receive real-time feedback on your form and performance during workouts, helping you correct mistakes and get the most out of every session.",
      image:
        "https://ik.imagekit.io/z1gqwes5lg/public/Feedback%203D%20Model.png?updatedAt=1727481093365",
    },
  ];

  // Context menu handlers
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

  // Carousel handlers
  const goNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= cards.length ? 0 : prevIndex + 3
    );
  };

  const goPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 3 < 0 ? cards.length - (cards.length % 3 || 3) : prevIndex - 3
    );
  };

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
        className="px-4 max-w-[1650px] mx-auto my-10" 
        id="learn"
        onClick={handleClickOutside}
      >
        <h1 
          className="text-[10vw] lg:text-[8vw] 2xl:text-9xl font-bold lg:ml-16 cursor-text select-text"
          onContextMenu={handleContextMenu}
        >
          WHY CHOOSE US
        </h1>
        <div className="hidden lg:block relative mt-10">
          <button
            onClick={goPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-violet-500 text-white p-2 rounded-full shadow-lg hover:bg-violet-600 z-10"
          >
            <BsChevronLeft size={24} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-violet-500 text-white p-2 rounded-full shadow-lg hover:bg-violet-600 z-10"
          >
            <BsChevronRight size={24} />
          </button>

          <div className="flex overflow-hidden space-x-4 mx-20">
            {cards.slice(currentIndex, currentIndex + 3).map((card, i) => (
              <Card 
                key={i} 
                {...card} 
                onContextMenu={handleContextMenu}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 lg:hidden mt-10">
          {cards.map((card, i) => (
            <Card 
              key={i} 
              {...card} 
              onContextMenu={handleContextMenu}
            />
          ))}
        </div>
      </section>
    </>
  );
};

const Card = ({ title, description, image, highlight = false, onContextMenu }) => {
  return (
    <div className="flex-1 sm:flex-auto sm:w-1/2 lg:flex-1 lg:min-h-[650px] xl:min-h-[520px]">
      <div
        className={`p-6 rounded-lg h-full cursor-text select-text ${
          highlight
            ? "bg-violet-200 dark:bg-violet-500"
            : "bg-neutral-100 dark:bg-neutral-800"
        }`}
        onContextMenu={onContextMenu}
      >
        <div className="h-52 flex justify-start items-center">
          <Image
            src={image}
            height={200}
            width={200}
            className="object-contain h-full"
            alt={title}
          />
        </div>
        <h2 className="text-4xl font-semibold my-5">{title}</h2>
        <p className="text-lg font-extralight">{description}</p>
      </div>
    </div>
  );
};