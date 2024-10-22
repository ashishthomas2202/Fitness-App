"use client";
import React from "react";
import { BsFillDiamondFill } from "react-icons/bs";

export const MarqueeBar = () => {
  return (
    <marquee className="relative overflow-hidden bg-gradient-to-r from-violet-400 to-purple-400 py-4 my-10">
      <div className="flex items-center gap-10 whitespace-nowrap text-white text-xl font-extralight">
        <span>Unlock Your Potential with FlexFit!</span>
        <span className="text-sm">
          <BsFillDiamondFill />
        </span>
        <span>Personalized Workouts for Every Goal.</span>
        <span className="text-sm">
          <BsFillDiamondFill />
        </span>
        <span>Train Like a Pro, Anytime, Anywhere.</span>
        <span className="text-sm">
          <BsFillDiamondFill />
        </span>
        <span>Join the FlexFit Community Today!</span>
        <span className="text-sm">
          <BsFillDiamondFill />
        </span>
        <span>Achieve Your Fitness Goals Faster!</span>
        <span className="text-sm">
          <BsFillDiamondFill />
        </span>
        <span>Get Stronger with Every Rep.</span>
        <span className="text-sm">
          <BsFillDiamondFill />
        </span>
        <span>Your Fitness Journey Starts Here.</span>
        <span className="text-sm">
          <BsFillDiamondFill />
        </span>

        {/* Duplicate content for continuous effect */}
        <span>Unlock Your Potential with FlexFit!</span>
        <span className="text-sm">
          <BsFillDiamondFill />
        </span>
        <span>Personalized Workouts for Every Goal.</span>
        <span className="text-sm">
          <BsFillDiamondFill />
        </span>
        <span>Train Like a Pro, Anytime, Anywhere.</span>
        <span className="text-sm">
          <BsFillDiamondFill />
        </span>
        <span>Join the FlexFit Community Today!</span>
        <span className="text-sm">
          <BsFillDiamondFill />
        </span>
        <span>Achieve Your Fitness Goals Faster!</span>
        <span className="text-sm">
          <BsFillDiamondFill />
        </span>
        <span>Get Stronger with Every Rep.</span>
        <span className="text-sm">
          <BsFillDiamondFill />
        </span>
        <span>Your Fitness Journey Starts Here.</span>
        <span className="text-sm">
          <BsFillDiamondFill />
        </span>
      </div>
    </marquee>
  );
};
