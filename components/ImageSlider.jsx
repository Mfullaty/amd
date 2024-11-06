import React, { useState } from "react";
import Image from "next/image";
import AppIcon from "./dashboard/AppIcon";
import { useSwipeable } from "react-swipeable";

export default function ImageSlider({
  imageUrls = [], // Default to an empty array if imageUrls is undefined
  containerHeight = "48",
  className = "rounded-md shadow-sm dark:shadow-slate-400",
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true,
  });

  if (imageUrls.length === 0) {
    return <div>No images</div>;
  }

  return (
    <div {...handlers} className={`relative w-full h-${containerHeight}`}>
      <div className="overflow-hidden w-full h-full">
        <Image
          src={imageUrls[currentIndex]} // Directly use the URL from the array
          alt={`Image ${currentIndex + 1}`} // Provide a simple alt text
          layout="fill"
          objectFit="cover"
          draggable="false" // Prevent default drag behavior
          className={className}
        />
      </div>
      <button onClick={handlePrev}>
        <AppIcon
          icon="ArrowLeft"
          className="w-7 h-7 p-1 absolute left-1 top-1/2 transform -translate-y-1/2 bg-background text-foreground rounded-full shadow-xl dark:shadow-lg dark:shadow-slate-400 hover:bg-indigo-500 hover:scale-105 transition-all ease-in-out"
        />
      </button>
      <button onClick={handleNext}>
        <AppIcon
          icon="ArrowRight"
          className="w-7 h-7 p-1 absolute right-1 top-1/2 transform -translate-y-1/2 bg-background text-foreground rounded-full shadow-xl dark:shadow-lg dark:shadow-slate-400 hover:bg-indigo-500 hover:scale-105 transition-all ease-in-out"
        />
      </button>
    </div>
  );
}
