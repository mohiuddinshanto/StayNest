import React from "react";
import { Star } from "lucide-react";

interface StarsProps {
  rating: number;
  size?: number;
}

export function Stars({ rating, size = 14 }: StarsProps) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
          }
        />
      ))}
    </span>
  );
}
