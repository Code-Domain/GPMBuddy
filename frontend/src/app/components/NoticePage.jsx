import { useEffect, useState } from "react";
import { Bell, FileText, Download, Search, Calendar, Archive, Filter, ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import api from "../../services/api";
import { unwrapApiData } from "../../services/publicContent";

export default function NoticePage() {
  const staticNotices = [
    { id: 1, date: "12 Jun 2025", day: "12", month: "Jun", year: "2025", title: "Admission Notification for Diploma 1st Year 2025-26", desc: "Online applications are invited for admission into various diploma branches. Last date to apply is 30th June 2025.", category: "Admission", tag: "NEW", size: "1.2 MB" },
    { id: 2, date: "10 Jun 2025", day: "10", month: "Jun", year: "2025", title: "Internal Assessment Exam Schedule (Even Semester)", desc: "The internal assessment examinations for the even semester will commence from 20th June. Check department-wise schedule.", category: "Examination", tag: "NEW", size: "850 KB" },
    { id: 3, date: "08 Jun 2025", day: "08", month: "Jun", year: "2025", title: "SBTE Bihar Revised Academic Calendar 2025-26", desc: "The State Board of Technical Education has released the revised academic calendar for the upcoming session.", category: "General", tag: "IMP", size: "2.1 MB" },
    { id: 4, date: "05 Jun 2025", day: "05", month: "Jun", year: "2025", title: "Industrial Visit to BHEL Patna - Mechanical Dept", desc: "Students of 4th semester Mechanical Engineering are informed about the upcoming industrial visit to BHEL Patna.", category: "Academic", tag: "IMP", size: "450 KB" },
    { id: 5, date: "03 Jun 2025", day: "03", month: "Jun", year: "2025", title: "Anti-Ragging Affidavit Submission Mandatory", desc: "All 1st-year students must submit the anti-ragging affidavit to their respective HODs before 15th July.", category: "General", tag: "IMP", size: "300 KB" },
    { id: 6, date: "28 May 2025", day: "28", month: "May", year: "2025", title: "Annual Athletics Meet 2024-25 Winners List", desc: "The final list of winners for the annual athletics meet held in March 2025 has been declared.", category: "Events", tag: "OLD", size: "600 KB" },
    { id: 7, date: "22 May 2025", day: "22", month: "May", year: "2025", title: "Scholarship Disbursement - Mukhyamantri Balika Protsahan Yojana", desc: "Check the status of your scholarship disbursement for the eligible female students of the 2024 batch.", category: "Scholarship", tag: "OLD", size: "1.5 MB" },
    { id: 8, date: "18 May 2025", day: "18", month: "May", year: "2025", title: "Guest Faculty Vacancy - Leather Technology Dept", desc: "Walk-in interview for the post of Guest Faculty in the Leather Technology department on 25th May 2025.", category: "Recruitment", tag: "OLD", size: "750 KB" },
  ];

  const [databaseEvents, setDatabaseEvents] = useState([]);
  useEffect(() => {
    let active = true;
    api.get("/events").then((response) => {
      const data = unwrapApiData(response);
      if (active && Array.isArray(data)) setDatabaseEvents(data);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const eventNotices = databaseEvents.map((event) => {
    const date = event.date ? new Date(event.date) : null;
    const validDate = date && !Number.isNaN(date.getTime());
    return {
      id: event._id || event.id || event.title,
      date: validDate ? date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Date not provided",
      day: validDate ? date.toLocaleDateString("en-IN", { day: "2-digit" }) : "—",
      month: validDate ? date.toLocaleDateString("en-IN", { month: "short" }) : "Event",
      year: validDate ? date.getFullYear() : "",
      title: event.title,
      desc: event.description || "",
      category: "Events",
      tag: validDate && date >= new Date(new Date().setHours(0, 0, 0, 0)) ? "NEW" : "IMP",
      venue: event.venue || "",
      time: event.time || "",
    };
  });
  const allNotices = databaseEvents.length
    ? [...staticNotices.filter((notice) => notice.category !== "Events"), ...eventNotices]
    : staticNotices;

  const categories = ["All", "Admission", "Examination", "Academic", "Scholarship", "Events", "Recruitment", "General"];
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotices = allNotices.filter(notice => {
    const matchesCategory = activeCategory === "All" || notice.category === activeCategory;
    const matchesSearch = (notice.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || (notice.desc || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const tagStyles = {
    NEW: "bg-red-600 text-white",
    IMP: "bg-[#FF9933] text-[#0b1f5e]",
    OLD: "bg-gray-200 text-gray-700",
  };

  return (
    <div className="bg-[#f6f3ea] text-[#0b1f5e] font-roboto min-h-screen" style={{ fontFamily: "'Roboto', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Tiro+Devanagari+Hindi&display=swap');
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ===================== HERO HEADER ===================== */}
      <section className="bg-[#0f172b] text-white border-b-4 border-[#FF9933]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 text-[12px] text-white/60 mb-6">
            <span>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#FF9933] font-medium">Notice Board</span>
          </div>
          
          <div className="flex items-center gap-5 border-l-4 border-[#FF9933] pl-5">
            <div className="w-16 h-16 flex items-center justify-center text-[#FF9933] border border-[#FF9933]/30 bg-white/5">
              <Bell className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-[26px] sm:text-[32px] font-bold leading-tight uppercase tracking-wide">
                Notice Board & Circulars
              </h1>
              <p className="text-[16px] text-white/80 mt-1" style={{ fontFamily: "'Tiro Devanagari Hindi', sans-serif" }}>
                सूचना पट्ट एवं परिपत्र
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== MAIN LAYOUT ===================== */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[1fr_320px] gap-8">
        
        {/* ----------- LEFT MAIN CONTENT ----------- */}
        <main className="space-y-6">
          
          {/* Search & Filter Section */}
          <div className="bg-white border border-gray-200 p-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
              <div className="relative w-full md:w-1/2">
                <input 
                  type="text" 
                  placeholder="Search notices..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-[14px] focus:outline-none focus:border-[#0b1f5e]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <div className="flex items-center gap-2 text-[13px] text-gray-600 w-full md:w-auto">
                <Filter className="w-4 h-4 text-[#FF9933]" />
                <span>Filter by Category:</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-[12px] font-semibold border transition-colors uppercase tracking-wider ${
                    activeCategory === cat 
                      ? "bg-[#0f172b] text-white border-[#0b1f5e]" 
                      : "bg-white text-[#0b1f5e] border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notice List */}
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="bg-[#0f172b] text-white px-5 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FF9933]" />
                <h2 className="text-[15px] font-bold uppercase tracking-wider">Recent Notices</h2>
              </div>
              <span className="text-[12px] bg-[#FF9933] text-[#0b1f5e] px-2 py-0.5 font-bold">{filteredNotices.length} Found</span>
            </div>
            
            <ul className="divide-y divide-gray-100">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((n) => (
                  <li key={n.id} className="group flex flex-col sm:flex-row items-start hover:bg-[#FFF4E5] transition-colors p-4 gap-4">
                    {/* Date Block */}
                    <div className="flex-shrink-0 w-16 h-16 border border-gray-200 flex flex-col items-center justify-center bg-[#f6f3ea] group-hover:bg-white">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{n.month}</span>
                      <span className="text-[22px] font-bold text-[#0b1f5e] leading-none mt-1">{n.day}</span>
                      <span className="text-[9px] text-gray-500 mt-1">{n.year}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-sm tracking-wider ${tagStyles[n.tag]}`}>{n.tag}</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF9933] border border-[#FF9933]/30 bg-[#FFF4E5] px-1.5 py-0.5">{n.category}</span>
                      </div>
                      <h3 className="text-[15px] font-bold text-[#0b1f5e] leading-snug">{n.title}</h3>
                      <p className="text-[13px] text-gray-600 leading-relaxed mt-1 text-justify">{n.desc}</p>
                      <div className="flex items-center gap-4 mt-3 text-[12px] text-gray-500">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {n.date}</span>
                        {n.time && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {n.time}</span>}
                        {n.venue ? <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {n.venue}</span> : <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {n.size}</span>}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0 w-full sm:w-auto flex sm:flex-col justify-end">
                      <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#0f172b] text-white text-[12px] font-semibold hover:bg-[#FF9933] hover:text-[#0b1f5e] transition-colors uppercase tracking-wider">
                        <Download className="w-4 h-4" /> View PDF
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-10 text-center text-gray-500 text-sm">
                  No notices found matching your search/filter criteria.
                </li>
              )}
            </ul>
            
            {/* Pagination */}
            <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between text-[13px]">
              <span className="text-gray-600">Showing 1 to {filteredNotices.length} of {allNotices.length} entries</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-gray-300 text-gray-600 hover:bg-white disabled:opacity-50" disabled>Prev</button>
                <button className="px-3 py-1 border border-[#0b1f5e] bg-[#0f172b] text-white">1</button>
                <button className="px-3 py-1 border border-gray-300 text-[#0b1f5e] hover:bg-white">2</button>
                <button className="px-3 py-1 border border-gray-300 text-gray-600 hover:bg-white">Next</button>
              </div>
            </div>
          </div>
        </main>

        {/* ----------- RIGHT SIDEBAR ----------- */}
        <aside className="space-y-6">
          
          {/* Notice Archives */}
          <div className="bg-white border border-gray-200">
            <div className="bg-[#0f172b] text-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <Archive className="w-4 h-4 text-[#FF9933]" />
              <h3 className="text-[14px] font-bold uppercase tracking-wider">Notice Archives</h3>
            </div>
            <ul className="divide-y divide-gray-100">
              {["2025", "2024", "2023", "2022", "2021", "2020", "2019"].map((year) => (
                <li key={year}>
                  <a href="#" className="flex items-center justify-between p-3 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-[#0b1f5e] transition-colors">
                    <span className="flex items-center gap-2"><span className="text-[#FF9933]">›</span> Year {year}</span>
                    <span className="text-[11px] bg-gray-100 px-1.5 py-0.5 text-gray-600 font-medium">{Math.floor(Math.random() * 50) + 10}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Categories */}
          <div className="bg-white border border-gray-200">
            <div className="bg-[#0f172b] text-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FF9933]" />
              <h3 className="text-[14px] font-bold uppercase tracking-wider">Quick Categories</h3>
            </div>
            <ul className="divide-y divide-gray-100">
              {["Examination Notices", "Admission Cell", "Scholarship Updates", "Tender Notices", "Recruitment Forms"].map((l) => (
                <li key={l}>
                  <a href="#" className="flex items-center gap-2 p-3 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-[#0b1f5e] transition-colors">
                    <span className="text-[#FF9933]">›</span> {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Box */}
          <div className="bg-white border border-gray-200">
            <div className="bg-[#0f172b] text-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#FF9933]" />
              <h3 className="text-[14px] font-bold uppercase tracking-wider">Notice Board Contact</h3>
            </div>
            <div className="p-5 space-y-3 text-[13px] text-gray-700">
              <p className="font-bold text-[#0b1f5e]">Academic Section</p>
              <p>Govt. Polytechnic, Muzaffarpur</p>
              <p className="flex items-start gap-2"><Mail className="w-4 h-4 text-[#FF9933] flex-shrink-0 mt-0.5" /> notices@gpmuzaffarpur.ac.in</p>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
