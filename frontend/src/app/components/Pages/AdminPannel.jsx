import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity, BookOpen, Building2, CalendarDays, ChevronRight, CircleHelp,
  FileUp, LayoutDashboard, LogOut, Menu, Plus, RefreshCw, Search,
  ShieldCheck, Trash2, UserRound, Users, X,
} from "lucide-react";
import api from "../../../services/api";
import { changeAdminPassword, logoutAdmin } from "../../../services/authService";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "admins", label: "Admins", icon: ShieldCheck, superOnly: true },
  { id: "departments", label: "Departments", icon: Building2 },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "faculties", label: "Faculties", icon: Users },
  { id: "facilities", label: "Facilities", icon: Building2 },
  { id: "subjects", label: "Subjects", icon: BookOpen },
  { id: "aboutUs", label: "About Us", icon: CircleHelp },
  { id: "faqs", label: "FAQs", icon: CircleHelp },
  { id: "uploads", label: "Uploads", icon: FileUp },
];

const EMPTY = {
  admins: [], departments: [], events: [], faculties: [], facilities: [],
  subjects: [], aboutUs: [], faqs: [], uploads: [],
};

const LABELS = {
  admins: "Admins", departments: "Departments", events: "Events",
  faculties: "Faculties", facilities: "Facilities", subjects: "Subjects",
  aboutUs: "About Us", faqs: "FAQs", uploads: "Uploads",
};

const CONFIG = {
  admins: {
    endpoint: "/admin",
    create: "/admin/create",
    update: (id) => `/admin/update/${id}`,
    remove: (id) => `/admin/delete/${id}`,
    fields: [
      ["username", "Username", "text", true], ["name", "Full name", "text", true],
      ["designation", "Designation", "text", true], ["department", "Department", "text", true],
      ["role", "Role", "select", true], ["password", "Temporary password", "password", true],
    ],
  },
  departments: {
    endpoint: "/department", create: "/department", remove: (id) => `/department/${id}`,
    update: (id) => `/department/${id}`,
    fields: [
      ["name", "Department name", "text", true], ["code", "Code", "text", true],
      ["description", "Description", "textarea"], ["established", "Established year", "number"],
      ["intake", "Intake", "number"], ["vision", "Vision", "textarea"],
      ["mission", "Mission (one item per line)", "list"], ["peo", "PEOs (one item per line)", "list"],
      ["po", "POs (one item per line)", "list"], ["pso", "PSOs (one item per line)", "list"],
      ["headOfDepartment", "Head of department (faculty name or ID)", "text"],
    ],
  },
  events: {
    endpoint: "/events", create: "/events", remove: (id) => `/events/${id}`,
    update: (id) => `/events/${id}`,
    fields: [
      ["title", "Title", "text", true], ["description", "Description", "textarea", true],
      ["date", "Date", "date", true], ["time", "Time", "text", true],
      ["venue", "Venue", "text", true],
    ],
  },
  faculties: {
    endpoint: "/faculty", create: "/faculty/create", remove: (id) => `/faculty/delete/${id}`,
    update: (id) => `/faculty/update/${id}`,
    fields: [
      ["name", "Full name", "text", true], ["department", "Department code or name", "text", true],
      ["designation", "Designation", "text", true], ["qualification", "Qualifications (one per line)", "list"],
      ["specialization", "Specialization (one per line)", "list"], ["phone", "Phone", "text"],
      ["office", "Office", "text"], ["profileImage", "Profile image URL", "url"],
      ["bio", "Biography", "textarea"], ["joiningYear", "Joining year", "number"],
    ],
  },
  facilities: {
    endpoint: "/facility", create: "/facility/create",
    update: (id) => `/facility/update/${id}`,
    remove: (id) => `/facility/delete/${id}`,
    fields: [
      ["name", "Facility name", "text", true], ["category", "Category", "text", true],
      ["description", "Description", "textarea"], ["department", "Department code or name", "text"],
      ["locationType", "Location type", "select", true], ["locationPlace", "Location", "text", true],
      ["locationFloor", "Floor", "text"], ["locationRoom", "Room", "text"],
      ["availabilityStatus", "Availability", "select"], ["availabilityDays", "Available days (one per line)", "list"],
      ["openingTime", "Opening time", "text"], ["closingTime", "Closing time", "text"],
      ["contactPhone", "Contact phone", "text"], ["contactEmail", "Contact email", "email"],
      ["contactAdditionalInfo", "Additional contact information", "text"],
      ["features", "Features (one per line)", "list"], ["images", "Image URLs (one per line)", "list"],
      ["inChargeName", "In-charge name", "text"], ["inChargeDesignation", "In-charge designation", "text"],
      ["inChargeContact", "In-charge contact", "text"],
    ],
  },
  subjects: {
    endpoint: "/subject", create: "/subject/create",
    update: (id) => `/subject/update/${id}`,
    remove: (id) => `/subject/delete/${id}`,
    fields: [
      ["name", "Subject name", "text", true], ["departments", "Departments (one per line; blank means all)", "list"],
      ["type", "Subject types (one per line)", "list"], ["description", "Description", "textarea"],
      ["syllabus", "Syllabus units (one per line)", "list"],
    ],
  },
  aboutUs: {
    endpoint: "/about", update: (id) => `/about/update/${id}`,
    fields: [
      ["history", "College history", "textarea", true], ["vision", "Vision", "textarea", true],
      ["mission", "Mission", "textarea", true], ["principalMessage", "Principal message", "textarea", true],
      ["principal", "Principal faculty ID", "text", true], ["achievements", "Achievements (JSON array)", "json"],
    ],
  },
  faqs: {
    fields: [["question", "Question", "text", true], ["answer", "Answer", "textarea", true]],
  },
  uploads: {
    endpoint: "/uploads", create: "/uploads", remove: (id) => `/uploads/${id}`,
    fields: [
      ["fileName", "Display name", "text", true], ["fileUrl", "File URL", "url", true],
      ["fileType", "File type", "text", true], ["uploadedBy", "Uploaded by", "text", true],
    ],
  },
};

