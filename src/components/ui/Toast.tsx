import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Info, XCircle, X } from "lucide-react";
import { useToastStore, type ToastType } from "@/store/useToastStore";
import clsx from "clsx";

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
  error: <XCircle className="w-6 h-6 text-red-500" />,
  info: <Info className="w-6 h-6 text-cyan-500" />,
};

const toastStyles: Record<ToastType, string> = {
  success: "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-300 dark:border-emerald-800 shadow-emerald-500/20",
  error: "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/40 dark:to-pink-950/40 border-red-300 dark:border-red-800 shadow-red-500/20",
  info: "bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40 border-cyan-300 dark:border-cyan-800 shadow-cyan-500/20",
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm px-4 sm:px-0 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9, x: 100 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 100, transition: { duration: 0.2 } }}
            whileHover={{ scale: 1.02 }}
            className={clsx(
              "pointer-events-auto flex items-center gap-4 p-5 rounded-2xl border-2 shadow-2xl backdrop-blur-xl",
              "transition-all duration-300 hover:shadow-lg",
              toastStyles[toast.type]
            )}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              {toastIcons[toast.type]}
            </motion.div>
            <p className="flex-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
              {toast.message}
            </p>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
