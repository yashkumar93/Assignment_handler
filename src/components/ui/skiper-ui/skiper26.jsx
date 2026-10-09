import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const getPositionCoords = (position) => {
  switch (position) {
    case "top-left":
      return { cx: "0", cy: "0" };
    case "top-right":
      return { cx: "40", cy: "0" };
    case "bottom-left":
      return { cx: "0", cy: "40" };
    case "bottom-right":
      return { cx: "40", cy: "40" };
    case "top-center":
      return { cx: "20", cy: "0" };
    case "bottom-center":
      return { cx: "20", cy: "40" };
    case "bottom-up":
    case "top-down":
    case "left-right":
    case "right-left":
    default:
      return { cx: "20", cy: "20" };
  }
};

const generateSVG = (variant, start) => {
  if (variant === "circle-blur") {
    if (start === "center") {
      return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="20" r="18" fill="white" filter="url(%23blur)"/></svg>`;
    }
    const positionCoords = getPositionCoords(start);
    const { cx, cy } = positionCoords || { cx: "20", cy: "20" };
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="${cx}" cy="${cy}" r="18" fill="white" filter="url(%23blur)"/></svg>`;
  }

  if (start === "center") return "";
  if (variant === "rectangle") return "";

  const positionCoords = getPositionCoords(start);
  const { cx, cy } = positionCoords || { cx: "20", cy: "20" };

  if (variant === "circle") {
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="${cx}" cy="${cy}" r="20" fill="white"/></svg>`;
  }

  return "";
};

const getTransformOrigin = (start) => {
  switch (start) {
    case "top-left":
      return "top left";
    case "top-right":
      return "top right";
    case "bottom-left":
      return "bottom left";
    case "bottom-right":
      return "bottom right";
    case "top-center":
      return "top center";
    case "bottom-center":
      return "bottom center";
    case "bottom-up":
    case "top-down":
    case "left-right":
    case "right-left":
    default:
      return "center";
  }
};

export const createAnimation = (
  variant,
  start = "center",
  blur = false,
  url = ""
) => {
  const svg = generateSVG(variant, start);
  const transformOrigin = getTransformOrigin(start);

  if (variant === "rectangle") {
    const getClipPath = (direction) => {
      switch (direction) {
        case "bottom-up":
          return {
            from: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          };
        case "top-down":
          return {
            from: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          };
        case "left-right":
          return {
            from: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
            to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          };
        case "right-left":
          return {
            from: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
            to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          };
        case "top-left":
          return {
            from: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
            to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          };
        case "top-right":
          return {
            from: "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)",
            to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          };
        case "bottom-left":
          return {
            from: "polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)",
            to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          };
        case "bottom-right":
          return {
            from: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
            to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          };
        default:
          return {
            from: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          };
      }
    };

    const clipPath = getClipPath(start);

    return {
      name: `${variant}-${start}${blur ? "-blur" : ""}`,
      css: `
       ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
      }
            
      ::view-transition-new(root) {
        animation-name: reveal-light-${start}${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root),
      [data-theme="dark"]::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root),
      [data-theme="dark"]::view-transition-new(root) {
        animation-name: reveal-dark-${start}${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      @keyframes reveal-dark-${start}${blur ? "-blur" : ""} {
        from {
          clip-path: ${clipPath.from};
          ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: ${clipPath.to};
          ${blur ? "filter: blur(0px);" : ""}
        }
      }

      @keyframes reveal-light-${start}${blur ? "-blur" : ""} {
        from {
          clip-path: ${clipPath.from};
          ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: ${clipPath.to};
          ${blur ? "filter: blur(0px);" : ""}
        }
      }
      `,
    };
  }

  if (variant === "circle" && start === "center") {
    return {
      name: `${variant}-${start}${blur ? "-blur" : ""}`,
      css: `
       ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
      }
            
      ::view-transition-new(root) {
        animation-name: reveal-light${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root),
      [data-theme="dark"]::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root),
      [data-theme="dark"]::view-transition-new(root) {
        animation-name: reveal-dark${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      @keyframes reveal-dark${blur ? "-blur" : ""} {
        from {
          clip-path: circle(0% at 50% 50%);
          ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: circle(100.0% at 50% 50%);
          ${blur ? "filter: blur(0px);" : ""}
        }
      }

      @keyframes reveal-light${blur ? "-blur" : ""} {
        from {
           clip-path: circle(0% at 50% 50%);
           ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: circle(100.0% at 50% 50%);
          ${blur ? "filter: blur(0px);" : ""}
        }
      }
      `,
    };
  }

  if (variant === "circle-blur") {
    return {
      name: `${variant}-${start}`,
      css: `
      ::view-transition-group(root) {
        animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
      }

      ::view-transition-new(root) {
        mask: url('${svg}') ${start === "center" ? "center" : start.replace("-", " ")} / 0 no-repeat;
        mask-origin: content-box;
        animation: scale-blur 1s;
        transform-origin: ${transformOrigin};
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root),
      [data-theme="dark"]::view-transition-old(root) {
        animation: scale-blur 1s;
        transform-origin: ${transformOrigin};
        z-index: -1;
      }

      @keyframes scale-blur {
        to {
          mask-size: 350vmax;
        }
      }
      `,
    };
  }

  // Fallback circle animation
  const clipPosition =
    start === "top-left"
      ? "0% 0%"
      : start === "top-right"
        ? "100% 0%"
        : start === "bottom-left"
          ? "0% 100%"
          : start === "bottom-right"
            ? "100% 100%"
            : start === "top-center"
              ? "50% 0%"
              : start === "bottom-center"
                ? "50% 100%"
                : "50% 50%";

  return {
    name: `${variant}-${start}${blur ? "-blur" : ""}`,
    css: `
     ::view-transition-group(root) {
      animation-duration: 0.8s;
      animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    }
          
    ::view-transition-new(root) {
      animation-name: reveal-light-${start}${blur ? "-blur" : ""};
      ${blur ? "filter: blur(2px);" : ""}
    }

    ::view-transition-old(root),
    .dark::view-transition-old(root),
    [data-theme="dark"]::view-transition-old(root) {
      animation: none;
      z-index: -1;
    }
    .dark::view-transition-new(root),
    [data-theme="dark"]::view-transition-new(root) {
      animation-name: reveal-dark-${start}${blur ? "-blur" : ""};
      ${blur ? "filter: blur(2px);" : ""}
    }

    @keyframes reveal-dark-${start}${blur ? "-blur" : ""} {
      from {
        clip-path: circle(0% at ${clipPosition});
        ${blur ? "filter: blur(8px);" : ""}
      }
      ${blur ? "50% { filter: blur(4px); }" : ""}
      to {
        clip-path: circle(150.0% at ${clipPosition});
        ${blur ? "filter: blur(0px);" : ""}
      }
    }

    @keyframes reveal-light-${start}${blur ? "-blur" : ""} {
      from {
         clip-path: circle(0% at ${clipPosition});
         ${blur ? "filter: blur(8px);" : ""}
      }
      ${blur ? "50% { filter: blur(4px); }" : ""}
      to {
        clip-path: circle(150.0% at ${clipPosition});
        ${blur ? "filter: blur(0px);" : ""}
      }
    }
    `,
  };
};

export const useThemeToggle = ({
  variant = "circle-blur",
  start = "center",
  blur = true,
  gifUrl = "",
  theme: controlledTheme,
  onToggleTheme: controlledToggle,
} = {}) => {
  const [internalTheme, setInternalTheme] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.getAttribute("data-theme") || "light";
    }
    return "light";
  });

  const activeTheme = controlledTheme || internalTheme;
  const isDark = activeTheme === "dark";

  const styleId = "theme-transition-styles";

  const updateStyles = useCallback((css) => {
    if (typeof window === "undefined") return;

    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = css;
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = activeTheme === "light" ? "dark" : "light";
    const animation = createAnimation(variant, start, blur, gifUrl);
    updateStyles(animation.css);

    const switchTheme = () => {
      document.documentElement.setAttribute("data-theme", nextTheme);
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      setInternalTheme(nextTheme);
      try {
        localStorage.setItem("niat_react_theme", nextTheme);
      } catch (e) { }
      if (controlledToggle) {
        controlledToggle();
      }
    };

    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(switchTheme);
    } else {
      switchTheme();
    }
  }, [activeTheme, variant, start, blur, gifUrl, updateStyles, controlledToggle]);

  return {
    isDark,
    toggleTheme,
  };
};

export const ThemeToggleButton = ({
  className = "",
  variant = "circle-blur",
  start = "center",
  blur = true,
  gifUrl = "",
  theme,
  onToggleTheme,
}) => {
  const { isDark, toggleTheme } = useThemeToggle({
    variant,
    start,
    blur,
    gifUrl,
    theme,
    onToggleTheme,
  });

  return (
    <button
      type="button"
      className={cn(
        "size-10 cursor-pointer rounded-full bg-[var(--color-bg-surface-alt)] border border-[var(--color-border-default)] p-0 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm inline-flex items-center justify-center",
        className
      )}
      onClick={toggleTheme}
      aria-label="Toggle theme with progressive blur transition"
      title="Toggle theme with progressive blur transition"
    >
      <span className="sr-only">Toggle theme with progressive blur</span>
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-6"
      >
        <motion.g
          animate={{ rotate: isDark ? -180 : 0 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        >
          <path
            d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
            fill="currentColor"
          />
          <path
            d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
          />
        </motion.g>
        <motion.path
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
          d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
};

export const Options = ({
  variant,
  start,
  blur,
  setVariant,
  setStart,
  setBlur,
}) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
      className="border-[var(--color-border-default)] bg-[var(--color-bg-surface)]/90 flex flex-col gap-2 rounded-2xl border p-3 shadow-lg backdrop-blur-md text-xs z-20"
      style={{ maxWidth: 280 }}
    >
      <div className="flex items-center justify-between pb-1 border-b border-[var(--color-border-subtle)]">
        <span className="size-4 cursor-grab active:cursor-grabbing inline-flex items-center text-[var(--color-text-tertiary)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="size-4 opacity-60" aria-hidden="true">
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="9" cy="5" r="1.5" />
            <circle cx="9" cy="19" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="15" cy="5" r="1.5" />
            <circle cx="15" cy="19" r="1.5" />
          </svg>
        </span>
        <span className="font-mono font-semibold uppercase tracking-wider text-[10px] text-[var(--color-text-tertiary)]">
          Progressive Blur Controls
        </span>
      </div>

      <div className="flex flex-col gap-2 pt-1">

        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-tertiary)] font-mono">blur:</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setBlur(false)}
              className={cn(
                "cursor-pointer px-2 py-0.5 rounded text-[11px] font-medium transition-all",
                !blur
                  ? "bg-[var(--color-accent-solid)] text-[var(--color-accent-solid-text)]"
                  : "bg-[var(--color-bg-surface-alt)] text-[var(--color-text-secondary)] opacity-60 hover:opacity-100"
              )}
            >
              off
            </button>
            <button
              type="button"
              onClick={() => setBlur(true)}
              className={cn(
                "cursor-pointer px-2 py-0.5 rounded text-[11px] font-medium transition-all",
                blur
                  ? "bg-[var(--color-accent-solid)] text-[var(--color-accent-solid-text)]"
                  : "bg-[var(--color-bg-surface-alt)] text-[var(--color-text-secondary)] opacity-60 hover:opacity-100"
              )}
            >
              on
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-tertiary)] font-mono">variant:</span>
          <div className="flex flex-wrap items-center justify-end gap-1">
            {["circle-blur", "rectangle", "circle"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVariant(v)}
                className={cn(
                  "cursor-pointer px-1.5 py-0.5 rounded text-[10px] font-mono transition-all",
                  variant === v
                    ? "bg-[var(--color-accent-solid)] text-[var(--color-accent-solid-text)] font-bold"
                    : "bg-[var(--color-bg-surface-alt)] text-[var(--color-text-secondary)] opacity-60 hover:opacity-100"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Skiper26 = ({ theme, onToggleTheme }) => {
  const [variant, setVariant] = useState("circle-blur");
  const [start, setStart] = useState("center");
  const [blur, setBlur] = useState(true);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] shadow-xs">
      <div className="flex items-center justify-between w-full gap-4">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-accent-text)]">
            Progressive Blur Transition
          </div>
          <div className="text-xs text-[var(--color-text-secondary)]">
            Click to trigger progressive view-transition blur
          </div>
        </div>

        <ThemeToggleButton
          variant={variant}
          start={start}
          blur={blur}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
      </div>
    </div>
  );
};

export default Skiper26;
