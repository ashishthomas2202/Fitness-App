import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { TbStairs } from "react-icons/tb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export const FlightsTracker = ({
  flights = 0,
  goal = 10000,
  step: defaultStep = 10,
}) => {
  const [step, setStep] = useState(defaultStep);
  const [flightsClimbed, setFlightsClimbed] = useState(flights);
  const [percentage, setPercentage] = useState(0);

  // Handlers to increase or decrease flights climbed
  const increaseFlightsClimbed = () => {
    setFlightsClimbed(flightsClimbed + step);
  };

  const decreaseFlightsClimbed = () => {
    if (flightsClimbed - step >= 0) setFlightsClimbed(flightsClimbed - step);
    else setFlightsClimbed(0);
  };

  useLayoutEffect(() => {
    setPercentage((flightsClimbed / goal) * 100);
  }, [flightsClimbed]);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Flights Climbed</h2>
      </CardHeader>
      <CardContent>
        <ProgressRing percentage={percentage} color={"#10b981"} customContent>
          <div className="flex flex-col gap-2 justify-center items-center">
            <span className="bg-emerald-50 p-5 rounded-full">
              <TbStairs className="text-6xl text-emerald-500" />
            </span>
            <div className="text-gray-700 dark:text-white">
              <p className="font-light text-center text-4xl">
                {flightsClimbed}
              </p>
              <p className="font-light text-center text-base opacity-30">
                / {goal} steps
              </p>
            </div>
          </div>
        </ProgressRing>
      </CardContent>
      <CardFooter className="flex justify-center gap-6">
        <button onClick={decreaseFlightsClimbed}>
          <MinusCircleIcon size={28} />
        </button>
        <Select
          onValueChange={(value) => {
            setStep(value);
          }}
        >
          <SelectTrigger className="w-fit">{step}x</SelectTrigger>
          <SelectContent>
            <SelectItem value={1}>1x</SelectItem>
            <SelectItem value={10}>10x</SelectItem>
            <SelectItem value={100}>100x</SelectItem>
            <SelectItem value={1000}>1000x</SelectItem>
          </SelectContent>
        </Select>
        <button onClick={increaseFlightsClimbed}>
          <PlusCircleIcon size={28} />
        </button>
      </CardFooter>
    </Card>
  );
};
