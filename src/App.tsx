import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import ConsentBanner from "@/components/ConsentBanner";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import SearchPage from "./pages/SearchPage";
import ArticlePage from "./pages/ArticlePage";
import ProfilePage from "./pages/ProfilePage";
import BookmarksPage from "./pages/BookmarksPage";
import ImpressumPage from "./pages/ImpressumPage";
import DatenschutzPage from "./pages/DatenschutzPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

function DarkModeInit() {
  useEffect(() => {
    const stored = localStorage.getItem("fiume_dark_mode");
    if (stored === null) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.toggle("dark", stored === "true");
    }
  }, []);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <DarkModeInit />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <div className="max-w-lg mx-auto min-h-screen relative">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rubriken" element={<CategoriesPage />} />
            <Route path="/rubriken/:slug" element={<CategoriesPage />} />
            <Route path="/suche" element={<SearchPage />} />
            <Route path="/artikel/:slug" element={<ArticlePage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/lesezeichen" element={<BookmarksPage />} />
            <Route path="/impressum" element={<ImpressumPage />} />
            <Route path="/datenschutz" element={<DatenschutzPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
        <ConsentBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
