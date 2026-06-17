import React, { useState } from "react";
import api from "../api.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUserData } from "../redux/userSlice.js";

const Home = () => {
  // Later replace with Redux user state
  const userData = useSelector((state) => state.user.userData?.user);
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [openProfile, setOpenProfile] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Handle Register called");
    try {
      const res = await api.post("/auth/register", {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
      });

      alert(res.data.message);
      // setUserData(res.data.user);
      setShowSignupModal(false);

      setRegisterData({
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(loginData.email);
    try {
      const res = await api.post("/auth/login", {
        email: loginData.email,
        password: loginData.password,
      });

      dispatch(setUserData(res.data));
      setShowLoginModal(false);

      setLoginData({
        email: "",
        password: "",
      });
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/forgot-password", {
        email: forgotEmail,
      });

      alert(res.data.message);

      setForgotEmail("");
      setShowForgotPasswordModal(false);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to send reset link");
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await api.get("/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setOpenProfile(false);
    } catch (error) {
      console.log("There is logout error", error);
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      console.log("Yes working");
      try {
        const res = await api.get("/auth/get-me", {
          withCredentials: true,
        });
        dispatch(setUserData(res.data));
        console.log(userData)
      } catch (error) {
        console.error("Error fetching user:", error);
        dispatch(setUserData(null));
      }
    };
    fetchUser();
  }, []);
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold">SecureAuth</h1>

        <div className="relative">
          {userData ? (
            <div
              className="flex cursor-pointer items-center gap-3"
              onClick={() => setOpenProfile(!openProfile)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                {userData.username[0].toUpperCase()}
              </div>

              <span>{userData.username}</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginModal(true)}
                className="rounded bg-slate-800 px-4 py-2 hover:bg-slate-700"
              >
                Login
              </button>

              <button
                onClick={() => setShowSignupModal(true)}
                className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-500"
              >
                Sign Up
              </button>
            </div>
          )}

          {openProfile && (
            <div className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#161b24] shadow-2xl">
              <div className="border-b border-white/10 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 font-bold text-black">
                    {userData?.username?.[0]?.toUpperCase()}
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {userData?.username}
                    </h3>

                    <p className="text-sm text-slate-400">{userData?.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <button className="w-full rounded-xl px-4 py-3 text-left hover:bg-white/5">
                  👤 Profile
                </button>

                <button className="w-full rounded-xl px-4 py-3 text-left hover:bg-white/5">
                  📄 Interview History
                </button>
              </div>

              <div className="border-t border-white/10 p-3">
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-red-500/10 px-4 py-3 text-red-400 hover:bg-red-500/20"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center h-[80vh] px-6">
        <h2 className="text-6xl font-bold mb-6">
          Secure Authentication System
        </h2>

        <p className="text-slate-400 max-w-2xl text-lg">
          Email Verification, Login, Forgot Password, Reset Password, JWT
          Authentication and Protected Routes built using MERN Stack.
        </p>
      </section>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-xl w-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Login</h2>

              <button onClick={() => setShowLoginModal(false)}>✕</button>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    email: e.target.value,
                  })
                }
                className="w-full p-3 rounded bg-slate-800 outline-none"
              />

              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value,
                  })
                }
                className="w-full p-3 rounded bg-slate-800 outline-none"
              />

              <button type="submit" className="w-full bg-blue-600 p-3 rounded">
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowLoginModal(false);
                  setShowForgotPasswordModal(true);
                }}
              >
                Forgot Password?
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-xl w-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create Account</h2>

              <button onClick={() => setShowSignupModal(false)}>✕</button>
            </div>

            <form className="space-y-4" onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 rounded bg-slate-800 border border-slate-600 text-white"
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    username: e.target.value,
                  })
                }
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded bg-slate-800 border border-slate-600 text-white"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    email: e.target.value,
                  })
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded bg-slate-800 border border-slate-600 text-white"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    password: e.target.value,
                  })
                }
              />

              <button type="submit" className="w-full bg-green-600 p-3 rounded">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      )}

      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-xl w-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Forgot Password</h2>

              <button onClick={() => setShowForgotPasswordModal(false)}>
                ✕
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full p-3 rounded bg-slate-800 outline-none"
                required
              />

              <button type="submit" className="w-full bg-blue-600 p-3 rounded">
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
