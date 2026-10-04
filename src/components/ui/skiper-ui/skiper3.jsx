"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

const Skiper3 = ({ className = "" }) => {
  const [toggle, setToggle] = useState(false);

  return (
    <div className={cn("relative flex flex-col h-[180px] w-full items-center justify-center rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] shadow-[var(--shadow-card)] p-6 overflow-hidden transition-all duration-300", className)}>
      <div className="flex items-center justify-center h-16 w-full">
        <motion.div layout>
          <motion.div
            className={cn(
              "h-[52px] relative flex items-center justify-between overflow-hidden rounded-full shadow-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900",
            )}
            style={{ borderRadius: 9999 }}
            initial={{ scale: 0, y: "100%" }}
            transition={{ type: "spring", bounce: 0.16 }}
            animate={{ scale: 1, y: 0, width: !toggle ? 52 : 300 }}
          >
            <div className="flex h-full w-[230px] items-center justify-center gap-2 rounded-full px-3">
              {toggle && (
                <motion.div
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center gap-2"
                >
                  <span className="h-[8px] w-[46px] rounded-full bg-white/50 dark:bg-neutral-900/50" />
                  <span className="size-[8px] rounded-full bg-white/50 dark:bg-neutral-900/50" />
                  <span className="size-[8px] rounded-full bg-white/50 dark:bg-neutral-900/50" />
                  <span className="size-[8px] rounded-full bg-white/50 dark:bg-neutral-900/50" />
                  <span className="size-[8px] rounded-full bg-white/50 dark:bg-neutral-900/50" />
                </motion.div>
              )}
            </div>
            {toggle && (
              <div className="flex h-full w-[52px] items-center justify-center rounded-full pr-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                  className="flex items-center justify-center"
                >
                  <motion.svg
                    key="play"
                    initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                    transition={{ delay: 0.2 }}
                    viewBox="-1 0 12 14"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                  >
                    <path d="M0.9375 13.2422C1.25 13.2422 1.51562 13.1172 1.82812 12.9375L10.9375 7.67188C11.5859 7.28906 11.8125 7.03906 11.8125 6.625C11.8125 6.21094 11.5859 5.96094 10.9375 5.58594L1.82812 0.3125C1.51562 0.132812 1.25 0.015625 0.9375 0.015625C0.359375 0.015625 0 0.453125 0 1.13281V12.1172C0 12.7969 0.359375 13.2422 0.9375 13.2422Z" />
                  </motion.svg>
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
      <button
        onClick={() => setToggle((x) => !x)}
        className="mt-3 rounded-full px-4 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--color-bg-surface-alt)] hover:bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)] shadow-xs transition-all active:scale-95 cursor-pointer"
        aria-label="Toggle Skiper 3 Dynamic Island"
      >
        {toggle ? "Collapse Skiper 3" : "Expand Skiper 3"}
      </button>
    </div>
  );
};

export { Skiper3 };

/**
 * Dynamic Toggle button Component — v1.0.0
 * Built with Motion fo rounded-full React
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper rounded-full UI is required when using the free version.
 * - No attribution required with Skiper rounded-full UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
