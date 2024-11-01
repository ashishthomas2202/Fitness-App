'use client';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useAccessibility } from "@/providers/AccessibilityProvider";

export const HeroSection = () => {
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

  // Handle text sharing
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
      {/* Enhanced Context Menu */}
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
        className="w-full lg:flex lg:flex-row-reverse max-w-screen-2xl mx-auto lg:px-4 lg:mt-10"
        onClick={handleClickOutside}
      >
        <article className="hidden lg:block sm:flex-1">
          <main className="relatiive h-full w-full overflow-hidden sm:rounded-3xl">
            <Image
              className="h-full object-center object-cover z-0"
              src="https://ik.imagekit.io/z1gqwes5lg/public/anastase-maragos-7kEpUPB8vNk-unsplash.jpg?updatedAt=1727405700614"
              alt="workout image"
              height={800}
              width={1200}
            />
          </main>
        </article>
        <article className="relative lg:flex-1">
          <Image
            className="h-full object-center object-cover z-10 lg:hidden"
            src="https://ik.imagekit.io/z1gqwes5lg/public/anastase-maragos-7kEpUPB8vNk-unsplash.jpg?updatedAt=1727405700614"
            alt="workout image"
            fill
          />
          <article className="w-full h-full z-10 absolute top-0 left-0 bg-black opacity-70 lg:hidden"></article>

          <main className="relative z-20 px-4 py-20 max-w-screen-sm mx-auto lg:mx-0">
            <div 
              className="cursor-text select-text"
              onContextMenu={handleContextMenu}
            >
              <h1 className="text-white lg:text-black dark:lg:text-white font-bold text-[20vw] leading-none sm:text-[15vw] md:text-9xl lg:text-8xl">
                ELEVATE
              </h1>
              <h1 className="text-white lg:text-black dark:lg:text-white font-bold text-[20vw] leading-none sm:text-[15vw] md:text-9xl lg:text-8xl">
                YOUR
              </h1>
              <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-500 font-bold text-[20vw] leading-none sm:text-[15vw] md:text-9xl lg:text-8xl">
                FITNESS
              </h1>
            </div>
            
            <p 
              className="text-white lg:text-black dark:lg:text-white font-light text-xl max-w-xl mx-auto sm:mx-0 mt-8 cursor-text select-text"
              onContextMenu={handleContextMenu}
            >
              Unlock your potential with personalized plans, expert trainers, and
              cutting-edge tools. Whether you&apos;re aiming to lose weight, build
              muscle, or stay healthy, FlexFit is your all-in-one fitness
              companion.
            </p>
            
            <footer className="flex gap-2 sm:gap-4 justify-center sm:justify-start items-center mt-16">
              <Button
                variant="primary"
                className="px-2 py-6 shadow-lg select-text"
                size="lg"
                asChild
                onContextMenu={handleContextMenu}
              >
                <Link href="/auth/signup">Join Now for Free</Link>
              </Button>
              <Button
                variant="ghost"
                className="text-white lg:text-black dark:lg:text-white px-2 py-6 shadow-lg lg:border border-slate-50 select-text"
                size="lg"
                asChild
                onContextMenu={handleContextMenu}
              >
                <Link href="#learn">
                  Learn More <ArrowRight size={20} />
                </Link>
              </Button>
            </footer>
          </main>
        </article>
      </section>
    </>
  );
};