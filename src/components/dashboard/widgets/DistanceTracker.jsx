import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { FaFire } from "react-icons/fa";

export const DistanceTracker = ({ distance = 0, goal = 10000 }) => {
  const [distanceCovered, setDistanceCovered] = useState(distance);
  const [percentage, setPercentage] = useState(0);

  // Handlers to increase or decrease distance covered
  const increaseDistanceCovered = () => {
    if (distanceCovered < goal) setDistanceCovered(distanceCovered + 0.1);
  };

  const decreaseDistanceCovered = () => {
    if (distanceCovered > 0) setDistanceCovered(distanceCovered - 0.1);
  };

  useLayoutEffect(() => {
    setPercentage((distanceCovered / goal) * 100);
  }, [distanceCovered]);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Distance Covered</h2>
      </CardHeader>
      <CardContent>
        <ProgressRing percentage={percentage} color={"#a3e635"} customContent>
          <div className="flex flex-col gap-2 justify-center items-center">
            <span className="bg-lime-50 p-5 rounded-full">
              <FaFire className="text-6xl text-lime-400" />
            </span>
            <div className="text-gray-700 dark:text-white">
              <p className="font-light text-center text-4xl">
                {distanceCovered.toFixed(2)}
              </p>
              <p className="font-light text-center text-base opacity-30">
                / {goal} miles
              </p>
            </div>
          </div>
        </ProgressRing>
      </CardContent>
      <CardFooter className="flex justify-center gap-10">
        <button onClick={decreaseDistanceCovered}>
          <MinusCircleIcon size={28} />
        </button>
        <button onClick={increaseDistanceCovered}>
          <PlusCircleIcon size={28} />
        </button>
      </CardFooter>
    </Card>
  );
};
