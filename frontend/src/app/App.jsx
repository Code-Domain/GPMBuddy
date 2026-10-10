import { BrowserRouter, Routes, Route, useLocation, useNavigate, useParams, Outlet } from "react-router-dom";
import { useEffect } from "react";

import { Navbar } from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";
import GPBuddyPage from "./components/GPBuddyPage";
import DepartmentPage from "./components/DepartmentPage";
import AcademicsPage from "./components/Pages/AcahdemicPage";
import PlacementPage from "./components/PlacementPage";
import NoticePage from "./components/NoticePage";
import Login from "./components/Login";
import AdminPanel from "./components/Pages/AdminPannel";

// ScrollToTop helper component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

// Layout component that wraps standard pages with Navbar and Footer
function StandardLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet /> {/* This renders the matched child route */}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        
        {/* Standalone pages without standard Navbar/Footer */}
        <Route path="/gpbuddy" element={<GPBuddyPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/super-admin" element={<AdminPanel />} />

        {/* Standard Pages with Navbar and Footer */}
        <Route element={<StandardLayout />}>
          <Route index element={<HeroSection />} /> {/* This is the home page ("/") */}
          <Route path="academics" element={<AcademicsPage />} />
          <Route path="placements" element={<PlacementPage />} />
          <Route path="notices" element={<NoticePage />} />
          <Route path="dept/:deptId" element={<DepartmentPage />} />
          {/* Fallback for old links or direct department URLs like /dept-cse */}
          <Route path=":pageName" element={<DynamicRouter />} /> 
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

// Helper to handle direct page names like "academics" or "dept-cse"
function DynamicRouter() {
  const { pageName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (pageName === "home") {
      navigate("/", { replace: true });
    } else if (pageName === "academics") {
      navigate("/academics", { replace: true });
    } else if (pageName?.startsWith("dept-")) {
      navigate(`/dept/${pageName}`, { replace: true });
    } else if (pageName === "gpbuddy") {
      navigate("/gpbuddy", { replace: true });
    } else if (pageName === "login") {
      navigate("/login", { replace: true });
    } else if (pageName === "admin") {
      navigate("/admin", { replace: true });
    } else if (pageName === "super-admin") {
      navigate("/super-admin", { replace: true });
    }
    
  }, [pageName, navigate]);

  return <div className="min-h-screen bg-[#f0f4f8]"></div>; // Empty div while redirecting
}
