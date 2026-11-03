const departmentAliases = {
  "civil engineering": "civil",
  "computer science and engineering": "cse",
  cse: "cse",
  "electrical engineering": "electrical",
  "electronics engineering": "electronics",
  "mechanical engineering": "mechanical",
  "chemistry applied sciences": "chemistry",
  "chemistry (applied sciences)": "chemistry",
  chemistry: "chemistry",
  "physics applied sciences": "physics",
  "physics (applied sciences)": "physics",
  physics: "physics",
  "humanities and management": "humanities",
  "humanities & management": "humanities",
  humanities: "humanities",
  "leather technology": "leather",
};

export const departmentRouteId = (department) => {
  const name = typeof department === "string" ? department : department?.name || "";
  const normalized = name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();
  const suffix = departmentAliases[normalized] || normalized
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `dept-${suffix}`;
};

export const unwrapApiData = (response) => response?.data?.data ?? null;

export const getFacultyImageUrl = (faculty, baseUrl = "/api") => {
  const id = faculty?._id || faculty?.id;
  if (!id || !faculty?.profileImage?.contentType) return "";
  return `${baseUrl}/faculty/id/${id}/image`;
};
