import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  GraduationCap,
  Users,
  FlaskConical,
  BookOpen,
  Target,
  Eye,
  Phone,
  Mail,
  ArrowRight,
  Cpu,
  Building2,
  Wrench,
  CircuitBoard,
  FlaskRound,
  Atom,
  BookMarked,
  Hand,
  FileText,
  UserRound,
} from "lucide-react";
import api from "../../services/api";
import { departmentRouteId, getFacultyImageUrl, unwrapApiData } from "../../services/publicContent";

const departmentsData = {
  "dept-civil": {
    name: "Civil Engineering",
    hindiName: "सिविल अभियांत्रिकी विभाग",
    icon: Building2,
    established: "1958",
    intake: "60",
    desc: "The Civil Engineering department is the cornerstone of infrastructure development. It deals with the design, construction, and maintenance of physical and naturally built environments including roads, bridges, canals, dams, and buildings.",
    vision: "To produce highly competent civil diploma engineers equipped with sustainable construction practices and modern surveying techniques.",
    mission: "To impart strong foundations in structural engineering, surveying, and construction management through extensive fieldwork and laboratory testing.",
    hod: {
      name: "Er. R. K. Mishra",
      msg: "Civil engineering is about shaping the world around us. We emphasize practical surveying, material testing, and modern construction management to make our students industry-ready.",
      img: "https://picsum.photos/seed/gpm-hod-civil/300/400",
    },
    labs: [
      { name: "Surveying Lab", desc: "Theodolites, total stations, auto levels, and GPS surveying equipment." },
      { name: "Material Testing Lab", desc: "Universal testing machine, concrete compressive strength, and aggregate testing." },
      { name: "Hydraulics & Fluid Mechanics Lab", desc: "Flow measurement, open channel flume, and centrifugal pump test rigs." },
      { name: "Highway Material Lab", desc: "Bitumen testing, Marshall stability, and pavement design tools." },
      { name: "Geotechnical Engineering Lab", desc: "Soil classification, compaction, and shear strength testing." },
      { name: "CAD Lab", desc: "AutoCAD, STAAD Pro, and BIM software for structural drafting." },
    ],
    faculty: [
      { name: "Er. A. K. Singh", role: "Lecturer (Selection Grade)", exp: "14 Years" },
      { name: "Mr. B. K. Pandey", role: "Lecturer", exp: "9 Years" },
      { name: "Mrs. S. Kumari", role: "Lecturer", exp: "7 Years" },
    ],
  },
  "dept-cse": {
    name: "Computer Science & Engineering",
    hindiName: "कंप्यूटर विज्ञान एवं अभियांत्रिकी विभाग",
    icon: Cpu,
    established: "1999",
    intake: "60",
    desc: "The Department of Computer Science & Engineering at GPM is dedicated to producing diploma engineers equipped with foundational and advanced knowledge in computing, software development, and systems architecture.",
    vision: "To be a center of excellence in computer science education, producing innovative and ethical technocrats who can meet the global challenges of the IT industry.",
    mission: "To impart quality technical education through state-of-the-art laboratories, industry-aligned curriculum, and project-based learning to foster problem-solving skills.",
    hod: {
      name: "Dr. A. K. Sharma",
      msg: "Our focus is on bridging the gap between theoretical concepts and practical applications. We emphasize coding skills, software engineering principles, and emerging technologies like AI and IoT.",
      img: "https://picsum.photos/seed/gpm-hod-cse/300/400",
    },
    labs: [
      { name: "Programming Lab (C/C++)", desc: "Fundamentals of structured and object-oriented programming." },
      { name: "DBMS & Oracle Lab", desc: "Database design, SQL queries, and backend management." },
      { name: "Computer Network Lab", desc: "Routing, switching, and network topology simulation." },
      { name: "Web Development Lab", desc: "HTML, CSS, JavaScript, and modern full-stack frameworks." },
      { name: "Hardware & Microprocessor Lab", desc: "Assembly language and microcontroller architecture." },
      { name: "Project & IoT Lab", desc: "Hands-on projects integrating sensors, cloud, and automation." },
    ],
    faculty: [
      { name: "Mr. R. K. Verma", role: "Lecturer (Selection Grade)", exp: "12 Years" },
      { name: "Mrs. S. Singh", role: "Lecturer", exp: "8 Years" },
      { name: "Mr. A. Kumar", role: "Lecturer", exp: "6 Years" },
    ],
  },
  "dept-electrical": {
    name: "Electrical Engineering",
    hindiName: "विद्युत अभियांत्रिकी विभाग",
    icon: CircuitBoard,
    established: "1962",
    intake: "60",
    desc: "The Electrical Engineering department focuses on the study and application of electricity, electronics, and electromagnetism. It covers power generation, transmission, distribution, and utilization of electrical energy.",
    vision: "To produce skilled diploma electrical engineers capable of meeting the growing demands of the power sector and renewable energy industries.",
    mission: "To provide a strong foundation in electrical machines, power systems, and control systems through rigorous practical training and industrial exposure.",
    hod: {
      name: "Er. S. N. Verma",
      msg: "Electricity is the lifeblood of modern civilization. We train our students to handle power systems safely, efficiently, and with a deep understanding of modern smart grid technologies.",
      img: "https://picsum.photos/seed/gpm-hod-elec/300/400",
    },
    labs: [
      { name: "Electrical Machine Lab", desc: "Transformers, DC motors, induction motors, and alternators testing." },
      { name: "Power System Lab", desc: "Relays, circuit breakers, and transmission line simulation." },
      { name: "Electrical Measurement Lab", desc: "Bridges, CRO, digital multimeters, and transducers." },
      { name: "Control System Lab", desc: "DC position control, AC servo motor, and PID controllers." },
      { name: "Power Electronics Lab", desc: "Rectifiers, inverters, choppers, and SCR control circuits." },
      { name: "Wiring & Winding Lab", desc: "Domestic wiring, panel design, and machine winding practices." },
    ],
    faculty: [
      { name: "Er. D. K. Singh", role: "Lecturer (Selection Grade)", exp: "16 Years" },
      { name: "Mr. P. R. Gupta", role: "Lecturer", exp: "11 Years" },
      { name: "Mrs. R. Kumari", role: "Lecturer", exp: "5 Years" },
    ],
  },
  "dept-electronics": {
    name: "Electronics Engineering",
    hindiName: "इलेक्ट्रॉनिक्स अभियांत्रिकी विभाग",
    icon: CircuitBoard,
    established: "1985",
    intake: "60",
    desc: "The Electronics Engineering department deals with the design and application of electronic circuits, microcontrollers, and communication systems. It is at the heart of modern automation and connectivity.",
    vision: "To produce highly skilled diploma engineers in electronics and communication who can contribute to the rapidly evolving electronics industry.",
    mission: "To provide a strong foundation in analog and digital electronics, embedded systems, and communication engineering through modern laboratories and projects.",
    hod: {
      name: "Er. A. K. Jha",
      msg: "Electronics is shaping the future. From embedded systems to IoT, we ensure our students are proficient in both hardware design and software programming.",
      img: "https://picsum.photos/seed/gpm-hod-ece/300/400",
    },
    labs: [
      { name: "Analog Electronics Lab", desc: "Op-amps, oscillators, and amplifier circuit design." },
      { name: "Digital Electronics Lab", desc: "Logic gates, flip-flops, counters, and shift registers." },
      { name: "Microprocessor & Microcontroller Lab", desc: "8085, 8051, and Arduino programming and interfacing." },
      { name: "Communication Lab", desc: "AM/FM modulation, PCM, TDM, and fiber optic communication." },
      { name: "Consumer Electronics Lab", desc: "Television, radio, and home appliance circuit analysis." },
      { name: "PCB Design Lab", desc: "Circuit layout, etching, and soldering practices." },
    ],
    faculty: [
      { name: "Mr. M. K. Prasad", role: "Lecturer (Selection Grade)", exp: "13 Years" },
      { name: "Mrs. N. Sharma", role: "Lecturer", exp: "9 Years" },
      { name: "Er. V. Kumar", role: "Lecturer", exp: "4 Years" },
    ],
  },
  "dept-mechanical": {
    name: "Mechanical Engineering",
    hindiName: "यांत्रिक अभियांत्रिकी विभाग",
    icon: Wrench,
    established: "1955",
    intake: "60",
    desc: "One of the oldest departments at GPM, Mechanical Engineering deals with the design, manufacturing, and maintenance of mechanical systems, blending traditional workshop practices with modern CAD/CAM technologies.",
    vision: "To produce skilled mechanical diploma engineers capable of contributing to industrial growth and sustainable manufacturing practices.",
    mission: "To provide a strong foundation in mechanical principles through rigorous workshop training, industrial visits, and exposure to modern manufacturing technology.",
    hod: {
      name: "Er. S. N. Pandey",
      msg: "Mechanical engineering is the backbone of any industrial infrastructure. We ensure our students are shop-floor ready with extensive hands-on training in our workshops and CAD labs.",
      img: "https://picsum.photos/seed/gpm-hod-mech/300/400",
    },
    labs: [
      { name: "Thermal Engineering Lab", desc: "Boilers, IC engines, and refrigeration cycles testing." },
      { name: "Machine Shop", desc: "Lathes, milling machines, and CNC operations." },
      { name: "CAD/CAM Lab", desc: "AutoCAD, SolidWorks, and CNC programming simulation." },
      { name: "Hydraulics & Pneumatics Lab", desc: "Fluid mechanics and control systems." },
      { name: "Material Testing Lab", desc: "Universal testing machine and metallography." },
      { name: "Foundry & Welding Shop", desc: "Casting processes and arc/gas welding." },
    ],
    faculty: [
      { name: "Er. D. K. Mishra", role: "Lecturer (Selection Grade)", exp: "15 Years" },
      { name: "Mr. P. Thakur", role: "Lecturer", exp: "10 Years" },
      { name: "Er. N. Gupta", role: "Lecturer", exp: "5 Years" },
    ],
  },
  "dept-chemistry": {
    name: "Chemistry (Applied Sciences)",
    hindiName: "रसायन विज्ञान विभाग",
    icon: FlaskRound,
    established: "1949",
    intake: "N/A",
    desc: "The Department of Chemistry provides fundamental science education to engineering students. It focuses on the chemical properties of materials used in construction, manufacturing, and electronics, along with environmental chemistry.",
    vision: "To build a strong scientific foundation for engineering students, enabling them to apply chemical principles in their respective technical domains.",
    mission: "To impart knowledge of material chemistry, water treatment, and polymer science through modern laboratory practices and research-oriented teaching.",
    hod: {
      name: "Dr. R. P. Singh",
      msg: "Chemistry is the foundation of all material sciences. We ensure our engineering students understand the properties and reactions of the materials they will use in the field.",
      img: "https://picsum.photos/seed/gpm-hod-chem/300/400",
    },
    labs: [
      { name: "Analytical Chemistry Lab", desc: "Titration, pH measurement, and gravimetric analysis." },
      { name: "Material Testing Lab", desc: "Water quality, solid fuel, and lubricant testing." },
      { name: "Polymer Chemistry Lab", desc: "Synthesis and property analysis of polymers and plastics." },
      { name: "Electrochemistry Lab", desc: "Conductivity, potentiometry, and corrosion testing." },
    ],
    faculty: [
      { name: "Dr. A. Pandey", role: "Assistant Professor", exp: "10 Years" },
      { name: "Mrs. K. Kumari", role: "Lecturer", exp: "7 Years" },
      { name: "Mr. R. Sharma", role: "Lecturer", exp: "5 Years" },
    ],
  },
  "dept-physics": {
    name: "Physics (Applied Sciences)",
    hindiName: "भौतिकी विभाग",
    icon: Atom,
    established: "1949",
    intake: "N/A",
    desc: "The Department of Physics imparts fundamental knowledge of matter, energy, and their interactions. It lays the groundwork for understanding electronics, optics, thermodynamics, and material science.",
    vision: "To cultivate a scientific temperament and strong analytical thinking among engineering students through the study of applied physics.",
    mission: "To provide conceptual understanding of physical principles and their practical applications in engineering and technology.",
    hod: {
      name: "Dr. S. K. Jha",
      msg: "Physics explains the 'why' and 'how' of engineering. We ensure our students develop a rigorous scientific approach to problem-solving.",
      img: "https://picsum.photos/seed/gpm-hod-phy/300/400",
    },
    labs: [
      { name: "Optics Lab", desc: "Lasers, interferometry, and diffraction experiments." },
      { name: "Electronics Lab", desc: "Diodes, transistors, and basic circuit analysis." },
      { name: "Thermal Physics Lab", desc: "Thermal conductivity, Stefan's law, and heat measurement." },
      { name: "Mechanics & Acoustics Lab", desc: "Vibration analysis, sound velocity, and Young's modulus." },
    ],
    faculty: [
      { name: "Dr. V. K. Singh", role: "Assistant Professor", exp: "12 Years" },
      { name: "Mr. A. K. Verma", role: "Lecturer", exp: "8 Years" },
      { name: "Mrs. S. Pandey", role: "Lecturer", exp: "6 Years" },
    ],
  },
  "dept-humanities": {
    name: "Humanities & Management",
    hindiName: "मानविकी एवं प्रबंधन विभाग",
    icon: BookMarked,
    established: "1949",
    intake: "N/A",
    desc: "The Department of Humanities focuses on communication skills, ethics, and management principles. It plays a vital role in the holistic development of students, preparing them for industry interactions and leadership roles.",
    vision: "To nurture well-rounded professionals equipped with excellent communication, interpersonal, and managerial skills.",
    mission: "To enhance English communication, soft skills, and management aptitude to complement technical education.",
    hod: {
      name: "Dr. Mrs. A. Singh",
      msg: "Technical skills are essential, but communication and management skills are what make a technologist a leader. We focus on the holistic development of our students.",
      img: "https://picsum.photos/seed/gpm-hod-hum/300/400",
    },
    labs: [
      { name: "Language Lab", desc: "Audio-visual aids for pronunciation, group discussion, and interview skills." },
      { name: "Soft Skills Lab", desc: "Personality development, teamwork, and leadership activities." },
      { name: "Management Lab", desc: "Case studies on industrial management and entrepreneurship." },
    ],
    faculty: [
      { name: "Mrs. R. Kumari", role: "Lecturer", exp: "15 Years" },
      { name: "Mr. P. Sharma", role: "Lecturer", exp: "9 Years" },
      { name: "Miss N. Verma", role: "Lecturer", exp: "4 Years" },
    ],
  },
  "dept-leather": {
    name: "Leather Technology",
    hindiName: "चर्म प्रौद्योगिकी विभाग",
    icon: Hand,
    established: "1992",
    intake: "40",
    desc: "Muzaffarpur is a historic hub for the leather industry. The Department of Leather Technology provides specialized education in leather processing, footwear design, and quality control, serving a vital sector of the local economy.",
    vision: "To produce highly skilled leather technologists who can innovate in leather processing, footwear design, and sustainable waste management.",
    mission: "To impart comprehensive knowledge of raw hide processing, tanning, leather chemicals, and footwear manufacturing through industry-aligned practicals.",
    hod: {
      name: "Er. D. N. Mahto",
      msg: "Leather technology is a highly specialized and lucrative field. We provide hands-on training in tanning and footwear manufacturing to meet the demands of the global leather industry.",
      img: "https://picsum.photos/seed/gpm-hod-leather/300/400",
    },
    labs: [
      { name: "Tannery Lab", desc: "Pre-tanning, tanning, and post-tanning processes of hides and skins." },
      { name: "Leather Chemicals Lab", desc: "Analysis of chromium, vegetable tannins, and syntans." },
      { name: "Footwear Design Lab", desc: "Pattern making, clicking, and shoe manufacturing machines." },
      { name: "Leather Testing Lab", desc: "Tensile strength, flex endurance, and color fastness testing." },
      { name: "Waste Management Lab", desc: "Effluent treatment and eco-friendly leather processing." },
    ],
    faculty: [
      { name: "Mr. S. K. Paswan", role: "Lecturer (Selection Grade)", exp: "18 Years" },
      { name: "Mrs. K. Singh", role: "Lecturer", exp: "10 Years" },
      { name: "Er. R. Kumar", role: "Lecturer", exp: "6 Years" },
    ],
  },
};

