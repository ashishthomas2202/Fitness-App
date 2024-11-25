import React from "react";

export default function AchievementCard({ achievement, updateProgress }) {
    const handleProgressUpdate = () => {
        if (!achievement.completed) {
            updateProgress(achievement._id, 10); // Example: Increment progress by 10
        }
    };

    return (
        <div
            className={`p-4 rounded-lg shadow relative ${achievement.completed ? "bg-green-200" : "bg-gray-100"
                }`}
        >
            {/* Text Content */}
            <div className="pr-28"> {/* Flexible padding for text */}
                <h3 className="font-medium text-lg leading-tight">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
            </div>

            {/* Badge */}
            {achievement.completed && (
                <div className="absolute top-2 right-2">
                    <img
                        src={achievement.badgeImage}
                        alt={`${achievement.title} Badge`}
                        className="w-20 h-20 object-contain" 
                    />
                </div>
            )}

            {/* Progress Bar */}
            <div className="relative w-full bg-gray-300 h-4 rounded mt-6"> {/* Added spacing */}
                <div
                    className="absolute top-0 left-0 h-4 rounded bg-green-500 transition-all"
                    style={{
                        width: `${(achievement.progress / achievement.target) * 100}%`,
                    }}
                />
            </div>

            {/* Completion Percentage */}
            <p className="text-sm text-gray-600 mt-2">
                Completion:{" "}
                <span className="font-semibold">
                    {((achievement.progress / achievement.target) * 100).toFixed(0)}%
                </span>
            </p>
        </div>
    );
}
