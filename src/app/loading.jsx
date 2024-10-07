import { Loader2 } from "lucide-react";
import React from "react";

export default function LoadingLayout() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Loader2 className="w-16 h-16 animate-spin" />
    </div>
  );
}