function FacultyPhoto({ src, name }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span
        role="img"
        aria-label={`${name || "Faculty member"} profile photo unavailable`}
        className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-full border-2 border-white bg-slate-100 text-slate-400 shadow-sm"
      >
        <UserRound size={25} strokeWidth={1.5} aria-hidden="true" />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={`${name || "Faculty member"} portrait`}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-16 w-16 flex-shrink-0 rounded-full border-2 border-white bg-slate-100 object-cover shadow-sm"
    />
  );
}

function ExpandableText({ text, lines = 3 }) {
  const [expanded, setExpanded] = useState(false);
  const content = typeof text === "string" ? text : "";
  const needsToggle = content.length > 150;

  if (!content) return null;

  return (
    <div>
      <p
        style={needsToggle && !expanded ? {
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: lines,
          overflow: "hidden",
        } : undefined}
      >
        {content}
      </p>
      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-1 ml-auto block text-right text-[12px] font-semibold text-sky-700 hover:text-sky-900 hover:underline"
          aria-expanded={expanded}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default function DepartmentPage() {
  // FIXED: Get deptId directly from the URL parameter using React Router
  const { deptId } = useParams();
  const navigate = useNavigate();
  const [databaseDepartment, setDatabaseDepartment] = useState(null);
  const [databaseFaculty, setDatabaseFaculty] = useState([]);
  const [databaseFacilities, setDatabaseFacilities] = useState([]);
  const [databaseSubjects, setDatabaseSubjects] = useState([]);
  const [loadedCollections, setLoadedCollections] = useState({ departments: false, faculty: false, facilities: false, subjects: false });

  useEffect(() => {
    let active = true;
    Promise.allSettled([api.get("/department"), api.get("/faculty"), api.get("/facility"), api.get("/subject")]).then((results) => {
      if (!active) return;
      const departments = results[0].status === "fulfilled" ? unwrapApiData(results[0].value) : null;
      const faculty = results[1].status === "fulfilled" ? unwrapApiData(results[1].value) : null;
      const facilities = results[2].status === "fulfilled" ? unwrapApiData(results[2].value) : null;
      const subjects = results[3].status === "fulfilled" ? unwrapApiData(results[3].value) : null;
      setLoadedCollections({
        departments: Array.isArray(departments),
        faculty: Array.isArray(faculty),
        facilities: Array.isArray(facilities),
        subjects: Array.isArray(subjects),
      });
      if (!Array.isArray(departments)) return;

      const match = departments.find((department) =>
        departmentRouteId(department) === deptId
      );
      if (!match) {
        setDatabaseDepartment(null);
        setDatabaseFaculty([]);
        setDatabaseFacilities([]);
        setDatabaseSubjects([]);
        return;
      }
      setDatabaseDepartment(match);

      const departmentId = String(match._id || match.id || "");
      const matchesDepartment = (entry) => {
        const linked = entry?.department;
        return String(linked?._id || linked?.id || linked || "") === departmentId ||
          (typeof linked === "object" && linked?.name?.trim().toLowerCase() === match.name?.trim().toLowerCase()) ||
          (typeof linked === "string" && linked.trim().toLowerCase() === match.name?.trim().toLowerCase());
      };
      if (Array.isArray(faculty)) setDatabaseFaculty(faculty.filter(matchesDepartment));
      if (Array.isArray(facilities)) setDatabaseFacilities(facilities.filter(matchesDepartment));
      if (Array.isArray(subjects)) {
        const matchNames = [match.name, match.code, deptId.replace(/^dept-/, "")].filter(Boolean).map((value) => String(value).trim().toLowerCase());
        setDatabaseSubjects(subjects.filter((subject) => !subject.departments?.length || subject.departments.some((name) => matchNames.includes(String(name).trim().toLowerCase()))));
      }
    });
    return () => { active = false; };
  }, [deptId]);

  const missing = "----";
  const textValue = (value) => value === undefined || value === null || String(value).trim() === "" ? missing : String(value);
  const data = {
    name: textValue(databaseDepartment?.name),
    hindiName: missing,
    icon: Building2,
    established: textValue(databaseDepartment?.established),
    intake: databaseDepartment?.intake === undefined || databaseDepartment?.intake === null ? missing : String(databaseDepartment.intake),
    desc: textValue(databaseDepartment?.description),
    vision: textValue(databaseDepartment?.vision),
    mission: Array.isArray(databaseDepartment?.mission) && databaseDepartment.mission.length
      ? databaseDepartment.mission.filter(Boolean)
      : databaseDepartment?.mission ? [String(databaseDepartment.mission)] : [missing],
    faculty: databaseFaculty.length ? databaseFaculty.map((member) => ({
      name: member.name,
      role: Array.isArray(member.designations) && member.designations.length ? member.designations.join(", ") : missing,
      image: getFacultyImageUrl(member, api.defaults.baseURL),
      qualification: member.qualification || [],
      specialization: member.specialization || [],
      phone: member.phone || missing,
      office: member.office || missing,
      bio: member.bio || "",
    })) : [{ name: missing, role: missing, image: "", qualification: [], specialization: [], office: missing, bio: "" }],
    labs: databaseFacilities.length ? databaseFacilities.map((facility) => ({
      name: facility.name,
      category: facility.category || missing,
      desc: facility.description || missing,
      image: facility.images?.[0] || "",
      location: facility.location ? [facility.location.type, facility.location.place, facility.location.floor, facility.location.room].filter(Boolean).join(" · ") || missing : missing,
      availability: facility.availability || null,
      contact: facility.contact || null,
      features: facility.features || [],
      inCharge: facility.inCharge || null,
    })) : [{ name: missing, category: missing, desc: missing, image: "", location: missing, features: [], availability: null, contact: null, inCharge: null }],
    peo: Array.isArray(databaseDepartment?.peo) && databaseDepartment.peo.length ? databaseDepartment.peo.filter(Boolean) : [missing],
    po: Array.isArray(databaseDepartment?.po) && databaseDepartment.po.length ? databaseDepartment.po.filter(Boolean) : [missing],
    pso: Array.isArray(databaseDepartment?.pso) && databaseDepartment.pso.length ? databaseDepartment.pso.filter(Boolean) : [missing],
  };
  const DeptIcon = data.icon || Building2;

  // Helper for routing
  const onNavigate = (path) => {
    if (path === "home") {
      navigate("/");
    } else if (path.startsWith("dept-")) {
      navigate(`/dept/${path}`);
    } else {
      navigate(`/${path}`);
    }
  };

  return (
    <div className="bg-[#f6f3ea] text-[#0b1f5e] font-roboto min-h-screen" style={{ fontFamily: "'Roboto', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Tiro+Devanagari+Hindi&display=swap');
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ===================== HEADER ===================== */}
      <section className="bg-[#0f172b] text-white border-b-4 border-[#FF9933]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-2 text-[12px] text-white/60 mb-6">
            <button onClick={() => onNavigate("home")} className="hover:text-[#FF9933] transition-colors">Home</button>
            <span>›</span>
            <button onClick={() => onNavigate("academics")} className="hover:text-[#FF9933] transition-colors">Academics</button>
            <span>›</span>
            <span className="text-[#FF9933] font-medium">{data.name}</span>
          </div>
          
          <div className="flex items-center gap-5 border-l-4 border-[#FF9933] pl-5">
            <div className="w-16 h-16 flex items-center justify-center text-[#FF9933] border border-[#FF9933]/30 bg-white/5">
              <DeptIcon className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-[26px] sm:text-[32px] font-bold leading-tight uppercase tracking-wide">
                {data.name}
              </h1>
              <p className="text-[16px] text-white/80 mt-1" style={{ fontFamily: "'Tiro Devanagari Hindi', sans-serif" }}>
                {data.hindiName}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STATS STRIP ===================== */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4">
          {[
            { icon: GraduationCap, label: "Established", val: data.established },
            { icon: Users, label: "Intake Capacity", val: String(data.intake).includes("N/A") ? "Core Branch" : data.intake + " Seats" },
            { icon: FlaskConical, label: databaseFacilities.length ? "Facilities" : "Laboratories", val: loadedCollections.facilities ? `${databaseFacilities.length} Items` : missing },
            { icon: BookOpen, label: "Program", val: missing },
          ].map((s, i) => (
            <div
              key={i}
              className={`p-4 flex items-center gap-3 ${i !== 3 ? "md:border-r border-gray-200" : ""} ${i % 2 === 0 ? "border-r border-gray-200" : ""} ${i < 2 ? "border-b md:border-b-0" : ""}`}
            >
              <s.icon className="w-6 h-6 text-[#0b1f5e] flex-shrink-0" />
              <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{s.label}</div>
                <div className="text-[16px] font-bold text-[#0b1f5e] leading-none mt-1">{s.val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== MAIN LAYOUT ===================== */}
      <div className="mx-auto grid w-full max-w-[1320px] min-w-0 grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        
        {/* ----------- LEFT MAIN CONTENT ----------- */}
        <main className="contents">
          
          {/* About Section */}
          <section className="order-1 self-start bg-white border border-gray-200 lg:col-start-1 lg:row-start-1">
            <div className="bg-[#0f172b] text-white px-5 py-3 border-b border-gray-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FF9933]" />
              <h2 className="text-[15px] font-bold uppercase tracking-wider">About the Department</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-[14px] leading-relaxed text-justify">{data.desc}</p>
            </div>
            
            {/* Vision & Mission inside About Box */}
            <div className="grid md:grid-cols-2 border-t border-gray-200 divide-x divide-gray-200">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                  <Eye className="w-5 h-5 text-[#138808]" />
                  <h3 className="text-[14px] font-bold text-[#0b1f5e] uppercase">Vision</h3>
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed text-justify">{data.vision}</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                  <Target className="w-5 h-5 text-[#FF9933]" />
                  <h3 className="text-[14px] font-bold text-[#0b1f5e] uppercase">Mission</h3>
                </div>
                 {Array.isArray(data.mission)
                   ? <ul className="list-disc space-y-2 pl-5 text-[13px] text-gray-600 leading-relaxed">{data.mission.map((item, index) => <li key={index}><ExpandableText text={item} /></li>)}</ul>
                   : <ExpandableText text={data.mission} lines={4} />}
              </div>
            </div>
          </section>

          <section className="order-3 grid gap-5 md:grid-cols-2 lg:col-span-2">
            {[["Program Educational Objectives", data.peo], ["Program Outcomes", data.po], ["Program Specific Outcomes", data.pso]].filter(([, items]) => items.length > 0).map(([title, items]) => <article key={title} className={title === "Program Specific Outcomes" ? "border border-gray-200 bg-white p-5 md:col-span-2" : "border border-gray-200 bg-white p-5"}>
              <h2 className="mb-3 text-[14px] font-bold uppercase tracking-wider text-[#0b1f5e]">{title}</h2>
              <ul className={`list-disc pl-5 text-[13px] leading-relaxed text-gray-600 ${title === "Program Specific Outcomes" ? "grid gap-x-8 gap-y-2 md:grid-cols-2" : "space-y-2"}`}>{items.map((item, index) => <li key={index}>{item}</li>)}</ul>
            </article>)}
          </section>

          <section className="order-4 overflow-hidden border border-gray-200 bg-white lg:col-span-2">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-[#0f172b] px-5 py-3 text-white"><BookMarked className="h-4 w-4 text-[#FF9933]" /><h2 className="text-[15px] font-bold uppercase tracking-wider">Subjects &amp; syllabus</h2></div>
            <div className="divide-y divide-gray-100">
              {databaseSubjects.length ? databaseSubjects.map((subject, index) => <article key={subject._id || index} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold text-[#0b1f5e]">{subject.name || missing}</h3><span className="text-xs text-gray-500">{subject.type?.length ? subject.type.join(" · ") : missing}</span></div>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{subject.description || missing}</p>
                <div className="mt-3 text-[13px] text-gray-600"><span className="font-semibold">Syllabus: </span>{subject.syllabus?.length ? <ul className="mt-1 list-disc space-y-1 pl-5">{subject.syllabus.map((unit, unitIndex) => <li key={unitIndex}>{unit}</li>)}</ul> : missing}</div>
              </article>) : <article className="p-5 text-[13px] text-gray-600">{missing}</article>}
            </div>
          </section>

          {/* Labs Section */}
          <section className="order-5 bg-white border border-gray-200 lg:col-span-2">
            <div className="bg-[#0f172b] text-white px-5 py-3 border-b border-gray-200 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-[#FF9933]" />
              <h2 className="text-[15px] font-bold uppercase tracking-wider">Laboratories & Facilities</h2>
            </div>
            <div className="grid md:grid-cols-2 divide-x divide-gray-200">
              {data.labs.map((lab, i) => (
                <div key={i} className={`p-5 border-b border-gray-200 ${i % 2 !== 0 ? "" : "md:border-r"}`}>
                  {lab.image && <img src={lab.image} alt={lab.name} loading="lazy" className="mb-3 h-36 w-full rounded-lg object-cover" />}
                  {lab.category && <span className="mb-1 inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700">{lab.category}</span>}
                  <h3 className="text-[14px] font-bold text-[#0b1f5e] mb-1.5">{lab.name}</h3>
                  <div className="text-[13px] text-gray-600 leading-relaxed"><ExpandableText text={lab.desc} lines={4} /></div>
                  <p className="mt-2 text-[12px] text-gray-500">Location: {lab.location || missing}</p>
                  <div className="mt-2 text-[12px] text-gray-500">Availability: {lab.availability ? [lab.availability.status, lab.availability.days?.join(", "), [lab.availability.openingTime, lab.availability.closingTime].filter(Boolean).join("–")].filter(Boolean).join(" · ") || missing : missing}</div>
                  <div className="mt-2 text-[12px] text-gray-600"><span className="font-semibold">Features: </span>{lab.features?.length ? <ul className="mt-1 list-disc space-y-1 pl-5">{lab.features.map((feature, featureIndex) => <li key={featureIndex}>{feature}</li>)}</ul> : missing}</div>
                  <p className="mt-2 text-[12px] text-gray-600">In charge: {lab.inCharge?.name || missing}{lab.inCharge?.designation ? ` · ${lab.inCharge.designation}` : ""}{lab.inCharge?.contact ? ` · ${lab.inCharge.contact}` : ""}</p>
                  <p className="mt-2 text-[12px] text-gray-600">Contact: {[lab.contact?.phone, lab.contact?.email, lab.contact?.additionalInfo].filter(Boolean).join(" · ") || missing}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Faculty Section (Table) */}
          <section className="order-6 bg-white border border-gray-200 overflow-hidden lg:col-span-2">
            <div className="bg-[#0f172b] text-white px-5 py-3 border-b border-gray-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FF9933]" />
              <h2 className="text-[15px] font-bold uppercase tracking-wider">Faculty Members</h2>
            </div>
            <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead className="bg-[#f6f3ea] text-[#0b1f5e] border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 font-semibold border-r border-gray-200 w-12">S.No.</th>
                  <th className="text-left p-3 font-semibold border-r border-gray-200">Name</th>
                  <th className="text-left p-3 font-semibold border-r border-gray-200">Designation</th>
                  <th className="text-left p-3 font-semibold">Office No.</th>
                </tr>
              </thead>
              <tbody>
                {data.faculty.map((f, i) => (
                  <tr key={i} className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-r border-gray-200 text-gray-500 font-medium">{i + 1}.</td>
                    <td className="p-3 border-r border-gray-200 font-medium text-[#0b1f5e]"><span className="flex items-center gap-3"><FacultyPhoto src={f.image} name={f.name} />{f.name}</span>{f.qualification?.length > 0 && <p className="mt-1 text-xs font-normal text-gray-500">{f.qualification.join(", ")}</p>}{f.bio && <p className="mt-1 max-w-sm text-xs font-normal text-gray-500">{f.bio}</p>}</td>
                    <td className="p-3 border-r border-gray-200 text-gray-700">{f.role}{f.specialization?.length > 0 && <p className="mt-1 text-xs text-gray-500">Specialization: {f.specialization.join(", ")}</p>}</td>
                  <td className="p-3 text-gray-700">{f.office || missing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </section>
        </main>

        {/* ----------- RIGHT SIDEBAR ----------- */}
        <aside className="order-2 space-y-6 lg:col-start-2 lg:row-start-1">
          
          {/* Contact Box */}
          <div className="bg-white border border-gray-200">
            <div className="bg-[#0f172b] text-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#FF9933]" />
              <h3 className="text-[14px] font-bold uppercase tracking-wider">Contact Info</h3>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <div className="flex items-start gap-3 text-gray-700">
                <Building2 className="w-4 h-4 text-[#FF9933] flex-shrink-0 mt-0.5" />
                <span>{missing}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-700">
                <Mail className="w-4 h-4 text-[#FF9933] flex-shrink-0 mt-0.5" />
                <span>{missing}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 p-4">
              <button onClick={() => onNavigate("home")} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0f172b] text-white text-[13px] font-semibold hover:bg-[#FF9933] hover:text-[#0b1f5e] transition-colors uppercase tracking-wider">
                Back to Home <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
