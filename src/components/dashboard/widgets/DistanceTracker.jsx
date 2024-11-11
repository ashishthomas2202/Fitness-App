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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/Select";

export const DistanceTracker = ({
  distance = 0,
  goal = 10000,
  step: defaultStep = 0.01,
}) => {
  const [step, setStep] = useState(defaultStep);
  const [distanceCovered, setDistanceCovered] = useState(distance);
  const [percentage, setPercentage] = useState(0);

  // Handlers to increase or decrease distance covered
  const increaseDistanceCovered = () => {
    setDistanceCovered(distanceCovered + step);
  };

  const decreaseDistanceCovered = () => {
    if (distanceCovered - step >= 0) setDistanceCovered(distanceCovered - step);
    else setDistanceCovered(0);
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
                / {goal.toFixed(2)} miles
              </p>
            </div>
          </div>
        </ProgressRing>
      </CardContent>
      <CardFooter className="flex justify-center gap-6">
        <button onClick={decreaseDistanceCovered}>
          <MinusCircleIcon size={28} />
        </button>
        <Select
          onValueChange={(value) => {
            setStep(value);
          }}
        >
          <SelectTrigger className="w-fit">{step}x</SelectTrigger>
          <SelectContent>
            <SelectItem value={0.01}>0.01x</SelectItem>
            <SelectItem value={0.1}>0.1x</SelectItem>
            <SelectItem value={1}>1x</SelectItem>
            <SelectItem value={10}>10x</SelectItem>
          </SelectContent>
        </Select>
        <button onClick={increaseDistanceCovered}>
          <PlusCircleIcon size={28} />
        </button>
      </CardFooter>
    </Card>
  );
};
