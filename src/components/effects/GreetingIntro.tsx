import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const GREETINGS = [
  "Hello",
  "Bonjour",
  "स्वागत है",
  "नमस्कार",
  "Ciao",
  "Olá",
  "おい",
  "Hallå",
  "Guten tag",
];

const STEP_MS = 180;
const NAME_MS = 600;

type Phase = "greetings" | "name" | "done";

export const GreetingIntro = () => {
  const [phase, setPhase] = useState<Phase>("greetings");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("done");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timers = GREETINGS.slice(1).map((_, step) =>
      window.setTimeout(() => setIndex(step + 1), (step + 1) * STEP_MS)
    );
    const afterGreetings = STEP_MS * GREETINGS.length;
    timers.push(window.setTimeout(() => setPhase("name"), afterGreetings));
    timers.push(
      window.setTimeout(() => {
        setPhase("done");
        document.body.style.overflow = previousOverflow;
      }, afterGreetings + NAME_MS)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          data-greeting-intro=""
          aria-hidden="true"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-theme-bg text-theme-text"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.45, ease: [0.77, 0, 0.175, 1] }}
        >
          <p className="flex items-center gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="size-1.5 shrink-0 rounded-full bg-current" />
            <span>{phase === "name" ? "Pradeep" : GREETINGS[index]}</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
