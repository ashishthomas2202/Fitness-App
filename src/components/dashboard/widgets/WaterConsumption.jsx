import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import { ProgressRing } from "@/components/ui/ProgressRing";

export const WaterConsumption = ({ consumed = 0, goal = 6 }) => {
  const [currentConsumed, setCurrentConsumed] = useState(consumed);

  // Calculate percentage of water filled
  const percentage = Math.min((currentConsumed / goal) * 100, 100);

  // Handlers to increase or decrease water consumption
  const increaseConsumption = () => {
    // if (currentConsumed < goal) setCurrentConsumed(currentConsumed + 1);
    setCurrentConsumed(currentConsumed + 1);
  };

  const decreaseConsumption = () => {
    if (currentConsumed > 0) setCurrentConsumed(currentConsumed - 1);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-center text-xl font-bold">Water Consumed</h2>
      </CardHeader>
      <CardContent>
        <ProgressRing percentage={percentage} color="#38bdf8" customContent>
          <div className="flex flex-col gap-2">
            <div className="bg-sky-50 px-6 py-4 rounded-full">
              <div
                className="relative w-12 h-16 overflow-hidden mx-auto bg-sky-100 dark:bg-sky-200"
                style={styles.container}
              >
                {/* Water filling animation */}
                <div
                  className="absolute bottom-0 left-0 w-full bg-sky-400 transition-all duration-500"
                  style={{ ...styles.water, height: `${percentage}%` }}
                />
              </div>
            </div>
            {/* <p className=" text-center text-xl font-light mt-4">
              {currentConsumed} 
              / {goal}{" "}
              <span className="text-sm">glasses</span>
            </p> */}
            <div className="text-gray-700 dark:text-white">
              <p className="font-light text-center text-4xl">
                {currentConsumed}
              </p>
              <p className="font-light text-center text-base opacity-30">
                / {goal} glasses
              </p>
            </div>
          </div>
        </ProgressRing>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="flex justify-center gap-10">
          <button onClick={decreaseConsumption} className="btn btn-primary">
            <MinusCircleIcon size={28} />
          </button>
          <button onClick={increaseConsumption} className="btn btn-primary">
            <PlusCircleIcon size={28} />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

const styles = {
  container: {
    position: "relative",
    clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)",
    // borderRadius: "5px",
    // borderLeft: "2px solid #3b82f6" /* Blue border on the left */,
    // borderRight: "2px solid #3b82f6" /* Blue border on the right */,
    // borderBottom: "2px solid #3b82f6" /* Blue border at the bottom */,
    // backgroundColor: "rgba(255, 255, 255, 0.1)" /* Transparent background */,
  },
  water: {
    // background: "rgba(59, 130, 246, 0.8)" /* Blue water */,
    transition: "height 0.5s ease-in-out",
  },
};

// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/Card";
// import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";

// export const WaterConsumption = ({ consumed = 0, goal = 6 }) => {
//   const [currentConsumed, setCurrentConsumed] = useState(consumed);

//   // Calculate percentage
//   const percentage = Math.min((currentConsumed / goal) * 100, 100);

//   // Handlers to increase or decrease water consumption
//   const increaseConsumption = () => {
//     if (currentConsumed < goal) setCurrentConsumed(currentConsumed + 1);
//   };

//   const decreaseConsumption = () => {
//     if (currentConsumed > 0) setCurrentConsumed(currentConsumed - 1);
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <h2 className="text-xl font-bold">Water</h2>
//       </CardHeader>
//       <CardContent>
//         <div className="relative w-20 h-40 border-2 border-blue-500 rounded-lg overflow-hidden">
//           {/* Water filling animation */}
//           <div
//             className="absolute bottom-0 left-0 w-full bg-blue-300 transition-all duration-500"
//             style={{ height: `${percentage}%` }}
//           />
//         </div>
//         <p className="text-lg mt-4">
//           {currentConsumed} / {goal} glasses
//         </p>
//       </CardContent>
//       <CardFooter className="flex justify-between">
//         <button onClick={increaseConsumption} className="btn btn-primary">
//           <PlusCircleIcon />
//         </button>
//         <button onClick={decreaseConsumption} className="btn btn-primary">
//           <MinusCircleIcon />
//         </button>
//       </CardFooter>
//     </Card>
//   );
// };
