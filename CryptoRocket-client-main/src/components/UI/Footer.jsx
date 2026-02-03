import React from "react";
import bg from "../../assets/Landing/bg.png";
import mobBg from "../../assets/Landing/mobBg.png";
import appLogo from "../../assets/CRL.png"
import { FaTelegramPlane, FaYoutube } from "react-icons/fa";
import { IoLogoFacebook } from "react-icons/io5";
import { FaSquareXTwitter } from "react-icons/fa6";
import { ExternalLink, Smartphone, Globe } from "lucide-react";
import { MainContent } from "../../constants/mainContent";

const Footer = () => {
  return (
    <div className="relative flex flex-col overflow-hidden bg-primary">
      {/* Top Section */}
      <div className="z-[11] flex w-full justify-between px-6 py-8 h-full flex-col space-y-12 border-t border-light bg-card/30 backdrop-blur-lg lg:min-h-[334px] lg:flex-row lg:space-y-0 lg:px-16 lg:py-16 lg:h-auto">
        {/* Logo + Tagline */}
        <div className="flex flex-col justify-start space-y-4">
          <img src={appLogo} className="md:h-28 w-1/3 lg:w-96 lg:h-auto" alt="CryptoRocket Logo" />
          <span className="text-sm leading-relaxed text-secondary text-center font-light max-w-[250px] lg:text-base">
            The world's first 100% decentralized AI-powered investment platform
          </span>
        </div>

        {/* Links + Smart Contracts */}
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-16 lg:space-y-0">
          {/* Smart Contracts */}
          <div className="flex flex-col space-y-4">
            <span className="text-primary-green leading-relaxed font-semibold flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Smart Contracts
            </span>
            <div className="flex flex-col space-y-3 text-secondary">
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
                <div key={index} className="flex items-center justify-between space-x-3">
                  <span className="text-sm text-secondary leading-relaxed">
                    {contract.name}
                  </span>
                  <span className="text-sm text-primary-green font-mono">{contract.address}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="flex flex-col space-y-4">
            <span className="text-primary-green leading-relaxed font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Products
            </span>
            <div className="flex flex-col space-y-3">
              {[
                "Zepto defi AI BUSD",
                "Zepto defi AI ETH",
                "Zepto defi AI TRX",
                "Zepto defi AI TON"
              ].map((product, index) => (
                <a
                  key={index}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-secondary custom-transition hover:text-primary-green flex items-center gap-1 group"
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
      <div className="z-[1] flex w-full items-start flex-col space-y-4 p-6 bg-card backdrop-blur-lg border-t border-accent lg:flex-row lg:items-center lg:justify-between lg:py-6 lg:px-16 lg:space-y-0">
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-light leading-relaxed text-secondary lg:text-base">
            © {new Date().getFullYear()} Zepto defi. All Rights Reserved
          </span>
          <span className="text-sm text-primary-green leading-relaxed hover:text-accent transition-colors cursor-pointer">
            Disclaimer
          </span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center space-x-6">
          {/* Telegram */}
          <a
            href="https://t.me/Zepotodefi"
            target="_blank"
            rel="noopener noreferrer"
            className="custom-transition hover:scale-110 hover:text-accent text-primary-green"
          >
            <FaTelegramPlane size={24} />
          </a>
          {/* Youtube */}
          <a
            href="https://youtube.com/@zop-r4w7j?si=gvg9OyvjIoFdstOX"
            target="_blank"
            rel="noopener noreferrer"
            className="custom-transition hover:scale-110 hover:text-accent text-primary-green"
          >
            <FaYoutube size={24} />
          </a>
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="custom-transition hover:scale-110 hover:text-accent text-primary-green"
          >
            <IoLogoFacebook size={24} />
          </a>
          {/* Twitter */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="custom-transition hover:scale-110 hover:text-accent text-primary-green"
          >
            <FaSquareXTwitter size={24} />
          </a>
        </div>
      </div>

      {/* Background Images */}
      <img
        className="absolute z-[0] bottom-0 h-[200px] left-[-10px] w-full flex lg:hidden opacity-20"
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

export default Footer;
