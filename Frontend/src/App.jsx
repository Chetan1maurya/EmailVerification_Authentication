import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/verify-email/:token"
          element={<VerifyEmail />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </div>
  );
};

export default App;