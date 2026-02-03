import React from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, LogIn } from "lucide-react";
import { LandingRouters } from "../../constants/routes";
import { MainContent } from "../../constants/mainContent";

const Header = () => {
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
            alt="CryptoRocket Logo"
            className="h-40 w-60"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
  onClick={() => navigate(LandingRouters.USER_REGISTER)}
  className="
    group relative flex items-center gap-2 px-6 h-10 rounded-xl font-semibold
    border border-green-400/50
    bg-green-400/5
    text-green-300
    transition-all duration-300
    hover:bg-green-400/10
    hover:border-green-400
    hover:shadow-lg hover:shadow-green-400/20
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-green-400/40
  "
>
  <UserPlus className="w-4 h-4 text-green-400 group-hover:scale-110 transition" />
  <span
    className="
      bg-gradient-to-r from-green-300 via-green-400 to-emerald-400
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
    bg-gradient-to-r from-green-400 via-emerald-400 to-green-500
    border border-green-400/60
    transition-all duration-300
    hover:shadow-xl hover:shadow-green-500/30
    hover:brightness-110
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-green-400/40
  "
>
  <LogIn className="w-4 h-4 group-hover:scale-110 transition" />
  Login
</button>

        </div>
      </header>

      {/* ================= Desktop Header ================= */}
      <header className="hidden lg:flex fixed top-0 inset-x-0 z-50 h-20 px-8 items-center justify-between
                         bg-primary/80 backdrop-blur-xl border-b border-light">
        {/* Logo with glow */}
        <div
          className="relative cursor-pointer flex items-center"
          onClick={() => navigate(LandingRouters.DASHBOARD)}
          aria-label="Go to dashboard"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-300 via-green-400 to-emerald-400
                          blur-2xl opacity-20" />
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
    border border-green-400/50
    bg-green-400/5
    text-green-300
    transition-all duration-300
    hover:bg-green-400/10
    hover:border-green-400
    hover:shadow-lg hover:shadow-green-400/20
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-green-400/40
  "
>
  <UserPlus className="w-4 h-4 text-green-400 group-hover:scale-110 transition" />
  <span
    className="
      bg-gradient-to-r from-green-300 via-green-400 to-emerald-400
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
    bg-gradient-to-r from-green-400 via-emerald-400 to-green-500
    border border-green-400/60
    transition-all duration-300
    hover:shadow-xl hover:shadow-green-500/30
    hover:brightness-110
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-green-400/40
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

export default Header;
