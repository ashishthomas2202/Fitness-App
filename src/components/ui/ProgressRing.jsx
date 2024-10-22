"use client";
import React, { useRef, useEffect, useState, useContext } from "react";
import { motion, useAnimation } from "framer-motion";
import { ThemeContext } from "@/providers/ThemeProvider";
export const ProgressRing = ({
  percentage = 0,
  color = "blue",
  colorDark = "blue",
  backgroundColor = "#f1f5f9",
  backgroundColorDark = "#262626",
  strokeWidth = 10,
  animationDuration = 1, // Duration in seconds
  noText = false,
  customContent,
  children,
}) => {
  const { theme } = useContext(ThemeContext);
  const containerRef = useRef(null);
  const [radius, setRadius] = useState(0);
  const previousPercentage = useRef(0); // Store the last percentage value
  const controls = useAnimation(); // Framer Motion animation controls

  const circumference = 2 * Math.PI * radius;

  // Measure the container size and update the radius
  useEffect(() => {
    const updateRadius = () => {
      if (containerRef.current) {
        const size = containerRef.current.offsetWidth;
        setRadius((size - strokeWidth * 2) / 2);
      }
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);

    return () => window.removeEventListener("resize", updateRadius);
  }, [strokeWidth]);

  // Handle animation on percentage change and initial render
  useEffect(() => {
    const startAnimation = async () => {
      // Start from 0 on initial render
      await controls.start({
        strokeDashoffset: ((100 - percentage) * circumference) / 100,
        transition: { duration: animationDuration, ease: "easeOut" },
      });

      // Update previous percentage after animation completes
      previousPercentage.current = percentage;
    };

    // Only animate from 0 on initial render, else animate from previous percentage
    if (previousPercentage.current === 0) {
      startAnimation();
    } else {
      controls.start({
        strokeDashoffset: ((100 - percentage) * circumference) / 100,
        transition: { duration: animationDuration, ease: "easeOut" },
      });
      previousPercentage.current = percentage;
    }
  }, [percentage, animationDuration, circumference, controls]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square flex items-center justify-center"
    >
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${2 * radius + strokeWidth} ${2 * radius + strokeWidth}`}
      >
        <g
          transform={`translate(${strokeWidth / 2}, ${
            strokeWidth / 2
          }) rotate(-90 ${radius} ${radius})`}
        >
          <Circle
            radius={radius}
            color={theme == "light" ? backgroundColor : backgroundColorDark}
            strokeWidth={strokeWidth}
            circumference={circumference}
          />
          <AnimatedCircle
            radius={radius}
            color={theme == "light" ? color : colorDark ? color : colorDark}
            strokeWidth={strokeWidth}
            circumference={circumference}
            controls={controls}
          />
        </g>
        {!noText && !customContent && <Text percentage={percentage} />}
      </svg>
      {customContent && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

const Circle = ({ radius, color, strokeWidth, circumference }) => {
  return (
    <circle
      r={radius}
      cx={radius}
      cy={radius}
      fill="transparent"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={circumference}
      strokeDashoffset={0}
      strokeLinecap="round" // Rounded stroke tips
    />
  );
};

const AnimatedCircle = ({
  radius,
  color,
  strokeWidth,
  circumference,
  controls,
}) => {
  return (
    <motion.circle
      r={radius}
      cx={radius}
      cy={radius}
      fill="transparent"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={circumference}
      strokeLinecap="round"
      animate={controls}
    />
  );
};

const Text = ({ percentage }) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      className="font-light text-3xl text-gray-700"
    >
      {percentage.toFixed(0)}%
    </text>
  );
};

// import React, { useRef, useEffect, useState } from "react";
// import { motion, useAnimation } from "framer-motion";

// export const ProgressRing = ({
//   percentage = 0,
//   color = "blue",
//   strokeWidth = 10,
//   animationDuration = 1, // Duration in seconds (Framer Motion uses seconds)
//   noText = false,
//   customContent,
//   children,
// }) => {
//   const containerRef = useRef(null);
//   const [radius, setRadius] = useState(0);
//   const previousPercentage = useRef(0); // Store last percentage value

//   const circumference = 2 * Math.PI * radius;
//   const controls = useAnimation(); // Controls for Framer Motion

//   // Measure container size and update radius
//   useEffect(() => {
//     const updateRadius = () => {
//       if (containerRef.current) {
//         const size = containerRef.current.offsetWidth;
//         setRadius((size - strokeWidth * 2) / 2);
//       }
//     };
//     updateRadius();
//     window.addEventListener("resize", updateRadius);

//     return () => window.removeEventListener("resize", updateRadius);
//   }, [strokeWidth]);

//   // Animate progress ring using Framer Motion
//   useEffect(() => {
//     controls.start({
//       strokeDashoffset: ((100 - percentage) * circumference) / 100,
//       transition: { duration: animationDuration, ease: "easeOut" },
//     });

//     previousPercentage.current = percentage; // Update the previous value
//   }, [percentage, animationDuration, circumference, controls]);

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full aspect-square flex items-center justify-center"
//     >
//       <svg
//         className="w-full h-full"
//         viewBox={`0 0 ${2 * radius + strokeWidth} ${2 * radius + strokeWidth}`}
//       >
//         <g
//           transform={`translate(${strokeWidth / 2}, ${
//             strokeWidth / 2
//           }) rotate(-90 ${radius} ${radius})`}
//         >
//           <Circle
//             radius={radius}
//             color="#f1f5f9"
//             strokeWidth={strokeWidth}
//             circumference={circumference}
//           />
//           <AnimatedCircle
//             radius={radius}
//             color={color}
//             strokeWidth={strokeWidth}
//             circumference={circumference}
//             controls={controls}
//           />
//         </g>
//         {!noText && !customContent && <Text percentage={percentage} />}
//       </svg>
//       {customContent && (
//         <div className="absolute inset-0 flex items-center justify-center">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };

// const Circle = ({ radius, color, strokeWidth, circumference }) => {
//   return (
//     <circle
//       r={radius}
//       cx={radius}
//       cy={radius}
//       fill="transparent"
//       stroke={color}
//       strokeWidth={strokeWidth}
//       strokeDasharray={circumference}
//       strokeDashoffset={0}
//       strokeLinecap="round"
//     />
//   );
// };

// const AnimatedCircle = ({
//   radius,
//   color,
//   strokeWidth,
//   circumference,
//   controls,
// }) => {
//   return (
//     <motion.circle
//       r={radius}
//       cx={radius}
//       cy={radius}
//       fill="transparent"
//       stroke={color}
//       strokeWidth={strokeWidth}
//       strokeDasharray={circumference}
//       strokeLinecap="round"
//       animate={controls}
//     />
//   );
// };

// const Text = ({ percentage }) => {
//   return (
//     <text
//       x="50%"
//       y="50%"
//       dominantBaseline="middle"
//       textAnchor="middle"
//       className="font-light text-3xl text-gray-700"
//     >
//       {percentage.toFixed(0)}%
//     </text>
//   );
// };

// import React, { useRef, useEffect, useState } from "react";

// export const ProgressRing = ({
//   percentage = 0,
//   color = "blue",
//   strokeWidth = 10,
//   animationDuration = 1000, // Duration in milliseconds
//   noText = false,
//   customContent,
//   children,
// }) => {
//   const containerRef = useRef(null);
//   const [radius, setRadius] = useState(0);
//   const [currentPercentage, setCurrentPercentage] = useState(0); // For animation
//   const previousPercentage = useRef(0); // Store last percentage value

//   // Measure container size and update radius
//   useEffect(() => {
//     const updateRadius = () => {
//       if (containerRef.current) {
//         const size = containerRef.current.offsetWidth;
//         setRadius((size - strokeWidth * 2) / 2);
//       }
//     };
//     updateRadius();
//     window.addEventListener("resize", updateRadius);

//     return () => window.removeEventListener("resize", updateRadius);
//   }, [strokeWidth]);

//   // Smooth animation between previous and new percentage
//   useEffect(() => {
//     let start = null;
//     const startPercentage = previousPercentage.current;

//     const easeOut = (t) => 1 - Math.pow(1 - t, 3); // Ease-out timing function

//     const animate = (timestamp) => {
//       if (!start) start = timestamp;
//       const progress = Math.min((timestamp - start) / animationDuration, 1); // Progress from 0 to 1
//       const easedProgress = easeOut(progress); // Apply easing function
//       const newPercentage =
//         startPercentage + (percentage - startPercentage) * easedProgress;

//       setCurrentPercentage(newPercentage); // Update animated percentage

//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       } else {
//         previousPercentage.current = percentage; // Update previous value
//       }
//     };

//     requestAnimationFrame(animate);

//     return () => cancelAnimationFrame(animate); // Cleanup on unmount
//   }, [percentage, animationDuration]);

//   const circumference = 2 * Math.PI * radius;
//   const strokePct = ((100 - currentPercentage) * circumference) / 100;

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full aspect-square flex items-center justify-center"
//     >
//       <svg
//         className="w-full h-full"
//         viewBox={`0 0 ${2 * radius + strokeWidth} ${2 * radius + strokeWidth}`}
//       >
//         <g
//           transform={`translate(${strokeWidth / 2}, ${
//             strokeWidth / 2
//           }) rotate(-90 ${radius} ${radius})`}
//         >
//           <Circle
//             radius={radius}
//             color="#f1f5f9"
//             strokeWidth={strokeWidth}
//             circumference={circumference}
//           />
//           <Circle
//             radius={radius}
//             color={color}
//             percentage={currentPercentage}
//             strokeWidth={strokeWidth}
//             circumference={circumference}
//           />
//         </g>
//         {!noText && !customContent && <Text percentage={currentPercentage} />}
//       </svg>
//       {customContent && (
//         <div className="absolute inset-0 flex items-center justify-center">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };

// const Circle = ({
//   radius,
//   color,
//   percentage = 100,
//   strokeWidth,
//   circumference,
// }) => {
//   const strokePct = ((100 - percentage) * circumference) / 100;

//   return (
//     <circle
//       r={radius}
//       cx={radius}
//       cy={radius}
//       fill="transparent"
//       stroke={strokePct !== circumference ? color : ""}
//       strokeWidth={strokeWidth}
//       strokeDasharray={circumference}
//       strokeDashoffset={strokePct}
//       strokeLinecap="round" // Rounded stroke tips
//       style={{ transition: "stroke-dashoffset 0.3s ease-in-out" }}
//     />
//   );
// };

// const Text = ({ percentage }) => {
//   return (
//     <text
//       x="50%"
//       y="50%"
//       dominantBaseline="middle"
//       textAnchor="middle"
//       className="font-light text-3xl text-gray-700"
//     >
//       {percentage.toFixed(0)}%
//     </text>
//   );
// };

// import React, { useRef, useEffect, useState } from "react";

// export const ProgressRing = ({
//   percentage = 0,
//   color = "blue",
//   strokeWidth = 10,
//   animationDuration = 1000, // Duration in milliseconds
// }) => {
//   const containerRef = useRef(null);
//   const [radius, setRadius] = useState(0);
//   const [currentPercentage, setCurrentPercentage] = useState(0);
//   const previousPercentage = useRef(0);

//   useEffect(() => {
//     const updateRadius = () => {
//       if (containerRef.current) {
//         const size = containerRef.current.offsetWidth;
//         setRadius((size - strokeWidth * 2) / 2);
//       }
//     };
//     updateRadius();
//     window.addEventListener("resize", updateRadius);

//     return () => window.removeEventListener("resize", updateRadius);
//   }, [strokeWidth]);

//   useEffect(() => {
//     let start = null;
//     const startPercentage = previousPercentage.current;

//     const animate = (timestamp) => {
//       if (!start) start = timestamp;
//       const progress = Math.min((timestamp - start) / animationDuration, 1);
//       const newPercentage =
//         startPercentage + (percentage - startPercentage) * progress;

//       setCurrentPercentage(newPercentage);

//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       } else {
//         previousPercentage.current = percentage;
//       }
//     };

//     requestAnimationFrame(animate);

//     return () => cancelAnimationFrame(animate);
//   }, [percentage, animationDuration]);

//   const circumference = 2 * Math.PI * radius;
//   const strokePct = ((100 - currentPercentage) * circumference) / 100;

//   return (
//     <div
//       ref={containerRef}
//       className="relative  w-full aspect-square flex items-center justify-center"
//     >
//       <svg
//         className="w-full h-full"
//         viewBox={`0 0 ${2 * radius + strokeWidth} ${2 * radius + strokeWidth}`}
//       >
//         <g
//           transform={`translate(${strokeWidth / 2}, ${
//             strokeWidth / 2
//           }) rotate(-90 ${radius} ${radius})`}
//         >
//           <Circle
//             color="#f1f5f9"
//             radius={radius}
//             strokeWidth={strokeWidth}
//             circumference={circumference}
//           />
//           <Circle
//             radius={radius}
//             color={color}
//             percentage={currentPercentage}
//             strokeWidth={strokeWidth}
//             circumference={circumference}
//           />
//         </g>
//         <Text percentage={currentPercentage} radius={radius} />
//       </svg>
//     </div>
//   );
// };

// const Circle = ({
//   radius,
//   color,
//   percentage = 100,
//   strokeWidth,
//   circumference,
// }) => {
//   const strokePct = ((100 - percentage) * circumference) / 100;

//   return (
//     <circle
//       r={radius}
//       cx={radius}
//       cy={radius}
//       fill="transparent"
//       stroke={strokePct !== circumference ? color : ""}
//       strokeWidth={strokeWidth}
//       strokeDasharray={circumference}
//       strokeDashoffset={strokePct}
//       strokeLinecap="round" // Make the tips rounded
//       style={{ transition: "stroke-dashoffset 0.3s ease-in-out" }}
//     />
//   );
// };

// const Text = ({ percentage, radius }) => {
//   return (
//     <text
//       x="50%"
//       y="50%"
//       dominantBaseline="middle"
//       textAnchor="middle"
//       fontSize="1.5em"
//       className="font-bold text-gray-700"
//     >
//       {percentage.toFixed(0)}%
//     </text>
//   );
// };

// import React, { useRef, useEffect, useState } from "react";

// export const ProgressRing = ({
//   percentage = 0,
//   color = "blue",
//   strokeWidth = 10,
//   animationDuration = 1000, // Duration in milliseconds
// }) => {
//   const containerRef = useRef(null); // Ref to measure container size
//   const [radius, setRadius] = useState(0); // State to store dynamic radius
//   const [animatedPercentage, setAnimatedPercentage] = useState(0); // State for animated percentage

//   // Calculate and set the radius when the component mounts or resizes
//   useEffect(() => {
//     const updateRadius = () => {
//       if (containerRef.current) {
//         const size = containerRef.current.offsetWidth;
//         setRadius((size - strokeWidth * 2) / 2); // Adjust radius to prevent overflow
//       }
//     };
//     updateRadius();
//     window.addEventListener("resize", updateRadius); // Update on window resize

//     return () => window.removeEventListener("resize", updateRadius);
//   }, [strokeWidth]);

//   // Animate the percentage from 0 to the specified value
//   useEffect(() => {
//     let start = 0;
//     const increment = percentage / (animationDuration / 10); // Calculate the step increment

//     const animate = setInterval(() => {
//       start += increment;
//       if (start >= percentage) {
//         clearInterval(animate);
//         setAnimatedPercentage(percentage); // Ensure final value is exactly the target percentage
//       } else {
//         setAnimatedPercentage(start);
//       }
//     }, 10);

//     return () => clearInterval(animate); // Clean up the interval on component unmount
//   }, [percentage, animationDuration]);

//   const circumference = 2 * Math.PI * radius;
//   const strokePct = ((100 - animatedPercentage) * circumference) / 100;

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full aspect-square flex items-center justify-center"
//     >
//       <svg
//         className="w-full h-full"
//         viewBox={`0 0 ${2 * radius + strokeWidth} ${2 * radius + strokeWidth}`}
//       >
//         <g
//           transform={`translate(${strokeWidth / 2}, ${
//             strokeWidth / 2
//           }) rotate(-90 ${radius} ${radius})`}
//         >
//           <Circle
//             radius={radius}
//             color="lightgray"
//             strokeWidth={strokeWidth}
//             circumference={circumference}
//           />
//           <Circle
//             radius={radius}
//             color={color}
//             percentage={animatedPercentage}
//             strokeWidth={strokeWidth}
//             circumference={circumference}
//           />
//         </g>
//         <Text percentage={animatedPercentage} radius={radius} />
//       </svg>
//     </div>
//   );
// };

// const Circle = ({
//   radius,
//   color,
//   percentage = 100,
//   strokeWidth,
//   circumference,
// }) => {
//   const strokePct = ((100 - percentage) * circumference) / 100;

//   return (
//     <circle
//       r={radius}
//       cx={radius}
//       cy={radius}
//       fill="transparent"
//       stroke={strokePct !== circumference ? color : ""}
//       strokeWidth={strokeWidth}
//       strokeDasharray={circumference}
//       strokeDashoffset={strokePct}
//       style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }} // Smooth transition
//     />
//   );
// };

// const Text = ({ percentage, radius }) => {
//   return (
//     <text
//       x="50%"
//       y="50%"
//       dominantBaseline="middle"
//       textAnchor="middle"
//       fontSize="1.5em"
//       className="font-bold text-gray-700"
//     >
//       {percentage.toFixed(0)}%
//     </text>
//   );
// };
