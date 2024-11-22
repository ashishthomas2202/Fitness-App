//src/app/api/goals/add-history/route.js
import GoalHistory from "@/db/models/GoalHistory";
import Achievement from "@/db/models/Achievement";
import UserAchievement from "@/db/models/UserAchievement";
import connectDB from "@/db/db";
import { authenticatedUser } from "@/lib/user";

export async function POST(req) {
  await connectDB();

  const currentUser = await authenticatedUser();
  if (!currentUser) {
    console.error("Unauthorized user");
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 }
    );
  }

  const { goals, notes } = await req.json();
  console.log("Received POST request data:", { goals, notes });

  const now = new Date();
  const localDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  try {
    let history = await GoalHistory.findOne({
      userId: currentUser.id,
      date: localDate,
    });

    if (history) {
      console.log("Updating existing history:", history);
      history.goals = goals; // Overwrite goals
      if (notes !== undefined) history.notes = notes; // Update notes
      await history.save();
    } else {
      console.log("Creating new history");
      history = await GoalHistory.create({
        userId: currentUser.id,
        date: localDate,
        goals,
        notes: notes || "", // Set notes
      });
    }

    // Achievement Logic: Check for Weekly Calorie Goal
    // Fetch goal history for the last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const recentHistory = await GoalHistory.find({
      userId: currentUser.id,
      date: { $gte: sevenDaysAgo, $lte: today },
    }).sort({ date: 1 }); // Sort by ascending date

    let consecutiveDays = 0;

    for (const entry of recentHistory) {
      console.log("Checking goal history entry:", entry);

      const calorieGoal = entry.goals.find((goal) => goal.name === "Calorie Intake");
      if (calorieGoal?.isCompleted) {
        consecutiveDays++;
        console.log(`Consecutive days: ${consecutiveDays}`);
        if (consecutiveDays >= 3) {
          console.log("Consecutive days goal met.");
          break;
        }
      } else {
        consecutiveDays = 0; // Reset if a day doesn't meet the goal
      }
    }

    if (consecutiveDays >= 3) {
      console.log("Granting Weekly Calorie Goal achievement...");
      const achievement = await Achievement.findOne({ title: "Weekly Calorie Goal" });

      if (achievement) {
        let userAchievement = await UserAchievement.findOne({
          userId: currentUser.id,
          achievementId: achievement._id,
        });

        if (!userAchievement) {
          console.log("Creating new user achievement for Weekly Calorie Goal...");
          userAchievement = new UserAchievement({
            userId: currentUser.id,
            achievementId: achievement._id,
            progress: achievement.target, // Set progress to target
            completed: true,
          });
        } else if (!userAchievement.completed) {
          console.log("Updating progress for Weekly Calorie Goal...");
          userAchievement.progress += 1;
          if (userAchievement.progress >= achievement.target) {
            userAchievement.progress = achievement.target;
            userAchievement.completed = true;
          }
        }

        await userAchievement.save();
        console.log("Achievement progress saved.");
      } else {
        console.error("Achievement not found: Weekly Calorie Goal");
      }
    }

    console.log("Saved history:", history);
    return new Response(JSON.stringify({ success: true, data: history }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in POST route:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to log history",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}



export async function PUT(req) {
  await connectDB();

  const { entryId, notes } = await req.json();
  console.log("Received PUT request data:", { entryId, notes });

  if (!entryId) {
    console.error("Entry ID is undefined");
    return new Response(
      JSON.stringify({ success: false, message: "Entry ID is required" }),
      { status: 400 }
    );
  }

  try {
    const historyEntry = await GoalHistory.findById(entryId);
    if (!historyEntry) {
      console.error("History entry not found for ID:", entryId);
      return new Response(
        JSON.stringify({ success: false, message: "Entry not found" }),
        { status: 404 }
      );
    }

    console.log("Before update:", historyEntry);
    if (notes !== undefined) historyEntry.notes = notes; // Update notes
    await historyEntry.save();
    console.log("After update:", historyEntry);

    return new Response(
      JSON.stringify({ success: true, data: historyEntry }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT route:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
