"use client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaQuoteLeft } from "react-icons/fa";

export const TestimonialSection = () => {
  const [loading, setLoading] = useState(true);
  const [firstRow, setFirstRow] = useState([]);
  const [secondRow, setSecondRow] = useState([]);

  useEffect(() => {
    // Split the testimonials array dynamically
    const splitIndex = Math.ceil(testimonials.length / 2);
    setFirstRow(testimonials.slice(0, splitIndex));
    setSecondRow(testimonials.slice(splitIndex, testimonials.length));
    setLoading(false);
  }, []);

  return (
    <section className="relative py-10">
      <h1 className="text-4xl text-center font-bold mb-8">
        Real Users, Real Results
      </h1>

      {loading ? (
        <div className="min-h-60 flex justify-center items-center">
          <Loader2 className="w-16 h-16 animate-spin" />
        </div>
      ) : (
        <div className="py-5 overflow-hidden relative">
          {/* Blurred edge mask */}
          <div className="absolute inset-0 z-10 pointer-events-none flex justify-between w-[110vw] left-[-5vw]">
            <div className="bg-gradient-to-r from-white dark:from-neutral-950 to-transparent w-40 md:w-80 h-full blur-sm"></div>
            <div className="bg-gradient-to-r from-transparent to-white dark:to-neutral-950 w-40 md:w-80 h-full"></div>
          </div>

          {/* First row: Scrolls left to right */}
          <div className="whitespace-nowrap animate-scroll-left">
            {[...firstRow, ...firstRow, ...firstRow].map((testimonial, i) => (
              <TestimonialCard
                key={`testimonial-row-1-${i}`}
                {...testimonial}
              />
            ))}
          </div>

          {/* Second row: Scrolls right to left */}
          <div className="whitespace-nowrap animate-scroll-right mt-8">
            {[...secondRow, ...secondRow, ...secondRow].map(
              (testimonial, i) => (
                <TestimonialCard
                  key={`testimonial-row-2-${i}`}
                  {...testimonial}
                />
              )
            )}
          </div>
        </div>
      )}
    </section>
  );
};

// Tailwind CSS animations
// const styles = `
//   @keyframes scroll-left {
//     0% { transform: translateX(0%); }
//     100% { transform: translateX(-50%); }
//   }
//   @keyframes scroll-right {
//     0% { transform: translateX(-50%); }
//     100% { transform: translateX(0%); }
//   }
//   .animate-scroll-left {
//     animation: scroll-left 40s linear infinite;
//   }
//   .animate-scroll-right {
//     animation: scroll-right 40s linear infinite;
//   }
// `;

// const styles = `
//   @keyframes scroll-left {
//     0% { transform: translateX(0); }
//     100% { transform: translateX(-50%); }
//   }
//   @keyframes scroll-right {
//     0% { transform: translateX(-50%); }
//     100% { transform: translateX(0); }
//   }

//   /* Default animation speed */
//   .animate-scroll-left {
//     animation: scroll-left 40s linear infinite;
//   }
//   .animate-scroll-right {
//     animation: scroll-right 40s linear infinite;
//   }

//   /* Speed up the animation for small screens */
//   @media (max-width: 768px) {
//     .animate-scroll-left {
//       animation: scroll-left 20s linear infinite;
//     }
//     .animate-scroll-right {
//       animation: scroll-right 20s linear infinite;
//     }
//   }

//   /* Speed up the animation further for extra small screens */
//   @media (max-width: 480px) {
//     .animate-scroll-left {
//       animation: scroll-left 5s linear infinite;
//     }
//     .animate-scroll-right {
//       animation: scroll-right 5s linear infinite;
//     }
//   }`;

// Tailwind CSS animations
const styles = `
  @keyframes scroll-left {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-200%); }
  }
  @keyframes scroll-right {
    0% { transform: translateX(-200%); }
    100% { transform: translateX(0%); }
  }

  /* Default animation speed */
  .animate-scroll-left {
    animation: scroll-left 40s linear infinite;
  }
  .animate-scroll-right {
    animation: scroll-right 40s linear infinite;
  }

  /* Speed up the animation for small screens, but adjust the width to fit more testimonials */
  @media (max-width: 768px) {
    .testimonials-row {
      width: 200%;
    }
    .animate-scroll-left {
      animation: scroll-left 30s linear infinite;
    }
    .animate-scroll-right {
      animation: scroll-right 30s linear infinite;
    }
  }

  /* Speed up the animation for extra small screens, but ensure that the row still fits */
  @media (max-width: 480px) {
    .testimonials-row {
      width: 500%;
    }
    .animate-scroll-left {
      animation: scroll-left 20s linear infinite;
    }
    .animate-scroll-right {
      animation: scroll-right 20s linear infinite;
    }
  }

`;

