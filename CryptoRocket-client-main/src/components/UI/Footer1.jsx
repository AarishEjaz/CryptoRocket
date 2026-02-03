import React from "react";
import bg from "../../assets/Landing/bg.png";
import mobBg from "../../assets/Landing/mobBg.png";
import appLogo from "../../assets/CRL.png";
import { FaTelegramPlane, FaYoutube } from "react-icons/fa";
import { IoLogoFacebook } from "react-icons/io5";
import { FaSquareXTwitter } from "react-icons/fa6";
import { ExternalLink, Smartphone, Globe } from "lucide-react";

const Footer1 = () => {
  return (
    <div className="relative flex flex-col overflow-hidden bg-[#020617]">
      {/* Top Section */}
      <div className="z-[11] flex w-full justify-between px-6 py-8 flex-col space-y-12 border-t border-cyan-500/20 bg-cyan-950/30 backdrop-blur-xl lg:min-h-[334px] lg:flex-row lg:space-y-0 lg:px-16 lg:py-16">
        {/* Logo + Tagline */}
        {/* <div className="flex flex-col items-center lg:items-start justify-start space-y-4">
          <img
            src={appLogo}
            className="md:h-28 w-1/3 lg:w-96 lg:h-auto"
            alt="CryptoRocket"
          />
          <span className="text-sm leading-relaxed text-cyan-100/70 text-center lg:text-left font-light max-w-[250px] lg:text-base">
            The world's first 100% decentralized AI-powered investment platform
          </span>
        </div> */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <img
            src={appLogo}
            className="md:h-28 w-40 lg:w-60 lg:h-auto"
            alt="CryptoRocket Logo"
          />
          <span className="text-sm leading-relaxed text-cyan-100/70 text-center font-light lg:text-base max-w-xs lg:max-w-sm">
            The world's first 100% decentralized AI-powered investment platform
          </span>
        </div>



        {/* Links + Smart Contracts */}
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-16 lg:space-y-0">
          {/* Smart Contracts */}
          <div className="flex flex-col space-y-4">
            <span className="text-cyan-400 font-semibold flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Smart Contracts
            </span>

            <div className="flex flex-col space-y-3 text-cyan-100/70">
              {[
                { name: "ETH X3 / X4", address: "0x5acc...FB97" },
                { name: "ETH XGold", address: "0x488e...b6C2" },
                { name: "TRON X3 / X4", address: "TREbha..." },
                { name: "TRON XGold", address: "TA6p1B..." },
                { name: "BUSD X3 / X4", address: "0x5acc...FB97" },
                { name: "BUSD XXX", address: "0x2CAa...ae52" },
                { name: "BUSD XGold", address: "0x9887...f7C5" },
                { name: "BUSD XQore", address: "0x1ee4...Ba78" }
              ].map((contract, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-sm">{contract.name}</span>
                  <span className="text-sm font-mono text-cyan-400">
                    {contract.address}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="flex flex-col space-y-4">
            <span className="text-cyan-400 font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Products
            </span>

            <div className="flex flex-col space-y-3">
              {[
                " CryptoRocket AI BUSD",
                " CryptoRocket AI ETH",
                " CryptoRocket AI TRX",
                " CryptoRocket AI TON"
              ].map((product, index) => (
                <a
                  key={index}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cyan-100/70 hover:text-cyan-400 transition-all flex items-center gap-1 group"
                >
                  {product}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="z-[1] flex w-full flex-col space-y-4 p-6 bg-cyan-950/40 backdrop-blur-xl border-t border-cyan-500/20 lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-6 lg:space-y-0">
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-light text-cyan-100/60 lg:text-base">
            © {new Date().getFullYear()}  CryptoRocket. All Rights Reserved
          </span>
          <span className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">
            Disclaimer
          </span>
        </div>

        {/* Social Icons */}
        {/* <div className="flex items-center space-x-6">
          {[FaTelegramPlane, FaYoutube, IoLogoFacebook, FaSquareXTwitter].map(
            (Icon, index) => (
              <a
                key={index}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all"
              >
                <Icon size={24} />
              </a>
            )
          )}
        </div> */}
      </div>

      {/* Background Images */}
      <img
        className="absolute z-[0] bottom-0 left-[-10px] w-full h-[200px] opacity-20 lg:hidden"
        src={mobBg}
        alt="footer mobile background"
      />
      <img
        className="absolute w-full z-[0] hidden lg:flex opacity-20"
        src={bg}
        alt="footer background"
      />
    </div>
  );
};

export default Footer1;
