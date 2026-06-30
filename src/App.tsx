import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { SearchPage } from "@/pages/SearchPage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";
import { SelectedProfilesSidebar } from "@/components/list/SelectedProfilesSidebar";
import { ToastContainer } from "@/components/ui/Toast";
import { AnimatePresence } from "framer-motion";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<SearchPage />} />
        <Route path="/profile/:username" element={<ProfileDetailPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <SelectedProfilesSidebar />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
