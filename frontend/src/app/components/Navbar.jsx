// import image_poly from "@/imports/poly.jpg";
// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Menu, X, Bot, ChevronDown, LogIn, Mail, Phone } from "lucide-react";

// const departments = [
//   { label: "Civil Engineering", id: "dept-civil" },
//   { label: "Computer Science & Engineering", id: "dept-cse" },
//   { label: "Electrical Engineering", id: "dept-electrical" },
//   { label: "Electronics Engineering", id: "dept-electronics" },
//   { label: "Mechanical Engineering", id: "dept-mechanical" },
//   { label: "Chemistry", id: "dept-chemistry" },
//   { label: "Physics", id: "dept-physics" },
//   { label: "Humanities", id: "dept-humanities" },
//   { label: "Leather Technology", id: "dept-leather" },
// ];

// export function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [deptOpen, setDeptOpen] = useState(false);
//   const [mobileDeptOpen, setMobileDeptOpen] = useState(false);

//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDeptOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const onNavigate = (path) => {
//     if (path === "home") navigate("/");
//     else if (path.startsWith("dept-")) navigate(`/dept/${path}`);
//     else navigate(`/${path}`);
    
//     setMobileOpen(false);
//     setDeptOpen(false);
//   };

//   const currentPage = location.pathname;
//   const isDeptPage = currentPage.startsWith("/dept/");
  
//   const navLinks = [
//     { label: "Home", path: "home", active: currentPage === "/" },
//     { label: "Academics", path: "academics", active: currentPage === "/academics" },
//     { label: "Placements", path: "placements", active: currentPage === "/placements" },
//     { label: "Notices", path: "notices", active: currentPage === "/notices" },
//   ];

//   return (
//     <header className="sticky top-0 z-50 font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
//       {/* ===================== HEADER SECTION (Modern Branding) ===================== */}
//       <div className="bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          
//           {/* Logo + Name */}
//           <button onClick={() => onNavigate("home")} className="flex items-center gap-3 group">
//             <div className="relative">
//               <div className="absolute inset-0 bg-[#FF9933] rounded-full blur-[8px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
//               <img src={image_poly} alt="GPM Logo" className="relative w-12 h-12 sm:w-14 sm:h-14 object-contain" />
//             </div>
//             <div className="hidden sm:block text-left">
//               <h1 className="text-[18px] sm:text-[20px] font-extrabold leading-tight text-[#0b1f5e]" style={{ letterSpacing: "-0.02em" }}>
//                 Government Polytechnic
//               </h1>
//               <div className="flex items-center gap-2">
//                 <span className="text-[14px] text-[#FF9933] font-bold tracking-wide">Muzaffarpur</span>
//                 <span className="text-[12px] text-slate-400 font-medium">• Est. 1949</span>
//               </div>
//               <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-0.5 hidden md:block">
//                 Dept. of Science &amp; Technology, Govt. of Bihar
//               </p>
//             </div>
//           </button>

//           {/* Action buttons (Pill-shaped & Vibrant) */}
//           <div className="flex items-center gap-2 sm:gap-3">
//             <button
//               onClick={() => onNavigate("login")}
//               className="flex items-center gap-2 bg-[#0b1f5e] text-white px-4 sm:px-5 py-2.5 rounded-full text-[13px] font-semibold hover:bg-[#0a1a4d] transition-all shadow-sm hover:shadow-md"
//             >
//               <LogIn className="w-4 h-4" strokeWidth={2.5} />
//               <span className="hidden sm:inline">Admin Login</span>
//             </button>
//             <button
//               onClick={() => onNavigate("gpbuddy")}
//               className="flex items-center gap-2 bg-gradient-to-r from-[#FF9933] to-[#ff7a00] text-white px-4 sm:px-5 py-2.5 rounded-full text-[13px] font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all shadow-sm"
//             >
//               <Bot className="w-4 h-4" /> 
//               <span className="hidden sm:inline">GPM Buddy</span>
//             </button>

//             {/* Mobile Hamburger inside header */}
//             <button
//               className="lg:hidden p-2 text-[#0b1f5e] hover:bg-slate-100 rounded-md transition-colors"
//               onClick={() => setMobileOpen(!mobileOpen)}
//               aria-label="Toggle menu"
//             >
//               {mobileOpen ? <X size={22} /> : <Menu size={22} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ===================== NAVIGATION BAR (Glassmorphism + Animated Links) ===================== */}
//       <nav
//         className={`sticky top-0 z-40 transition-all duration-300 ${
//           scrolled 
//             ? "bg-white/90 backdrop-blur-md shadow-md border-b border-slate-200" 
//             : "bg-[#0b1f5e]"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="hidden lg:flex items-center h-[52px]">
            
