import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";

export const WeightProgressTracker = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Weight Progress</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 justify-center items-center">
          <span className="bg-blue-50 p-5 rounded-full">
            <img src="/icons/weight.svg" alt="Weight" className="h-16 w-16" />
          </span>
          <div className="text-gray-700 dark:text-white">
            <p className="font-light text-center text-4xl">75</p>
            <p className="font-light text-center text-base opacity-30">
              / 100 kg
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
