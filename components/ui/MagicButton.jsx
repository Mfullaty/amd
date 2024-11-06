import React from "react";

const MagicButton = ({ title, icon, position, handleClick = () => {}, otherClasses }) => {
  return (
    <button
      className="relative inline-flex h-12 overflow-hidden rounded-lg w-full p-[1px] focus:outline-none md:w-60"
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FFA500_0%,#800080_50%,#00008B_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className={`inline-flex gap-1 h-full w-full cursor-pointer items-center justify-center rounded-lg bg-white dark:bg-slate-950 hover:bg-muted dark:hover:bg-slate-800  px-7  text-sm font-medium text-foreground backdrop-blur-3xl ${otherClasses}`}>
        {position === 'left' && icon}
        {title}
        {position === 'right' && icon}
      </span>
    </button>
  );
};

export default MagicButton;
