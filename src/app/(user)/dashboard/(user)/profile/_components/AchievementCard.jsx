//src\app\(user)\dashboard\(user)\profile\_components\AchievementCard.jsx
import React from "react";

export default function AchievementCard({ achievement, updateProgress }) {
    const handleProgressUpdate = () => {
        if (!achievement.completed) {
            updateProgress(achievement._id, 10); // Example: Increment progress by 10
        }
    };

    return (
        <div
            className={`p-4 rounded-lg shadow ${achievement.completed ? "bg-green-200" : "bg-gray-100"
                } relative`}
        >
            <h3 className="font-medium text-lg">{achievement.title}</h3>
            <p className="text-sm text-gray-600">{achievement.description}</p>
            <div className="relative w-full bg-gray-300 h-4 rounded mt-2">
                <div
                    className="absolute top-0 left-0 h-4 rounded bg-green-500"
                    style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                />
            </div>
            <p className="text-sm text-gray-600 mt-1">
                Completion: {((achievement.progress / achievement.target) * 100).toFixed(0)}%
            </p>
            {achievement.completed && (
                <div className="absolute top-2 right-2">
                    <img
                        src={achievement.badgeImage}
                        alt={`${achievement.title} Badge`}
                        className="w-24 h-auto object-contain" // Preserve aspect ratio
                    />
                </div>
            )}
        </div>
    );
}