// Injecting styles into the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

const TestimonialCard = ({ name = "", image = "", testimony = "" }) => {
  return (
    <article className="inline-block w-[400px] h-56 mx-4 dark:bg-neutral-700 overflow-hidden rounded-3xl shadow-lg p-4">
      <FaQuoteLeft className="text-5xl text-violet-500" />
      <p className="text-sm text-wrap font-light py-4">{testimony}</p>
      <div className="flex gap-5 items-center">
        <Image
          className="object-cover w-[60px] h-[60px] rounded-3xl"
          src={image}
          alt={name}
          width={60}
          height={60}
        />
        <h2 className="font-bold text-xl">{name}</h2>
      </div>
    </article>
  );
};

const testimonials = [
  {
    name: "Sarah Johnson",
    image:
      "https://ik.imagekit.io/z1gqwes5lg/public/testimonials/p1.png?updatedAt=1727918757790",

    testimony:
      "FlexFit completely changed my fitness routine! I’ve lost 20 pounds in 3 months and feel stronger than ever. The personalized workout plan made all the difference.",
  },
  {
    name: "James Miller",
    image:
      "https://ik.imagekit.io/z1gqwes5lg/public/testimonials/p2.png?updatedAt=1727918914784",
    testimony:
      "I’ve been using FlexFit for six months, and the progress has been incredible. The app helped me track my workouts and stay consistent.",
  },
  {
    name: "Emily Roberts",
    image:
      "https://ik.imagekit.io/z1gqwes5lg/public/testimonials/p4.png?updatedAt=1727919029353",

    testimony:
      "Syncing my Apple Watch with FlexFit was seamless, and now I have all my fitness data in one place. It keeps me motivated!",
  },
  {
    name: "John Doe",
    image:
      "https://ik.imagekit.io/z1gqwes5lg/public/testimonials/p3.png?updatedAt=1727918957909",
    testimony:
      "The variety of workouts and flexibility in the plans are fantastic! I love how I can adjust my workouts depending on my mood or schedule.",
  },
  {
    name: "Mia Kim",
    image:
      "https://ik.imagekit.io/z1gqwes5lg/public/testimonials/p5.png?updatedAt=1727919085593",

    testimony:
      "FlexFit helped me lose 10 pounds in just two months. The personalized meal plans make it so easy to stay on track and reach my goals.",
  },
  {
    name: "Adam Parker",
    image:
      "https://ik.imagekit.io/z1gqwes5lg/public/testimonials/p7.png?updatedAt=1727919360432",

    testimony:
      "I love how FlexFit tracks my steps and calories burned. It’s like having a personal trainer and nutritionist in my pocket!",
  },
  {
    name: "Sophia Lee",
    image:
      "https://ik.imagekit.io/z1gqwes5lg/public/testimonials/p6.png?updatedAt=1727919085276",
    testimony:
      "FlexFit is hands-down the best fitness app I’ve ever used. The tracking features and expert advice keep me motivated every day.",
  },
  {
    name: "David Thompson",
    image:
      "https://ik.imagekit.io/z1gqwes5lg/public/testimonials/p9.png?updatedAt=1727919360527",
    testimony:
      "The fitness data syncs perfectly across my phone, tablet, and watch. I’m impressed with how smooth everything works!",
  },
  {
    name: "Emma Brown",
    image:
      "https://ik.imagekit.io/z1gqwes5lg/public/testimonials/p11.png?updatedAt=1727919360154",
    testimony:
      "After just a few weeks of using FlexFit, I’ve already started to see results. The app keeps me accountable, and I love the flexibility it offers!",
  },
  {
    name: "Liam Smith",
    image:
      "https://ik.imagekit.io/z1gqwes5lg/public/testimonials/p10.png?updatedAt=1727919360680",
    testimony:
      "FlexFit is a game changer! I was able to set realistic goals, track my progress, and now I’m fitter and healthier than ever.",
  },
];
