import { ethers } from "ethers";

export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("No wallet detected. Please install MetaMask or Trust Wallet.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  // Example: Ask backend for nonce
  const res = await fetch("https://your-api.com/auth/nonce", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  });

  const { nonce } = await res.json();

  // Sign the nonce message
  const signature = await signer.signMessage(nonce);

  // Send signed message to backend
  const loginRes = await fetch("https://your-api.com/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, signature }),
  });

  const data = await loginRes.json();

  if (!loginRes.ok) {
    throw new Error(data.message || "Authentication failed");
  }

  // Return token/user info
  return data;
};
