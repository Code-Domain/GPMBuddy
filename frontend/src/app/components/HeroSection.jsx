import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image_campus from "../../imports/clg.jpg";
import { Bot, MapPin, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import api from "../../services/api";
import { departmentRouteId, getFacultyImageUrl, unwrapApiData } from "../../services/publicContent";


/* ---------- Tiny inline SVG icons ---------- */
const Icon = {
  Phone: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>),
  Mail: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>),
  Login: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>),
  Bot: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="8" width="18" height="12" rx="2" /><circle cx="8" cy="14" r="1.5" fill="currentColor" stroke="none" /><circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none" /><path d="M12 8V4M12 4h-1M12 4h1" /></svg>),
  ArrowRight: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>),
  ArrowLeft: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>),
  Calendar: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></svg>),
  BookOpen: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>),
  Award: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>),
  Users: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>),
  Briefcase: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>),
  Building: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M19 21V9a2 2 0 0 0-2-2M9 7h2M9 11h2M9 15h2" /></svg>),
  GradCap: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" /></svg>),
  Megaphone: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>),
  Bell: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>),
  MapPin: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>),
  Sparkles: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/></svg>),
};

/* ---------- Reusable: notice status pill ---------- */
function StatusPill({ type }) {
  const map = {
    NEW: "bg-red-100 text-red-600",
    IMP: "bg-amber-100 text-amber-700",
    OLD: "bg-slate-100 text-slate-500",
  };
  return <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full tracking-wider ${map[type] || map.OLD}`}>{type}</span>;
}

function ReadMoreText({ text, className = "", limit = 220, alignActionRight = false }) {
  const [expanded, setExpanded] = useState(false);
  const content = typeof text === "string" ? text : "";
  if (!content) return null;

  const needsToggle = content.length > limit;
  return (
    <div className={className}>
      <p style={needsToggle && !expanded ? { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3, overflow: "hidden" } : undefined}>
        {content}
      </p>
      {needsToggle && <button type="button" onClick={(event) => { event.stopPropagation(); setExpanded((value) => !value); }} className={`mt-1 text-[13px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline ${alignActionRight ? "ml-auto block text-right" : ""}`}>
        {expanded ? "Read less" : "Read more"}
      </button>}
    </div>
  );
}

/* ---------- Main Component ---------- */
export default function HeroSection() {
  const navigate = useNavigate();
  const [databaseDepartments, setDatabaseDepartments] = useState([]);
  const [databaseFaculty, setDatabaseFaculty] = useState([]);
  const [databaseEvents, setDatabaseEvents] = useState([]);
  const [databaseFacilities, setDatabaseFacilities] = useState([]);
  const [databaseAbout, setDatabaseAbout] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      api.get("/department"),
      api.get("/faculty"),
      api.get("/events"),
      api.get("/facility"),
      api.get("/about"),
    ]).then(([departmentsResult, facultyResult, eventsResult, facilitiesResult, aboutResult]) => {
      if (!active) return;
      const departments = departmentsResult.status === "fulfilled" ? unwrapApiData(departmentsResult.value) : null;
      const faculty = facultyResult.status === "fulfilled" ? unwrapApiData(facultyResult.value) : null;
      const events = eventsResult.status === "fulfilled" ? unwrapApiData(eventsResult.value) : null;
      const facilities = facilitiesResult.status === "fulfilled" ? unwrapApiData(facilitiesResult.value) : null;
      const about = aboutResult.status === "fulfilled" ? unwrapApiData(aboutResult.value) : null;
      if (Array.isArray(departments)) setDatabaseDepartments(departments);
      if (Array.isArray(faculty)) setDatabaseFaculty(faculty);
      if (Array.isArray(events)) setDatabaseEvents(events);
      if (Array.isArray(facilities)) setDatabaseFacilities(facilities);
      if (about && typeof about === "object") setDatabaseAbout(about);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [databaseDepartments, databaseEvents, databaseFacilities, databaseAbout]);


  const notices = [
    { tag: "NEW", title: "Admission notification for Diploma 1st Year 2025-26 — apply before 30th June", date: "12 Jun 2025" },
    { tag: "NEW", title: "Internal assessment exam schedule for even semester released", date: "10 Jun 2025" },
    { tag: "IMP", title: "SBTE Bihar revised academic calendar for AY 2025-26 published", date: "08 Jun 2025" },
    { tag: "IMP", title: "Industrial visit to BHEL Patna for Mechanical 4th semester students", date: "05 Jun 2025" },
    { tag: "OLD", title: "World Environment Day pledge — plantation drive on 5th June at campus", date: "03 Jun 2025" },
    { tag: "OLD", title: "Sports meet winners list — annual athletics 2024-25 declared", date: "28 May 2025" },
    { tag: "OLD", title: "Scholarship disbursement under Mukhyamantri Balika Protsahan Yojana", date: "22 May 2025" },
    { tag: "OLD", title: "Vacancy for guest faculty in Leather Technology department", date: "18 May 2025" },
  ];

  const deptCards = [
    { name: "Civil Engineering", path: "dept-civil", img: "https://picsum.photos/seed/gpm-dept-civil/600/400", desc: "Surveying, structural engineering, construction technology, water resources and transportation labs." },
    { name: "Computer Science & Engg", path: "dept-cse", img: "https://picsum.photos/seed/gpm-dept-cse/600/400", desc: "Programming, data structures, DBMS, computer networks, full-stack development with modern labs." },
    { name: "Electrical Engineering", path: "dept-electrical", img: "https://picsum.photos/seed/gpm-dept-elec/600/400", desc: "Power systems, electrical machines, control systems, switchgear & protection, embedded systems." },
    { name: "Electronics Engineering", path: "dept-electronics", img: "https://picsum.photos/seed/gpm-dept-ece/600/400", desc: "Analog & digital circuits, microcontrollers, VLSI, communication systems and IoT specialisation." },
    { name: "Mechanical Engineering", path: "dept-mechanical", img: "https://picsum.photos/seed/gpm-dept-mech/600/400", desc: "Thermal engineering, machine design, manufacturing, CAD/CAM, hydraulics and robotics workshops." },
    { name: "Leather Technology", path: "dept-leather", img: "https://picsum.photos/seed/gpm-dept-leather/600/400", desc: "A flagship department — leather processing, footwear design, quality control and tannery management." },
  ];

  const displayDepartments = databaseDepartments.length
    ? databaseDepartments.map((department) => {
      const path = departmentRouteId(department);
      const original = deptCards.find((item) => item.path === path);
      return {
        name: department.name,
        path,
        img: original?.img || image_campus,
        desc: department.description || original?.desc || "",
      };
    })
    : deptCards;

  const displayEvents = databaseEvents.length
    ? databaseEvents.map((event) => ({
      ...event,
      title: event.title,
      date: event.date ? new Date(event.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "",
      tag: event.date && new Date(event.date) >= new Date(new Date().setHours(0, 0, 0, 0)) ? "NEW" : "IMP",
      meta: [event.time, event.venue].filter(Boolean).join(" · "),
    }))
    : [];
  const homeNotices = [...displayEvents, ...notices];
  const aboutMissions = Array.isArray(databaseAbout?.mission)
    ? databaseAbout.mission.filter(Boolean)
    : [];
  const aboutParagraphs = databaseAbout
    ? [databaseAbout.history, databaseAbout.vision, ...aboutMissions].filter(Boolean)
    : [
      "Government Polytechnic, Muzaffarpur is one of the oldest polytechnics in the eastern region. Affiliated to the State Board of Technical Education, Bihar and approved by AICTE, the institute runs diploma programs across nine disciplines with a strong focus on practical training and industry readiness.",
      "The 28-acre campus houses workshops, modern laboratories, hostels, a central library with over 35,000 volumes, sports facilities and a T&P cell that consistently places over 85% of eligible students.",
    ];

  return (
    <div className="bg-slate-50 text-[#0b1f5e] font-jakarta" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      
      {/* ===================== STATIC HERO SECTION ===================== */}
      <section className="relative min-h-8/12 flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={image_campus}
            alt="Government Polytechnic Muzaffarpur campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0f2e5a]/75 to-[#0f2e5a]/40" />
        </div>

        {/* Floating Shapes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-32 right-20 w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 rotate-12 hidden lg:block"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute bottom-40 right-40 w-20 h-20 rounded-2xl bg-[#38b2f0]/20 backdrop-blur-sm border border-[#38b2f0]/30 -rotate-6 hidden lg:block"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="absolute top-1/2 right-16 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hidden lg:block"
        />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-5xl">
            {/* Badge */}
            <motion.div
              initial={{opacity:0,y:20}}
              animate={{opacity:1,y:0}}
              transition={{duration:0.6}}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white mb-6"
            >
              <MapPin size={14} className="text-[#38b2f0]" />
              Muzaffarpur, Bihar · Est. 1924
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{opacity:0,y:30}}
              animate={{opacity:1,y:0}}
              transition={{duration:0.8}}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              style={{
                fontFamily:"Poppins, sans-serif"
              }}
            >
              Government
              &nbsp;
              <span className="text-[#38b2f0]">
                Polytechnic
              </span>
              <br />
              Muzaffarpur
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{opacity:0,y:20}}
              animate={{opacity:1,y:0}}
              transition={{duration:0.8,delay:0.2}}
              className="text-lg lg:text-2xl text-white/80 max-w-2xl mb-8"
            >
              Empowering Future Engineers Since 1924 through quality technical
              education, innovation, and industry-ready skills.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{opacity:0,y:20}}
              animate={{opacity:1,y:0}}
              transition={{duration:0.8,delay:0.4}}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() =>
                  window.open(
                    "https://www.gpmuz.ac.in/department/",
                    "_blank"
                  )
                }
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#0f2e5a] font-semibold shadow-lg hover:bg-blue-50"
              >
                Explore Campus
                <ArrowRight size={16}/>
              </button>
              <button
                // onClick={handleNavigate}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#38b2f0] to-[#1a6bc5] text-white font-semibold shadow-lg hover:scale-105 transition"
              >
                <Bot size={16}/>
                Talk to GP Buddy
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{opacity:0,y:20}}
              animate={{opacity:1,y:0}}
              transition={{duration:0.8,delay:0.7}}
              className="mt-12 flex flex-wrap gap-8"
            >
              {
                [
                  {
                    value:"100+",
                    label:"Years of Excellence"
                  },
                  {
                    value: databaseDepartments.length ? String(databaseDepartments.length) : "6",
                    label:"Departments"
                  },
                  {
                    value:"5000+",
                    label:"Alumni Network"
                  },
                  {
                    value:"AICTE",
                    label:"Approved"
                  }
                ].map((item)=>(
                  <div key={item.label}>
                    <div
                      className="text-2xl font-bold text-white"
                    >
                      {item.value}
                    </div>
                    <div className="text-white/60 text-xs">
                      {item.label}
                    </div>
                  </div>
                ))
              }
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== NOTICE MARQUEE ===================== */}
      <section className="reveal mb-12 mt-5">
        <div className="bg-white border-y border-slate-100 overflow-hidden">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 flex items-center">
            <div className="flex-shrink-0 bg-[#0b1f5e] text-white px-5 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 -mr-4 z-10 relative shadow-lg">
              <span className="w-2 h-2 rounded-full bg-red-500 gpm-pulse"></span>
              Latest
            </div>
            <div className="flex-1 overflow-hidden py-3 pl-8">
              <div className="gpm-marquee whitespace-nowrap flex gap-12 text-[14px] text-slate-600 hover:[animation-play-state:paused]">
                {[...homeNotices, ...homeNotices].map((n, i) => (
                  <span key={i} className="inline-flex items-center gap-2">
                    <span className="text-[#FF9933]">●</span>
                    <span className="font-medium">{n.title}</span>
                    <span className="text-slate-300">|</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== MAIN CONTENT ===================== */}
      <main id="main" className="max-w-[1320px] mx-auto px-4 sm:px-6 pb-16">
        <div className="grid lg:grid-cols-[1fr_400px] gap-10">
          
          {/* Welcome / About */}
          <div className="reveal">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider mb-4">
              <Icon.Sparkles className="w-3.5 h-3.5" /> Welcome to GPM
            </div>
            <h2 className="text-[32px] sm:text-[40px] font-extrabold text-[#0b1f5e] mb-4" style={{ letterSpacing: "-0.02em" }}>
              Building Bihar's technical backbone since 1949.
            </h2>
            {aboutParagraphs.map((paragraph, index) => (
              <ReadMoreText key={index} text={paragraph} limit={260} className={`text-slate-600 text-[16px] leading-relaxed ${index === aboutParagraphs.length - 1 ? "mb-8" : "mb-4"}`} />
            ))}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
              {[
                { icon: Icon.Building, v: "28 acres", l: "Campus area", bg: "bg-blue-50", text: "text-blue-600" },
                { icon: Icon.Users, v: databaseFaculty.length ? String(databaseFaculty.length) : "120+", l: "Faculty & staff", bg: "bg-purple-50", text: "text-purple-600" },
                { icon: Icon.BookOpen, v: "35,000+", l: "Library volumes", bg: "bg-emerald-50", text: "text-emerald-600" },
                { icon: Icon.Briefcase, v: "85%+", l: "Avg placement", bg: "bg-amber-50", text: "text-amber-600" },
                { icon: Icon.Award, v: "AICTE", l: "Approved", bg: "bg-rose-50", text: "text-rose-600" },
                { icon: Icon.GradCap, v: databaseDepartments.length ? String(databaseDepartments.length) : "9", l: "Diploma branches", bg: "bg-indigo-50", text: "text-indigo-600" },
              ].map((s) => (
                <div key={s.l} className="bg-white p-5 flex items-center gap-4 rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100">
                  <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.text} flex items-center justify-center`}>
                     <s.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[18px] font-extrabold text-[#0b1f5e] leading-tight">{s.v}</div>
                    <div className="text-[12px] text-slate-500 font-medium leading-tight">{s.l}</div>
                  </div>
                </div>
              ))}
            </div>

            {databaseAbout?.achievements?.length > 0 && <div className="mb-10 rounded-2xl border border-amber-100 bg-amber-50/70 p-5">
              <h3 className="mb-3 text-[14px] font-extrabold uppercase tracking-wide text-[#0b1f5e]">College achievements</h3>
              <ul className="space-y-3">
                {databaseAbout.achievements.map((achievement, index) => <li key={achievement._id || index}>
                  <div className="font-bold text-[#0b1f5e]">{achievement.title}{achievement.year ? ` · ${achievement.year}` : ""}</div>
                  {achievement.description && <ReadMoreText text={achievement.description} limit={180} className="mt-1 text-[13px] leading-relaxed text-slate-600" />}
                </li>)}
              </ul>
            </div>}

            {/* Principal's Message Card */}
            <div className="bg-gradient-to-br from-[#0b1f5e] to-[#1e3a8a] rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9933]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="relative flex items-start gap-6">
                <div className="w-20 h-24 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden flex-shrink-0 border border-white/20 grid place-items-center">
                  {databaseAbout?.principal && getFacultyImageUrl(databaseAbout.principal, api.defaults.baseURL)
                    ? <img src={getFacultyImageUrl(databaseAbout.principal, api.defaults.baseURL)} alt={databaseAbout.principal.name || "Principal"} className="w-full h-full object-cover" />
                    : <img src="https://picsum.photos/seed/gpm-principal-portrait/120/160" alt="Principal" className="w-full h-full object-cover" />}
                </div>
                <div>
                  <div className="text-[12px] font-bold uppercase tracking-wider text-[#FF9933] mb-3">Principal's Message</div>
                  <p className="text-[15px] text-white/90 leading-relaxed italic mb-4">
                    databaseAbout?.principalMessage || "Technical education must serve the cause of equitable development. At GPM Muzaffarpur, we strive to produce diploma engineers who are not just employable, but who carry forward the tradition of integrity, craftsmanship and nation-building."
                  </p>
                  <div className="text-[14px] font-bold text-white">— {databaseAbout?.principal?.name || "Dr. R. K. Thakur"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Notices & Circulars */}
          <aside className="reveal">
            <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden sticky top-4">
              <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-slate-100">
                <h3 className="text-[18px] font-extrabold text-[#0b1f5e] flex items-center gap-2">
                  <span className="bg-amber-50 p-2 rounded-xl text-amber-500"><Icon.Bell className="w-5 h-5" /></span> Notices &amp; Circulars
                </h3>
                <span className="text-[11px] bg-red-50 text-red-500 px-3 py-1 rounded-full font-bold">{homeNotices.filter(n => n.tag === "NEW").length} New</span>
              </div>
              <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto custom-scroll">
                {homeNotices.map((n, i) => (
                  <a key={i} href="#" className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all duration-200 cursor-pointer">
                    <StatusPill type={n.tag} />
                    <div className="flex-1">
                      <div className="text-[14px] text-[#0b1f5e] font-semibold leading-snug group-hover:text-indigo-600 transition-colors">{n.title}</div>
                      {n.description && <ReadMoreText text={n.description} limit={150} className="mt-1 text-[12px] leading-relaxed text-slate-500" />}
                      <div className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5 font-medium">
                        <Icon.Calendar className="w-3.5 h-3.5" /> {n.date}
                      </div>
                      {n.meta && <div className="mt-1 text-[11px] font-medium text-slate-500">{n.meta}</div>}
                    </div>
                  </a>
                ))}
              </div>
              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
                <a href="#" className="text-[14px] font-bold text-[#0b1f5e] hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 bg-white rounded-full py-2 border border-slate-200 hover:border-indigo-200">
                  View All Notices <Icon.ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ===================== ACADEMIC DEPARTMENTS ===================== */}
      <section className="py-16 bg-white reveal">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider mb-4">
              <Icon.GradCap className="w-3.5 h-3.5" /> Academic Departments
            </div>
            <h2 className="text-[32px] sm:text-[40px] font-extrabold text-[#0b1f5e]" style={{ letterSpacing: "-0.02em" }}>
              {databaseDepartments.length ? `${databaseDepartments.length} disciplines. One mission.` : "Nine disciplines. One mission."}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayDepartments.map((d) => (
              <article key={d.name} className="group bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer" onClick={() => navigate(`/dept/${d.path}`)}>
                <div className="relative h-52 overflow-hidden rounded-t-3xl">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border border-white/30">Department</div>
                </div>
                <div className="p-6">
                  <h3 className="text-[20px] font-extrabold text-[#0b1f5e] mb-2 group-hover:text-indigo-600 transition-colors">{d.name}</h3>
                  {d.desc && <ReadMoreText text={d.desc} limit={190} alignActionRight className="text-[14px] text-slate-500 leading-relaxed mb-4" />}
                  <span className="inline-flex items-center gap-2 text-[14px] font-bold text-indigo-600 group-hover:gap-3 transition-all">
                    Know More <Icon.ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {databaseFacilities.length > 0 && <section className="reveal bg-[#f8fafc] py-16">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[12px] font-bold uppercase tracking-wider text-emerald-700"><Icon.Building className="h-3.5 w-3.5" /> Campus Facilities</div>
            <h2 className="text-[32px] font-extrabold text-[#0b1f5e] sm:text-[40px]" style={{ letterSpacing: "-0.02em" }}>Explore our campus resources.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {databaseFacilities.map((facility) => {
              const location = facility.location ? [facility.location.type, facility.location.place, facility.location.floor, facility.location.room].filter(Boolean).join(" · ") : "";
              return <article key={facility._id || facility.name} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                {facility.images?.[0] && <img src={facility.images[0]} alt={facility.name} loading="lazy" className="h-48 w-full object-cover" />}
                <div className="p-5">
                  {facility.category && <span className="mb-2 inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">{facility.category}</span>}
                  <h3 className="text-[18px] font-extrabold text-[#0b1f5e]">{facility.name}</h3>
                  {facility.description && <ReadMoreText text={facility.description} limit={200} className="mt-2 text-[13px] leading-6 text-slate-600" />}
                  {location && <p className="mt-3 text-[12px] font-medium text-slate-500">{location}</p>}
                  {facility.availability && <p className="mt-1 text-[11px] text-slate-500">{[facility.availability.status, facility.availability.days?.join(", "), facility.availability.openingTime && facility.availability.closingTime ? `${facility.availability.openingTime}–${facility.availability.closingTime}` : facility.availability.openingTime || facility.availability.closingTime].filter(Boolean).join(" · ")}</p>}
                  {facility.features?.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-5 text-[12px] text-slate-600">{facility.features.map((feature, index) => <li key={index}>{feature}</li>)}</ul>}
                  {facility.inCharge?.name && <p className="mt-3 text-[12px] text-slate-600">In charge: {facility.inCharge.name}{facility.inCharge.designation ? ` · ${facility.inCharge.designation}` : ""}</p>}
                  {(facility.contact?.phone || facility.contact?.email || facility.contact?.additionalInfo) && <p className="mt-2 text-[12px] text-slate-500">{[facility.contact.phone, facility.contact.email, facility.contact.additionalInfo].filter(Boolean).join(" · ")}</p>}
                </div>
              </article>;
            })}
          </div>
        </div>
      </section>}

      {/* ============ STYLES (keyframes + reveal) ============ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.in { opacity: 1; transform: translateY(0); }

        @keyframes gpm-kenburns {
          0% { transform: scale(1.0) translate(0, 0); }
          100% { transform: scale(1.1) translate(-1%, -1%); }
        }
        .gpm-kenburns { animation: gpm-kenburns 15s ease-out forwards; }

        @keyframes gpm-fadeup {
          0% { opacity: 0; transform: translateY(28px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .gpm-fadeup { animation: gpm-fadeup 0.9s cubic-bezier(.2,.7,.2,1) both; }

        @keyframes gpm-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .gpm-marquee { animation: gpm-marquee 50s linear infinite; will-change: transform; }
        .gpm-marquee:hover { animation-play-state: paused; }

        @keyframes gpm-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        .gpm-pulse { animation: gpm-pulse 1.2s ease-in-out infinite; }

        html { scroll-behavior: smooth; }
        
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}

// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import collegeimage from "../../imports/clg.jpg";

// const Icon = {
//   ArrowRight: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>),
//   ArrowUpRight: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>),
//   Sparkles: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/></svg>),
//   Building: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M19 21V9a2 2 0 0 0-2-2M9 7h2M9 11h2M9 15h2" /></svg>),
//   Users: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>),
//   BookOpen: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>),
//   Briefcase: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>),
//   Award: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>),
//   GradCap: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" /></svg>),
//   Bell: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>),
//   MapPin: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>),
//   Plus: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
//   Quote: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M7.17 6A5.001 5.001 0 0 0 2 11v7h7v-7H5a3 3 0 0 1 3-3V6zm10 0a5.001 5.001 0 0 0-5.17 5v7H19v-7h-4a3 3 0 0 1 3-3V6z"/></svg>)
// };

// export default function HeroSection() {
//   const navigate = useNavigate();
//   const heroRef = useRef(null);
  
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const els = document.querySelectorAll(".reveal");
//     const io = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((e) => {
//           if (e.isIntersecting) {
//             e.target.classList.add("in");
//             io.unobserve(e.target);
//           }
//         });
//       },
//       { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
//     );
//     els.forEach((el) => io.observe(el));
//     return () => io.disconnect();
//   }, []);

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (heroRef.current) {
//         const rect = heroRef.current.getBoundingClientRect();
//         setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
//       }
//     };
//     const heroEl = heroRef.current;
//     if (heroEl) {
//       heroEl.addEventListener("mousemove", handleMouseMove);
//     }
//     return () => {
//       if (heroEl) {
//         heroEl.removeEventListener("mousemove", handleMouseMove);
//       }
//     };
//   }, []);

//   const notices = [
//     { tag: "NEW", title: "Admission notification for Diploma 1st Year 2025-26", date: "12 Jun 2025" },
//     { tag: "IMP", title: "SBTE Bihar revised academic calendar for AY 2025-26", date: "08 Jun 2025" },
//     { tag: "IMP", title: "Industrial visit to BHEL Patna for Mechanical 4th sem", date: "05 Jun 2025" },
//     { tag: "OLD", title: "World Environment Day pledge — plantation drive", date: "03 Jun 2025" },
//     { tag: "OLD", title: "Sports meet winners list — annual athletics declared", date: "28 May 2025" },
//   ];

//   const deptCards = [
//     { name: "Computer Science", path: "dept-cse", img: "https://picsum.photos/seed/gpm-dept-cse/600/400", desc: "Full-stack dev, DBMS, networks." },
//     { name: "Mechanical Engg", path: "dept-mechanical", img: "https://picsum.photos/seed/gpm-dept-mech/600/400", desc: "Thermal, CAD/CAM, robotics." },
//     { name: "Civil Engineering", path: "dept-civil", img: "https://picsum.photos/seed/gpm-dept-civil/600/400", desc: "Structures, surveying, hydro." },
//     { name: "Electrical Engg", path: "dept-electrical", img: "https://picsum.photos/seed/gpm-dept-elec/600/400", desc: "Power systems, machines." },
//     { name: "Electronics Engg", path: "dept-electronics", img: "https://picsum.photos/seed/gpm-dept-ece/600/400", desc: "VLSI, IoT, microcontrollers." },
//     { name: "Leather Technology", path: "dept-leather", img: "https://picsum.photos/seed/gpm-dept-leather/600/400", desc: "Flagship dept, footwear design." },
//   ];

//   const placementData = [
//     { year: "2024-25", placed: 286, percent: "91.7%", ctc: "₹8.4 LPA", top: "TCS" },
//     { year: "2023-24", placed: 263, percent: "88.3%", ctc: "₹7.8 LPA", top: "Infosys" },
//     { year: "2022-23", placed: 241, percent: "85.8%", ctc: "₹7.2 LPA", top: "L&T" },
//     { year: "2021-22", placed: 218, percent: "82.6%", ctc: "₹6.5 LPA", top: "Bajaj" },
//   ];

//   const recruiters = ["TCS", "Infosys", "L&T", "Bajaj", "Mahindra", "ITC", "Tata Motors", "Sail", "BSNL", "BEL", "Wipro", "Capgemini"];

//   return (
//     <div className="bg-slate-950 text-slate-300 font-jakarta overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      
//       {/* ===================== EDITORIAL HERO ===================== */}
//       <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden border-b border-white/5">
//         {/* Background Elements */}
//         <div className="absolute inset-0 gpm-kenburns opacity-40" style={{ backgroundImage: `url('${collegeimage}')`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
//         <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20" />
//         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950" />
        
//         {/* Interactive Grid & Glow */}
//         <div className="absolute inset-0 gpm-grid-pattern opacity-[0.03]"></div>
//         <div 
//           className="pointer-events-none absolute w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] transition-transform duration-500 ease-out"
//           style={{ left: mousePos.x - 250, top: mousePos.y - 250 }}
//         ></div>

//         {/* Content Layout - Left Heavy */}
//         <div className="relative max-w-[1320px] w-full mx-auto px-6 z-10 grid lg:grid-cols-12 gap-12 items-end">
//           <div className="lg:col-span-8 gpm-fadeup">
//             <div className="flex items-center gap-4 mb-8">
//               <span className="h-px w-12 bg-emerald-400"></span>
//               <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.3em]">Admissions Open 2025-26</span>
//             </div>
            
//             <h1 className="text-[clamp(3rem,8vw,7rem)] font-extrabold text-white leading-[0.9] mb-8" style={{ letterSpacing: "-0.04em" }}>
//               Engineering <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-600">the Future</span> <br />
//               of Bihar.
//             </h1>
            
//             <div className="max-w-xl border-l-2 border-emerald-400/50 pl-6 mb-10">
//               <p className="text-lg text-slate-400 leading-relaxed">
//                 Government Polytechnic, Muzaffarpur. 75 years of forging technical brilliance and craftsmanship. Applications invited for 9 diploma disciplines.
//               </p>
//             </div>

//             <div className="flex items-center gap-6">
//               <button onClick={() => navigate("/academics")} className="group bg-emerald-500 text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-emerald-400 transition-all flex items-center gap-3 shadow-lg shadow-emerald-500/20">
//                 Start Application
//                 <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
//                   <Icon.ArrowRight className="w-4 h-4" />
//                 </span>
//               </button>
//               <button onClick={() => navigate("/campus")} className="text-slate-300 text-sm font-semibold border-b border-transparent hover:border-emerald-400 hover:text-emerald-400 transition-all pb-1">
//                 Explore Campus
//               </button>
//             </div>
//           </div>

//           {/* Floating Glass Stats - Right Side */}
//           <div className="lg:col-span-4 space-y-4">
//             {[
//               { v: "1949", l: "Established", icon: Icon.Building },
//               { v: "85%+", l: "Placement Rate", icon: Icon.Briefcase },
//               { v: "28 Acres", l: "Campus Area", icon: Icon.MapPin }
//             ].map((s, i) => (
//               <div key={i} className="flex items-center justify-between bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all group" style={{ animationDelay: `${i * 0.1}s` }}>
//                 <div>
//                   <div className="text-3xl font-extrabold text-white mb-1" style={{letterSpacing: "-0.02em"}}>{s.v}</div>
//                   <div className="text-xs text-slate-400 uppercase tracking-wider">{s.l}</div>
//                 </div>
//                 <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
//                   <s.icon className="w-6 h-6" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Scroll Indicator */}
//         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
//           <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
//           <div className="w-px h-10 bg-gradient-to-b from-slate-500 to-transparent"></div>
//         </div>
//       </section>

//       {/* ===================== NOTICE TICKER ===================== */}
//       <div className="bg-slate-900 border-y border-white/5 py-4 overflow-hidden">
//         <div className="flex items-center gap-8 gpm-marquee whitespace-nowrap">
//           {[...notices, ...notices, ...notices].map((n, i) => (
//             <div key={i} className="flex items-center gap-8 text-sm">
//               <span className={`px-2 py-1 text-[10px] font-bold rounded ${n.tag === "NEW" ? "bg-rose-500/20 text-rose-400" : n.tag === "IMP" ? "bg-amber-500/20 text-amber-400" : "bg-slate-700 text-slate-400"}`}>{n.tag}</span>
//               <span className="text-slate-300 font-medium">{n.title}</span>
//               <span className="text-emerald-500">●</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ===================== ASYMMETRIC MAIN CONTENT ===================== */}
//       <section className="max-w-[1320px] mx-auto px-6 py-24 grid lg:grid-cols-12 gap-12">
        
//         {/* Left Sticky Sidebar */}
//         <aside className="lg:col-span-4 reveal">
//           <div className="lg:sticky lg:top-28">
//             <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider mb-6 border border-emerald-500/20">
//               <Icon.Sparkles className="w-3.5 h-3.5" /> Institution Overview
//             </div>
//             <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight" style={{ letterSpacing: "-0.02em" }}>
//               A legacy of <br/> technical excellence.
//             </h2>
//             <p className="text-slate-400 leading-relaxed mb-8">
//               Affiliated to the State Board of Technical Education, Bihar, and approved by AICTE, we run diploma programs across nine disciplines with a strong focus on practical training and industry readiness.
//             </p>
            
//             <div className="space-y-4 mb-8 border-t border-white/10 pt-8">
//               {[
//                 { icon: Icon.Users, v: "120+", l: "Faculty & Staff" },
//                 { icon: Icon.BookOpen, v: "35,000+", l: "Library Volumes" },
//                 { icon: Icon.Award, v: "AICTE", l: "Approved Institution" }
//               ].map((s, i) => (
//                 <div key={i} className="flex items-center gap-4 text-slate-300 group cursor-default">
//                   <div className="w-10 h-10 rounded-lg bg-slate-800/50 border border-white/5 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
//                     <s.icon className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <span className="font-bold text-white mr-2">{s.v}</span>
//                     <span className="text-sm text-slate-500">{s.l}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button onClick={() => navigate("/about")} className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:gap-3 transition-all text-sm">
//               Read Full History <Icon.ArrowRight className="w-4 h-4" />
//             </button>
//           </div>
//         </aside>

//         {/* Right Content Area */}
//         <div className="lg:col-span-8 space-y-8">
//           {/* Principal's Card */}
//           <div className="reveal bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
//             <Icon.Quote className="w-12 h-12 text-emerald-500/20 mb-4" />
//             <p className="text-xl text-white leading-relaxed italic mb-6 relative">
//               "Technical education must serve the cause of equitable development. At GPM Muzaffarpur, we strive to produce diploma engineers who are not just employable, but who carry forward the tradition of integrity, craftsmanship and nation-building."
//             </p>
//             <div className="flex items-center gap-4 relative">
//               <img src="https://picsum.photos/seed/gpm-principal/100/100" alt="Principal" className="w-14 h-14 rounded-full ring-2 ring-emerald-500/20 object-cover" />
//               <div>
//                 <div className="font-bold text-white">Dr. R. K. Thakur</div>
//                 <div className="text-sm text-slate-500">Principal, GPM</div>
//               </div>
//             </div>
//           </div>

//           {/* Live Notices Grid */}
//           <div className="reveal grid sm:grid-cols-2 gap-4">
//             {notices.slice(0, 4).map((n, i) => (
//               <a key={i} href="#" className="group bg-slate-900 border border-white/5 p-6 rounded-2xl hover:border-emerald-500/30 transition-all flex flex-col justify-between min-h-[160px]">
//                 <div className="flex justify-between items-start mb-4">
//                   <span className={`px-2 py-1 text-[10px] font-bold rounded ${n.tag === "NEW" ? "bg-rose-500/20 text-rose-400" : n.tag === "IMP" ? "bg-amber-500/20 text-amber-400" : "bg-slate-700 text-slate-400"}`}>{n.tag}</span>
//                   <Icon.ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:rotate-12 transition-all" />
//                 </div>
//                 <div>
//                   <h4 className="text-white font-semibold leading-snug mb-2 group-hover:text-emerald-400 transition-colors">{n.title}</h4>
//                   <span className="text-xs text-slate-500 flex items-center gap-2"><Icon.Bell className="w-3 h-3"/> {n.date}</span>
//                 </div>
//               </a>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ===================== HORIZONTAL SCROLL DEPARTMENTS ===================== */}
//       <section className="py-24 border-t border-white/5 reveal">
//         <div className="max-w-[1320px] mx-auto px-6 flex items-end justify-between mb-12">
//           <div>
//             <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Academic Departments</span>
//             <h2 className="text-4xl sm:text-5xl font-extrabold text-white" style={{ letterSpacing: "-0.02em" }}>Nine disciplines. <br/>One mission.</h2>
//           </div>
//           <button onClick={() => navigate("/departments")} className="hidden sm:flex items-center gap-2 text-slate-400 hover:text-emerald-400 font-bold text-sm transition-colors">
//             View All <Icon.ArrowRight className="w-4 h-4" />
//           </button>
//         </div>

//         {/* Scroll Track */}
//         <div className="gpm-scroll-track flex gap-6 overflow-x-auto pb-6 px-6 scroll-smooth snap-x snap-mandatory">
//           {deptCards.map((d, i) => (
//             <article 
//               key={d.name} 
//               onClick={() => navigate(`/dept/${d.path}`)}
//               className={`group relative flex-shrink-0 snap-start overflow-hidden rounded-3xl cursor-pointer border border-white/5 ${i === 0 ? "w-[80vw] sm:w-[500px]" : "w-[60vw] sm:w-[380px]"}`}
//             >
//               <div className="relative h-[400px]">
//                 <img src={d.img} alt={d.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
//                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                
//                 <div className="absolute inset-0 p-8 flex flex-col justify-between">
//                   <div className="flex justify-between items-start">
//                     <span className="bg-white/10 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-white/20">
//                       Dept 0{i + 1}
//                     </span>
//                     <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-45">
//                       <Icon.Plus className="w-6 h-6" />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{d.name}</h3>
//                     <p className="text-slate-300 text-sm max-w-xs opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-300">{d.desc}</p>
//                   </div>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       </section>

//       {/* ===================== ZIGZAG PLACEMENTS TIMELINE ===================== */}
//       <section className="py-24 border-t border-white/5 reveal">
//         <div className="max-w-[1320px] mx-auto px-6">
//           <div className="text-center mb-20">
//             <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Placements Snapshot</span>
//             <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>Where our engineers go next.</h2>
//             <p className="text-slate-500 max-w-xl mx-auto">We take pride in our consistent placement record and strong industry connections.</p>
//           </div>

//           <div className="relative">
//             {/* Center Line */}
//             <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent md:-translate-x-1/2"></div>

//             <div className="space-y-12">
//               {placementData.map((p, i) => (
//                 <div key={p.year} className={`relative flex items-center gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
//                   {/* Content Card */}
//                   <div className="w-full md:w-1/2 pl-20 md:pl-0 md:pr-12">
//                     <div className={`bg-slate-900 border border-white/5 p-8 rounded-3xl transition-all duration-300 hover:border-emerald-500/30 ${i % 2 === 0 ? "md:text-right" : ""}`}>
//                       <span className="text-emerald-400 font-bold text-sm">{p.year}</span>
//                       <h3 className="text-4xl font-extrabold text-white my-2">{p.percent}</h3>
//                       <div className={`flex items-center gap-4 text-slate-400 text-sm ${i % 2 === 0 ? "md:justify-end" : ""}`}>
//                         <span>{p.placed} Students Placed</span>
//                         <span className="w-1 h-1 rounded-full bg-slate-600"></span>
//                         <span className="text-amber-400 font-semibold">{p.ctc}</span>
//                       </div>
//                       <p className="text-xs text-slate-500 mt-4">Top Recruiter: {p.top}</p>
//                     </div>
//                   </div>
                  
//                   {/* Center Dot */}
//                   <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 md:-translate-x-1/2 z-10"></div>

//                   {/* Spacer */}
//                   <div className="hidden md:block w-1/2"></div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Recruiters Marquee */}
//           <div className="mt-20 pt-12 border-t border-white/5">
//             <p className="text-center text-slate-500 text-xs uppercase tracking-[0.3em] mb-8">Top Recruiters on Campus</p>
//             <div className="flex flex-wrap justify-center gap-4">
//               {recruiters.map((r) => (
//                 <div key={r} className="bg-slate-900 border border-white/5 px-6 py-4 text-sm font-bold text-slate-500 rounded-xl hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors cursor-default">
//                   {r}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ============ STYLES ============ */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

//         .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s cubic-bezier(.2,.7,.2,1), transform 0.8s cubic-bezier(.2,.7,.2,1); }
//         .reveal.in { opacity: 1; transform: translateY(0); }

//         @keyframes gpm-kenburns {
//           0% { transform: scale(1.0) translate(0, 0); }
//           100% { transform: scale(1.1) translate(-1%, -1%); }
//         }
//         .gpm-kenburns { animation: gpm-kenburns 15s ease-out forwards; }

//         @keyframes gpm-fadeup {
//           0% { opacity: 0; transform: translateY(28px); }
//           100% { opacity: 1; transform: translateY(0); }
//         }
//         .gpm-fadeup { animation: gpm-fadeup 0.9s cubic-bezier(.2,.7,.2,1) both; }

//         @keyframes gpm-marquee {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-33.33%); }
//         }
//         .gpm-marquee { animation: gpm-marquee 40s linear infinite; will-change: transform; }
//         .gpm-marquee:hover { animation-play-state: paused; }

//         .gpm-grid-pattern {
//           background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
//           background-size: 60px 60px;
//         }

//         .gpm-scroll-track {
//           scrollbar-width: none;
//           -ms-overflow-style: none;
//         }
//         .gpm-scroll-track::-webkit-scrollbar {
//           display: none;
//         }
        
//         html { scroll-behavior: smooth; }
        
//         ::selection { background: #10b981; color: #fff; }
//       `}</style>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import collegeimage from "../../imports/clg.jpg";

// /* ---------- Tiny inline SVG icons ---------- */
// const Icon = {
//   Phone: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>),
//   Mail: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>),
//   Login: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>),
//   ArrowRight: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>),
//   Calendar: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></svg>),
//   BookOpen: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>),
//   Award: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>),
//   Users: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>),
//   Briefcase: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>),
//   Building: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M19 21V9a2 2 0 0 0-2-2M9 7h2M9 11h2M9 15h2" /></svg>),
//   GradCap: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" /></svg>),
//   Bell: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>),
//   Sparkles: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/></svg>),
// };

// /* ---------- Main Component ---------- */
// export default function HeroSection() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const els = document.querySelectorAll(".reveal");
//     const io = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((e) => {
//           if (e.isIntersecting) {
//             e.target.classList.add("in");
//             io.unobserve(e.target);
//           }
//         });
//       },
//       { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
//     );
//     els.forEach((el) => io.observe(el));
//     return () => io.disconnect();
//   }, []);

//   const notices = [
//     { tag: "NEW", title: "Admission notification for Diploma 1st Year 2025-26", date: "12 Jun 2025" },
//     { tag: "NEW", title: "Internal assessment exam schedule for even semester", date: "10 Jun 2025" },
//     { tag: "IMP", title: "SBTE Bihar revised academic calendar published", date: "08 Jun 2025" },
//     { tag: "IMP", title: "Industrial visit to BHEL Patna for Mech students", date: "05 Jun 2025" },
//     { tag: "OLD", title: "World Environment Day pledge — plantation drive", date: "03 Jun 2025" },
//     { tag: "OLD", title: "Sports meet winners list — annual athletics", date: "28 May 2025" },
//   ];

//   const deptCards = [
//     { name: "Civil Engineering", path: "dept-civil", img: "https://picsum.photos/seed/gpm-dept-civil/600/400" },
//     { name: "Computer Science", path: "dept-cse", img: "https://picsum.photos/seed/gpm-dept-cse/600/400" },
//     { name: "Electrical Engg", path: "dept-electrical", img: "https://picsum.photos/seed/gpm-dept-elec/600/400" },
//     { name: "Electronics Engg", path: "dept-electronics", img: "https://picsum.photos/seed/gpm-dept-ece/600/400" },
//     { name: "Mechanical Engg", path: "dept-mechanical", img: "https://picsum.photos/seed/gpm-dept-mech/600/400" },
//     { name: "Leather Technology", path: "dept-leather", img: "https://picsum.photos/seed/gpm-dept-leather/600/400" },
//   ];

//   const placementData = [
//     { year: "2024-25", percent: 91, ctc: "₹8.4 LPA" },
//     { year: "2023-24", percent: 88, ctc: "₹7.8 LPA" },
//     { year: "2022-23", percent: 85, ctc: "₹7.2 LPA" },
//     { year: "2021-22", percent: 82, ctc: "₹6.5 LPA" },
//   ];

//   const recruiters = ["TCS", "Infosys", "L&T", "Bajaj", "Mahindra", "ITC", "Tata Motors", "Sail", "BSNL", "BEL", "Wipro", "Capgemini"];

//   return (
//     <div className="bg-[#F4F4F0] text-[#0F2A29] font-display" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
      
//       {/* ===================== IMMERSIVE EDITORIAL HERO ===================== */}
//       <section className="relative min-h-[90vh] overflow-hidden border-b-4 border-[#0F2A29]">
//         {/* Background Image with Overlay */}
//         <div className="absolute inset-0">
//           <img src={collegeimage} alt="Campus" className="w-full h-full object-cover" />
//           <div className="absolute inset-0 bg-gradient-to-r from-[#0F2A29] via-[#0F2A29]/80 to-[#0F2A29]/20" />
//           <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A29] via-transparent to-transparent"></div>
//         </div>

//         {/* Floating Marquee Top Right */}
//         <div className="absolute top-8 right-0 bg-[#FF6B35] text-white py-2 pl-8 pr-16 flex items-center gap-4 rounded-l-full shadow-lg border-l-2 border-y-2 border-[#0F2A29]">
//           <Icon.Sparkles className="w-5 h-5 flex-shrink-0" />
//           <span className="text-[13px] font-bold uppercase tracking-widest whitespace-nowrap">Admissions Open 2025-26</span>
//         </div>

//         {/* Hero Content */}
//         <div className="relative max-w-[1320px] mx-auto px-6 sm:px-10 h-[90vh] flex flex-col justify-end pb-20">
          
//           {/* Large Typography */}
//           <div className="max-w-4xl mb-10 gpm-fadeup">
//             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#2EC4B6] mb-6">
//               <span className="w-2 h-2 rounded-full bg-[#FF6B35] gpm-pulse"></span>
//               Government Polytechnic Muzaffarpur
//             </div>
//             <h1 className="text-[44px] sm:text-[80px] lg:text-[100px] font-bold text-white leading-[0.9] tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
//               Shaping <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FFB627]">Engineers</span> of <br />
//               Bihar Since 1949
//             </h1>
//           </div>

//           {/* Bottom Bar: CTAs & Stats */}
//           <div className="grid lg:grid-cols-2 gap-8 items-end">
//             <div className="flex flex-wrap gap-4">
//               <button onClick={() => navigate("/academics")} className="group bg-[#FF6B35] text-white px-7 py-3.5 rounded-full text-[14px] font-bold hover:bg-[#0F2A29] border-2 border-[#0F2A29] transition-all hover:scale-105 flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(15,42,41,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
//                 Apply for Admission <Icon.ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//               </button>
//               <button onClick={() => navigate("/placements")} className="bg-white/10 backdrop-blur-md text-white px-7 py-3.5 rounded-full text-[14px] font-bold hover:bg-white hover:text-[#0F2A29] border-2 border-white/20 transition-all">
//                 View Placements 
//               </button>
//             </div>
//             <div className="hidden lg:flex justify-end gap-8 text-white">
//               <div className="border-l-2 border-[#FF6B35] pl-4">
//                 <div className="text-[32px] font-bold leading-none">9</div>
//                 <div className="text-[11px] uppercase tracking-wider text-white/60 mt-1">Diploma Branches</div>
//               </div>
//               <div className="border-l-2 border-[#FF6B35] pl-4">
//                 <div className="text-[32px] font-bold leading-none">28 acres</div>
//                 <div className="text-[11px] uppercase tracking-wider text-white/60 mt-1">Green Campus</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ===================== BENTO GRID ABOUT & NOTICES ===================== */}
//       <main id="main" className="max-w-[1320px] mx-auto px-6 sm:px-10 py-20">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 reveal">
          
//           {/* Card 1: Principal's Message (Wide) */}
//           <div className="lg:col-span-2 bg-white rounded-3xl p-8 border-2 border-[#0F2A29] shadow-[8px_8px_0px_0px_rgba(15,42,41,1)] hover:shadow-[12px_12px_0px_0px_rgba(15,42,41,1)] transition-all duration-300 flex flex-col">
//             <div className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B35] mb-4 flex items-center gap-2">
//               <Icon.Sparkles className="w-4 h-4" /> Principal's Message
//             </div>
//             <p className="text-[18px] text-[#0F2A29] leading-relaxed flex-grow italic mb-6">
//               "Technical education must serve the cause of equitable development. At GPM Muzaffarpur, we strive to produce diploma engineers who are not just employable, but who carry forward the tradition of integrity, craftsmanship and nation-building."
//             </p>
//             <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
//               <img src="https://picsum.photos/seed/gpm-principal-portrait/120/120" alt="Principal" className="w-14 h-14 object-cover rounded-full border-2 border-[#0F2A29]" />
//               <div>
//                 <div className="text-[16px] font-bold text-[#0F2A29]">Dr. R. K. Thakur</div>
//                 <div className="text-[12px] text-slate-500 font-medium">Principal, GPM</div>
//               </div>
//             </div>
//           </div>

//           {/* Card 2: Notices (Tall) */}
//           <div className="lg:col-span-1 lg:row-span-2 bg-[#0F2A29] rounded-3xl p-6 border-2 border-[#0F2A29] shadow-[8px_8px_0px_0px_rgba(255,107,53,1)] hover:shadow-[12px_12px_0px_0px_rgba(255,107,53,1)] transition-all flex flex-col">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-[18px] font-bold text-white">Notices</h3>
//               <span className="text-[10px] bg-[#FF6B35] text-white px-2 py-1 rounded-full font-bold">{notices.length} New</span>
//             </div>
//             <div className="space-y-4 flex-grow overflow-y-auto custom-scroll pr-2 max-h-[400px] lg:max-h-none">
//               {notices.map((n, i) => (
//                 <a key={i} href="#" className="block group">
//                   <div className="flex items-center gap-2 mb-1.5">
//                     <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${n.tag === 'NEW' ? 'bg-[#FF6B35] text-white' : 'bg-white/10 text-[#2EC4B6]'}`}>{n.tag}</span>
//                     <span className="text-[10px] text-white/40 flex items-center gap-1"><Icon.Calendar className="w-3 h-3" /> {n.date}</span>
//                   </div>
//                   <div className="text-[13px] text-white/80 font-medium leading-snug group-hover:text-[#FF6B35] transition-colors">{n.title}</div>
//                 </a>
//               ))}
//             </div>
//             <a href="#" className="mt-6 text-[12px] font-bold text-[#2EC4B6] hover:text-[#FF6B35] flex items-center gap-1 transition-colors">
//               View All Notices <Icon.ArrowRight className="w-3.5 h-3.5" />
//             </a>
//           </div>

//           {/* Card 3: Admissions CTA */}
//           <div className="lg:col-span-1 bg-[#FF6B35] rounded-3xl p-6 border-2 border-[#0F2A29] shadow-[8px_8px_0px_0px_rgba(15,42,41,1)] hover:shadow-[12px_12px_0px_0px_rgba(15,42,41,1)] transition-all flex flex-col justify-between min-h-[180px]">
//             <Icon.GradCap className="w-8 h-8 text-[#0F2A29] mb-4" />
//             <div>
//               <div className="text-[20px] font-bold text-[#0F2A29] leading-tight mb-2">Explore Academic Departments</div>
//               <button onClick={() => navigate("/academics")} className="text-[12px] font-bold text-[#0F2A29] flex items-center gap-1 hover:gap-2 transition-all">
//                 Get Started <Icon.ArrowRight className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {/* Card 4: Stats */}
//           <div className="lg:col-span-1 bg-[#2EC4B6] rounded-3xl p-6 border-2 border-[#0F2A29] shadow-[8px_8px_0px_0px_rgba(15,42,41,1)] hover:shadow-[12px_12px_0px_0px_rgba(15,42,41,1)] transition-all flex items-center justify-between">
//             <div>
//               <div className="text-[36px] font-bold text-[#0F2A29] leading-none">85%+</div>
//               <div className="text-[12px] text-[#0F2A29]/70 font-bold uppercase mt-1">Placement Rate</div>
//             </div>
//             <Icon.Briefcase className="w-10 h-10 text-[#0F2A29]" />
//           </div>
//         </div>
//       </main>

//       {/* ===================== DEPARTMENTS (HOVER GRID) ===================== */}
//       <section className="py-20 bg-[#0F2A29] reveal border-y-2 border-[#0F2A29]">
//         <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
//           <div className="flex flex-wrap justify-between items-end mb-12 gap-4">
//             <div>
//               <div className="text-[11px] font-bold uppercase tracking-wider text-[#2EC4B6] mb-3">Academic Departments</div>
//               <h2 className="text-[32px] sm:text-[48px] font-bold text-white leading-none" style={{ letterSpacing: "-0.02em" }}>
//                 Nine disciplines.<br />One mission.
//               </h2>
//             </div>
//             <p className="max-w-sm text-[14px] text-white/60 leading-relaxed">
//               Discover cutting-edge labs, experienced faculty, and industry-aligned curriculum across our diverse engineering departments.
//             </p>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             {deptCards.map((d, i) => (
//               <article 
//                 key={d.name} 
//                 className="group relative h-[260px] rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
//                 onClick={() => navigate(`/dept/${d.path}`)}
//               >
//                 <img src={d.img} alt={d.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
//                 <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A29] via-[#0F2A29]/40 to-transparent transition-opacity group-hover:opacity-80"></div>
                
//                 {/* Number Badge */}
//                 <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-[14px] font-bold text-white">
//                   0{i + 1}
//                 </div>

//                 {/* Content */}
//                 <div className="absolute bottom-0 left-0 right-0 p-5">
//                   <h3 className="text-[20px] font-bold text-white mb-1">{d.name}</h3>
//                   <div className="h-0 group-hover:h-8 overflow-hidden transition-all duration-300">
//                     <span className="inline-flex items-center gap-2 text-[12px] font-bold text-[#FF6B35] mt-2">
//                       Know More <Icon.ArrowRight className="w-4 h-4" />
//                     </span>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ===================== PLACEMENTS DASHBOARD ===================== */}
//       <section className="py-20 bg-[#F4F4F0] reveal">
//         <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
//           <div className="mb-12">
//             <div className="inline-flex items-center gap-2 bg-[#0F2A29] text-[#2EC4B6] px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4">
//               <Icon.Award className="w-3.5 h-3.5" /> Placements Snapshot
//             </div>
//             <h2 className="text-[32px] sm:text-[48px] font-bold text-[#0F2A29] leading-none" style={{ letterSpacing: "-0.02em" }}>
//               Where our engineers go next.
//             </h2>
//           </div>

//           <div className="grid lg:grid-cols-2 gap-8">
//             {/* Placement Donut Chart Visualization */}
//             <div className="bg-white rounded-3xl p-8 border-2 border-[#0F2A29] shadow-[8px_8px_0px_0px_rgba(15,42,41,1)]">
//               <h3 className="text-[18px] font-bold text-[#0F2A29] mb-8">Placement Records (Last 4 Years)</h3>
//               <div className="space-y-6">
//                 {placementData.map((r) => (
//                   <div key={r.year} className="flex items-center gap-4 group cursor-default">
//                     <div className="w-12 text-[14px] font-bold text-slate-600">{r.year}</div>
//                     {/* Progress Ring */}
//                     <div className="relative w-12 h-12 flex-shrink-0">
//                       <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
//                         <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E5E7EB" strokeWidth="3"></circle>
//                         <circle cx="18" cy="18" r="15.915" fill="none" stroke="#FF6B35" strokeWidth="3" strokeDasharray={`${r.percent}, 100`} strokeLinecap="round" className="transition-all duration-1000 group-hover:stroke-[#0F2A29]"></circle>
//                       </svg>
//                       <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#0F2A29]">{r.percent}%</div>
//                     </div>
//                     <div className="flex-grow">
//                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
//                         <div className="h-full bg-gradient-to-r from-[#2EC4B6] to-[#FF6B35] rounded-full transition-all duration-1000" style={{ width: `${r.percent}%` }}></div>
//                       </div>
//                     </div>
//                     <div className="w-16 text-right text-[14px] font-bold text-[#0F2A29]">{r.ctc}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Recruiters Grid */}
//             <div className="bg-[#FF6B35] rounded-3xl p-8 border-2 border-[#0F2A29] shadow-[8px_8px_0px_0px_rgba(15,42,41,1)] flex flex-col">
//               <h3 className="text-[18px] font-bold text-[#0F2A29] mb-8 flex items-center gap-2">
//                 <Icon.Briefcase className="w-5 h-5" /> Top Recruiters
//               </h3>
//               <div className="grid grid-cols-3 gap-3 flex-grow">
//                 {recruiters.map((r, i) => (
//                   <div 
//                     key={r} 
//                     className={`flex items-center justify-center text-center p-4 rounded-xl border-2 border-[#0F2A29] transition-all cursor-default
//                     ${i % 2 === 0 ? 'bg-[#F4F4F0] hover:bg-[#2EC4B6] hover:text-white' : 'bg-white hover:bg-[#0F2A29] hover:text-white'}`}
//                   >
//                     <span className="text-[14px] font-bold text-[#0F2A29] group-hover:text-white">{r}</span>
//                   </div>
//                 ))}
//               </div>
//               <button className="mt-6 w-full bg-[#0F2A29] text-white py-3 rounded-full text-[13px] font-bold hover:bg-white hover:text-[#0F2A29] border-2 border-[#0F2A29] transition-colors">
//                 View Detailed Placement Report
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ============ STYLES (keyframes + reveal) ============ */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

//         .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
//         .reveal.in { opacity: 1; transform: translateY(0); }

//         @keyframes gpm-fadeup {
//           0% { opacity: 0; transform: translateY(40px); }
//           100% { opacity: 1; transform: translateY(0); }
//         }
//         .gpm-fadeup { animation: gpm-fadeup 1s cubic-bezier(.2,.7,.2,1) both; }

//         @keyframes gpm-pulse {
//           0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7); }
//           50% { transform: scale(1.2); opacity: 0.8; box-shadow: 0 0 0 8px rgba(255, 107, 53, 0); }
//         }
//         .gpm-pulse { animation: gpm-pulse 1.5s ease-in-out infinite; }

//         html { scroll-behavior: smooth; }
        
//         .custom-scroll::-webkit-scrollbar { width: 4px; }
//         .custom-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); border-radius: 10px; }
//         .custom-scroll::-webkit-scrollbar-thumb { background: #FF6B35; border-radius: 10px; }
//       `}</style>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import collegeimage from "../../imports/clg.jpg";

// /* ---------- Tiny inline SVG icons ---------- */
// const Icon = {
//   Phone: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>),
//   Mail: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>),
//   Login: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>),
//   Bot: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="8" width="18" height="12" rx="2" /><circle cx="8" cy="14" r="1.5" fill="currentColor" stroke="none" /><circle cx="16" cy="14" r="1.5" fill="currentColor" stroke="none" /><path d="M12 8V4M12 4h-1M12 4h1" /></svg>),
//   ArrowRight: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>),
//   ArrowLeft: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>),
//   Calendar: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></svg>),
//   BookOpen: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>),
//   Award: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>),
//   Users: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>),
//   Briefcase: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>),
//   Building: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M19 21V9a2 2 0 0 0-2-2M9 7h2M9 11h2M9 15h2" /></svg>),
//   GradCap: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" /></svg>),
//   Megaphone: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>),
//   Bell: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>),
//   MapPin: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>),
//   Sparkles: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/></svg>),
// };

// /* ---------- Reusable: notice status pill ---------- */
// function StatusPill({ type }) {
//   const map = {
//     NEW: "bg-rose-500/10 text-rose-500 ring-rose-500/20",
//     IMP: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
//     OLD: "bg-slate-500/10 text-slate-500 ring-slate-500/20",
//   };
//   return <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full tracking-wider ring-1 ${map[type] || map.OLD}`}>{type}</span>;
// }

// /* ---------- Main Component ---------- */
// export default function HeroSection() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const els = document.querySelectorAll(".reveal");
//     const io = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((e) => {
//           if (e.isIntersecting) {
//             e.target.classList.add("in");
//             io.unobserve(e.target);
//           }
//         });
//       },
//       { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
//     );
//     els.forEach((el) => io.observe(el));
//     return () => io.disconnect();
//   }, []);

//   const notices = [
//     { tag: "NEW", title: "Admission notification for Diploma 1st Year 2025-26 — apply before 30th June", date: "12 Jun 2025" },
//     { tag: "NEW", title: "Internal assessment exam schedule for even semester released", date: "10 Jun 2025" },
//     { tag: "IMP", title: "SBTE Bihar revised academic calendar for AY 2025-26 published", date: "08 Jun 2025" },
//     { tag: "IMP", title: "Industrial visit to BHEL Patna for Mechanical 4th semester students", date: "05 Jun 2025" },
//     { tag: "OLD", title: "World Environment Day pledge — plantation drive on 5th June at campus", date: "03 Jun 2025" },
//     { tag: "OLD", title: "Sports meet winners list — annual athletics 2024-25 declared", date: "28 May 2025" },
//     { tag: "OLD", title: "Scholarship disbursement under Mukhyamantri Balika Protsahan Yojana", date: "22 May 2025" },
//     { tag: "OLD", title: "Vacancy for guest faculty in Leather Technology department", date: "18 May 2025" },
//   ];

//   const deptCards = [
//     { name: "Civil Engineering", path: "dept-civil", img: "https://picsum.photos/seed/gpm-dept-civil/600/400", desc: "Surveying, structural engineering, construction technology, water resources and transportation labs." },
//     { name: "Computer Science & Engg", path: "dept-cse", img: "https://picsum.photos/seed/gpm-dept-cse/600/400", desc: "Programming, data structures, DBMS, computer networks, full-stack development with modern labs." },
//     { name: "Electrical Engineering", path: "dept-electrical", img: "https://picsum.photos/seed/gpm-dept-elec/600/400", desc: "Power systems, electrical machines, control systems, switchgear & protection, embedded systems." },
//     { name: "Electronics Engineering", path: "dept-electronics", img: "https://picsum.photos/seed/gpm-dept-ece/600/400", desc: "Analog & digital circuits, microcontrollers, VLSI, communication systems and IoT specialisation." },
//     { name: "Mechanical Engineering", path: "dept-mechanical", img: "https://picsum.photos/seed/gpm-dept-mech/600/400", desc: "Thermal engineering, machine design, manufacturing, CAD/CAM, hydraulics and robotics workshops." },
//     { name: "Leather Technology", path: "dept-leather", img: "https://picsum.photos/seed/gpm-dept-leather/600/400", desc: "A flagship department — leather processing, footwear design, quality control and tannery management." },
//   ];

//   const placementData = [
//     { year: "2024-25", eligible: 312, placed: 286, percent: "91.7%", ctc: "₹8.4 LPA", width: "91%" },
//     { year: "2023-24", eligible: 298, placed: 263, percent: "88.3%", ctc: "₹7.8 LPA", width: "88%" },
//     { year: "2022-23", eligible: 281, placed: 241, percent: "85.8%", ctc: "₹7.2 LPA", width: "85%" },
//     { year: "2021-22", eligible: 264, placed: 218, percent: "82.6%", ctc: "₹6.5 LPA", width: "82%" },
//     { year: "2020-21", eligible: 248, placed: 196, percent: "79.0%", ctc: "₹5.8 LPA", width: "79%" },
//   ];

//   const recruiters = ["TCS", "Infosys", "L&T", "Bajaj", "Mahindra", "ITC", "Tata Motors", "Sail", "BSNL", "BEL", "Wipro", "Capgemini"];

//   return (
//     <div className="bg-slate-50 text-slate-900 font-jakarta" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      
//       {/* ===================== HERO SECTION ===================== */}
//       <section className="relative min-h-[92vh] flex items-center overflow-hidden">
//         {/* Background Image */}
//         <div className="absolute inset-0 gpm-kenburns" style={{ backgroundImage: `url('${collegeimage}')`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
        
//         {/* Gradient Overlays */}
//         <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/20" />
//         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
        
//         {/* Grid Pattern Overlay */}
//         <div className="absolute inset-0 gpm-grid-pattern opacity-20"></div>

//         {/* Hero Text Content */}
//         <div className="relative max-w-[1320px] w-full mx-auto px-4 sm:px-6 py-24 z-10">
//           <div className="max-w-3xl text-white gpm-fadeup">
//             <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-8 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30 backdrop-blur-md">
//               <span className="flex h-2 w-2 relative">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
//               </span>
//               Admissions Open 2025-26
//             </span>
//             <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.05] mb-6" style={{ letterSpacing: "-0.03em" }}>
//               Shaping the Engineers of <span className="text-emerald-400">Tomorrow.</span>
//             </h2>
//             <p className="text-[16px] sm:text-[18px] text-slate-300 leading-relaxed mb-10 max-w-xl">
//               Government Polytechnic, Muzaffarpur — a premier technical institution since 1949. Applications invited for diploma programs across nine disciplines.
//             </p>
//             <div className="flex flex-wrap gap-4 mb-16">
//               <button onClick={() => navigate("/academics")} className="group bg-emerald-500 text-white px-8 py-4 rounded-full text-[14px] font-bold hover:bg-emerald-400 transition-all hover:scale-105 shadow-xl shadow-emerald-500/20 flex items-center gap-2">
//                 Apply for Admission 
//                 <Icon.ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//               </button>
//               <button onClick={() => navigate("/placements")} className="border border-white/20 bg-white/5 backdrop-blur-md text-white px-8 py-4 rounded-full text-[14px] font-semibold hover:bg-white/10 transition-all">
//                 View Placements 
//               </button>
//             </div>

//             {/* Floating Glass Stats Card */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
//               {[
//                 { v: "75+", l: "Years of Legacy" },
//                 { v: "9", l: "Disciplines" },
//                 { v: "85%+", l: "Placement Rate" },
//                 { v: "28", l: "Acres Campus" }
//               ].map((s, i) => (
//                 <div key={i} className="bg-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-2xl">
//                   <div className="text-2xl font-extrabold text-white mb-1">{s.v}</div>
//                   <div className="text-xs text-slate-400 uppercase tracking-wider">{s.l}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ===================== NOTICE MARQUEE ===================== */}
//       <section className="relative -mt-10 z-20 mb-16 px-4">
//         <div className="max-w-[1320px] mx-auto bg-slate-900 rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden border border-slate-800">
//           <div className="flex items-center">
//             <div className="flex-shrink-0 bg-emerald-500 text-white px-6 py-4 text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 rounded-l-2xl">
//               <span className="w-2 h-2 rounded-full bg-white gpm-pulse"></span>
//               Latest
//             </div>
//             <div className="flex-1 overflow-hidden py-4">
//               <div className="gpm-marquee whitespace-nowrap flex gap-12 text-[14px] text-slate-300 hover:[animation-play-state:paused] pl-8">
//                 {[...notices, ...notices].map((n, i) => (
//                   <span key={i} className="inline-flex items-center gap-3">
//                     <span className="text-emerald-400">●</span>
//                     <span className="font-medium text-slate-200">{n.title}</span>
//                     <span className="text-slate-700">|</span>
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ===================== MAIN CONTENT ===================== */}
//       <main id="main" className="max-w-[1320px] mx-auto px-4 sm:px-6 pb-16">
//         <div className="grid lg:grid-cols-[1fr_400px] gap-10">
          
//           {/* Welcome / About */}
//           <div className="reveal">
//             <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-5">
//               <Icon.Sparkles className="w-3.5 h-3.5" /> Welcome to GPM
//             </div>
//             <h2 className="text-[32px] sm:text-[44px] font-extrabold text-slate-900 mb-5" style={{ letterSpacing: "-0.02em" }}>
//               Building Bihar's technical backbone since 1949.
//             </h2>
//             <p className="text-slate-600 text-[16px] leading-relaxed mb-4">
//               Government Polytechnic, Muzaffarpur is one of the oldest polytechnics in the eastern region. Affiliated to the State Board of Technical Education, Bihar and approved by AICTE, the institute runs diploma programs across nine disciplines with a strong focus on practical training and industry readiness.
//             </p>
//             <p className="text-slate-600 text-[16px] leading-relaxed mb-8">
//               The 28-acre campus houses workshops, modern laboratories, hostels, a central library with over 35,000 volumes, sports facilities and a T&P cell that consistently places over 85% of eligible students.
//             </p>

//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
//               {[
//                 { icon: Icon.Building, v: "28 acres", l: "Campus area", bg: "bg-sky-50", text: "text-sky-600" },
//                 { icon: Icon.Users, v: "120+", l: "Faculty & staff", bg: "bg-purple-50", text: "text-purple-600" },
//                 { icon: Icon.BookOpen, v: "35,000+", l: "Library volumes", bg: "bg-emerald-50", text: "text-emerald-600" },
//                 { icon: Icon.Briefcase, v: "85%+", l: "Avg placement", bg: "bg-amber-50", text: "text-amber-600" },
//                 { icon: Icon.Award, v: "AICTE", l: "Approved", bg: "bg-rose-50", text: "text-rose-600" },
//                 { icon: Icon.GradCap, v: "9", l: "Diploma branches", bg: "bg-indigo-50", text: "text-indigo-600" },
//               ].map((s) => (
//                 <div key={s.l} className="bg-white p-5 flex items-center gap-4 rounded-2xl border border-slate-100 transition-all hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-1">
//                   <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.text} flex items-center justify-center`}>
//                      <s.icon className="w-6 h-6" />
//                   </div>
//                   <div>
//                     <div className="text-[18px] font-extrabold text-slate-900 leading-tight">{s.v}</div>
//                     <div className="text-[12px] text-slate-500 font-medium leading-tight uppercase tracking-wide">{s.l}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Principal's Message Card */}
//             <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
//               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
//               <div className="relative flex flex-col sm:flex-row items-start gap-6">
//                 <div className="w-24 h-28 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
//                   <img src="https://picsum.photos/seed/gpm-principal-portrait/120/160" alt="Principal" className="w-full h-full object-cover" />
//                 </div>
//                 <div>
//                   <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">Principal's Message</div>
//                   <p className="text-[15px] text-slate-300 leading-relaxed italic mb-4 border-l-2 border-emerald-500/50 pl-4">
//                     "Technical education must serve the cause of equitable development. At GPM Muzaffarpur, we strive to produce diploma engineers who are not just employable, but who carry forward the tradition of integrity, craftsmanship and nation-building."
//                   </p>
//                   <div className="text-[14px] font-bold text-white">— Dr. R. K. Thakur</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Sidebar: Notices & Circulars */}
//           <aside className="reveal">
//             <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 overflow-hidden lg:sticky lg:top-6">
//               <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-slate-100">
//                 <h3 className="text-[18px] font-extrabold text-slate-900 flex items-center gap-2">
//                   <span className="bg-emerald-50 p-2 rounded-xl text-emerald-600"><Icon.Bell className="w-5 h-5" /></span> Notices &amp; Circulars
//                 </h3>
//                 <span className="text-[11px] bg-rose-50 text-rose-500 px-3 py-1 rounded-full font-bold">{notices.filter(n => n.tag === "NEW").length} New</span>
//               </div>
//               <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto custom-scroll">
//                 {notices.map((n, i) => (
//                   <a key={i} href="#" className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all duration-200 cursor-pointer">
//                     <StatusPill type={n.tag} />
//                     <div className="flex-1">
//                       <div className="text-[14px] text-slate-800 font-semibold leading-snug group-hover:text-emerald-600 transition-colors">{n.title}</div>
//                       <div className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5 font-medium">
//                         <Icon.Calendar className="w-3.5 h-3.5" /> {n.date}
//                       </div>
//                     </div>
//                   </a>
//                 ))}
//               </div>
//               <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
//                 <a href="#" className="text-[14px] font-bold text-slate-900 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2 bg-white rounded-full py-2.5 border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50">
//                   View All Notices <Icon.ArrowRight className="w-4 h-4" />
//                 </a>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </main>

//       {/* ===================== ACADEMIC DEPARTMENTS ===================== */}
//       <section className="py-20 bg-white reveal">
//         <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
//           <div className="text-center mb-14">
//             <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4">
//               <Icon.GradCap className="w-3.5 h-3.5" /> Academic Departments
//             </div>
//             <h2 className="text-[32px] sm:text-[44px] font-extrabold text-slate-900 mb-3" style={{ letterSpacing: "-0.02em" }}>
//               Nine disciplines. One mission.
//             </h2>
//             <p className="text-slate-500 max-w-xl mx-auto">Explore our cutting-edge programs designed to foster innovation and technical excellence.</p>
//           </div>

//           {/* Bento Grid Layout */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Featured Card */}
//             <article className="group relative lg:col-span-2 lg:row-span-2 min-h-[400px] rounded-3xl overflow-hidden cursor-pointer" onClick={() => navigate(`/dept/dept-cse`)}>
//               <img src="https://picsum.photos/seed/gpm-dept-cse/800/600" alt="Computer Science" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
//               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
//               <div className="relative h-full flex flex-col justify-end p-8">
//                 <span className="bg-emerald-500 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full w-fit mb-4">Featured Department</span>
//                 <h3 className="text-3xl font-extrabold text-white mb-2">Computer Science & Engg</h3>
//                 <p className="text-slate-200 max-w-md mb-4">Programming, data structures, DBMS, computer networks, full-stack development with modern labs.</p>
//                 <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 group-hover:gap-3 transition-all">
//                   Know More <Icon.ArrowRight className="w-4 h-4" />
//                 </span>
//               </div>
//             </article>

//             {/* Smaller Cards */}
//             {deptCards.filter(d => d.path !== 'dept-cse').map((d) => (
//               <article key={d.name} className="group bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-emerald-50 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer" onClick={() => navigate(`/dept/${d.path}`)}>
//                 <div className="relative h-40 overflow-hidden">
//                   <img src={d.img} alt={d.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
//                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
//                 </div>
//                 <div className="p-6">
//                   <h3 className="text-[18px] font-extrabold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{d.name}</h3>
//                   <p className="text-[13px] text-slate-500 leading-relaxed mb-4 line-clamp-2">{d.desc}</p>
//                   <span className="inline-flex items-center gap-2 text-[13px] font-bold text-emerald-600 group-hover:gap-3 transition-all">
//                     Know More <Icon.ArrowRight className="w-4 h-4" />
//                   </span>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ===================== PLACEMENTS SNAPSHOT ===================== */}
//       <section className="py-20 bg-slate-50 reveal">
//         <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
//           <div className="text-center mb-14">
//             <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4">
//               <Icon.Award className="w-3.5 h-3.5" /> Placements Snapshot
//             </div>
//             <h2 className="text-[32px] sm:text-[44px] font-extrabold text-slate-900 mb-3" style={{ letterSpacing: "-0.02em" }}>
//               Where our engineers go next.
//             </h2>
//             <p className="text-slate-500 max-w-xl mx-auto">We take pride in our consistent placement record and strong industry connections.</p>
//           </div>

//           <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
//             <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
//               <h3 className="text-[18px] font-extrabold text-slate-900 mb-8 flex items-center gap-2">
//                 <span className="bg-emerald-50 p-2 rounded-xl text-emerald-600"><Icon.Award className="w-5 h-5" /></span>
//                 Placement Records (Last 5 Years)
//               </h3>
//               <div className="space-y-6">
//                 {placementData.map((r) => (
//                   <div key={r.year} className="grid grid-cols-[80px_1fr_auto] items-center gap-4">
//                     <div className="text-[14px] font-bold text-slate-500">{r.year}</div>
//                     <div className="w-full">
//                       <div className="flex justify-between text-[12px] mb-1.5">
//                         <span className="text-slate-400 font-medium">{r.placed} / {r.eligible} placed</span>
//                         <span className="font-bold text-emerald-600">{r.percent}</span>
//                       </div>
//                       <div className="w-full bg-slate-100 rounded-full h-2">
//                         <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: r.width }}></div>
//                       </div>
//                     </div>
//                     <div className="text-[13px] font-extrabold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg">{r.ctc}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="flex flex-col gap-6">
//               <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-full">
//                 <h3 className="text-[18px] font-extrabold text-slate-900 mb-6 flex items-center gap-2">
//                   <span className="bg-slate-100 p-2 rounded-xl text-slate-700"><Icon.Briefcase className="w-5 h-5" /></span>
//                   Top Recruiters
//                 </h3>
//                 <div className="grid grid-cols-3 gap-3">
//                   {recruiters.map((r) => (
//                     <div key={r} className="bg-slate-50 border border-slate-100 px-2 py-4 text-center text-[12px] font-bold text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors cursor-default">
//                       {r}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ============ STYLES (keyframes + reveal) ============ */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

//         .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
//         .reveal.in { opacity: 1; transform: translateY(0); }

//         @keyframes gpm-kenburns {
//           0% { transform: scale(1.0) translate(0, 0); }
//           100% { transform: scale(1.1) translate(-1%, -1%); }
//         }
//         .gpm-kenburns { animation: gpm-kenburns 15s ease-out forwards; }

//         @keyframes gpm-fadeup {
//           0% { opacity: 0; transform: translateY(28px); }
//           100% { opacity: 1; transform: translateY(0); }
//         }
//         .gpm-fadeup { animation: gpm-fadeup 0.9s cubic-bezier(.2,.7,.2,1) both; }

//         @keyframes gpm-marquee {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         .gpm-marquee { animation: gpm-marquee 40s linear infinite; will-change: transform; }
//         .gpm-marquee:hover { animation-play-state: paused; }

//         @keyframes gpm-pulse {
//           0%, 100% { transform: scale(1); opacity: 1; }
//           50% { transform: scale(1.4); opacity: 0.6; }
//         }
//         .gpm-pulse { animation: gpm-pulse 1.2s ease-in-out infinite; }

//         html { scroll-behavior: smooth; }
        
//         .custom-scroll::-webkit-scrollbar { width: 6px; }
//         .custom-scroll::-webkit-scrollbar-track { background: transparent; }
//         .custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
//         .custom-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

//         .gpm-grid-pattern {
//           background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
//           background-size: 40px 40px;
//         }
        
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// }
