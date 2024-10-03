"use client";
import React, { useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Image from "next/image";

export const LearnSection = () => {
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

  const [currentIndex, setCurrentIndex] = useState(0);

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
    <section className="px-4 max-w-[1650px] mx-auto my-10" id="learn">
      <h1 className="text-[10vw] lg:text-[8vw] 2xl:text-9xl font-bold lg:ml-16">
        WHY CHOOSE US
      </h1>
      <div className="hidden lg:block relative mt-10">
        {/* Arrow Buttons */}
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

        {/* Carousel */}
        <div className="flex overflow-hidden space-x-4 mx-20">
          {cards.slice(currentIndex, currentIndex + 3).map((card, i) => (
            <Card key={i} {...card} />
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4  lg:hidden mt-10">
        {cards.map((card, i) => (
          <Card key={i} {...card} />
        ))}
      </div>
    </section>
  );
};

const Card = ({ title, description, image, highlight = false }) => {
  return (
    // <div className="flex-shrink-0 w-full lg:w-1/2 px-4 sm:px-10 rounded-xl py-4 shadow-lg">
    <div className="flex-1  sm:flex-auto sm:w-1/2 lg:flex-1 lg:min-h-[650px] xl:min-h-[520px]">
      <div
        className={`p-6 rounded-lg h-full ${
          highlight
            ? "bg-violet-200 dark:bg-violet-500"
            : "bg-neutral-100 dark:bg-neutral-800"
        }`}
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

// import { cn } from "@/lib/utils";
// import Image from "next/image";
// import React from "react";

// export const LearnSection = () => {
//   const cards = [
//     {
//       title: "Personalized Plans",
//       description:
//         "Tailored workout and nutrition plans based on your individual goals, fitness level, and lifestyle. Whether you're looking to build muscle, lose weight, or improve your endurance, FlexFit creates a program just for you.",
//       image:
//         "https://ik.imagekit.io/z1gqwes5lg/public/Deadline%203D%20Model.png?updatedAt=1727475500588",
//       highlight: true,
//     },
//     {
//       title: "Expert Guidance",
//       description:
//         "Access professional guidance and support from certified trainers right from your phone or computer. Train at your convenience, with video tutorials and real-time tips that help you stay on track.",
//       image:
//         "https://ik.imagekit.io/z1gqwes5lg/public/A%20Female%20Customer%20Service%20Person%20Sits%20In%20Front%20Of%20The%20Phone%20And%20Provides%20Online%20Consultation%203D%20Illustration.png?updatedAt=1727475500773",
//     },
//     {
//       title: "Track Your Progress",
//       description:
//         "Our built-in tracking tools monitor your workouts, nutrition, and milestones. Visualize your progress with detailed analytics, making it easy to see improvements and stay motivated.",
//       image:
//         "https://ik.imagekit.io/z1gqwes5lg/public/Growth.png?updatedAt=1727475500641",
//     },
//   ];
//   return (
//     <section className="px-4 max-w-screen-2xl mx-auto my-10">
//       <h1 className="text-[10vw] lg:text-[8vw] 2xl:text-9xl font-bold">
//         WHY CHOOSE US
//       </h1>
//       <main className="mt-10">
//         <article className="flex flex-col lg:flex-row gap-4">
//           {cards.map((card, i) => (
//             <Card key={i} {...card} />
//           ))}
//         </article>
//       </main>
//     </section>
//   );
// };

// const Card = ({ title, description, image, highlight = false }) => {
//   return (
//     <div
//       className={cn(
//         "flex-1  px-4 sm:px-10 rounded-xl py-4 shadow-lg",
//         highlight
//           ? "bg-violet-200 dark:bg-violet-500"
//           : "bg-neutral-100 dark:bg-neutral-800"
//       )}
//     >
//       <div className="h-52 flex justify-start items-center">
//         <Image
//           src={image}
//           height={200}
//           width={200}
//           className="object-contain h-full"
//         />
//       </div>
//       <h2 className="text-4xl font-semibold my-5">{title}</h2>
//       <p className="text-lg font-extralight">{description}</p>
//     </div>
//   );
// };
