import type { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={clsx(
        "relative rounded-2xl border bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg p-5 sm:p-6",
        "transition-all duration-300 hover-lift overflow-hidden group",
        "border-white/60 dark:border-gray-700/60",
        className
      )}
    >
      {/* Gradient Background Animation */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05))",
        }}
      />

      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300 pointer-events-none"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          {icon && (
            <motion.div
              whileHover={{ rotate: 12, scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/40 dark:to-pink-900/40 flex items-center justify-center"
            >
              <span className="text-violet-600 dark:text-violet-400">{icon}</span>
            </motion.div>
          )}
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {label}
          </span>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent"
        >
          {value}
        </motion.div>
      </div>
    </motion.div>
  );
}