//             {/* Dynamic Nav Links with Animated Underline */}
//             {navLinks.map((link) => (
//               <button
//                 key={link.label}
//                 onClick={() => onNavigate(link.path)}
//                 className={`relative px-5 py-4 text-[14px] font-semibold transition-colors group ${
//                   scrolled 
//                     ? `${link.active ? "text-[#0b1f5e]" : "text-slate-600 hover:text-[#0b1f5e]"}` 
//                     : `${link.active ? "text-[#FF9933]" : "text-white hover:text-[#FF9933]"}`
//                 }`}
//               >
//                 {link.label}
//                 <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-[#FF9933] rounded-t-full transition-all duration-300 ${link.active ? "w-8" : "w-0 group-hover:w-6"}`}></span>
//               </button>
//             ))}

//             {/* Desktop Departments Dropdown */}
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setDeptOpen(!deptOpen)}
//                 className={`flex items-center gap-1.5 px-5 py-4 text-[14px] font-semibold transition-colors group ${
//                   isDeptPage 
//                     ? (scrolled ? "text-[#0b1f5e]" : "text-[#FF9933]") 
//                     : (scrolled ? "text-slate-600 hover:text-[#0b1f5e]" : "text-white hover:text-[#FF9933]")
//                 }`}
//               >
//                 Departments 
//                 <ChevronDown size={16} className={`transition-transform duration-200 ${deptOpen ? "rotate-180" : ""}`} />
//                 <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-[#FF9933] rounded-t-full transition-all duration-300 ${isDeptPage ? "w-8" : "w-0 group-hover:w-6"}`}></span>
//               </button>

//               {deptOpen && (
//                 <div className="absolute left-0 top-full bg-white text-[#0b1f5e] shadow-2xl rounded-lg mt-1 min-w-[300px] animate-[fadeIn_0.2s_ease] z-50 border border-slate-100 overflow-hidden">
//                   <ul className="py-2 max-h-[450px] overflow-y-auto">
//                     {departments.map((dept) => (
//                       <li key={dept.id}>
//                         <button
//                           onClick={() => onNavigate(dept.id)}
//                           className="w-full text-left px-4 py-2.5 text-[13px] text-slate-700 hover:bg-[#0b1f5e] hover:text-white transition-colors flex items-center group"
//                         >
//                           <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] mr-3 group-hover:bg-white transition-colors"></span>
//                           {dept.label}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu (Clean Modern Accordion) */}
//         <div
//           className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out bg-white text-[#0b1f5e] border-t border-slate-100 ${
//             mobileOpen ? "max-h-[900px] shadow-lg" : "max-h-0"
//           }`}
//         >
//           <div className="px-4 py-4 space-y-1">
//             {navLinks.map((link) => (
//               <button
//                 key={link.label}
//                 onClick={() => onNavigate(link.path)}
//                 className={`w-full text-left p-3 rounded-lg text-sm font-semibold transition-colors ${
//                   link.active ? "bg-[#0b1f5e] text-white" : "text-[#0b1f5e] hover:bg-slate-50"
//                 }`}
//               >
//                 {link.label}
//               </button>
//             ))}

//             {/* Mobile Departments Accordion */}
//             <div>
//               <button
//                 onClick={() => setMobileDeptOpen(!mobileDeptOpen)}
//                 className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold transition-colors ${
//                   isDeptPage ? "bg-[#0b1f5e] text-white" : "text-[#0b1f5e] hover:bg-slate-50"
//                 }`}
//               >
//                 Departments
//                 <ChevronDown size={16} className={`transition-transform duration-200 ${mobileDeptOpen ? "rotate-180" : ""}`} />
//               </button>

//               {mobileDeptOpen && (
//                 <div className="pl-4 pb-1 space-y-1 mt-1 border-l-2 border-slate-100 ml-3">
//                   {departments.map((dept) => (
//                     <button
//                       key={dept.id}
//                       onClick={() => onNavigate(dept.id)}
//                       className="block w-full text-left px-4 py-2.5 text-[13px] text-slate-600 hover:text-[#0b1f5e] hover:bg-slate-50 rounded-md transition-colors font-medium"
//                     >
//                       {dept.label}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Mobile Action Buttons */}
//             <div className="pt-4 border-t border-slate-100 mt-3 flex gap-3">
//               <button 
//                 onClick={() => onNavigate("login")} 
//                 className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0b1f5e] rounded-full"
//               >
//                 <LogIn size={16} strokeWidth={2.5} /> Admin Login
//               </button>
//               <button 
//                 onClick={() => onNavigate("gpbuddy")} 
//                 className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#FF9933] to-[#ff7a00] rounded-full"
//               >
//                 <Bot size={16} /> GPM Buddy
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
//       `}</style>
//     </header>
//   );
// }

