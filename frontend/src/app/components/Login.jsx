import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const onNavigate = (path) => {
    if (path === "home") navigate("/");
    else if (path === "admin") navigate("/admin");
    else if (path === "super-admin") navigate("/super-admin");
    else if (path.startsWith("dept-")) navigate(`/dept/${path}`);
    else navigate(`/${path}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    if (!form.username.trim() || !form.password) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);

    try {

      const response = await loginAdmin({
        username: form.username.trim(),
        password: form.password,
        role: role,
      });


      if (!response || !response.success) {
        throw new Error(
          response?.message || "Login failed."
        );
      }


      const token = response?.data?.token;
      const admin = response?.data?.admin;


      if (!token) {
        throw new Error("Login succeeded but no authentication token was received.");
      }


      localStorage.setItem("adminToken", token);

      if (admin) {
        localStorage.setItem(
          "adminData",
          JSON.stringify(admin)
        );
      }

      console.log("Login successful:", { admin });

      onNavigate(role === "super_admin" ? "super-admin" : "admin");

    } catch (error) {

      console.error("Login failed:", error);

      const backendMessage =
        error?.response?.data?.message;

      setError(
        backendMessage ||
        error?.message ||
        "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col lg:flex-row">

      <aside className="relative lg:w-1/2 min-h-[280px] lg:min-h-screen overflow-hidden bg-[#0a1f44] text-white">

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(197,165,114,0.4) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(197,165,114,0.25) 0%, transparent 40%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 h-full flex flex-col justify-between p-8 sm:p-12">

          <div>

            <div className="pb-8">

              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#4a6080]"
              >
                <ArrowLeft size={17} />

                <span className="lg:hidden xl:block">
                  Back to Site
                </span>
              </button>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full border-2 border-[#c5a572] flex items-center justify-center bg-[#0a1f44]/60 backdrop-blur">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-7 h-7 text-[#c5a572]"
                >
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                </svg>

              </div>

              <div>

                <h1 className="font-serif text-xl sm:text-2xl tracking-wide leading-tight">
                  Government Polytechnic Muzaffarpur
                </h1>

                <p className="text-[#c5a572] text-xs sm:text-sm tracking-[0.25em] uppercase">
                  Est. 1924
                </p>

              </div>

            </div>

          </div>

          <div className="hidden lg:block max-w-md">

            <h2 className="font-serif text-4xl xl:text-5xl leading-tight mb-6">
              Knowledge.{" "}
              <span className="text-[#c5a572]">
                Honor.
              </span>{" "}
              Future.
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Welcome to the official administrative portal.
              Sign in to access academic records, manage
              departments, and oversee university operations.
            </p>

          </div>

          <div className="border-l-2 border-[#c5a572] pl-4">

            <p className="font-serif italic text-sm sm:text-base text-slate-200">
              "The roots of education are bitter, but the fruit is sweet."
            </p>

            <p className="text-xs text-slate-400 mt-1">
              — Prof. Sweta
            </p>

          </div>

        </div>

      </aside>

      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16">

        <div className="w-full max-w-md">

          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">

            <div className="w-12 h-12 rounded-full border-2 border-[#c5a572] flex items-center justify-center">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-6 h-6 text-[#c5a572]"
              >
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>

            </div>

            <div>

              <h1 className="font-serif text-lg text-[#0a1f44]">
                Government Polytechnic
              </h1>

              <p className="text-[#c5a572] text-[10px] tracking-[0.25em] uppercase">
                Admin Portal
              </p>

            </div>

          </div>

          <div className="mb-8">

            <h2 className="font-serif text-3xl sm:text-4xl text-[#0a1f44] mb-2">
              Sign In
            </h2>

            <p className="text-slate-500 text-sm">
              Enter your credentials to access the admin dashboard.
            </p>

          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm"
            >
              {error}
            </div>
          )}


          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >


            <div>

              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Username
              </label>

              <div className="relative">

                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>

                </span>

                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent transition"
                />

              </div>

            </div>

            <div>

              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Password
              </label>

              <div className="relative">

                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>

                </span>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#0a1f44] transition"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-5 h-5"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.06" />
                      <path d="M1 1l22 22" />
                    </svg>

                  ) : (

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-5 h-5"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>

                  )}

                </button>

              </div>

            </div>

            <div>

              <label
                htmlFor="role"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                User Role
              </label>

              <div className="relative">

                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>

                </span>

                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent transition cursor-pointer"
                >

                  <option value="admin">
                    Admin
                  </option>

                  <option value="super_admin">
                    Super Admin
                  </option>

                </select>

                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 pointer-events-none">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>

                </span>

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#0a1f44] text-white font-medium tracking-wide hover:bg-[#0d2954] active:scale-[0.99] transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >

              {loading ? (

                <>

                  <svg
                    className="animate-spin w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>

                  Signing in...

                </>

              ) : (

                "Sign In"

              )}

            </button>

          </form>

          <p className="text-center text-xs text-slate-500 mt-8">

            Need access? Contact the{" "}

            <a
              href="#"
              className="text-[#0a1f44] font-medium hover:underline"
            >
              IT Help Desk
            </a>{" "}

            or call ext. 1000

          </p>

        </div>

      </main>

    </div>
  );
};

export default Login;
