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
        <div className="bg-gradient-to-br from-accent-primary/10 to-accent-primary/5 border border-accent-primary/20 rounded-lg p-8 md:p-12 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center mb-6"
          >
            <Heart
              size={32}
              className="text-accent-primary fill-accent-primary"
            />
          </motion.div>

          <h2 className="heading-2 mb-4">{sponsor.title}</h2>
          <p className="text-text-secondary text-lg mb-8 max-w-lg mx-auto">
            {sponsor.description}
          </p>

          <Button
            variant="primary"
            size="lg"
            onClick={() => window.open(sponsor.link, "_blank")}
          >
            {sponsor.cta}
          </Button>

          <p className="text-text-tertiary text-sm mt-6">
            Your support helps me create more quality content & projects
          </p>
        </div>
      </motion.div>
    </SectionWrapper>
  );
};
