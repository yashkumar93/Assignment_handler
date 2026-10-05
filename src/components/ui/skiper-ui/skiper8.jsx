"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_WORDS = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Olá",
  "やあ",
  "Hallå",
  "Guten Tag",
  "Hallo",
];

export const opacity = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.1 },
  },
};

export const slideUp = {
  initial: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: "-100%",
    opacity: 1,
    transition: { duration: 0.8, ease: [0.76, 0.21, 0.9, 1] },
    transitionEnd: {
      display: "none",
    },
  },
};

const Skiper8 = ({
  words = DEFAULT_WORDS,
  studentName = "",
  backgroundColor = "#141516",
  textColor = "#ffffff",
  firstWordDelay = 850, // 👈 1. First word ("Hello"): generous time (0.85s)
  fastWordDelay = 260,  // 👈 2. Middle greetings ("नमस्ते", "Welcome"): fast & snappy (0.26s)
  nameWordDelay = 950,  // 👈 3. Student's Name: generous time to read & enjoy (0.95s)
  lastWordDelay = 900,  // 👈 4. Final word ("Assignment Portal"): 900ms before curtain exit (0.9s)
  onComplete,
  className = "",
}) => {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const updateDimension = () => {
      setDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimension();
    window.addEventListener("resize", updateDimension);

    // Lock body scroll while preloader is active
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("resize", updateDimension);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    // If it's the very last word, wait for lastWordDelay before sliding up
    if (index === words.length - 1) {
      if (onComplete) {
        const exitTimer = setTimeout(() => {
          onComplete();
        }, lastWordDelay);
        return () => clearTimeout(exitTimer);
      }
      return;
    }

    const currentWord = words[index];
    const isFirstWord = index === 0;
    const isNameWord = (studentName && currentWord === studentName) || (!studentName && index === words.length - 2);

    // Dynamic delay: First word and Student name get extra time, other greetings are fast
    let delay = fastWordDelay;
    if (isFirstWord) {
      delay = firstWordDelay;
    } else if (isNameWord) {
      delay = nameWordDelay;
    }

    const timer = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [index, words, onComplete, firstWordDelay, fastWordDelay, nameWordDelay, lastWordDelay, studentName]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.25 },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      onClick={() => onComplete && onComplete()}
      className={cn(
        "fixed top-0 left-0 w-screen h-screen z-[99999] flex items-center justify-center cursor-pointer overflow-hidden select-none",
        className
      )}
      style={{ backgroundColor }}
      aria-label="Loading..."
      role="status"
    >
      {dimension.width > 0 && (
        <>
          <motion.p
            variants={opacity}
            initial="initial"
            animate="enter"
            className="relative z-10 flex items-center justify-center flex-wrap px-4 max-w-full text-center text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight"
            style={{ color: textColor }}
          >
            <span
              className="mr-3.5 inline-block size-2.5 sm:size-3 rounded-full shrink-0 animate-pulse"
              style={{ backgroundColor: textColor }}
            />
            {words[index]}
          </motion.p>

          <svg
            className="absolute top-0 left-0 w-full pointer-events-none"
            style={{ height: "calc(100% + 300px)" }}
          >
            <motion.path
              variants={curve}
              initial="initial"
              exit="exit"
              fill={backgroundColor}
            />
          </svg>
        </>
      )}
    </motion.div>
  );
};

export { Skiper8, Skiper8 as Preloader_002 };
export default Skiper8;

