import React from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, LogIn } from "lucide-react";
import { LandingRouters } from "../../constants/routes";
import { MainContent } from "../../constants/mainContent";

const Header1 = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* ================= Mobile Header ================= */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 h-20 px-4 flex items-center justify-between bg-primary/90 backdrop-blur-lg border-b border-light">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate(LandingRouters.DASHBOARD)}
          aria-label="Go to dashboard"
        >
          <img
            src={MainContent.fullLogo}
            alt="CryptoRocket"
            className="h-40 w-60"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(LandingRouters.USER_REGISTER)}
            className="
              group relative flex items-center gap-2 px-6 h-10 rounded-xl font-semibold
              border border-cyan-400/50
              bg-cyan-400/5
              text-cyan-300
              transition-all duration-300
              hover:bg-cyan-400/10
              hover:border-cyan-400
              hover:shadow-lg hover:shadow-cyan-400/20
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-cyan-400/40
            "
          >
            <UserPlus className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
            <span
              className="
                bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400
                bg-clip-text text-transparent
              "
            >
              Signup
            </span>
          </button>

          <button
            onClick={() => navigate(LandingRouters.USER_LOGIN)}
            className="
              group relative flex items-center gap-2 px-6 h-10 rounded-xl font-semibold
              text-white
              bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500
              border border-cyan-400/60
              transition-all duration-300
              hover:shadow-xl hover:shadow-blue-500/30
              hover:brightness-110
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-cyan-400/40
            "
          >
            <LogIn className="w-4 h-4 group-hover:scale-110 transition" />
            Login 
          </button>
        </div>
      </header>

      {/* ================= Desktop Header ================= */}
      <header className="hidden lg:flex fixed top-0 inset-x-0 z-50 h-20 px-8 items-center justify-between bg-primary/80 backdrop-blur-xl border-b border-light">
        {/* Logo with glow */}
        <div
          className="relative cursor-pointer flex items-center"
          onClick={() => navigate(LandingRouters.DASHBOARD)}
          aria-label="Go to dashboard"
        >
          <div
            className="
              absolute inset-0
              bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400
              blur-2xl opacity-20
            "
          />
          <img
            src={MainContent.fullLogo}
            alt="CryptoRocket Logo"
            className="relative z-10 h-40 w-80"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(LandingRouters.USER_REGISTER)}
            className="
              group relative flex items-center gap-2 px-6 h-10 rounded-xl font-semibold
              border border-cyan-400/50
              bg-cyan-400/5
              text-cyan-300
              transition-all duration-300
              hover:bg-cyan-400/10
              hover:border-cyan-400
              hover:shadow-lg hover:shadow-cyan-400/20
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-cyan-400/40
            "
          >
            <UserPlus className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
            <span
              className="
                bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400
                bg-clip-text text-transparent
              "
            >
              Sign up
            </span>
          </button>

          <button
            onClick={() => navigate(LandingRouters.USER_LOGIN)}
            className="
              group relative flex items-center gap-2 px-6 h-10 rounded-xl font-semibold
              text-white
              bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500
              border border-cyan-400/60
              transition-all duration-300
              hover:shadow-xl hover:shadow-blue-500/30
              hover:brightness-110
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-cyan-400/40
            "
          >
            <LogIn className="w-4 h-4 group-hover:scale-110 transition" />
            Login
          </button>
        </div>
      </header>
    </>
  );
};

export default Header1;

