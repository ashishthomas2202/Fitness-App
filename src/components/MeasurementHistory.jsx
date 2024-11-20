// src/components/MeasurementHistory.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

export function MeasurementHistory({ measurements }) {
  const measurementTypes = ['chest', 'waist', 'hips', 'biceps', 'thighs'];
  const colors = {
    chest: "#ef4444",
    waist: "#3b82f6",
    hips: "#10b981",
    biceps: "#8b5cf6",
    thighs: "#f59e0b"
  };

  return (
    <Card className="mt-8">
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={measurements}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'MMM d')}
              />
              <YAxis />
              <Tooltip />
              {measurementTypes.map(type => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  stroke={colors[type]}
                  strokeWidth={2}
                  name={type.charAt(0).toUpperCase() + type.slice(1)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}