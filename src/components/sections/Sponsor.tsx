import React from "react";
import { motion } from "framer-motion";
import { sponsor } from "../../data/sponsor";
import { SectionWrapper } from "../layout/SectionWrapper";
import { Button } from "../ui/Button";
import { Heart } from "lucide-react";

export const Sponsor: React.FC = () => {
  return (
    <SectionWrapper id="sponsor">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-theme-surface border border-theme-border rounded-[10px] p-8 md:p-10 text-center shadow-card">
          <div className="flex justify-center mb-5">
            <Heart
              size={28}
              className="text-theme-accent"
            />
          </div>

          <h2 className="heading-2 mb-3">{sponsor.title}</h2>
          <p className="text-theme-muted text-base mb-8 max-w-lg mx-auto">
            {sponsor.description}
          </p>

          <Button
            variant="primary"
            size="lg"
            onClick={() => window.open(sponsor.link, "_blank")}
          >
            {sponsor.cta}
          </Button>

          <p className="text-theme-muted text-sm mt-6">
            Your support helps me create more quality content & projects
          </p>
        </div>
      </motion.div>
    </SectionWrapper>
  );
};
