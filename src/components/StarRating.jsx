import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, max = 5, onChange, size = 16 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        const isActive = hoverRating ? starValue <= hoverRating : starValue <= rating;
        return (
          <button
            key={index}
            type="button"
            className={`transition-all duration-150 ${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => onChange && setHoverRating(starValue)}
            onMouseLeave={() => onChange && setHoverRating(0)}
            disabled={!onChange}
          >
            <Star
              size={size}
              className={`${
                isActive
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
