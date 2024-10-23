"use client";
import React, { useRef, useEffect, useState, useContext } from "react";
import { motion, useAnimation } from "framer-motion";
import { ThemeContext } from "@/providers/ThemeProvider";
import tinycolor from "tinycolor2";

export const ProgressRing = ({
  percentage = 0,
  color = "#FFDD00", // Default vibrant yellow
  backgroundColor = "#f1f5f9",
  strokeWidth = 10,
  animationDuration = 1,
  noText = false,
  customContent,
  children,
}) => {
  const { theme } = useContext(ThemeContext);
  const containerRef = useRef(null);
  const [radius, setRadius] = useState(50);
  const controls = useAnimation();

  const circumference = 2 * Math.PI * radius;
  const rings = Math.ceil(percentage / 100);

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

  // Generate a new hue for each ring to keep it vibrant and distinct
  const getRingColor = (index) => {
    const hueShift = index * 15; // Shift hue by 15 degrees for each ring
    return tinycolor(color).spin(hueShift).toHexString();
  };

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
            color={backgroundColor}
            strokeWidth={strokeWidth}
            circumference={circumference}
          />

          {Array.from({ length: rings }).map((_, index) => (
            <AnimatedCircle
              key={index}
              radius={radius}
              color={getRingColor(index)}
              strokeWidth={strokeWidth}
              circumference={circumference}
              percentage={Math.min(100, percentage - index * 100)}
              animationDuration={animationDuration}
            />
          ))}
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

const Circle = ({ radius, color, strokeWidth, circumference }) => (
  <circle
    r={radius}
    cx={radius}
    cy={radius}
    fill="transparent"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeDasharray={circumference}
    strokeDashoffset={0}
    strokeLinecap="round"
  />
);

const AnimatedCircle = ({
  radius,
  color,
  strokeWidth,
  circumference,
  percentage,
  animationDuration,
}) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      strokeDashoffset: ((100 - percentage) * circumference) / 100,
      transition: { duration: animationDuration, ease: "easeOut" },
    });
  }, [percentage, animationDuration, circumference, controls]);

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

