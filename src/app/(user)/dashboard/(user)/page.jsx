"use client";
import { Page } from "@/components/dashboard/Page";
import { StepCountTracker } from "@/components/dashboard/widgets/StepCountTracker";
import { WaterConsumption } from "@/components/dashboard/widgets/WaterConsumption";
import { useSession } from "next-auth/react";
import { CalorieBurnedTracker } from "@/components/dashboard/widgets/CalorieBurnedTracker";
import { CalorieIntakeTracker } from "@/components/dashboard/widgets/CalorieIntakeTracker";
import { DistanceTracker } from "@/components/dashboard/widgets/DistanceTracker";
import { FlightsTracker } from "@/components/dashboard/widgets/FlightsTracker";
import { WeightProgressTracker } from "@/components/dashboard/widgets/WeightProgressTracker";

export default function DashboardPage() {
  const { data: session } = useSession();

  const stats = {
    water: {
      consumed: 4,
      goal: 6,
    },
    steps: {
      count: 4000,
      goal: 10000,
    },
    caloriesBurned: {
      burned: 800,
      goal: 3000,
    },
    caloriesIntake: {
      intake: 2000,
      goal: 2500,
    },
    distanceCovered: {
      distance: 0.8,
      goal: 2,
    },
    flights: {
      flights: 80,
      goal: 200,
    },
    weight: [
      { date: "2024-10-01", weight: 192, goal: 180 },
      { date: "2024-10-02", weight: 191, goal: 180 },
      { date: "2024-10-03", weight: 190, goal: 180 },
      { date: "2024-10-04", weight: 190, goal: 180 },
      { date: "2024-10-05", weight: 191, goal: 180 },
      { date: "2024-10-06", weight: 192, goal: 180 },
      { date: "2024-10-07", weight: 193, goal: 180 },
      { date: "2024-10-08", weight: 192, goal: 180 },
      { date: "2024-10-09", weight: 191, goal: 180 },
      { date: "2024-10-10", weight: 194, goal: 180 },
      { date: "2024-10-11", weight: 189, goal: 180 },
      { date: "2024-10-12", weight: 188, goal: 180 },
      { date: "2024-10-13", weight: 187, goal: 180 },
      { date: "2024-10-14", weight: 186, goal: 180 },
      { date: "2024-10-15", weight: 185, goal: 180 },
      { date: "2024-10-16", weight: 184, goal: 180 },
      { date: "2024-10-17", weight: 186, goal: 180 },
      { date: "2024-10-18", weight: 182, goal: 180 },
      { date: "2024-10-19", weight: 181, goal: 180 },
      { date: "2024-10-20", weight: 184, goal: 180 },
      { date: "2024-10-21", weight: 184, goal: 180 },
      { date: "2024-10-22", weight: 182, goal: 180 },
      { date: "2024-10-23", weight: 183, goal: 180 },
      { date: "2024-10-24", weight: 184, goal: 180 },
      { date: "2024-10-25", weight: 185, goal: 180 },
      { date: "2024-10-26", weight: 184, goal: 180 },
      { date: "2024-10-27", weight: 183, goal: 180 },
      { date: "2024-10-28", weight: 182, goal: 180 },
      { date: "2024-10-29", weight: 184, goal: 180 },
      { date: "2024-10-30", weight: 183, goal: 180 },
      { date: "2024-10-31", weight: 180, goal: 180 },
    ],
  };
  // console.log(session);
  return (
    <Page title="Dashboard">
      <div className="grid sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        <StepCountTracker steps={stats.steps.count} goal={stats.steps.goal} />
        <CalorieBurnedTracker
          burned={stats.caloriesBurned.burned}
          goal={stats.caloriesBurned.goal}
        />
        <CalorieIntakeTracker
          intake={stats.caloriesIntake.intake}
          goal={stats.caloriesIntake.goal}
        />
        <DistanceTracker
          distance={stats.distanceCovered.distance}
          goal={stats.distanceCovered.goal}
        />
        <FlightsTracker
          flights={stats.flights.flights}
          goal={stats.flights.goal}
        />
        <WaterConsumption
          consumed={stats.water.consumed}
          goal={stats.water.goal}
        />
        <WeightProgressTracker className="sm:col-span-2" data={stats.weight} />
      </div>
    </Page>
  );
}
