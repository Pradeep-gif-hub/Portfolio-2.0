import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const LINES = [
  "Building web interfaces",
  "Writing systems software",
  "Running models on device",
  "Shipping products",
];
const LINE_MS = 560;

export const ScrollIdentity = () => {
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (location.pathname !== "/") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let played = false;

    const tick = () => {
      const section = document.getElementById("github-activity");
      if (played || document.querySelector("[data-greeting-intro]")) return;
      if (!section) return;
      if (section.getBoundingClientRect().top > window.innerHeight * 0.9) return;
      played = true;
      window.clearInterval(timer);
      window.removeEventListener("scroll", tick);
      section.scrollIntoView({ block: "start" });
      setIndex(0);
      setActive(true);
    };

    const timer = window.setInterval(tick, 200);
    window.addEventListener("scroll", tick, { passive: true });
    tick();
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", tick);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timers = LINES.slice(1).map((_, step) =>
      window.setTimeout(() => setIndex(step + 1), (step + 1) * LINE_MS)
    );
    timers.push(
      window.setTimeout(() => {
        setActive(false);
        document.body.style.overflow = previousOverflow;
      }, LINE_MS * LINES.length)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-theme-bg text-theme-text"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="flex items-center gap-2 px-6 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="size-1.5 shrink-0 rounded-full bg-current" />
            <span>{LINES[index]}</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
