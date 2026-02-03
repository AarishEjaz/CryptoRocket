import { ethers } from "ethers";

export const maskString = (str, maskChar = "*", start = 4, end = -4) => {
  if (!str || typeof str !== "string") return "";

  const strLength = str.length;

  // Normalize negative end values
  if (end < 0) {
    end = strLength + end;
  }

  // Ensure start and end are within bounds
  start = Math.max(0, start);
  end = Math.min(strLength, end);

  if (end <= start) return str; // Nothing to mask

  const maskedStr =
    str.substring(0, start) + maskChar.repeat(4) + str.substring(end);

  return maskedStr;
};

// utils/urlHelpers.js
export const getLastPathSegment = (pathname) => {
  if (!pathname) return "";
  const parts = pathname.split("/").filter(Boolean);
  return parts[parts.length - 1].split("-").join(" ") || "";
};

export const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

export const extractText = (value) => {
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(extractText).join(" ");
  }

  if (value?.props?.children) {
    return extractText(value.props.children);
  }

  return ""; // fallback
};

const USDT_CONTRACT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // Replace with real address
const USDT_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

export const sendUSDTToken = async (to, amount) => {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const usdt = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, signer);

  // Normalize address with ethers.js to validate checksum
  let toAddress;
  try {
    toAddress = ethers.getAddress(to);  // This fixes/validates checksum
  } catch (e) {
    throw new Error(`Invalid recipient address: ${to}`);
  }

  // Parse amount with USDT decimals (6 decimals on BSC)
  const parsedAmount = ethers.parseUnits(amount.toString(), 6);

  const tx = await usdt.transfer(toAddress, parsedAmount);
  await tx.wait();

  return tx;
};