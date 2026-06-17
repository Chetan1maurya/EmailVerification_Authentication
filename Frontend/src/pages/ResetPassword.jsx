import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api.js";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await api.post(
        `/auth/reset-password/${token}`,
        {
          password,
        }
      );

      alert(res.data.message);

      navigate("/");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Unable to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Reset Password
        </h1>

        <form
          onSubmit={handleResetPassword}
          className="space-y-4"
        >
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full p-3 rounded bg-slate-800 text-white outline-none"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full p-3 rounded bg-slate-800 text-white outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-white"
          >
            {loading
              ? "Resetting Password..."
              : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;