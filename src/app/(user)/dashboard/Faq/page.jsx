"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  { question: "How do I access the meal plans?", answer: "You can access the meal plans by navigating to the 'Meal Plans' section in the app's main menu." },
  { question: "Can I customize my meal plan?", answer: "Yes, you can customize your meal plan to fit your dietary needs and preferences by going to the 'Customize' option within the meal plan section." },
  { question: "Are the meal plans suitable for different dietary preferences (e.g., vegan, gluten-free)?", answer: "Yes, our meal plans cater to various dietary preferences, including vegan and gluten-free options." },
  { question: "How often should I update my workout plan?", answer: "It is recommended to update your workout plan every 4-6 weeks to continue challenging your body and prevent plateaus." },
  { question: "Can I track my progress within the app?", answer: "Yes, the app includes progress tracking features for both workouts and meals." },
  { question: "What equipment do I need for the workout plans?", answer: "Some workout plans may require basic equipment like dumbbells, resistance bands, or a yoga mat, while others are bodyweight-only." },
  { question: "Is there a way to connect with a trainer for personalized guidance?", answer: "Yes, the app offers a feature to connect with certified trainers for personalized coaching." },
  { question: "Can I download workout and meal plans for offline use?", answer: "Yes, you can download the plans by tapping the 'Download' button in the respective sections." },
  { question: "Are there beginner-friendly workout plans available?", answer: "Absolutely, we have a range of beginner-friendly plans to help you get started." },
  { question: "What should I do if I miss a workout day?", answer: "If you miss a day, try to pick up where you left off or adjust your schedule to make up for it." },
  { question: "How do I set fitness goals in the app?", answer: "You can set your fitness goals in the 'Goals' section of your profile settings." },
  { question: "Can I integrate this app with other fitness trackers (e.g., Fitbit, Apple Watch)?", answer: "Yes, our app supports integration with popular fitness trackers like Fitbit and Apple Watch." },
  { question: "Are there video tutorials for each exercise?", answer: "Yes, every exercise in our workout plans comes with video tutorials for proper form and technique." },
  { question: "How do I switch between different workout plans?", answer: "You can switch between workout plans by navigating to the 'Workout Plans' section and selecting a new plan." },
  { question: "What is included in the premium version of the app?", answer: "The premium version includes exclusive meal and workout plans, personal trainer support, and additional tracking features." }
];

const FaqPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-100 dark:bg-neutral-900 p-8">
        <h1 className="text-3xl font-semibold mb-8 text-gray-700 dark:text-gray-200">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-lg">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center text-left text-lg font-medium text-gray-700 dark:text-gray-200"
              >
                {faq.question}
                {activeIndex === index ? (
                  <ChevronUp className="text-gray-500 dark:text-gray-300" />
                ) : (
                  <ChevronDown className="text-gray-500 dark:text-gray-300" />
                )}
              </button>
              {activeIndex === index && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FaqPage;
