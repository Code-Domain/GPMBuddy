import api from "./api";

/*
|--------------------------------------------------------------------------
| Admin Login
|--------------------------------------------------------------------------
|
| Sends:
|
| {
|   username,
|   password,
|   role
| }
|
| to:
|
| POST /api/auth/login
|
| Backend response:
|
| {
|   success: true,
|   message: "Login successful",
|   data: {
|     token: "...",
|     admin: {
|       id: "...",
|       username: "...",
|       role: "admin"
|     }
|   }
| }
|
*/

export const loginAdmin = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Current Admin
|--------------------------------------------------------------------------
|
| This will be useful for /auth/me later.
|
*/

export const getCurrentAdmin = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
|
| Sends:
|
| {
|   currentPassword,
|   newPassword
| }
|
*/

export const changeAdminPassword = async (
  currentPassword,
  newPassword
) => {
  const response = await api.put("/auth/change-password", {
    currentPassword,
    newPassword,
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
|
| Your current authentication design uses stateless JWT.
|
| Therefore logout on the frontend means removing the stored token.
|
*/

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminData");
};