const asArray = (response) => {
  const data = response?.data?.data ?? response?.data ?? [];
  return Array.isArray(data) ? data : [];
};

const getId = (item) => item?._id || item?.id;
const cacheDepartment = (department) => {
  if (!department || !getId(department)) return;
  try {
    const cached = JSON.parse(localStorage.getItem("gpm-admin-departments") || "[]");
    const list = Array.isArray(cached) ? cached : [];
    localStorage.setItem("gpm-admin-departments", JSON.stringify([
      department,
      ...list.filter((item) => String(getId(item)) !== String(getId(department))),
    ]));
  } catch { localStorage.setItem("gpm-admin-departments", JSON.stringify([department])); }
};

const initialForm = (section, record) => {
  let source = record || {};
  if (section === "facilities" && record) {
    source = {
      ...record,
      department: record.department?.code || record.department?.name || record.department || "",
      locationType: record.location?.type || "", locationPlace: record.location?.place || "",
      locationFloor: record.location?.floor || "", locationRoom: record.location?.room || "",
      availabilityStatus: record.availability?.status || "",
      availabilityDays: record.availability?.days || [],
      openingTime: record.availability?.openingTime || "", closingTime: record.availability?.closingTime || "",
      contactPhone: record.contact?.phone || "", contactEmail: record.contact?.email || "",
      contactAdditionalInfo: record.contact?.additionalInfo || "",
      inChargeName: record.inCharge?.name || "", inChargeDesignation: record.inCharge?.designation || "",
      inChargeContact: record.inCharge?.contact || "",
    };
  }
  if (section === "aboutUs" && record) {
    source = {
      ...record,
      principal: record.principal?._id || record.principal || "",
      achievements: JSON.stringify(record.achievements || [], null, 2),
    };
  }
  const result = {};
  CONFIG[section].fields.forEach(([key]) => {
    if (section === "admins" && record && key === "password") {
      result[key] = "";
      return;
    }
    let value = source?.[key];
    if (["department", "principal", "headOfDepartment"].includes(key) && value && typeof value === "object") value = value._id || value.code || value.name || "";
    if (Array.isArray(value)) {
      result[key] = value.map((entry) => typeof entry === "string" ? entry : entry.description || "").join("\n");
    } else if (key === "date" && value) {
      result[key] = new Date(value).toISOString().slice(0, 10);
    } else {
      result[key] = value ?? "";
    }
  });
  return result;
};

