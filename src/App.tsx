import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SearchPage } from "@/pages/SearchPage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";
import { SelectedProfilesSidebar } from "@/components/list/SelectedProfilesSidebar";
import { ToastContainer } from "@/components/ui/Toast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/profile/:username" element={<ProfileDetailPage />} />
      </Routes>
      <SelectedProfilesSidebar />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
