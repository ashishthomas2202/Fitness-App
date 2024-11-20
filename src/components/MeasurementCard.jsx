// src/components/MeasurementCard.jsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

export function MeasurementCard({ title, current, previous, unit = "in" }) {
  const difference = current - previous;
  const percentChange = ((difference / previous) * 100).toFixed(1);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold">
            {current} {unit}
          </p>
          {difference !== 0 && (
            <span className={`ml-2 flex items-center text-sm ${
              difference > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {difference > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(percentChange)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}