const Text = ({ percentage }) => (
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

// "use client";
// import React, { useRef, useEffect, useState, useContext } from "react";
// import { motion, useAnimation } from "framer-motion";
// import { ThemeContext } from "@/providers/ThemeProvider";

// export const ProgressRing = ({
//   percentage = 0,
//   color = "blue",
//   colorDark = "blue",
//   backgroundColor = "#f1f5f9",
//   backgroundColorDark = "#262626",
//   strokeWidth = 10,
//   animationDuration = 1,
//   noText = false,
//   customContent,
//   children,
// }) => {
//   const { theme } = useContext(ThemeContext);
//   const containerRef = useRef(null);
//   const [radius, setRadius] = useState(50);
//   const controls = useAnimation();

//   const circumference = 2 * Math.PI * radius;

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

//   const rings = Math.floor(percentage / 100) + 1; // Calculate how many rings to display

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
//           {/* Render the background circle */}
//           <Circle
//             radius={radius}
//             color={theme === "light" ? backgroundColor : backgroundColorDark}
//             strokeWidth={strokeWidth}
//             circumference={circumference}
//           />

//           {/* Render multiple animated circles based on the percentage */}
//           {Array.from({ length: rings }).map((_, index) => (
//             <AnimatedCircle
//               key={index}
//               radius={radius}
//               color={theme === "light" ? color : colorDark}
//               strokeWidth={strokeWidth}
//               circumference={circumference}
//               percentage={Math.min(100, percentage - index * 100)}
//               animationDuration={animationDuration}
//             />
//           ))}
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

// const Circle = ({ radius, color, strokeWidth, circumference }) => (
//   <circle
//     r={radius}
//     cx={radius}
//     cy={radius}
//     fill="transparent"
//     stroke={color}
//     strokeWidth={strokeWidth}
//     strokeDasharray={circumference}
//     strokeDashoffset={0}
//     strokeLinecap="round"
//   />
// );

// const AnimatedCircle = ({
//   radius,
//   color,
//   strokeWidth,
//   circumference,
//   percentage,
//   animationDuration,
// }) => {
//   const controls = useAnimation();

//   useEffect(() => {
//     controls.start({
//       strokeDashoffset: ((100 - percentage) * circumference) / 100,
//       transition: { duration: animationDuration, ease: "easeOut" },
//     });
//   }, [percentage, animationDuration, circumference, controls]);

//   return (
//     <motion.circle
//       r={radius}
//       cx={radius}
//       cy={radius}
//       fill="transparent"
//       stroke={color}
//       strokeWidth={strokeWidth}
//       strokeDasharray={circumference}
//       strokeDashoffset={circumference}
//       strokeLinecap="round"
//       animate={controls}
//     />
//   );
// };

// const Text = ({ percentage }) => (
//   <text
//     x="50%"
//     y="50%"
//     dominantBaseline="middle"
//     textAnchor="middle"
//     className="font-light text-3xl text-gray-700"
//   >
//     {percentage.toFixed(0)}%
//   </text>
// );

// "use client";
// import React, { useRef, useEffect, useState, useContext } from "react";
// import { motion, useAnimation } from "framer-motion";
// import { ThemeContext } from "@/providers/ThemeProvider";

// export const ProgressRing = ({
//   percentage = 0,
//   color = "blue",
//   colorDark = "blue",
//   backgroundColor = "#f1f5f9",
//   backgroundColorDark = "#262626",
//   strokeWidth = 10,
//   animationDuration = 1,
//   noText = false,
//   customContent,
//   children,
// }) => {
//   const { theme } = useContext(ThemeContext);
//   const containerRef = useRef(null);
//   const [radius, setRadius] = useState(50); // Set a reasonable default radius
//   const previousPercentage = useRef(0);
//   const controls = useAnimation();

//   const circumference = 2 * Math.PI * radius;

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
//     const dashOffset = ((100 - percentage) * circumference) / 100;
//     controls.start({
//       strokeDashoffset: dashOffset,
//       transition: { duration: animationDuration, ease: "easeOut" },
//     });
//     previousPercentage.current = percentage;
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
//             color={theme === "light" ? backgroundColor : backgroundColorDark}
//             strokeWidth={strokeWidth}
//             circumference={circumference}
//           />
//           <AnimatedCircle
//             radius={radius}
//             // color={theme === "light" ? color : colorDark}
//             color={theme == "light" ? color : colorDark ? color : colorDark}
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

// const Circle = ({ radius, color, strokeWidth, circumference }) => (
//   <circle
//     r={radius}
//     cx={radius}
//     cy={radius}
//     fill="transparent"
//     stroke={color}
//     strokeWidth={strokeWidth}
//     strokeDasharray={circumference}
//     strokeDashoffset={0}
//     strokeLinecap="round"
//   />
// );

// const AnimatedCircle = ({
//   radius,
//   color,
//   strokeWidth,
//   circumference,
//   controls,
// }) => (
//   <motion.circle
//     r={radius}
//     cx={radius}
//     cy={radius}
//     fill="transparent"
//     stroke={color}
//     strokeWidth={strokeWidth}
//     strokeDasharray={circumference}
//     strokeDashoffset={circumference}
//     strokeLinecap="round"
//     animate={controls}
//   />
// );

// const Text = ({ percentage }) => (
//   <text
//     x="50%"
//     y="50%"
//     dominantBaseline="middle"
//     textAnchor="middle"
//     className="font-light text-3xl text-gray-700"
//   >
//     {percentage.toFixed(0)}%
//   </text>
// );

// // "use client";
// // import React, { useRef, useEffect, useState, useContext } from "react";
// // import { motion, useAnimation } from "framer-motion";
// // import { ThemeContext } from "@/providers/ThemeProvider";
// // export const ProgressRing = ({
// //   percentage = 0,
// //   color = "blue",
// //   colorDark = "blue",
// //   backgroundColor = "#f1f5f9",
// //   backgroundColorDark = "#262626",
// //   strokeWidth = 10,
// //   animationDuration = 1, // Duration in seconds
// //   noText = false,
// //   customContent,
// //   children,
// // }) => {
// //   const { theme } = useContext(ThemeContext);
// //   const containerRef = useRef(null);
// //   const [radius, setRadius] = useState(0);
// //   const previousPercentage = useRef(0); // Store the last percentage value
// //   const controls = useAnimation(); // Framer Motion animation controls

// //   const circumference = 2 * Math.PI * radius;

// //   // Measure the container size and update the radius
// //   useEffect(() => {
// //     const updateRadius = () => {
// //       if (containerRef.current) {
// //         const size = containerRef.current.offsetWidth;
// //         setRadius((size - strokeWidth * 2) / 2);
// //       }
// //     };
// //     updateRadius();
// //     window.addEventListener("resize", updateRadius);

// //     return () => window.removeEventListener("resize", updateRadius);
// //   }, [strokeWidth]);

// //   // Handle animation on percentage change and initial render
// //   useEffect(() => {
// //     const startAnimation = async () => {
// //       // Start from 0 on initial render
// //       await controls.start({
// //         strokeDashoffset: ((100 - percentage) * circumference) / 100,
// //         transition: { duration: animationDuration, ease: "easeOut" },
// //       });

// //       // Update previous percentage after animation completes
// //       previousPercentage.current = percentage;
// //     };

// //     // Only animate from 0 on initial render, else animate from previous percentage
// //     if (previousPercentage.current === 0) {
// //       startAnimation();
// //     } else {
// //       controls.start({
// //         strokeDashoffset: ((100 - percentage) * circumference) / 100,
// //         transition: { duration: animationDuration, ease: "easeOut" },
// //       });
// //       previousPercentage.current = percentage;
// //     }
// //   }, [percentage, animationDuration, circumference, controls]);

// //   return (
// //     <div
// //       ref={containerRef}
// //       className="relative w-full aspect-square flex items-center justify-center"
// //     >
// //       <svg
// //         className="w-full h-full"
// //         viewBox={`0 0 ${2 * radius + strokeWidth} ${2 * radius + strokeWidth}`}
// //       >
// //         <g
// //           transform={`translate(${strokeWidth / 2}, ${
// //             strokeWidth / 2
// //           }) rotate(-90 ${radius} ${radius})`}
// //         >
// //           <Circle
// //             radius={radius}
// //             color={theme == "light" ? backgroundColor : backgroundColorDark}
// //             strokeWidth={strokeWidth}
// //             circumference={circumference}
// //           />
// //           <AnimatedCircle
// //             radius={radius}
// //             color={theme == "light" ? color : colorDark ? color : colorDark}
// //             strokeWidth={strokeWidth}
// //             circumference={circumference}
// //             controls={controls}
// //           />
// //         </g>
// //         {!noText && !customContent && <Text percentage={percentage} />}
// //       </svg>
// //       {customContent && (
// //         <div className="absolute inset-0 flex items-center justify-center">
// //           {children}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const Circle = ({ radius, color, strokeWidth, circumference }) => {
// //   return (
// //     <circle
// //       r={radius}
// //       cx={radius}
// //       cy={radius}
// //       fill="transparent"
// //       stroke={color}
// //       strokeWidth={strokeWidth}
// //       strokeDasharray={circumference}
// //       strokeDashoffset={0}
// //       strokeLinecap="round" // Rounded stroke tips
// //     />
// //   );
// // };

// // const AnimatedCircle = ({
// //   radius,
// //   color,
// //   strokeWidth,
// //   circumference,
// //   controls,
// // }) => {
// //   return (
// //     <motion.circle
// //       r={radius}
// //       cx={radius}
// //       cy={radius}
// //       fill="transparent"
// //       stroke={color}
// //       strokeWidth={strokeWidth}
// //       strokeDasharray={circumference}
// //       strokeLinecap="round"
// //       animate={controls}
// //     />
// //   );
// // };

// // const Text = ({ percentage }) => {
// //   return (
// //     <text
// //       x="50%"
// //       y="50%"
// //       dominantBaseline="middle"
// //       textAnchor="middle"
// //       className="font-light text-3xl text-gray-700"
// //     >
// //       {percentage.toFixed(0)}%
// //     </text>
// //   );
// // };
