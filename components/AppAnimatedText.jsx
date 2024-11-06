"use client";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";

export function AppAnimatedText({words,  className}) {
  return <TextGenerateEffect className={className} words={words} />;
}
