import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Info, XCircle, X } from "lucide-react";
import { useToastStore, type ToastType } from "@/store/useToastStore";
import clsx from "clsx";

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const toastStyles: Record<ToastType, string> = {
  success: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900",
  error: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900",
  info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900",
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={clsx(
              "pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md",
              toastStyles[toast.type]
            )}
          >
            {toastIcons[toast.type]}
            <p className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
