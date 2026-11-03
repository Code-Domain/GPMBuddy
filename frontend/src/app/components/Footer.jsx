import image_poly from "@/imports/poly.jpg";
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Bot, ChevronDown, ArrowUp } from "lucide-react";
import api from "../../services/api";
import { departmentRouteId, unwrapApiData } from "../../services/publicContent";


// Reusing the exact same departments array for consistency
const fallbackDepartments = [
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

export function Footer() {
  const [departments, setDepartments] = useState(fallbackDepartments);

  useEffect(() => {
    let active = true;
    api.get("/department").then((response) => {
      const rows = unwrapApiData(response);
      if (active && Array.isArray(rows) && rows.length) {
        setDepartments(rows.map((department) => ({
          label: department.name,
          id: departmentRouteId(department),
        })));
      }
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  // Dummy navigate function for demonstration
  const onNavigate = (path) => {
    if (path === "home") window.location.href = "/";
    else if (path.startsWith("dept-")) window.location.href = `/dept/${path}`;
    else window.location.href = `/${path}`;
  };

  const quickLinks = [
    { label: "Home", path: "home" },
    { label: "Academics", path: "academics" },
    { label: "Placements", path: "placements" },
    { label: "Notices", path: "notices" },
  ];

  return (
    <footer
      className="w-full bg-slate-900 text-slate-300 font-sans"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* ===================== MAIN FOOTER SECTION (Dark Slate) ===================== */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Column 1: Brand & Description */}
          <div className="space-y-5">
            <button onClick={() => onNavigate("home")} className="flex items-center gap-3 group">
              {/* Added a placeholder div for logo since we don't have your image_poly import here */}
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl blur-[8px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img src={image_poly} alt="GPM Logo" className="relative w-11 h-11 sm:w-12 sm:h-12 object-contain rounded-2xl" />
              </div>
              <div className="text-left">
                <h1 className="text-[16px] font-extrabold leading-tight text-white" style={{ letterSpacing: "-0.02em" }}>
                  Government Polytechnic
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[13px] text-emerald-400 font-bold tracking-wide">Muzaffarpur</span>
                  <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                  <span className="text-[11px] text-slate-400 font-medium">Est. 1949</span>
                </div>
              </div>
            </button>

            <p className="text-[13px] leading-relaxed text-slate-400">
              Empowering students with cutting-edge technical education since 1949. Fostering innovation, discipline, and excellence in engineering and sciences.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => onNavigate(link.path)}
                    className="text-[14px] text-slate-400 hover:text-emerald-400 transition-colors flex items-center group"
                  >
                    <span className="w-0 h-1 rounded-full bg-emerald-500 mr-0 group-hover:mr-2 group-hover:w-1.5 transition-all duration-300"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Departments */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-5">Departments</h3>
            <ul className="space-y-3 max-h-[300px] overflow-y-auto custom-scroll pr-2">
              {departments.map((dept) => (
                <li key={dept.id}>
                  <button
                    onClick={() => onNavigate(dept.id)}
                    className="text-[14px] text-slate-400 hover:text-emerald-400 transition-colors flex items-center group"
                  >
                    <span className="w-0 h-1 rounded-full bg-emerald-500 mr-0 group-hover:mr-2 group-hover:w-1.5 transition-all duration-300"></span>
                    {dept.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & CTA */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-5">Get in Touch</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3 text-[14px] text-slate-400">
                <MapPin size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Government Polytechnic, Muzaffarpur, Bihar 842001</span>
              </li>
              <li className="flex items-center gap-3 text-[14px] text-slate-400">
                <Phone size={16} className="text-emerald-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-[14px] text-slate-400">
                <Mail size={16} className="text-emerald-500 flex-shrink-0" />
                <span>info@gpmuzaffarpur.ac.in</span>
              </li>
            </ul>

            {/* GPM Buddy CTA */}
            <button
              onClick={() => onNavigate("gpbuddy")}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white px-5 py-3 rounded-full text-[13px] font-semibold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              <Bot size={16} /> Ask GPM Buddy
            </button>
          </div>
        </div>
      </div>

      {/* Reusing the exact same styles as navbar */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; } /* Adjusted for dark bg */
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </footer>
  );
}

export default Footer;