// export default Navbar;


import image_poly from "@/imports/poly.jpg";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Bot, ChevronDown, LogIn } from "lucide-react";

const departments = [
  { label: "Civil Engineering", id: "dept-civil" },
  { label: "Computer Science & Engineering", id: "dept-cse" },
  { label: "Electrical Engineering", id: "dept-electrical" },
  { label: "Electronics Engineering", id: "dept-electronics" },
  { label: "Mechanical Engineering", id: "dept-mechanical" },
  { label: "Chemistry", id: "dept-chemistry" },
  { label: "Physics", id: "dept-physics" },
  { label: "Humanities", id: "dept-humanities" },
  { label: "Leather Technology", id: "dept-leather" },
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminToken = localStorage.getItem("adminToken");
  let adminRole = "";
  if (adminToken) {
    try {
      adminRole = JSON.parse(localStorage.getItem("adminData") || "{}").role || "";
    } catch {
      adminRole = "";
    }
  }
  const isAdminLoggedIn = Boolean(adminToken && ["admin", "super_admin"].includes(adminRole));
  const controlPanelPath = adminRole === "super_admin" ? "/super-admin" : "/admin";
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const [mobileDeptOpen, setMobileDeptOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDeptOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onNavigate = (path) => {
    if (path === "home") navigate("/");
    else if (path.startsWith("dept-")) navigate(`/dept/${path}`);
    else navigate(`/${path}`);
    
    setMobileOpen(false);
    setDeptOpen(false);
  };

  const currentPage = location.pathname;
  const isDeptPage = currentPage.startsWith("/dept/");
  
  const navLinks = [
    { label: "Home", path: "home", active: currentPage === "/" },
    { label: "Academics", path: "academics", active: currentPage === "/academics" },
    { label: "Placements", path: "placements", active: currentPage === "/placements" },
    { label: "Notices", path: "notices", active: currentPage === "/notices" },
  ];

  return (
    <header className="sticky top-0 z-50 font-sans w-full" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      
      {/* ===================== TOP BRANDING BAR (Collapsible on scroll) ===================== */}
      <div className={`bg-[#ffffff] text-gray-800 pt-3 transition-all duration-300 overflow-hidden ${scrolled ? "max-h-0 opacity-0" : "max-h-[150px] opacity-100"}`}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          
          {/* Logo + Name */}
          <button onClick={() => onNavigate("home")} className="flex min-w-0 items-center gap-2 sm:gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-[8px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <img src={image_poly} alt="GPM Logo" className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0 object-contain rounded-2xl" />
            </div>
            <div className="min-w-0 text-left">
              <h1 className="whitespace-nowrap text-[13px] sm:text-[18px] font-extrabold leading-tight text-gray-800" style={{ letterSpacing: "-0.02em" }}>
                Government Polytechnic
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="whitespace-nowrap text-[11px] sm:text-[13px] text-orange-400 font-bold tracking-wide">Muzaffarpur</span>
                <span className="w-1 h-1 shrink-0 rounded-full bg-slate-500"></span>
                <span className="whitespace-nowrap text-[10px] sm:text-[11px] text-slate-400 font-medium">Est. 1949</span>
              </div>
            </div>
          </button>

          {/* Action buttons */}
          <div className="hidden lg:flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => isAdminLoggedIn ? navigate(controlPanelPath) : onNavigate("login")}
              className="flex items-center gap-2 bg-blue-700 border border-white/10 text-white px-4 sm:px-5 py-2.5 rounded-full text-[12px] font-semibold hover:bg-blue-500 transition-all"
            >
              {isAdminLoggedIn ? <Menu className="w-4 h-4" strokeWidth={2.5} /> : <LogIn className="w-4 h-4" strokeWidth={2.5} />}
              <span className="hidden sm:inline">{isAdminLoggedIn ? "Control Panel" : "Admin Login"}</span>
            </button>
            <button
              onClick={() => onNavigate("gpbuddy")}
              className="flex items-center gap-2 bg-blue-900 text-white px-4 sm:px-5 py-2.5 rounded-full text-[12px] font-semibold hover:bg-blue-800 transition-all"
            >
              <Bot className="w-4 h-4" /> 
              <span className="hidden sm:inline">GPM Buddy</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================== NAVIGATION BAR (Sticky + Glassmorphism) ===================== */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 border-b-[1px] ${
          scrolled 
            ? "bg-white/80 backdrop-blur-lg shadow-lg border-b border-slate-200/50" 
            : "bg-slate-900 shadow-md"
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Collapsed Logo (Shows on scroll) */}
          <button onClick={() => onNavigate("home")} className={`flex items-center gap-2 transition-all ${scrolled ? "block py-3" : "hidden"}`}>
            <img src={image_poly} alt="GPM Logo" className="w-8 h-8 object-contain" />
            <span className="font-extrabold text-slate-900 text-[15px] tracking-tight">GPM Muzaffarpur</span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center h-[52px]">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.path)}
                className={`relative px-5 py-4 text-[14px] font-semibold transition-colors group ${
                  scrolled 
                    ? `${link.active ? "text-orange-400" : "text-slate-600 hover:text-slate-900"}` 
                    : `${link.active ? "text-orange-400" : "text-slate-300 hover:text-white"}`
                }`}
              >
                {link.label}
                <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] bg-orange-400 rounded-t-full transition-all duration-300 ${link.active ? "w-1/2" : "w-0 group-hover:w-6"}`}></span>
              </button>
            ))}

            {/* Desktop Departments Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDeptOpen(!deptOpen)}
                className={`flex items-center gap-1.5 px-5 py-4 text-[14px] font-semibold transition-colors group ${
                  isDeptPage 
                    ? (scrolled ? "text-orange-400" : "text-orange-200") 
                    : (scrolled ? "text-slate-600 hover:text-slate-900" : "text-slate-300 hover:text-white")
                }`}
              >
                Departments 
                <ChevronDown size={16} className={`transition-transform duration-200 ${deptOpen ? "rotate-180" : ""}`} />
                <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] bg-orange-400 rounded-t-full transition-all duration-300 ${isDeptPage ? "w-1/2" : "w-0 group-hover:w-6"}`}></span>
              </button>

              {/* Mega Menu Style Dropdown */}
              {deptOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full bg-white text-slate-900 shadow-2xl rounded-2xl mt-1 w-[600px] animate-[fadeIn_0.2s_ease] z-50 border border-slate-100 overflow-hidden grid grid-cols-2">
                  <div className="bg-slate-50 p-6 col-span-1 hidden md:block">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Explore Our</h3>
                    <h2 className="text-[24px] font-extrabold text-slate-900 leading-tight mb-4" style={{letterSpacing: "-0.02em"}}>Academic Departments</h2>
                    <p className="text-[13px] text-slate-500 leading-relaxed">Dive into cutting-edge curriculum across nine distinct engineering and science disciplines.</p>
                  </div>
                  <ul className="py-3 col-span-1 max-h-[380px] overflow-y-auto custom-scroll">
                    {departments.map((dept) => (
                      <li key={dept.id}>
                        <button
                          onClick={() => onNavigate(dept.id)}
                          className="w-full text-left px-4 py-2.5 text-[13px] text-slate-700 hover:bg-emerald-50 hover:text-orange-400 transition-colors flex items-center group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-3 group-hover:bg-orange-400 transition-colors"></span>
                          {dept.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`lg:hidden p-2 rounded-md transition-colors ${scrolled ? "text-slate-900 hover:bg-slate-100" : "text-white hover:bg-white/10"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out bg-white text-slate-900 border-t border-slate-100 ${
            mobileOpen ? "max-h-[900px] shadow-lg" : "max-h-0"
          }`}
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.path)}
                className={`w-full text-left p-3 rounded-xl text-sm font-semibold transition-colors ${
                  link.active ? "bg-emerald-50 text-orange-400" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Mobile Departments Accordion */}
            <div>
              <button
                onClick={() => setMobileDeptOpen(!mobileDeptOpen)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors ${
                  isDeptPage ? "bg-emerald-50 text-orange-400" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Departments
                <ChevronDown size={16} className={`transition-transform duration-200 ${mobileDeptOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileDeptOpen && (
                <div className="pl-4 pb-1 space-y-1 mt-1 border-l-2 border-slate-100 ml-3">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => onNavigate(dept.id)}
                      className="block w-full text-left px-4 py-2.5 text-[13px] text-slate-500 hover:text-orange-400 hover:bg-emerald-50 rounded-lg transition-colors font-medium"
                    >
                      {dept.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Action Buttons */}
            <div className="pt-4 border-t border-slate-100 mt-3 flex gap-3">
              <button 
                onClick={() => isAdminLoggedIn ? navigate(controlPanelPath) : onNavigate("login")} 
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-500 transition-colors rounded-full"
              >
                {isAdminLoggedIn ? <Menu size={16} strokeWidth={2.5} /> : <LogIn size={16} strokeWidth={2.5} />}
                {isAdminLoggedIn ? "Control Panel" : "Login"}
              </button>
              <button 
                onClick={() => onNavigate("gpbuddy")} 
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 transition-colors rounded-full"
              >
                <Bot size={16} /> GPM Buddy
              </button>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Custom Scrollbar for Desktop Dropdown */
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </header>
  );
}

export default Navbar;