const makePayload = (section, form, profile) => {
  const payload = { ...form };
  CONFIG[section].fields.forEach(([key, , type]) => {
    if (type === "number") payload[key] = payload[key] === "" ? undefined : Number(payload[key]);
    if (type === "list") {
      const list = String(payload[key] || "").split("\n").map((item) => item.trim()).filter(Boolean);
      payload[key] = ["mission", "peo", "po", "pso"].includes(key)
        ? list.map((description) => ({ description }))
        : list;
    }
    if (type === "json") {
      try {
        payload[key] = payload[key] ? JSON.parse(payload[key]) : [];
      } catch {
        throw new Error(`${key} must contain valid JSON.`);
      }
    }
  });
  if (section === "facilities") {
    payload.location = { type: payload.locationType, place: payload.locationPlace, floor: payload.locationFloor, room: payload.locationRoom };
    payload.availability = { status: payload.availabilityStatus || "Available", days: payload.availabilityDays, openingTime: payload.openingTime, closingTime: payload.closingTime };
    payload.contact = { phone: payload.contactPhone, email: payload.contactEmail, additionalInfo: payload.contactAdditionalInfo };
    payload.inCharge = { name: payload.inChargeName, designation: payload.inChargeDesignation, contact: payload.inChargeContact };
    ["locationType", "locationPlace", "locationFloor", "locationRoom", "availabilityStatus", "availabilityDays", "openingTime", "closingTime", "contactPhone", "contactEmail", "contactAdditionalInfo", "inChargeName", "inChargeDesignation", "inChargeContact"].forEach((key) => delete payload[key]);
  }
  if (section === "uploads" && !payload.uploadedBy) payload.uploadedBy = profile.username;
  return payload;
};

