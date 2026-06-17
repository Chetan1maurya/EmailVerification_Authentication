import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api.js";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(
        `/auth/verify-email/${token}`
      );

      setVerified(true);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.log(err)
      setError(
        err?.response?.data?.message ||
          "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Verify Email
          </h1>

          <p className="text-slate-400 mb-8">
            Click the button below to verify
            your account.
          </p>
        </div>

        {verified ? (
          <div className="text-center">
            <div className="text-5xl mb-4">
              ✅
            </div>

            <h2 className="text-green-400 text-xl font-semibold mb-2">
              Email Verified
            </h2>

            <p className="text-slate-400">
              Redirecting to home page...
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-semibold text-white disabled:opacity-50"
            >
              {loading
                ? "Verifying..."
                : "Verify Email"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;