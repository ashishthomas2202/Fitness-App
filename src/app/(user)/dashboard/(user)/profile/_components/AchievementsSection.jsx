//src\app\(user)\dashboard\(user)\profile\_components\AchievementsSection.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AchievementCard from "./AchievementCard";

export default function AchievementsSection({ onAchievementCompleted }) {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch achievements
    const fetchAchievements = async () => {
        try {
            const response = await axios.get("/api/achievements/all");
            if (response.data.success) {
                setAchievements(response.data.data);

                // Count completed achievements and update badge counter
                const completedCount = response.data.data.filter(
                    (achievement) => achievement.completed
                ).length;

                if (onAchievementCompleted) {
                    onAchievementCompleted(completedCount);
                }
            }
        } catch (error) {
            console.error("Failed to fetch achievements:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAchievements();
    }, []);

    return (
        <section className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800">Achievements</h2>
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {achievements.map((achievement, index) => (
                        <AchievementCard
                            key={achievement._id || index} // Use fallback if _id is missing
                            achievement={achievement}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