const formatValue = (section, key, value) => {
  if (key === "password") return "••••••••";
  if (Array.isArray(value)) return value.map((item) => {
    if (typeof item === "string") return item;
    if (item?.title) return `${item.title}${item.year ? ` (${item.year})` : ""}`;
    return item?.description || "";
  }).filter(Boolean).join(", ") || "—";
  if (value && typeof value === "object") {
    if (value.name) return value.code ? `${value.name} (${value.code})` : value.name;
    return Object.values(value).filter((item) => typeof item === "string").join(" · ") || "—";
  }
  if (key === "date" && value) return new Date(value).toLocaleDateString();
  if (key === "role" && section === "admins") return value === "super_admin" ? "Super Admin" : "Admin";
  return value === undefined || value === null || value === "" ? "—" : String(value);
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ id: "", username: "", role: "" });
  const [profileForm, setProfileForm] = useState({ name: "", email: "", designation: "", department: "", phone: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ type: "", text: "" });
  const [active, setActive] = useState("dashboard");
  const [records, setRecords] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [mobileNav, setMobileNav] = useState(false);

  const isSuper = profile.role === "super_admin";

  const loadAll = useCallback(async () => {
    setError("");
    const response = await api.get("/auth/me");
    const current = response.data?.data;
    if (!current?.role || !["admin", "super_admin"].includes(current.role)) {
      throw new Error("This account does not have an administrator role.");
    }
    if (window.location.pathname === "/super-admin" && current.role !== "super_admin") {
      navigate("/admin", { replace: true });
    } else if (window.location.pathname === "/admin" && current.role === "super_admin") {
      navigate("/super-admin", { replace: true });
    }
    setProfile({ id: current.id || "", username: current.username || "Administrator", role: current.role });
    const profileKey = `gpm-admin-profile-${current.id || current.username}`;
    let savedProfile = {};
    try {
      savedProfile = JSON.parse(localStorage.getItem(profileKey) || "{}");
    } catch {
      localStorage.removeItem(profileKey);
    }
    setProfileForm({
      name: savedProfile.name || current.name || "",
      email: savedProfile.email || current.email || "",
      designation: current.designation || "",
      department: savedProfile.department || current.department || "",
      phone: savedProfile.phone || "",
    });
    const urls = {
      events: "/events", faculties: "/faculty", facilities: "/facility",
      subjects: "/subject", aboutUs: "/about", uploads: "/uploads",
    };
    if (current.role === "super_admin") urls.departments = "/department";
    if (current.role === "super_admin") urls.admins = "/admin";
    const results = await Promise.allSettled(Object.entries(urls).map(async ([key, url]) => {
      const response = await api.get(url);
      if (key === "aboutUs") {
        const data = response.data?.data;
        return [key, data ? [data] : []];
      }
      return [key, asArray(response)];
    }));
    let savedFaqs = [];
    try {
      const parsedFaqs = JSON.parse(localStorage.getItem("gpm-faqs") || "[]");
      if (Array.isArray(parsedFaqs)) savedFaqs = parsedFaqs;
    } catch {
      localStorage.removeItem("gpm-faqs");
    }
    const next = { ...EMPTY, faqs: savedFaqs };
    const failures = [];
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        const [key, data] = result.value;
        next[key] = data;
      } else {
        failures.push(`${Object.keys(urls)[index]}: ${result.reason?.response?.data?.message || result.reason?.message || "could not load"}`);
      }
    });
    const linkedDepartments = [...next.faculties, ...next.facilities].map((item) => item.department).filter(Boolean);
    const departmentInputs = [
      ...linkedDepartments.flatMap((item) => typeof item === "object" ? [item.code, item.name] : [item]),
      ...next.subjects.flatMap((item) => Array.isArray(item.departments) ? item.departments : []),
      ...next.admins.map((item) => item.department),
      current.department,
    ].map((item) => String(item || "").trim()).filter(Boolean);
    const departmentLookups = [...new Set(departmentInputs)].map(async (input) => {
      const response = await api.get(`/department/find/${encodeURIComponent(input)}`);
      return response.data?.data;
    });
    const departmentLookupResults = await Promise.allSettled(departmentLookups);
    const departmentRecords = [
      ...linkedDepartments.filter((item) => typeof item === "object" && (item._id || item.id || item.code)),
      ...departmentLookupResults.filter((result) => result.status === "fulfilled" && result.value).map((result) => result.value),
    ];
    const departmentsById = new Map(departmentRecords.map((item) => [String(item._id || item.id || item.code), item]));
    try {
      const cached = JSON.parse(localStorage.getItem("gpm-admin-departments") || "[]");
      if (Array.isArray(cached)) cached.forEach((item) => departmentsById.set(String(item._id || item.id || item.code), item));
    } catch { localStorage.removeItem("gpm-admin-departments"); }
    if (current.role === "super_admin" && next.departments.length) {
      localStorage.setItem("gpm-admin-departments", JSON.stringify(next.departments));
    }
    if (current.role !== "super_admin" || !next.departments.length) next.departments = [...departmentsById.values()];
    if (current.role !== "super_admin") {
      failures.splice(0, failures.length, ...failures.filter((message) => !message.startsWith("departments:")));
    }
    setRecords(next);
    if (failures.length) setError(failures.join(" · "));
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadAll().catch((err) => {
      logoutAdmin();
      setError(err.response?.data?.message || err.message || "Please sign in again.");
      setLoading(false);
      navigate("/login", { replace: true });
    });
  }, [loadAll, navigate]);

  useEffect(() => {
    if (!loading && profile.role && active === "admins" && !isSuper) setActive("dashboard");
  }, [active, isSuper, loading, profile.role]);

  const visibleNav = NAV.filter((item) => !item.superOnly || isSuper);
  const filtered = useMemo(() => {
    const list = records[active] || [];
    const query = search.trim().toLowerCase();
    if (!query) return list;
    return list.filter((item) => JSON.stringify(item).toLowerCase().includes(query));
  }, [active, records, search]);

  const openCreate = () => {
    if (!CONFIG[active].create) return;
    setForm(initialForm(active));
    setModal({ section: active, record: null });
    setNotice("");
  };

  const openEdit = (record) => {
    setForm(initialForm(active, record));
    setModal({ section: active, record });
    setNotice("");
  };

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const payload = makePayload(modal.section, form, profile);
      if (modal.section === "faqs") {
        const faqList = [...records.faqs];
        if (modal.record) {
          const index = faqList.findIndex((item) => getId(item) === getId(modal.record));
          faqList[index] = { ...modal.record, ...payload };
        } else faqList.unshift({ ...payload, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
        localStorage.setItem("gpm-faqs", JSON.stringify(faqList));
        setRecords((previous) => ({ ...previous, faqs: faqList }));
      } else if (modal.record) {
        if (modal.section === "admins") delete payload.password;
        if (modal.section === "facilities") {
          const oldDepartment = modal.record.department?.code || modal.record.department?.name || modal.record.department || "";
          if (String(payload.department || "") === String(oldDepartment)) delete payload.department;
        }
        const response = await api.put(CONFIG[modal.section].update(getId(modal.record)), payload);
        if (modal.section === "departments") cacheDepartment(response.data?.data);
        await loadAll();
      } else {
        const response = await api.post(CONFIG[modal.section].create, payload);
        if (modal.section === "departments") cacheDepartment(response.data?.data);
        await loadAll();
      }
      setModal(null);
      setNotice(`${LABELS[modal.section].slice(0, -1)} saved.`);
    } catch (err) {
      setNotice(err.response?.data?.message || err.message || "Could not save this record.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (record) => {
    if (!window.confirm(`Delete this ${LABELS[active].toLowerCase().replace(/s$/, "")} record?`)) return;
    setBusy(true);
    setNotice("");
    try {
      if (active === "faqs") {
        const faqList = records.faqs.filter((item) => getId(item) !== getId(record));
        localStorage.setItem("gpm-faqs", JSON.stringify(faqList));
        setRecords((previous) => ({ ...previous, faqs: faqList }));
      } else {
        await api.delete(CONFIG[active].remove(getId(record)));
        if (active === "departments") {
          const cached = records.departments.filter((item) => String(getId(item)) !== String(getId(record)));
          localStorage.setItem("gpm-admin-departments", JSON.stringify(cached));
        }
        await loadAll();
      }
      setNotice("Record deleted.");
    } catch (err) {
      setNotice(err.response?.data?.message || err.message || "Could not delete this record.");
    } finally {
      setBusy(false);
    }
  };

  const signOut = () => {
    logoutAdmin();
    navigate("/login", { replace: true });
  };

  const saveProfile = (event) => {
    event.preventDefault();
    setProfileSaving(true);
    try {
      const profileKey = `gpm-admin-profile-${profile.id || profile.username}`;
      localStorage.setItem(profileKey, JSON.stringify({
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        department: profileForm.department.trim(),
        phone: profileForm.phone.trim(),
      }));
      setNotice("Profile details saved in this browser.");
    } catch {
      setNotice("Could not save profile details in this browser.");
    } finally {
      setProfileSaving(false);
    }
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    setPasswordStatus({ type: "", text: "" });
    if (passwordForm.next.length < 8) {
      setPasswordStatus({ type: "error", text: "Use at least 8 characters for the new password." });
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordStatus({ type: "error", text: "The new passwords do not match." });
      return;
    }
    setPasswordSaving(true);
    try {
      await changeAdminPassword(passwordForm.current, passwordForm.next);
      setPasswordForm({ current: "", next: "", confirm: "" });
      setPasswordStatus({ type: "success", text: "Password updated successfully." });
    } catch (err) {
      setPasswordStatus({
        type: "error",
        text: err.response?.data?.message || "Could not update password. Check your current password and try again.",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  const selectSection = (id) => {
    setActive(id);
    setSearch("");
    setNotice("");
    setMobileNav(false);
  };

  if (loading) return <div className="min-h-screen grid place-items-center bg-[#f4f6fa] text-slate-600">Loading your secure workspace…</div>;

  const title = active === "dashboard" ? "Dashboard" : LABELS[active];
  const stats = [
    ["Departments", records.departments.length, Building2],
    ["Events", records.events.length, CalendarDays],
    ["Faculty", records.faculties.length, Users],
    ["Uploads", records.uploads.length, FileUp],
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-800 md:flex">
      {mobileNav && <button aria-label="Close menu" onClick={() => setMobileNav(false)} className="fixed inset-0 z-30 bg-slate-950/40 md:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col bg-[#101a30] text-white transition-transform md:static md:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[82px] items-center gap-3 border-b border-white/10 px-6">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 text-slate-950"><BookOpen size={21} /></div>
          <div><p className="font-bold tracking-wide">GPM BUDDY</p><p className="text-[11px] text-slate-400">Administration</p></div>
          <button aria-label="Close navigation" onClick={() => setMobileNav(false)} className="ml-auto md:hidden"><X size={18} /></button>
        </div>
        <div className="px-4 pt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</div>
        <nav className="custom-scroll flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {visibleNav.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => selectSection(id)} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[13px] font-semibold transition ${active === id ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-950/10" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
              <Icon size={17} /><span>{label}</span>{id === "admins" && <span className="ml-auto rounded-full bg-slate-900/10 px-2 py-0.5 text-[9px] uppercase">Root</span>}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button onClick={() => selectSection("profile")} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[13px] font-semibold ${active === "profile" ? "bg-white/10 text-amber-300" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
            <UserRound size={17} /><span>Profile</span>
          </button>
          <button onClick={signOut} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[13px] font-semibold text-slate-300 hover:bg-red-400/10 hover:text-red-300">
            <LogOut size={17} /><span>Log out</span>
          </button>
        </div>
        <div className="border-t border-white/10 px-6 py-4 text-[11px] text-slate-500">Government Polytechnic · Muzaffarpur</div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[82px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3"><button aria-label="Open navigation" onClick={() => setMobileNav(true)} className="rounded-lg p-2 hover:bg-slate-100 md:hidden"><Menu size={20} /></button><div><p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">GPM Buddy / {active === "profile" ? "Account" : title}</p><h1 className="text-lg font-extrabold text-[#12203a]">{active === "profile" ? "Your profile" : title}</h1></div></div>
          <div className="flex items-center gap-3"><span className="hidden text-right sm:block"><b className="block text-[12px]">{profile.username}</b><small className="text-[10px] uppercase tracking-wide text-slate-400">{isSuper ? "Super Admin" : "Admin"}</small></span><div className="grid h-10 w-10 place-items-center rounded-full bg-[#12203a] font-bold text-amber-300">{profile.username?.[0]?.toUpperCase() || "A"}</div></div>
        </header>

        <div className="mx-auto max-w-[1480px] space-y-6 p-4 sm:p-8">
          {error && <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-900"><span>{error}</span><button aria-label="Dismiss" onClick={() => setError("")}><X size={16} /></button></div>}
          {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] text-emerald-800">{notice}</div>}

          {active === "dashboard" && <>
            <section className="overflow-hidden rounded-2xl bg-[#142342] p-6 text-white sm:p-8"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300"><Activity size={15} /> Control center</p><h2 className="max-w-xl text-2xl font-extrabold sm:text-3xl">Welcome back, {profile.username}.</h2><p className="mt-2 max-w-xl text-[13px] leading-6 text-slate-300">Manage campus information and keep the GPM Buddy portal up to date.</p></div><button onClick={() => loadAll().catch((err) => setError(err.message))} className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 px-4 py-2.5 text-[12px] font-semibold hover:bg-white/10 sm:self-auto"><RefreshCw size={15} /> Refresh data</button></div></section>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value, Icon]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</span><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600"><Icon size={19} /></span></div><p className="mt-4 text-3xl font-extrabold text-[#12203a]">{value}</p></div>)}</section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-4"><h3 className="font-bold text-[#12203a]">Management</h3><p className="mt-1 text-[12px] text-slate-500">Open a section to review or update its records.</p></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{visibleNav.filter((item) => item.id !== "dashboard").map(({ id, label, icon: Icon }) => <button key={id} onClick={() => selectSection(id)} className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left hover:border-amber-300 hover:bg-amber-50/40"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-[#142342] group-hover:bg-amber-100"><Icon size={18} /></span><span className="min-w-0 flex-1"><b className="block text-[13px]">{label}</b><small className="text-[11px] text-slate-500">{id === "faqs" ? "Saved in this browser" : `${records[id]?.length || 0} records`}</small></span><ChevronRight size={16} className="text-slate-400" /></button>)}</div></section>
          </>}

          {active === "profile" && <div className="grid max-w-5xl gap-5 xl:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600"><UserRound /></div><div><h2 className="font-bold">Profile details</h2><p className="text-[12px] text-slate-500">Add your contact and work information.</p></div></div>
              <form onSubmit={saveProfile} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <ProfileInput label="Full name" value={profileForm.name} onChange={(value) => setProfileForm((previous) => ({ ...previous, name: value }))} />
                  <ProfileInput label="Email" type="email" value={profileForm.email} onChange={(value) => setProfileForm((previous) => ({ ...previous, email: value }))} />
                  {profile.role === "admin" && <ProfileItem label="Designation" value={profileForm.designation || "Set by Super Admin"} />}
                  <ProfileInput label="Department" value={profileForm.department} onChange={(value) => setProfileForm((previous) => ({ ...previous, department: value }))} />
                  <ProfileInput label="Contact number" type="tel" value={profileForm.phone} onChange={(value) => setProfileForm((previous) => ({ ...previous, phone: value }))} />
                </div>
                <div className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2"><ProfileItem label="Username" value={profile.username} /><ProfileItem label="Role" value={isSuper ? "Super Admin" : "Admin"} /></div>
                <p className="text-[11px] leading-5 text-slate-500">Name, email, department, and contact number are saved in this browser. {profile.role === "admin" ? "Your designation is managed by the Super Admin." : ""} The backend has no profile update or email field.</p>
                <button type="submit" disabled={profileSaving} className="rounded-xl bg-[#142342] px-4 py-2.5 text-[12px] font-bold text-white hover:bg-[#20365e] disabled:opacity-60">{profileSaving ? "Saving…" : "Save profile details"}</button>
              </form>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6"><h2 className="font-bold">Reset password</h2><p className="mt-1 text-[12px] text-slate-500">Verify your current password and choose a new one.</p></div>
              <form onSubmit={updatePassword} className="space-y-4">
                <PasswordField label="Current password" value={passwordForm.current} autoComplete="current-password" onChange={(value) => setPasswordForm((previous) => ({ ...previous, current: value }))} />
                <PasswordField label="New password" value={passwordForm.next} autoComplete="new-password" onChange={(value) => setPasswordForm((previous) => ({ ...previous, next: value }))} />
                <PasswordField label="Confirm new password" value={passwordForm.confirm} autoComplete="new-password" onChange={(value) => setPasswordForm((previous) => ({ ...previous, confirm: value }))} />
                {passwordStatus.text && <p role={passwordStatus.type === "error" ? "alert" : "status"} className={`rounded-xl px-3.5 py-3 text-[12px] ${passwordStatus.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{passwordStatus.text}</p>}
                <button type="submit" disabled={passwordSaving} className="rounded-xl bg-[#142342] px-4 py-2.5 text-[12px] font-bold text-white hover:bg-[#20365e] disabled:opacity-60">{passwordSaving ? "Updating…" : "Update password"}</button>
              </form>
            </section>

          </div>}

          {active !== "dashboard" && active !== "profile" && <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h2 className="text-lg font-extrabold text-[#12203a]">{active === "faqs" ? "Frequently asked questions" : `${LABELS[active]} management`}</h2><p className="mt-1 text-[12px] text-slate-500">{active === "faqs" ? "FAQ records are stored in this browser because the backend has no FAQ API." : active === "uploads" ? "Manage file metadata and URLs. The backend does not receive file contents." : active === "admins" ? "Create and manage Admin and Super Admin accounts." : active === "aboutUs" ? "Edit the existing About Us content. The backend create route is unavailable." : active === "departments" && !isSuper ? "The backend restricts the full department list to Super Admin. Admins can use the list after a Super Admin loads it once in this browser; department creation and updates use the authenticated routes." : `Create, update, and remove ${LABELS[active].toLowerCase()} records.`}</p></div><div className="flex gap-2"><button onClick={() => loadAll().catch((err) => setError(err.message))} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-[12px] font-semibold hover:bg-slate-50"><RefreshCw size={15} /> Refresh</button>{CONFIG[active].create && <button onClick={openCreate} disabled={busy || (active === "admins" && !isSuper)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#142342] px-4 text-[12px] font-bold text-white hover:bg-[#20365e] disabled:opacity-50"><Plus size={16} /> {active === "admins" ? "Add account" : `Add ${active === "faqs" ? "FAQ" : active === "faculties" ? "Faculty" : active === "facilities" ? "Facility" : active.slice(0, -1)}`}</button>}</div></div>
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3 sm:px-6"><Search size={16} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${LABELS[active].toLowerCase()}…`} className="w-full bg-transparent text-[13px] outline-none placeholder:text-slate-400" /></div>
            <div className="overflow-x-auto">
              {filtered.length === 0 ? <div className="p-12 text-center"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400"><BookOpen size={20} /></div><p className="text-[13px] font-semibold text-slate-700">No {LABELS[active].toLowerCase()} found</p><p className="mt-1 text-[11px] text-slate-500">{active === "aboutUs" ? "No About Us record is available to edit." : active === "departments" && !isSuper && records.departments.length === 0 ? "Sign in as Super Admin, open Departments, and select Refresh once in this browser. Then return to this Admin panel and select Refresh." : "Add a record or change the search term."}</p></div> : <table className="w-full min-w-[680px] text-left text-[12px]"><thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3 sm:px-6">Record</th><th className="px-4 py-3">Details</th><th className="px-4 py-3">Updated</th><th className="px-5 py-3 text-right sm:px-6">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((record, index) => <RecordRow key={getId(record) || index} section={active} record={record} currentAdminId={profile.id} onEdit={() => openEdit(record)} onDelete={() => remove(record)} busy={busy} />)}</tbody></table>}
            </div>
            <div className="border-t border-slate-100 px-5 py-3 text-[11px] text-slate-500 sm:px-6">Showing {filtered.length} of {records[active]?.length || 0} records</div>
          </section>}
        </div>
      </main>

      {modal && <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) setModal(null); }}><form onSubmit={save} className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6"><div><h2 className="font-extrabold text-[#12203a]">Edit {modal.section === "faqs" ? "FAQ" : modal.section === "faculties" ? "Faculty" : modal.section === "facilities" ? "Facility" : modal.section === "aboutUs" ? "About Us" : modal.section.slice(0, -1)}</h2><p className="mt-1 text-[11px] text-slate-500">Fields marked required must be completed.</p></div><button type="button" onClick={() => setModal(null)} disabled={busy} aria-label="Close dialog" className="rounded-lg p-2 hover:bg-slate-100"><X size={18} /></button></div><div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">{CONFIG[modal.section].fields.map(([key, label, type, required]) => { if (modal.section === "admins" && modal.record && key === "password") return null; const large = ["textarea", "list", "json"].includes(type); const selectOptions = key === "role" ? [["admin", "Admin"], ["super_admin", "Super Admin"]] : key === "locationType" ? [["Campus", "Campus"], ["Off-Campus", "Off-Campus"]] : [["Available", "Available"], ["Temporarily Closed", "Temporarily Closed"], ["Under Maintenance", "Under Maintenance"]]; return <label key={key} className={large ? "sm:col-span-2" : ""}><span className="mb-1.5 block text-[11px] font-bold text-slate-600">{label}{required && <em className="ml-1 not-italic text-red-500">*</em>}</span>{large ? <textarea rows={type === "list" ? 3 : type === "json" ? 7 : 4} required={required} value={form[key] ?? ""} onChange={(event) => setForm((previous) => ({ ...previous, [key]: event.target.value }))} className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-[13px] outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" /> : type === "select" ? <select required={required} value={form[key] ?? ""} onChange={(event) => setForm((previous) => ({ ...previous, [key]: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"><option value="" disabled>Select {label.toLowerCase()}</option>{selectOptions.map(([value, optionLabel]) => <option key={value} value={value}>{optionLabel}</option>)}</select> : <input type={type} required={required} min={type === "number" ? 1900 : undefined} value={form[key] ?? ""} onChange={(event) => setForm((previous) => ({ ...previous, [key]: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-[13px] outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />}</label>; })}</div><div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4 sm:px-6"><button type="button" onClick={() => setModal(null)} disabled={busy} className="rounded-xl border border-slate-200 px-4 py-2.5 text-[12px] font-bold hover:bg-slate-50">Cancel</button><button type="submit" disabled={busy} className="rounded-xl bg-[#142342] px-5 py-2.5 text-[12px] font-bold text-white hover:bg-[#20365e] disabled:opacity-60">{busy ? "Saving…" : "Save record"}</button></div></form></div>}
    </div>
  );
}

function RecordRow({ section, record, currentAdminId, onEdit, onDelete, busy }) {
  const titleKey = { admins: "username", departments: "name", events: "title", faculties: "name", facilities: "name", subjects: "name", aboutUs: "history", faqs: "question", uploads: "fileName" }[section];
  const detailKeys = {
    admins: ["name", "designation", "role"], departments: ["code", "established", "intake"],
    events: ["date", "time", "venue"], faculties: ["designation", "department", "phone"],
    facilities: ["category", "department", "location", "availability"], subjects: ["departments", "type", "description"],
    aboutUs: ["vision", "mission", "principalMessage"],
    faqs: ["answer"], uploads: ["fileType", "uploadedBy", "fileUrl"],
  }[section];
  const stamp = record.updatedAt || record.createdAt;
  const isCurrentAdmin = section === "admins" && String(getId(record)) === String(currentAdminId);
  return <tr className="align-top hover:bg-slate-50/70"><td className="max-w-[260px] px-5 py-4 sm:px-6"><b className="block truncate text-slate-800">{section === "aboutUs" ? "About Us content" : formatValue(section, titleKey, record[titleKey])}</b>{section === "uploads" && record.fileUrl && <a href={record.fileUrl} target="_blank" rel="noreferrer" className="mt-1 block truncate text-[10px] text-blue-600 hover:underline">Open file</a>}</td><td className="max-w-[360px] px-4 py-4 text-slate-600"><div className="flex flex-wrap gap-x-4 gap-y-1">{detailKeys.map((key) => <span key={key} className="max-w-[240px] truncate"><span className="text-slate-400">{key === "role" ? "Role" : key === "fileUrl" ? "URL" : key}:</span> {formatValue(section, key, record[key])}</span>)}</div></td><td className="whitespace-nowrap px-4 py-4 text-slate-500">{stamp ? new Date(stamp).toLocaleDateString() : "—"}</td><td className="whitespace-nowrap px-5 py-4 text-right sm:px-6"><button onClick={onEdit} disabled={busy} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold hover:bg-white disabled:opacity-50">Edit</button>{section !== "aboutUs" && <button onClick={onDelete} disabled={busy || isCurrentAdmin} title={isCurrentAdmin ? "You cannot delete your own account" : "Delete record"} className="ml-2 inline-flex items-center gap-1 rounded-lg border border-red-100 px-3 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-50 disabled:opacity-40"><Trash2 size={13} /> Delete</button>}</td></tr>;
}

function ProfileItem({ label, value }) {
  return <div className="rounded-xl bg-slate-50 px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-[13px] font-semibold text-slate-800">{value}</p></div>;
}

function ProfileInput({ label, type = "text", value, onChange }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-bold text-slate-600">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-[13px] outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" /></label>;
}

function PasswordField({ label, value, autoComplete, onChange }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-bold text-slate-600">{label}</span><input type="password" required value={value} autoComplete={autoComplete} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-[13px] outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" /></label>;
}
