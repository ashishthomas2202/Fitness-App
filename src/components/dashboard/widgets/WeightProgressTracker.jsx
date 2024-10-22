"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

export const WeightProgressTracker = ({ data, className }) => {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <h2 className="text-xl font-bold">Weight Progress</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6 justify-center items-center">
          {/* Line Chart for Weight Progress */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[175, 195]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#8884d8"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="goal"
                stroke="#82ca9d"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import React from "react";

// export const WeightProgressTracker = ({ data }) => {
//   return (
//     <Card>
//       <CardHeader>
//         <h2 className="text-xl font-bold">Weight Progress</h2>
//       </CardHeader>
//       <CardContent>
//         <div className="flex flex-col gap-2 justify-center items-center">
//           <span className="bg-blue-50 p-5 rounded-full">
//             <img src="/icons/weight.svg" alt="Weight" className="h-16 w-16" />
//           </span>
//           <div className="text-gray-700 dark:text-white">
//             <p className="font-light text-center text-4xl">75</p>
//             <p className="font-light text-center text-base opacity-30">
//               / 100 kg
//             </p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };
