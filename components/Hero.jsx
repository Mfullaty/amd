import React from "react";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import MagicButton from "./ui/MagicButton";
import AppIcon from "./dashboard/AppIcon";
import { GridDotBackgrounds } from "./ui/GridDotBackgrounds";

const Hero = () => {
  return (
    <div className="pb-20 pt-36">
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="top-10 left-full h-[80vh] w-[50vw]"
          fill="purple"
        />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw] " fill="blue" />
      </div>

      <GridDotBackgrounds />

      <div className="flex justify-center relative my-20 z-10 ">
        <div className="max-w-[89-vw] md:max-w-2xl lg:max-[60vw] flex flex-col items-center justify-center">
          <h2 className="uppercase tracking-widest text-xs text-center text-slate-950 dark:text-blue-100 max-w-80">
            Weaving Dreams, One Stitch at a Time
          </h2>
          <TextGenerateEffect
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
            words="Where Art Meets Fabric, We Are There For You!"
          />
          <p className="text-center md-tracking-wider mb-4 text-sm">
            Built By Skilled Full Stack Developer, Mustapha Ibrahim
          </p>

          <div className="flex items-center justify-center gap-2 flex-wrap">

          <a href="#designs">
            <MagicButton
              otherClasses="uppercase"
              title="See recent Designs"
              position="right"
              icon={
                <AppIcon icon="Box" className="text-muted-foreground w-5" />
              }
            />
          </a>

          <a href="/dashboard">
            <MagicButton
              otherClasses="uppercase"
              title="Go to dashboard"
              position="left"
              icon={
                <AppIcon icon="AppWindow" className="text-muted-foreground w-5" />
              }
            />
          </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
