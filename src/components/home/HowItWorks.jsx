"use client";
import { motion } from "framer-motion";
import { FiEdit3, FiShare2, FiUsers } from "react-icons/fi";

const steps = [
  {
    icon: FiEdit3,
    title: "Create Your Recipe",
    description:
      "Add your favorite recipes with photos, ingredients, and step-by-step instructions.",
  },
  {
    icon: FiShare2,
    title: "Share with Community",
    description:
      "Publish your recipe and let thousands of food lovers discover your creations.",
  },
  {
    icon: FiUsers,
    title: "Connect & Get Liked",
    description:
      "Engage with other foodies, collect likes, and grow your culinary reputation.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[var(--text-primary)]">
          How RecipeHub Works
        </h2>
        <p className="text-[var(--text-secondary)] mt-2">
          Three simple steps to start your culinary journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center mb-4">
                <Icon size={28} className="text-[var(--primary)]" />
              </div>
              <h3 className="font-bold text-lg text-[var(--text-primary)] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
